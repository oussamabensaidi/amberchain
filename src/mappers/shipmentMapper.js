// src/mappers/shipmentMapper.js

/* =========================
   UI (STORE) → API
========================= */

export function toApiShipment(sourceData) {
  const safeNumber = (v) => v === "" || v == null ? null : Number(v);

  return {
    cargoDetail: {
      accessConditions: mapAccessCondition(sourceData.accsesConditions),
      cargoProbs: sourceData.probes?.numberOfCargoProbes || 0,
      coldTraitement: sourceData.coldTreatment?.required || false,
      drainHolesOpen: sourceData.probes?.drainHoles || false,
      freshAirExchangeOpen: sourceData.probes?.freshAirExchange === "open",
      gensetDuringExport: sourceData.genset?.duringExport || false,
      gensetDuringImport: sourceData.genset?.duringImport || false,
      height: safeNumber(sourceData.cargo?.height),
      length: safeNumber(sourceData.cargo?.length),
      width: safeNumber(sourceData.cargo?.width),
      numberOfPackages: safeNumber(sourceData.cargo?.numberOfPackages),
      numberOfPallets: safeNumber(sourceData.cargo?.numberOfPallets),
      humidity: sourceData.humidity?.percentage || "",
      humidityControl: sourceData.humidity?.required || false,
      id: 0,
      imoClass: sourceData.cargo?.class || "",
      liftGate: sourceData.liftgate?.required || false,
      packageType: sourceData.cargo?.packageType || "",
      stackableCargo: sourceData.cargo?.stackableCargo || false,
      temperature: sourceData.coldTreatment?.temperature || "",
      temperatureSetPoints: {
        enabled: sourceData.coldTreatment?.multipleSetPoints || false,
        mode: "string",
        sets: sourceData.coldTreatment?.temperatureSetPoints || [],
      },
      truckType: sourceData.cargo?.truckType || "",
      unNumber: sourceData.cargo?.unNumber
        ? Number(sourceData.cargo.unNumber.replace("UN", ""))
        : null,
      unit: sourceData.cargo?.lengthMetrics === "m" ? "Meter" : "INCH",
      ventilationVolume: sourceData.probes?.ventilationVolume || "",
      volume: sourceData.cargo?.volume || "",
    },

    cargoType: mapCargoType(sourceData.cargoType),
    commodity: sourceData.commodity || "",

    containerPickUpLocation: sourceData.pickupChecked
      ? buildLocation("pickup", sourceData)
      : null,

    containerDeliveryLocation: sourceData.returnChecked
      ? buildLocation("return", sourceData)
      : null,

    containerSize: extractContainerSize(sourceData.containerType),
    containerType: extractContainerTypeCategory(sourceData.containerType),

    deliveryPosition: buildLocation("pod", sourceData),
    pickUpPosition: buildLocation("pol", sourceData),

    positionA: sourceData.plorChecked && sourceData.plor
      ? buildLocation("plor", sourceData)
      : buildLocation("pol", sourceData),

    positionB: sourceData.plodChecked && sourceData.plod
      ? buildLocation("plod", sourceData)
      : buildLocation("pod", sourceData),

    serviceAddons: {
      changeDestination: !!sourceData.addons?.changeDestination,
      extraFreeTime: !!sourceData.addons?.extraFreeTime,
      portAgent: !!sourceData.addons?.portAgent,
      readyToLoad: !!sourceData.addons?.readyToLoad,
      reduceEmission: !!sourceData.addons?.reduceEmission,
      repositionning: !!sourceData.addons?.reposition,
      socForAll: !!sourceData.addons?.socForAll,
      liveTracking: !!sourceData.addons?.trackLive,
      customerBrokerage: sourceData.addons?.customsBrokerage?.enabled
        ? (sourceData.addons.customsBrokerage.origin && sourceData.addons.customsBrokerage.destination ? "BOTH" :
        sourceData.addons.customsBrokerage.origin ? "ORIGIN" :
        sourceData.addons.customsBrokerage.destination ? "DESTINATION" : null)
        : null,
      inspection: sourceData.addons?.inspection?.enabled
        ? { type: sourceData.addons.inspection.type || "" }
        : null,
      insurance: sourceData.addons?.insurance?.enabled
        ? Number(sourceData.addons.insurance.cargoValue)
        : 0,
      insuranceCurrency: sourceData.addons?.insurance?.currency || "EURO",
      stuffing: sourceData.addons?.stuffing?.enabled
        ? (sourceData.addons.stuffing.equipment?.toUpperCase() || "MANUALLY")
        : null,
      stuffingNumberWorkers: parseInt(sourceData.addons?.stuffing?.resources) || 0,
      unStuffing: sourceData.addons?.unstuffing?.enabled
        ? (sourceData.addons.unstuffing.equipment?.toUpperCase() || "MANUALLY")
        : null,
      unStuffingNumberWorkers: parseInt(sourceData.addons?.unstuffing?.resources) || 0,
      trokeTrace: !!sourceData.addons?.trokeTrace
    },

    grossWeight: Number(sourceData.grossWeight) || 0,
    shipmentMethod: sourceData.shipmentType || "LCL",
    shipmentMode: mapShipmentMode(sourceData.mode),
    status: "PENDING",
    trackId: "",
    creationDate: new Date().toISOString(),
    updateDate: new Date().toISOString(),
  };
}

