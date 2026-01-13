import { create } from "zustand"

export const useShipmentStore = create((set) => ({
  data: {
    mode: "",
    shipmentType: "",
    containerType: "",
    pol: "",
    pod: "",
    origin: null,
    destination: null,
    
    plorChecked: false,
    plor: "",
    plodChecked: false,
    plod: "",
    cargoType: "",
    commodity: "",
    grossWeight: "",
    pickupChecked: false,
    pickupLocation: "",
    returnChecked: false,
    returnLocation: "",
    
    // Wizard form data
    wizardSelection: {
      mainCategory: "",
      subCategory: "",
    },
    
    coldTreatment: {
      required: false,
      temperature: "",
      temperatureSetPoints: [],
      multipleSetPoints: false,
    },
    
    probes: {
      numberOfCargoProbes: 0,
      drainHoles: false,
      freshAirExchange: "open",
      ventilationVolume: "",
    },
    
    humidity: {
      required: false,
      percentage: "",
    },
    
    genset: {
      duringExport: false,
      duringImport: false,
    },
    
    temperatureSchedule: {
      daysBeforeETA: [],
      daysAfterGateIn: [],
    },
    
    cargo: {
      class: "",
      unNumber: "",
      width: "",
      length: "",
      height: "",
      lengthMetrics: "",
      packageType: "",
      numberOfPackages: "",
      volume: "",
      truckType: "",
      numberOfPallets: "",
      stackableCargo: false,
    },
    
    liftgate: {
      required: false,
    },
    
    accsesConditions: "",
    comparisonResults: [],
    scheduleResults: [], // ✅ Store schedule API results
    shipmentQueryContext: {}, // ✅ Store shipment parameters used for search
    
    // ✅ ADD these fields to store location details for API
    polCity: "",
    polCountry: "",
    polCountryCode: "",
    polLat: "",
    polLon: "",
    
    podCity: "",
    podCountry: "",
    podCountryCode: "",
    podLat: "",
    podLon: "",
    
    plorCity: "",
    plorCountry: "",
    plorCountryCode: "",
    plorLat: "",
    plorLon: "",
    
    plodCity: "",
    plodCountry: "",
    plodCountryCode: "",
    plodLat: "",
    plodLon: "",
    
    pickupCity: "",
    pickupCountry: "",
    pickupCountryCode: "",
    pickupLat: "",
    pickupLon: "",
    
    returnCity: "",
    returnCountry: "",
    returnCountryCode: "",
    returnLat: "",
    returnLon: "",
  },

  setField: (key, value) =>
    set((state) => ({
      data: { ...state.data, [key]: value }
    })),

  setWizardSelection: (selection) =>
    set((state) => ({
      data: {
        ...state.data,
        wizardSelection: selection
      }
    })),

  setComparisonResults: (results) =>
    set((state) => ({
      data: {
        ...state.data,
        comparisonResults: results
      }
    })),

  reset: () =>
    set({
      data: {
        mode: "",
        shipmentType: "",
        containerType: "",
        pol: "",
        pod: "",
        origin: null,
        destination: null,
        
        plorChecked: false,
        plor: "",
        plodChecked: false,
        plod: "",
        cargoType: "",
        commodity: "",
        grossWeight: "",
        pickupChecked: false,
        pickupLocation: "",
        returnChecked: false,
        returnLocation: "",
        
        wizardSelection: {
          mainCategory: "",
          subCategory: "",
        },
        
        coldTreatment: {
          required: false,
          temperature: "",
          temperatureSetPoints: [],
          multipleSetPoints: false,
        },
        
        probes: {
          numberOfCargoProbes: 0,
          drainHoles: false,
          freshAirExchange: "open",
          ventilationVolume: "",
        },
        
        humidity: {
          required: false,
          percentage: "",
        },
        
        genset: {
          duringExport: false,
          duringImport: false,
        },
        
        temperatureSchedule: {
          daysBeforeETA: [],
          daysAfterGateIn: [],
        },
        
        cargo: {
          class: "",
          unNumber: "",
          width: "",
          length: "",
          height: "",
          lengthMetrics: "",
          packageType: "",
          numberOfPackages: "",
          volume: "",
          truckType: "",
          numberOfPallets: "",
          stackableCargo: false,
        },
        
        liftgate: {
          required: false,
        },
        
        accsesConditions: "",
        comparisonResults: [],
        scheduleResults: [],
        shipmentQueryContext: {},
        
        polCity: "",
        polCountry: "",
        polCountryCode: "",
        polLat: "",
        polLon: "",
        
        podCity: "",
        podCountry: "",
        podCountryCode: "",
        podLat: "",
        podLon: "",
        
        plorCity: "",
        plorCountry: "",
        plorCountryCode: "",
        plorLat: "",
        plorLon: "",
        
        plodCity: "",
        plodCountry: "",
        plodCountryCode: "",
        plodLat: "",
        plodLon: "",
        
        pickupCity: "",
        pickupCountry: "",
        pickupCountryCode: "",
        pickupLat: "",
        pickupLon: "",
        
        returnCity: "",
        returnCountry: "",
        returnCountryCode: "",
        returnLat: "",
        returnLon: "",
      },
    })
}))