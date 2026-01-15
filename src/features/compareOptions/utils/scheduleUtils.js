// utils/scheduleUtils.js

/**
 * Transforms backend schedule data into a normalized format for UI components
 * @param {Object} scheduleData - Raw schedule data from backend
 * @returns {Object} Normalized schedule data
 */
export function normalizeScheduleData(scheduleData) {
  if (!scheduleData) return null;

  return {
    company: scheduleData.company,
    solutionNumber: scheduleData.solutionNumber,
    price: scheduleData.price,
    
    // Transit time in hours and days
    transitTimeHours: scheduleData.transitTime,
    transitTimeDays: scheduleData.transitTime ? Math.ceil(scheduleData.transitTime / 24) : null,
    
    // Dates
    departureDate: scheduleData.placeOfReceipt?.dateTime || null,
    arrivalDate: scheduleData.placeOfDelivery?.dateTime || null,

    
    // Locations
    originLocation: scheduleData.placeOfReceipt?.location?.locationName,
    originFacility: scheduleData.placeOfReceipt?.location?.facility?.facilityCode,
    destinationLocation: scheduleData.placeOfDelivery?.location?.locationName,
    destinationFacility: scheduleData.placeOfDelivery?.location?.facility?.facilityCode,
    
    // Service types
    receiptTypeAtOrigin: scheduleData.receiptTypeAtOrigin,
    deliveryTypeAtDestination: scheduleData.deliveryTypeAtDestination,
    
    // Cut-off times
    cutOffTimes: scheduleData.cutOffTimes || [],
    
    // Legs/Route information
legs: extractVesselInfo(scheduleData.legs),
    
    // Full raw data for advanced use cases
    _raw: scheduleData
  };
}

/**
 * Format date for display
 * @param {string|Date} dateString 
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string}
 */
export function formatScheduleDate(dateString, options = { month: 'short', day: 'numeric' }) {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date && !isNaN(date) ? date.toLocaleDateString('en-US', options) : null;
}

/**
 * Format date and time for display
 * @param {string|Date} dateString 
 * @returns {string}
 */
export function formatScheduleDateTime(dateString) {
  return formatScheduleDate(dateString, { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

/**
 * Calculate days until departure from today
 * @param {string|Date} departureDate 
 * @returns {string|null}
 */
export function calculateDaysUntilDeparture(departureDate) {
  if (!departureDate) return null;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const departure = new Date(departureDate);
  departure.setHours(0, 0, 0, 0);
  
  const diffTime = departure - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'Departed';
  if (diffDays === 0) return 'Today';
  return `${diffDays} ${diffDays === 1 ? 'day' : 'days'}`;
}

/**
 * Format transit time in days
 * @param {number} hours - Transit time in hours
 * @returns {string|null}
 */
export function formatTransitTime(hours) {
  if (!hours) return null;
  const days = Math.ceil(hours / 24);
  return `${days} ${days === 1 ? 'day' : 'days'}`;
}

/**
 * Get human-readable label for cut-off time code
 * @param {string} code 
 * @returns {string}
 */
export function getCutOffLabel(code) {
  const labels = {
    'DGC': 'Dangerous Cargo Cut-off',
    'DCO': 'Documentation Cut-off',
    'FCO': 'Full Container Cut-off',
    'VGM': 'VGM Cut-off',
    'ECP': 'Empty Container Pick-up'
  };
  return labels[code] || code;
}

/**
 * Get human-readable label for receipt/delivery type
 * @param {string} type 
 * @returns {string}
 */
export function getReceiptDeliveryType(type) {
  const types = {
    'CY': 'Container Yard',
    'CFS': 'Container Freight Station',
    'SD': 'Store Door',
    'DOOR': 'Door to Door'
  };
  return types[type] || type;
}

/**
 * Extract vessel information from legs
 * @param {Array} legs 
 * @returns {Array}
 */
export function extractVesselInfo(legs) {
  if (!legs || !Array.isArray(legs)) return [];
  
  return legs.map(leg => ({
    sequenceNumber: leg.sequenceNumber,
    vesselName: leg.transport?.vessel?.name,
    vesselIMO: leg.transport?.vessel?.vesselIMONumber,
    vesselFlag: leg.transport?.vessel?.flag,
    serviceName: leg.transport?.servicePartners?.[0]?.carrierServiceName,
    serviceCode: leg.transport?.servicePartners?.[0]?.carrierServiceCode,
    voyageNumber: leg.transport?.servicePartners?.[0]?.carrierImportVoyageNumber,
    departureLocation: leg.departure?.location?.locationName,
    departureDateTime: leg.departure?.dateTime,
    arrivalLocation: leg.arrival?.location?.locationName,
    arrivalDateTime: leg.arrival?.dateTime
  }));
}

/**
 * Check if schedule data is valid and complete
 * @param {Object} scheduleData 
 * @returns {boolean}
 */
export function isValidScheduleData(scheduleData) {
  if (!scheduleData) return false;
  
  return !!(
    scheduleData.company &&
    scheduleData.placeOfReceipt?.dateTime &&
    scheduleData.placeOfDelivery?.dateTime
  );
}

/**
 * Merge schedule data with result metadata
 * @param {Object} resultMeta - Result metadata from comparison
 * @param {Object} scheduleData - Raw schedule data
 * @returns {Object} Merged data
 */
export function mergeScheduleWithResult(resultMeta, scheduleData) {
  const normalized = normalizeScheduleData(scheduleData);
  
  return {
    ...resultMeta,
    schedule: normalized,
    // Override with schedule data if available
    company: normalized?.company || resultMeta?.company,
    transitDays: normalized?.transitTimeDays || resultMeta?.transitDays,
    departureDate: normalized?.departureDate,
    arrivalDate: normalized?.arrivalDate
  };
}