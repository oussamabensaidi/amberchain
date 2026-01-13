import axios from 'axios';
import { getLocationCodes } from '@/lib/locationCodeMapper';

// Helper function to extract city from location string (e.g., "Los Angeles, US" → "Los Angeles")
const extractCity = (locationString) => {
  if (!locationString) return '';
  if (typeof locationString === 'string') {
    return locationString.split(',')[0].trim();
  }
  return '';
};

// Helper function to extract port code from location data
const extractPortCode = (locationData) => {
  if (!locationData) return null;
  // If it's already a code like "USLAX" or "DEHAM"
  if (typeof locationData === 'string' && locationData.length === 5) {
    return locationData;
  }
  
  // If it has countryCode and city, try to construct or return what we have
  if (locationData.countryCode) {
    return locationData.countryCode;
  }
  
  return null;
};

const submitCompareOptions = async (formData) => {
  const token = localStorage.getItem("token");

  try {
    // Step 1: Create a quote using the payload
    const quoteResponse = await axios.post(
      `${import.meta.env.VITE_APP_DOMAIN}/request-quotations/v2/`,
      formData,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Quote created successfully:", quoteResponse.data);

    // Step 2: Extract location codes from formData - DYNAMIC from user input
    // Use getLocationCodes to convert city/country to proper port codes
    const locationCodes = getLocationCodes(
      formData.polCity || extractCity(formData.pickUpPosition?.city),
      formData.polCountry || formData.pickUpPosition?.country,
      formData.polCountryCode || formData.pickUpPosition?.countryCode,
      formData.podCity || extractCity(formData.deliveryPosition?.city),
      formData.podCountry || formData.deliveryPosition?.country,
      formData.podCountryCode || formData.deliveryPosition?.countryCode
    );

    const polCode = formData.polLocationId || locationCodes.polCode;
    const podCode = formData.podLocationId || locationCodes.podCode;
    const weight = formData.grossWeight || formData.stuffingWeight || 100;

    // Step 3: Call the /schedule/points-to-points endpoint with GET method
    const schedulePayload = {
      cargoType: "DRY",
      placeOfDeliveryCode: podCode,
      placeOfReceiptCode: polCode,
      stuffingVolume: null,
      stuffingWeight: weight
    };

    console.log("Calling schedule endpoint with payload:", schedulePayload);
    console.log("Token:", token);
    console.log("Full URL:", `${import.meta.env.VITE_APP_DOMAIN}/schedule/points-to-points`);

    let scheduleData = null;
    try {
      const scheduleResponse = await axios.post(
        `${import.meta.env.VITE_APP_DOMAIN}/schedule/points-to-points`,
        schedulePayload,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      scheduleData = scheduleResponse.data;
      console.log("Schedule response:", scheduleData);
      
      // Ensure scheduleData is always an array
      if (scheduleData && !Array.isArray(scheduleData)) {
        scheduleData = [scheduleData];
      }
    } catch (scheduleError) {
      console.warn("Schedule request failed (non-blocking):", scheduleError.message);
      // Don't throw - schedule is optional
      scheduleData = [];
    }

    // Return both responses
    return {
      quote: quoteResponse.data,
      schedule: scheduleData || [],
      trackId: quoteResponse.data.trackId
    };
  } catch (error) {
    console.error("Error in submitCompareOptions:", error);
    throw error;
  }
};

export default submitCompareOptions;