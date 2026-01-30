// queries/useUserQuotes.js
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import storage from '@/lib/storage'
import { fromApiShipment } from "../mappers/shipmentMapper"

/**
 * Fetch user quotes with server-side pagination and filtering
 * @param {Object} params - Fetch parameters
 * @param {Object} params.user - User object (contains id and role)
 * @param {number} params.page - Page number (0-indexed)
 * @param {number} params.size - Page size
 * @param {Object} params.filters - API filters (status, shipmentMode, cargoType, etc.)
 * @returns {Promise<Object>} Paginated response with quotes
 */
const fetchUserQuotes = async ({ user, page = 0, size = 10, filters = {} }) => {
  const token = storage.getToken()
  
  // Build request body - include userId only if user is not ADMIN (for ADMIN, global search)
  const body = {
    ...filters, // status, shipmentMode, cargoType, etc.
  }
  
  // Only add userId if user role is not ADMIN
  if (user && user.id && user.role?.nom !== 'ADMIN') {
    body.userId = user.id
  }

  // Build URL with pagination as query parameters
  const url = new URL(`${import.meta.env.VITE_APP_DOMAIN}/request-quotations/v2/search`)
  url.searchParams.append('page', page)
  url.searchParams.append('size', size)

  console.log('Fetching from URL:', url.toString());
  console.log('Request body:', body);
  console.log('User role:', user?.role?.nom, 'IsAdmin:', user?.role?.nom === 'ADMIN');

  try {
    const response = await axios.post(
      url.toString(),
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    console.log('API Response status:', response.status);
    console.log('API Response data:', response.data);
    return response.data || { content: [], totalElements: 0, totalPages: 0 }
  } catch (error) {
    console.error('Error fetching quotes:', error);
    throw error;
  }
}

/**
 * Normalize shipment mode from API format to UI format
 */
const normalizeMode = (apiMode) => {
  if (!apiMode) return 'Sea';
  const mode = apiMode.toLowerCase();
  if (mode === 'air') return 'air';
  if (mode === 'sea') return 'sea';
  if (mode === 'road') return 'road';
  if (mode === 'rail') return 'rail';
  if (mode === 'ecommerce' || mode === 'ecommerce') return 'ecommerce';
  return 'combined'; // Default
}

/**
 * Transform a single API quote to component format
 * Includes full quotation object data for QuotationDetails component
 */
const transformQuote = (apiQuote) => {
  const baseData = fromApiShipment(apiQuote)

  // Build route array for BookingRoute component
  const routeArray = [
    apiQuote.pickUpPosition?.city || baseData.polCity || 'Origin',
    apiQuote.deliveryPosition?.city || baseData.podCity || 'Destination'
  ]

  return {
    // Quote-specific metadata
    id: apiQuote.trackId,
    trackId: apiQuote.trackId,
    status: apiQuote.status,
    createdAt: apiQuote.creationDate,
    readinessDate: apiQuote.creationDate, // Display-friendly date

    // Spread all the properly mapped shipment data
    ...baseData,

    // Add display-friendly route summary
    pol: apiQuote.pickUpPosition?.city || baseData.polCity || '',
    pod: apiQuote.deliveryPosition?.city || baseData.podCity || '',
    polCountry: apiQuote.pickUpPosition?.country || baseData.polCountry || '',
    podCountry: apiQuote.deliveryPosition?.country || baseData.podCountry || '',
    
    // Location-based fields for DataTable display
    origin: apiQuote.pickUpPosition?.city || baseData.polCity || '',
    destination: apiQuote.deliveryPosition?.city || baseData.podCity || '',
    finalDestination: apiQuote.deliveryPosition?.city || baseData.podCity || '',

    // Cargo and container info
    cargoType: baseData.cargoType || apiQuote.cargoType || '',
    vehicleOrPackageInfo: baseData.containerType || '',
    commodityInfo: apiQuote.commodity || '',

    // Price and carrier (from API if available)
    price: apiQuote.price || apiQuote.totalPrice || 'N/A',
    carrier: apiQuote.carrier || '',

    // Quotation mode for mode filter - normalized to UI format
    mode: normalizeMode(apiQuote.shipmentMode),

    // Full quotation object for QuotationDetails
    costBreakdown: apiQuote.costBreakdown || {
      total: apiQuote.price || 0,
      breakdown: []
    },
    conditions: apiQuote.conditions || {},
    // Route as array for BookingRoute component
    route: routeArray,

    // Customer field if needed
    customer: apiQuote.customer || '',

    // Wizard selection placeholder
    wizardSelection: { mainCategory: "", subCategory: "" },
    
    // Store full API response for detailed views
    _raw: apiQuote,
  }
}

/**
 * Build filter object from column filters for API
 * Maps DataTable column filters to API-compatible format
 */
const buildApiFilters = (columnFilters = []) => {
  const filters = {}

  columnFilters.forEach(filter => {
    const { id, value } = filter
    
    // Map table column IDs to API filter names
    switch (id) {
      case 'status':
        if (value && value !== 'all') {
          filters.status = value.toUpperCase()
        }
        break
      case 'mode':
        if (value && value !== 'all') {
          filters.shipmentMode = value.toUpperCase()
        }
        break
      case 'cargoType':
        if (value && value !== 'all') {
          filters.cargoType = value.toUpperCase()
        }
        break
      case 'origin':
        if (value) {
          filters.pickupLocation = value
        }
        break
      case 'destination':
        if (value) {
          filters.deliveryLocation = value
        }
        break
      default:
        // Support any additional filters by passing them through
        if (value && value !== 'all') {
          filters[id] = value
        }
    }
  })

  return filters
}

/**
 * Hook for fetching user quotes with server-side pagination and filtering
 * @param {Object} user - User object (contains id and role)
 * @param {number} pageIndex - Current page (0-indexed)
 * @param {number} pageSize - Items per page
 * @param {Array} columnFilters - DataTable column filters
 * @returns {Object} Query result with data, loading states, pagination metadata
 */
export const useUserQuotes = (user, pageIndex = 0, pageSize = 10, columnFilters = []) => {
  const apiFilters = buildApiFilters(columnFilters)

  console.log('useUserQuotes called with:', { user, pageIndex, pageSize, columnFilters });

  return useQuery({
    queryKey: ['userQuotes', user?.id, pageIndex, pageSize, apiFilters],
    queryFn: () => {
      console.log('Fetching quotes with pageIndex:', pageIndex, 'pageSize:', pageSize);
      return fetchUserQuotes({
        user,
        page: pageIndex,
        size: pageSize,
        filters: apiFilters,
      });
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data) => {
      console.log('API Response:', data);
      
      const quotes = data.content || []
      const transformed = quotes.map(transformQuote)
      
      // Calculate totalPages from totalElements if not provided by API
      const totalElements = data.totalElements || 0;
      const totalPages = data.totalPages || Math.ceil(totalElements / pageSize) || 0;

      const result = {
        quotes: transformed,
        pagination: {
          pageIndex,
          pageSize,
          total: totalElements,
          totalPages: totalPages,
          hasNextPage: data.hasNext !== undefined ? data.hasNext : (pageIndex < totalPages - 1),
          hasPreviousPage: data.hasPrevious !== undefined ? data.hasPrevious : (pageIndex > 0),
        },
      }
      
      console.log('Transformed pagination:', result.pagination);
      return result;
    },
  })
}