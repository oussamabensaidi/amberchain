/**
 * Port and Location Search Service
 * Uses multiple free APIs with CORS support
 */

// Port database - common shipping ports
const PORT_DATABASE = {
  // North America
  "USLAX": { name: "Los Angeles", country: "United States", city: "Los Angeles", lat: 33.7425, lon: -118.2627 },
  "USNYC": { name: "New York", country: "United States", city: "New York", lat: 40.7128, lon: -74.0060 },
  "USLGB": { name: "Long Beach", country: "United States", city: "Long Beach", lat: 33.7701, lon: -118.1937 },
  "USSAV": { name: "Savannah", country: "United States", city: "Savannah", lat: 32.0809, lon: -81.0912 },
  "USHTX": { name: "Houston", country: "United States", city: "Houston", lat: 29.7589, lon: -95.3677 },
  "USTAC": { name: "Seattle", country: "United States", city: "Seattle", lat: 47.6062, lon: -122.3321 },
  
  // Europe
  "DEHAM": { name: "Hamburg", country: "Germany", city: "Hamburg", lat: 53.5511, lon: 9.9937 },
  "NLRTM": { name: "Rotterdam", country: "Netherlands", city: "Rotterdam", lat: 51.9225, lon: 4.4792 },
  "BEANR": { name: "Antwerp", country: "Belgium", city: "Antwerp", lat: 51.2213, lon: 4.4015 },
  "GBLDN": { name: "London", country: "United Kingdom", city: "London", lat: 51.5074, lon: -0.1278 },
  
  // Asia
  "CNSHA": { name: "Shanghai", country: "China", city: "Shanghai", lat: 31.2304, lon: 121.4737 },
  "CNSZX": { name: "Shenzhen", country: "China", city: "Shenzhen", lat: 22.5431, lon: 114.0579 },
  "SGSIN": { name: "Singapore", country: "Singapore", city: "Singapore", lat: 1.3521, lon: 103.8198 },
  "JPYOK": { name: "Yokohama", country: "Japan", city: "Yokohama", lat: 35.4437, lon: 139.6380 },
  "INMAA": { name: "Mumbai", country: "India", city: "Mumbai", lat: 19.0760, lon: 72.8777 },
};

// Airport database
const AIRPORT_DATABASE = {
  "LAX": { name: "Los Angeles International", country: "United States", city: "Los Angeles", lat: 33.9425, lon: -118.4081 },
  "JFK": { name: "John F. Kennedy", country: "United States", city: "New York", lat: 40.6413, lon: -73.7781 },
  "ORD": { name: "Chicago O'Hare", country: "United States", city: "Chicago", lat: 41.9742, lon: -87.9073 },
  "FRA": { name: "Frankfurt am Main", country: "Germany", city: "Frankfurt", lat: 50.0379, lon: 8.5622 },
  "CDG": { name: "Charles de Gaulle", country: "France", city: "Paris", lat: 49.0097, lon: 2.5479 },
  "HND": { name: "Haneda", country: "Japan", city: "Tokyo", lat: 35.5494, lon: 139.7798 },
  "PVG": { name: "Shanghai Pudong", country: "China", city: "Shanghai", lat: 31.1437, lon: 121.8083 },
  "SIN": { name: "Changi", country: "Singapore", city: "Singapore", lat: 1.3644, lon: 103.9915 },
};

/**
 * Search for locations with CORS-friendly approach
 * Returns array of location suggestions
 */
export const searchLocations = async (query, type = "port") => {
  if (!query || query.length < 2) {
    return [];
  }

  const queryLower = query.toLowerCase();
  const results = [];

  try {
    if (type === "port") {
      // Search port database first
      for (const [code, port] of Object.entries(PORT_DATABASE)) {
        if (
          port.name.toLowerCase().includes(queryLower) ||
          port.city.toLowerCase().includes(queryLower) ||
          port.country.toLowerCase().includes(queryLower) ||
          code.toLowerCase().includes(queryLower)
        ) {
          results.push({
            code,
            name: port.name,
            city: port.city,
            country: port.country,
            lat: port.lat,
            lon: port.lon,
            locationType: "PORT",
            display_name: `${port.name}, ${port.country}`,
          });
        }
      }
    } else if (type === "airport") {
      // Search airport database
      for (const [code, airport] of Object.entries(AIRPORT_DATABASE)) {
        if (
          airport.name.toLowerCase().includes(queryLower) ||
          airport.city.toLowerCase().includes(queryLower) ||
          airport.country.toLowerCase().includes(queryLower) ||
          code.toLowerCase().includes(queryLower)
        ) {
          results.push({
            code,
            name: airport.name,
            city: airport.city,
            country: airport.country,
            lat: airport.lat,
            lon: airport.lon,
            locationType: "AIRPORT",
            display_name: `${airport.name} (${code}), ${airport.country}`,
          });
        }
      }
    }

    // Return top 10 results
    return results.slice(0, 10);
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

  const nameLower = name.toLowerCase();
  const database = type === "airport" ? AIRPORT_DATABASE : PORT_DATABASE;

  for (const [code, location] of Object.entries(database)) {
    if (
      location.name.toLowerCase().includes(nameLower) ||
      location.city.toLowerCase().includes(nameLower) ||
      code.toLowerCase().includes(nameLower)
    ) {
      return {
        code,
        ...location,
        locationType: type === "airport" ? "AIRPORT" : "PORT",
      };
    }
  }

  return null;
};

export default {
  searchLocations,
  searchPorts,
  searchAirports,
  getLocationByName,
};
