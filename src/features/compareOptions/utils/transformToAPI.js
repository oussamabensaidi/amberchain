// Enhanced transformation function with proper location handling
function mapCargoType(sourceCargoType) {
  if (!sourceCargoType) return "GENERAL";

  switch (sourceCargoType.toLowerCase()) {
    case "hazardous":
      return "IMO";

    case "reefer":
    case "perishable":
      return "REEFER";

    case "oog":
    case "oversized":
      return "OOG";

    case "general":
      return "GENERAL";

    default:
      return "GENERAL";
  }
}

function transformToAPIFormat(sourceData) {
  return {
    cargoDetail: {
      accessConditions: sourceData.accsesConditions || "EASY",
      cargoProbs: sourceData.probes?.numberOfCargoProbes || 0,
      coldTraitement: sourceData.coldTreatment?.required || false,
      drainHolesOpen: sourceData.probes?.drainHoles || false,
      freshAirExchangeOpen: sourceData.probes?.freshAirExchange === "open",
      gensetDuringExport: sourceData.genset?.duringExport || false,
      gensetDuringImport: sourceData.genset?.duringImport || false,
      height: parseFloat(sourceData.cargo?.height) || 0,
      humidity: sourceData.humidity?.percentage || "",
      humidityControl: sourceData.humidity?.required || false,
      id: 0,
      imoClass: sourceData.cargo?.class || "",
      length: parseFloat(sourceData.cargo?.length) || 0,
      liftGate: sourceData.liftgate?.required || false,
      numberOfPackages: parseInt(sourceData.cargo?.numberOfPackages) || 0,
      numberOfPallets: parseInt(sourceData.cargo?.numberOfPallets) || 0,
      packageType: sourceData.cargo?.packageType || "",
      stackableCargo: sourceData.cargo?.stackableCargo || false,
      temperature: sourceData.coldTreatment?.temperature || "",
      temperatureSetPoints: {
        enabled: sourceData.coldTreatment?.multipleSetPoints || false,
        mode: "string",
        sets: sourceData.coldTreatment?.temperatureSetPoints?.map(point => ({
          day: point.day || "",
          temperature: point.temperature || ""
        })) || []
      },
      truckType: sourceData.cargo?.truckType || "",
      unNumber: sourceData.cargo?.unNumber ? parseInt(sourceData.cargo.unNumber.replace("UN", "")) : 0,
      unit: sourceData.cargo?.lengthMetrics === "m" ? "METER" : "INCH",
      ventilationVolume: sourceData.probes?.ventilationVolume || "",
      volume: sourceData.cargo?.volume || "",
      width: parseFloat(sourceData.cargo?.width) || 0
    },
    
    // Cargo Type
    cargoType: mapCargoType(sourceData.cargoType),
    commodity: sourceData.commodity || "",
    
    // Container Pickup Location (if checked)
    containerPickUpLocation: sourceData.pickupChecked ? {
      city: sourceData.pickupCity || "",
      country: sourceData.pickupCountry || "",
      countryCode: sourceData.pickupCountryCode || "",
      id: parseInt(sourceData.pickupLocation) || 0,
      lat: sourceData.pickupLat || "",
      locationType: "PORT",
      lon: sourceData.pickupLon || ""
    } : null,
    
    // Container Delivery/Return Location (if checked)
    containerDeliveryLocation: sourceData.returnChecked ? {
      city: sourceData.returnCity || "",
      country: sourceData.returnCountry || "",
      countryCode: sourceData.returnCountryCode || "",
      id: parseInt(sourceData.returnLocation) || 0,
      lat: sourceData.returnLat || "",
      locationType: "PORT",
      lon: sourceData.returnLon || ""
    } : null,
    
    // Container Size - extract from containerType
    containerSize: extractContainerSize(sourceData.containerType),
    containerType: extractContainerTypeCategory(sourceData.containerType),
    creationDate: new Date().toISOString(),
    
    // Delivery Position (POD)
    deliveryPosition: {
      city: sourceData.podCity || extractCity(sourceData.pod),
      country: sourceData.podCountry || "",
      countryCode: sourceData.podCountryCode || extractCountryCode(sourceData.pod),
      id: 0,
      lat: sourceData.podLat || "",
      locationType: "PORT",
      lon: sourceData.podLon || ""
    },
    
    grossWeight: parseFloat(sourceData.grossWeight) || 0,
    id: 0,
    
    // Pickup Position (POL)
    pickUpPosition: {
      city: sourceData.polCity || extractCity(sourceData.pol),
      country: sourceData.polCountry || "",
      countryCode: sourceData.polCountryCode || extractCountryCode(sourceData.pol),
      id: 0,
      lat: sourceData.polLat || "",
      locationType: "PORT",
      lon: sourceData.polLon || ""
    },
    
    // Position A (PLOR or POL)
    positionA: sourceData.plorChecked && sourceData.plor ? {
      city: sourceData.plorCity || extractCity(sourceData.plor),
      country: sourceData.plorCountry || "",
      countryCode: sourceData.plorCountryCode || extractCountryCode(sourceData.plor),
      id: 0,
      lat: sourceData.plorLat || "",
      locationType: "PORT",
      lon: sourceData.plorLon || ""
    } : {
      city: sourceData.polCity || extractCity(sourceData.pol),
      country: sourceData.polCountry || "",
      countryCode: sourceData.polCountryCode || extractCountryCode(sourceData.pol),
      id: 0,
      lat: sourceData.polLat || "",
      locationType: "PORT",
      lon: sourceData.polLon || ""
    },
    
    // Position B (PLOD or POD)
    positionB: sourceData.plodChecked && sourceData.plod ? {
      city: sourceData.plodCity || extractCity(sourceData.plod),
      country: sourceData.plodCountry || "",
      countryCode: sourceData.plodCountryCode || extractCountryCode(sourceData.plod),
      id: 0,
      lat: sourceData.plodLat || "",
      locationType: "PORT",
      lon: sourceData.plodLon || ""
    } : {
      city: sourceData.podCity || extractCity(sourceData.pod),
      country: sourceData.podCountry || "",
      countryCode: sourceData.podCountryCode || extractCountryCode(sourceData.pod),
      id: 0,
      lat: sourceData.podLat || "",
      locationType: "PORT",
      lon: sourceData.podLon || ""
    },
    
    serviceAddons: {
      changeDestination: false,
      customerBrokerage: sourceData.addons?.customsBrokerage?.enabled 
        ? (sourceData.addons.customsBrokerage.origin ? "ORIGIN" : "DESTINATION")
        : null,
      extraFreeTime: false,
      id: 0,
      inspection: null,
      insurance: 0,
      insuranceCurrency: "MAD",
      liveTracking: sourceData.addons?.trokeTrace || false,
      portAgent: false,
      readyToLoad: false,
      reduceEmission: false,
      repositionning: false,
      socForAll: false,
      stuffing: sourceData.addons?.stuffing?.enabled 
        ? (sourceData.addons.stuffing.equipment?.toUpperCase() || "FORKLIFT")
        : null,
      stuffingNumberWorkers: parseInt(sourceData.addons?.stuffing?.resources) || 0,
      trokeTrace: sourceData.addons?.trokeTrace || false,
      unStuffing: null,
      unStuffingNumberWorkers: 0
    },
    
    shipmentMethod: sourceData.shipmentType || "LCL",
    shipmentMode: sourceData.mode?.toUpperCase() || "SEA",
    status: "PENDING",
    trackId: "",
    updateDate: new Date().toISOString()
  };
}