/* =========================
   API → UI (STORE)
========================= */

export function fromApiShipment(api) {
  return {
    // CRITICAL: Normalize mode to lowercase for UI consistency
    mode: api.shipmentMode?.toLowerCase() || "",
    shipmentType: api.shipmentMethod || "",
    containerType: buildContainerTypeString(api.containerType, api.containerSize),

    // CRITICAL: Reverse cargo type mapping
    cargoType: reverseMapCargoType(api.cargoType),
    commodity: api.commodity || "",
    grossWeight: String(api.grossWeight || ""),

    coldTreatment: {
      required: api.cargoDetail?.coldTraitement || false,
      temperature: api.cargoDetail?.temperature || "",
      temperatureSetPoints: api.cargoDetail?.temperatureSetPoints?.sets || [],
      multipleSetPoints: api.cargoDetail?.temperatureSetPoints?.enabled || false,
    },

    probes: {
      numberOfCargoProbes: api.cargoDetail?.cargoProbs || 0,
      drainHoles: api.cargoDetail?.drainHolesOpen || false,
      freshAirExchange: api.cargoDetail?.freshAirExchangeOpen ? "open" : "closed",
      ventilationVolume: api.cargoDetail?.ventilationVolume || "",
    },

    humidity: {
      required: api.cargoDetail?.humidityControl || false,
      percentage: api.cargoDetail?.humidity || "",
    },

    genset: {
      duringExport: api.cargoDetail?.gensetDuringExport || false,
      duringImport: api.cargoDetail?.gensetDuringImport || false,
    },

    cargo: {
      class: api.cargoDetail?.imoClass || "",
      unNumber: api.cargoDetail?.unNumber ? `UN${api.cargoDetail.unNumber}` : "",
      width: api.cargoDetail?.width || "",
      length: api.cargoDetail?.length || "",
      height: api.cargoDetail?.height || "",
      lengthMetrics: api.cargoDetail?.unit === "Meter" ? "m" : "in",
      packageType: api.cargoDetail?.packageType || "",
      numberOfPackages: api.cargoDetail?.numberOfPackages || "",
      volume: api.cargoDetail?.volume || "",
      truckType: api.cargoDetail?.truckType || "",
      numberOfPallets: api.cargoDetail?.numberOfPallets || "",
      stackableCargo: api.cargoDetail?.stackableCargo || false,
    },

    liftgate: {
      required: api.cargoDetail?.liftGate || false,
    },

    accsesConditions: reverseMapAccessCondition(api.cargoDetail?.accessConditions),

    // CRITICAL: Map service addons from API
    addons: mapServiceAddonsFromApi(api.serviceAddons),

    // RESTORE BOOLEAN FLAGS (Critical for UI visibility)
    pickupChecked: !!api.containerPickUpLocation,
    returnChecked: !!api.containerDeliveryLocation,
    plorChecked: !!(api.positionA?.city && api.positionA.city !== api.pickUpPosition?.city),
    plodChecked: !!(api.positionB?.city && api.positionB.city !== api.deliveryPosition?.city),

    // Map Locations
    ...flattenLocation("pol", api.pickUpPosition),
    ...flattenLocation("pod", api.deliveryPosition),
    ...flattenLocation("plor", api.positionA),
    ...flattenLocation("plod", api.positionB),
    ...flattenLocation("pickup", api.containerPickUpLocation),
    ...flattenLocation("return", api.containerDeliveryLocation),
  };
}

/* =========================
   Helpers
========================= */

function buildLocation(prefix, src) {
  return {
    city: src[`${prefix}City`] || src[prefix] || "",
    country: src[`${prefix}Country`] || src[prefix] || "",
    countryCode: src[`${prefix}CountryCode`] || "",
    lat: src[`${prefix}Lat`] ? String(src[`${prefix}Lat`]) : "",
    lon: src[`${prefix}Lon`] ? String(src[`${prefix}Lon`]) : "",
    id: src[`${prefix}LocationId`] || 0,
    locationType: "PORT",
  };
}

