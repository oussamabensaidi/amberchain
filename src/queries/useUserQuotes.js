// queries/useUserQuotes.js
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { fromApiShipment } from "../mappers/shipmentMapper" // Import your existing mapper

// Fetch function for quotes
const fetchUserQuotes = async (userId) => {
  const token = localStorage.getItem('token')

  const response = await axios.post(
    `${import.meta.env.VITE_APP_DOMAIN}/request-quotations/v2/search`,
    { userId }, 
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  )
  
  console.log("Fetched user quotes:", response.data)
  return response.data
}

// Transform API data to match component format
const transformQuote = (apiQuote) => {
  // Use your existing mapper as the base
  const baseData = fromApiShipment(apiQuote)
  
  // Add any additional fields needed for the quotes list
  return {
    // Quote-specific metadata
    id: apiQuote.trackId,
    status: apiQuote.status,
    createdAt: apiQuote.creationDate,
    
    // Spread all the properly mapped shipment data
    ...baseData,
    
    // Add display-friendly route summary
    pol: apiQuote.pickUpPosition?.city || baseData.polCity || '',
    pod: apiQuote.deliveryPosition?.city || baseData.podCity || '',
    polCountry: apiQuote.pickUpPosition?.country || baseData.polCountry || '',
    podCountry: apiQuote.deliveryPosition?.country || baseData.podCountry || '',
    
    // Customer field if needed (add to mapper if you have this data)
    customer: '', // TODO: Add to API response if available
    
    // Wizard selection placeholder
    wizardSelection: { mainCategory: "", subCategory: "" },
  }
}

export const useUserQuotes = (userId) => {
  return useQuery({
    queryKey: ['userQuotes', userId],
    queryFn: () => fetchUserQuotes(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    select: (data) => {
      console.log("Transforming quotes data:", data)
      // Extract the content array from the paginated response
      const quotes = data.content || []
      const transformed = quotes.map(transformQuote)
      console.log("Transformed quotes:", transformed)
      return transformed
    },
  })
}