// Helper function to extract city from "City, CountryCode" format
function extractCity(locationString) {
  if (!locationString) return "";
  const parts = locationString.split(',').map(s => s.trim());
  return parts[0] || "";
}

// Helper function to extract country code from "City, CountryCode" format
function extractCountryCode(locationString) {
  if (!locationString) return "";
  const parts = locationString.split(',').map(s => s.trim());
  return parts[1] || "";
}

// Helper function to extract container size from containerType
function extractContainerSize(containerType) {
  if (!containerType) return "SIZE_40";
  
  if (containerType.includes("20")) return "SIZE_20";
  if (containerType.includes("40")) return "SIZE_40";
  if (containerType.includes("45")) return "SIZE_45";
  
  return "SIZE_40"; // default
}

// Helper function to extract container category
function extractContainerTypeCategory(containerType) {
  if (!containerType) return "";
  
  const lowerType = containerType.toLowerCase();
  
  if (lowerType.includes("refrigerated") || lowerType.includes("reefer")) return "REEFER";
  if (lowerType.includes("flat") || lowerType.includes("flatrack")) return "FLAT_RACK";
  if (lowerType.includes("open")) return "OPEN_TOP";
  if (lowerType.includes("tank")) return "TANK";
  if (lowerType.includes("high cube")) return "HIGH_CUBE";
  
  return "STANDARD";
}


export default transformToAPIFormat