function flattenLocation(prefix, loc) {
  if (!loc) return {};
  return {
    [`${prefix}City`]: loc.city || "",
    [`${prefix}Country`]: loc.country || "",
    [`${prefix}CountryCode`]: loc.countryCode || "",
    [`${prefix}Lat`]: loc.lat || "",
    [`${prefix}Lon`]: loc.lon || "",
    [`${prefix}`]: loc.city ? `${loc.city}, ${loc.countryCode}` : "",
  };
}

function mapShipmentMode(mode) {
  if (!mode) return "SEA";
  const normalizedMode = mode.toLowerCase();
  if (normalizedMode === "ecommerce") return "ECOMM";
  return normalizedMode.toUpperCase();
}

function mapCargoType(type) {
  if (!type) return "GENERAL";
  const t = type.toLowerCase();
  if (t === "hazardous") return "IMO";
  if (t === "perishable") return "REEFER";  // Changed from "reefer"
  if (t === "oversized") return "OOG";      // Changed from "oog"
  if (t === "liquid") return "LQUID";       // Added
  if (t === "general") return "GENERAL";    // Added explicitly
  return "GENERAL";
}

// NEW: Reverse mapping for cargo type (API → UI)
function reverseMapCargoType(apiType) {
  if (!apiType) return "General";
  const t = apiType.toUpperCase();
  if (t === "IMO" || t === "OOG_IMO" || t === "REEFER_IMO") return "Hazardous";
  if (t === "REEFER") return "Perishable";
  if (t === "OOG") return "Oversized";
  if (t === "LQUID") return "Liquid";
  if (t === "GENERAL" || t === "DRY") return "General";
  return "General";
}

function extractContainerSize(type) {
  if (!type) return "SIZE_40";
  if (type.includes("20")) return "SIZE_20";
  if (type.includes("45")) return "SIZE_45";
  return "SIZE_40";
}

function extractContainerTypeCategory(type) {
  if (!type) return "STANDARD";
  const t = type.toLowerCase();
  if (t.includes("reefer") || t.includes("refrigerated")) return "REEFER";
  if (t.includes("flat")) return "FLAT_RACK";
  if (t.includes("open")) return "OPEN_TOP";
  if (t.includes("tank")) return "TANK";
  if (t.includes("high cube")) return "HIGH_CUBE";
  return "STANDARD";
}

// NEW: Build container type string from API values
function buildContainerTypeString(containerType, containerSize) {
  if (!containerType && !containerSize) return "";
  
  const size = containerSize?.replace("SIZE_", "") || "40";
  let type = containerType || "STANDARD";
  
  // Convert API type to display format
  const typeMap = {
    "REEFER": "Reefer",
    "FLAT_RACK": "Flat Rack",
    "OPEN_TOP": "Open Top",
    "TANK": "Tank",
    "HIGH_CUBE": "High Cube",
    "STANDARD": "Standard"
  };
  
  const displayType = typeMap[type.toUpperCase()] || "Standard";
  return `${size}' ${displayType}`;
}

function mapAccessCondition(input) {
  if (!input) return "EASY";
  const v = input.toLowerCase();
  if (v.includes("limited")) return "LIMITED";
  if (v.includes("difficult") || v.includes("restricted")) return "DIFFICULT";
  return "EASY";
}

// NEW: Reverse mapping for access conditions
function reverseMapAccessCondition(apiValue) {
  if (!apiValue) return "";
  const v = apiValue.toUpperCase();
  if (v === "LIMITED") return "limited access";
  if (v === "DIFFICULT") return "difficult access";
  if (v === "EASY") return "easy access";
  return "";
}

