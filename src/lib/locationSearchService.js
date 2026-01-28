/**
 * Location Search Service
 * Uses API endpoint /locations/v2/{query}
 */
import apiClient from "@/lib/apiClient";

/**
 * Search for locations using the /locations/v2/{query} API endpoint
 * Returns array of location suggestions with all required data
 */
export const searchLocations = async (query, type = "port") => {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const { data } = await apiClient.get(`/locations/v2/${query}`);
    
    if (!Array.isArray(data)) {
      return [];
    }

    // Transform API response to expected format
    const results = data.map(item => ({
      display_name: item.fullName,
      name: item.city,
      city: item.city,
      country: item.fullName.split(", ").slice(1).join(", ") || "",
      countryCode: "",
      lat: item.lat ? String(item.lat) : "",
      lon: item.lon ? String(item.lon) : "",
      id: item.unCode || 0,
      locationType: item.locationType || "PORT",
      code: item.unCode,
      unicode: item.unCode,
    }));

    return results;
  } catch (error) {
    console.error("Location search error:", error);
    return [];
  }
};

/**
 * Search for ports specifically
 */
export const searchPorts = (query) => {
  return searchLocations(query, "port");
};

/**
 * Search for airports specifically
 */
export const searchAirports = (query) => {
  return searchLocations(query, "airport");
};

/**
 * Get location code by name
 */
export const getLocationByName = (name, type = "port") => {
  if (!name) return null;
  // This function would need to make an API call if needed
  // For now, returning null as it's not commonly used with API-based search
  return null;
};

export default {
  searchLocations,
  searchPorts,
  searchAirports,
  getLocationByName,
};
