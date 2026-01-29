import axios from 'axios';

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
    
    // Step 2: Extract location codes for schedule API
    const polCode = formData.pickUpPosition?.unicode || null;
    const podCode = formData.deliveryPosition?.unicode || null;
    const weight = formData.grossWeight || 100;

    // DEBUG: Log location codes
    console.log("Location codes extracted from formData:", {
      polCode,
      podCode,
      polLocation: formData.pickUpPosition,
      podLocation: formData.deliveryPosition
    });

    // Step 3: Call schedule API only if we have valid location codes
    let scheduleData = [];
    
    if (polCode && podCode) {
      const schedulePayload = {
        cargoType: "DRY",
        placeOfDeliveryCode: podCode,
        placeOfReceiptCode: polCode,
        stuffingVolume: null,
        stuffingWeight: weight
      };

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
        
        // Ensure scheduleData is always an array
        if (scheduleData && !Array.isArray(scheduleData)) {
          scheduleData = [scheduleData];
        }
      } catch (scheduleError) {
        console.warn("Schedule request failed (non-blocking):", scheduleError.message);
        scheduleData = [];
      }
    } else {
      console.warn("Skipping schedule API call - missing location codes (polCode or podCode)");
    }

    // Return both responses
    return {
      quote: quoteResponse.data,
      schedule: scheduleData,
      trackId: quoteResponse.data.trackId
    };
  } catch (error) {
    console.error("Error in submitCompareOptions:", error);
    throw error;
  }
};

export default submitCompareOptions;