// NEW: Map service addons from API to UI format
function mapServiceAddonsFromApi(serviceAddons) {
  if (!serviceAddons) return {};

  return {
    changeDestination: serviceAddons.changeDestination || false,
    extraFreeTime: serviceAddons.extraFreeTime || false,
    portAgent: serviceAddons.portAgent || false,
    readyToLoad: serviceAddons.readyToLoad || false,
    reduceEmission: serviceAddons.reduceEmission || false,
    reposition: serviceAddons.repositionning || false,
    socForAll: serviceAddons.socForAll || false,
    trackLive: serviceAddons.liveTracking || false,
    trokeTrace: serviceAddons.trokeTrace || false,
    
    customsBrokerage: serviceAddons.customerBrokerage ? {
      enabled: true,
      origin: serviceAddons.customerBrokerage === "ORIGIN" || serviceAddons.customerBrokerage === "BOTH",
      destination: serviceAddons.customerBrokerage === "DESTINATION" || serviceAddons.customerBrokerage === "BOTH"
    } : {
      enabled: false,
      origin: false,
      destination: false
    },
    
    inspection: serviceAddons.inspection ? {
      enabled: true,
      type: serviceAddons.inspection.type || ""
    } : {
      enabled: false,
      type: ""
    },
    
    insurance: {
      enabled: !!serviceAddons.insurance && serviceAddons.insurance > 0,
      cargoValue: String(serviceAddons.insurance || ""),
      currency: serviceAddons.insuranceCurrency || "EURO"
    },
    
    stuffing: serviceAddons.stuffing ? {
      enabled: true,
      equipment: serviceAddons.stuffing.toLowerCase() || "manually",
      resources: String(serviceAddons.stuffingNumberWorkers || "")
    } : {
      enabled: false,
      equipment: "manually",
      resources: ""
    },
    
    unstuffing: serviceAddons.unStuffing ? {
      enabled: true,
      equipment: serviceAddons.unStuffing.toLowerCase() || "manually",
      resources: String(serviceAddons.unStuffingNumberWorkers || "")
    } : {
      enabled: false,
      equipment: "manually",
      resources: ""
    }
  };
}

// shipmentMapper.js
export function applyQuoteToStore(quote, setField) {
  setField("mode", quote.mode || "")
  setField("shipmentType", quote.shipmentType || "")
  setField("containerType", quote.containerType || "")

  setField("cargoType", quote.cargoType || "")
  setField("commodity", quote.commodity || "")
  setField("grossWeight", quote.grossWeight || "")

  const pol = quote.polCity || quote.pol || ""
  const pod = quote.podCity || quote.pod || ""

  setField("pol", pol)
  setField("pod", pod)

  setField("polCity", quote.polCity || "")
  setField("polCountry", quote.polCountry || "")
  setField("polCountryCode", quote.polCountryCode || "")
  setField("polLat", quote.polLat || "")
  setField("polLon", quote.polLon || "")

  setField("podCity", quote.podCity || "")
  setField("podCountry", quote.podCountry || "")
  setField("podCountryCode", quote.podCountryCode || "")
  setField("podLat", quote.podLat || "")
  setField("podLon", quote.podLon || "")

  setField("plorChecked", !!quote.plorChecked)
  setField("plor", quote.plor || "")
  setField("plorCity", quote.plorCity || "")
  setField("plorCountry", quote.plorCountry || "")
  setField("plorCountryCode", quote.plorCountryCode || "")
  setField("plorLat", quote.plorLat || "")
  setField("plorLon", quote.plorLon || "")

  setField("plodChecked", !!quote.plodChecked)
  setField("plod", quote.plod || "")
  setField("plodCity", quote.plodCity || "")
  setField("plodCountry", quote.plodCountry || "")
  setField("plodCountryCode", quote.plodCountryCode || "")
  setField("plodLat", quote.plodLat || "")
  setField("plodLon", quote.plodLon || "")

  setField("pickupChecked", !!quote.pickupChecked)
  setField("pickupLocation", quote.pickupLocation || "")
  setField("pickupCity", quote.pickupCity || "")
  setField("pickupCountry", quote.pickupCountry || "")
  setField("pickupCountryCode", quote.pickupCountryCode || "")
  setField("pickupLat", quote.pickupLat || "")
  setField("pickupLon", quote.pickupLon || "")

  setField("returnChecked", !!quote.returnChecked)
  setField("returnLocation", quote.returnLocation || "")
  setField("returnCity", quote.returnCity || "")
  setField("returnCountry", quote.returnCountry || "")
  setField("returnCountryCode", quote.returnCountryCode || "")
  setField("returnLat", quote.returnLat || "")
  setField("returnLon", quote.returnLon || "")

  setField("coldTreatment", quote.coldTreatment || {})
  setField("probes", quote.probes || {})
  setField("humidity", quote.humidity || {})
  setField("genset", quote.genset || {})

  setField("cargo", quote.cargo || {})
  setField("liftgate", quote.liftgate || {})
  setField("accsesConditions", quote.accsesConditions || "")

  if (quote.addons) {
    setField("addons", quote.addons)
  }

  setField(
    "wizardSelection",
    quote.wizardSelection || { mainCategory: "", subCategory: "" }
  )
}
