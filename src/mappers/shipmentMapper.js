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
        numberOfPallets: safeNumber(sourceData.cargo?.numberOfPallets),      humidity: sourceData.humidity?.percentage || "",
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
        // Ensure we map this safely even if undefined
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
    shipmentMode: sourceData.mode?.toUpperCase() || "SEA",
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
    mode: api.shipmentMode || "",
    shipmentType: api.shipmentMethod || "",
    containerType: api.containerType || "",

    cargoType: api.cargoType || "",
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

    accsesConditions: api.cargoDetail?.accessConditions || "",

    // RESTORE BOOLEAN FLAGS (Critical for UI visibility)
    pickupChecked: !!api.containerPickUpLocation,
    returnChecked: !!api.containerDeliveryLocation,
    // Compare PLOR vs POL to determine if checked
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
    lat: src[`${prefix}Lat`] || "",
    lon: src[`${prefix}Lon`] || "",
    id: 0,
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
    // Also map the full string if the store uses it for display
    [`${prefix}`]: loc.city ? `${loc.city}, ${loc.countryCode}` : "", 
  };
}

function mapCargoType(type) {
  if (!type) return "GENERAL";
  const t = type.toLowerCase();
  if (t === "hazardous") return "IMO";
  if (t === "reefer" || t === "perishable") return "REEFER";
  if (t === "oog" || t === "oversized") return "OOG";
  return "GENERAL";
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
  // Fixed logic to include "refrigerated"
  if (t.includes("reefer") || t.includes("refrigerated")) return "REEFER";
  if (t.includes("flat")) return "FLAT_RACK";
  if (t.includes("open")) return "OPEN_TOP";
  if (t.includes("tank")) return "TANK";
  if (t.includes("high cube")) return "HIGH_CUBE";
  return "STANDARD";
}

function mapAccessCondition(input) {
  if (!input) return "EASY";
  const v = input.toLowerCase();
  if (v.includes("limited")) return "LIMITED";
  if (v.includes("difficult") || v.includes("restricted")) return "DIFFICULT";
  return "EASY";
}
