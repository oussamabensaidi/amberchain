import { useState, useRef, useEffect } from "react"
import { TRANSPORT_MODES } from "@/constants/CompareOptionsFields"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useShipmentStore } from "@/store/shipmentStore"
import { locationLabels } from "../utils/modeLabels"
import ModeSelector from "./ModeSelector"
import LocationSection from "./LocationSection"
import ShipmentTypeSection from "./ShipmentTypeSection"
import CargoTypeSection from "./CargoTypeSection"
import BookingForm from "./bookingForm/BookingForm"
// import transformToAPIFormat from "../utils/transformToAPI"
import {toApiShipment} from "@/mappers/shipmentMapper"
// import normalizeScheduleData from "../utils/scheduleUtils"
import submitCompareOptions from "@/services/CompareOptionsService"
import PopUp from "./PopUp"
import { toast } from 'sonner';

export default function ShipmentForm({ onFormComplete, enableServicePopup = true }) {

  const { data, setField, setComparisonResults } = useShipmentStore()
  const { mode, shipmentType, cargoType } = data
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [showError, setShowError] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const navigate = useNavigate()

  const modeRef = useRef(null)
  const shipmentTypeRef = useRef(null)
  const locationsRef = useRef(null)
  const cargoTypeRef = useRef(null)
  const submitRef = useRef(null)
  const transition = { duration: 0.35, ease: "easeOut" }
  // Default mode to 'combined' on initial load if not already set
  useEffect(() => {
    if (!mode) {
      setField("mode", "combined")
      setField("shipmentType", "")
      setField("cargoType", "")
    }
  }, [])

  // POL / POD labels come from locationLabels[mode] if available,
  // otherwise fallback to standard names
  const [polLabel, podLabel] = locationLabels[mode] || ["Place of origin", "Port of destination"]

  // PLOR / PLOD full names — conditional on selected mode.
  // If mode exists, include the chosen POL/POD label in the description;
  // if not, show a standard full name.
  const plorLabel = mode
    ? `${polLabel} — Place/Return of Loading (PLOR)`
    : "Place of Loading (PLOR)"
  const plodLabel = mode
    ? `${podLabel} — Place/Return of Discharge (PLOD)`
    : "Place of Discharge (PLOD)"

  // Return an object of field errors. Empty object = valid
  const validateForm = () => {
    const errors = {}

    // Start with location validation first (POL/POD are always required)
    if (!data.pol) errors.pol = `Please enter a valid ${polLabel || 'POL'}.`
    if (!data.pod) errors.pod = `Please enter a valid ${podLabel || 'POD'}.`

    // Optional PLOR/PLOD/Pickup (only required if their checkboxes are checked)
    if (data.plorChecked && !data.plor) errors.plor = `Please enter a valid ${plorLabel}.`
    if (data.plodChecked && !data.plod) errors.plod = `Please enter a valid ${plodLabel}.`
    if (data.pickupChecked && !data.pickupLocation) errors.pickupLocation = "Please enter a valid Pickup location."
    if (data.returnChecked && !data.returnLocation) errors.returnLocation = "Please enter a valid Return location."

    // Mode is now required
    if (!mode) {
      errors.mode = "Please select a mode of transport."
    }

    // If location or mode errors found, short-circuit (so user sees these errors first)
    if (Object.keys(errors).length > 0) return errors

    // Validate shipmentType if mode requires it
    if ((mode && mode !== "air" && mode !== "ecommerce" && mode !== "combined") && !shipmentType) {
      errors.shipmentType = "Please select a shipment type."
      return errors
    }

    if (!cargoType) {
      errors.cargoType = "Please select a cargo type."
      return errors
    }

    // Commodity and gross weight required once cargo type is selected
    if (!data.commodity) {
      errors.commodity = "Please select a commodity."
    }
    if (!data.grossWeight) {
      errors.grossWeight = "Please enter gross weight."
    }

    // plor, plod, pickup/return re-check (kept, though we already did above)
    if (data.plorChecked && !data.plor) errors.plor = `Please enter a valid ${plorLabel}.`
    if (data.plodChecked && !data.plod) errors.plod = `Please enter a valid ${plodLabel}.`
    if (data.pickupChecked && !data.pickupLocation) errors.pickupLocation = "Please enter a valid Pickup location."
    if (data.returnChecked && !data.returnLocation) errors.returnLocation = "Please enter a valid Return location."

    return errors
  }


  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setError("Please fix the errors above and try again.");
      setShowError(true);

      // Scroll to the first error
      setTimeout(() => {
        const firstError = Object.keys(validationErrors)[0];
        const errorToRef = {
          mode: modeRef, shipmentType: shipmentTypeRef,
          pol: locationsRef, pod: locationsRef,
          cargoType: cargoTypeRef, commodity: cargoTypeRef,
          grossWeight: cargoTypeRef
        };
        errorToRef[firstError]?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return; // Stop here if invalid
  }
  // VALIDATION PASSED: Now transform
  const payload = toApiShipment(data);
  // Clear previous errors
  setError("");
  setShowError(false);
  setFieldErrors({});

  // Check if popup is needed
  const requiresPopup = enableServicePopup && ["air", "ecommerce"].includes(data.mode);

  if (requiresPopup) {
    setShowSuccessPopup(true);
    // Note: The PopUp component needs to call completeSubmission(payload) when closed
    return; 
  }

  // Final step for standard modes
  completeSubmission(payload);
};

// Complete submission and handle success/error states
const completeSubmission = async (transformedPayload) => {
  try {
    console.log("SENDING TO API:", transformedPayload);
    const response = await submitCompareOptions(transformedPayload);

    console.log("API RESPONSE:", response);

    // Store shipment query context (parameters used for the search) for reference in results
    setField("shipmentQueryContext", {
      mode: data.mode,
      shipmentType: data.shipmentType,
      pol: data.pol,
      pod: data.pod,
      plor: data.plor,
      plod: data.plod,
      cargoType: data.cargoType,
      commodity: data.commodity,
      grossWeight: data.grossWeight,
      pickupLocation: data.pickupLocation,
      returnLocation: data.returnLocation,
      polCity: data.polCity,
      polCountry: data.polCountry,
      polCountryCode: data.polCountryCode,
      podCity: data.podCity,
      podCountry: data.podCountry,
      podCountryCode: data.podCountryCode,
    });

    // Store schedule data if available
    if (response.schedule) {
      setField("scheduleResults", response.schedule);
      console.log("Schedule data stored:", response.schedule);
    }

    // Use schedule data only - skip quote processing
    if (response.schedule && Array.isArray(response.schedule) && response.schedule.length > 0) {
      // Use full schedule data directly - preserves all API response data
      setComparisonResults(response.schedule);
    } 

    setHasSubmitted(true);
    toast.success('QUOTE submitted successfully!');
    if (onFormComplete) onFormComplete();

    // Scroll to results/success
    setTimeout(() => 
      submitRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 
    100);

  } catch (err) {
    console.error("Submission failed:", err);
    setError("Failed to connect to the server. Please try again.");
    setShowError(true);
  }
};




  return (
    <div className="w-full flex justify-center">
      <form onSubmit={handleSubmit} className="w-3/4 space-y-10 bg-card p-8 rounded-2xl border shadow-xl">

        {/* Mode selector remains (unchanged behavior / placement can be kept below POL/POD) */}
        <div className="mode-section">
          {/* POL / POD: always visible */}
          <ModeSelector 
            mode={mode} 
            setField={setField} 
            error={fieldErrors.mode}
            forwardedRef={modeRef}
          />
          <LocationSection
            data={data}
            setField={setField}
            labels={[polLabel, podLabel]}
            plorPlodLabels={[plorLabel, plodLabel]} // new prop to communicate full names to LocationSection
            errors={fieldErrors}
            forwardedRef={locationsRef}
          />
        </div>

     {/* Shipment Type section (hidden for combined/air/ecommerce) */}
{mode && mode !== "air" && mode !== "ecommerce" && mode !== "combined" && (
  <ShipmentTypeSection
    mode={mode}
    shipmentType={shipmentType}
    setField={setField}
    error={fieldErrors.shipmentType}
    forwardedRef={shipmentTypeRef}
  />
)}

{/* Cargo Type section logic updated */}
{(
  // Case 1: normal behavior if mode selected
    (mode && (
    (mode === "air" || mode === "ecommerce" || mode === "combined") ||
    (mode !== "air" && mode !== "ecommerce" && mode !== "combined" && shipmentType)
  ))
  // Case 2: NEW behavior — no mode, but POL & POD filled
  || (!mode && data.pol && data.pod)
) && (
  <CargoTypeSection
    cargoType={cargoType}
    data={data}
    setField={setField}
    errors={fieldErrors}
    forwardedRef={cargoTypeRef}
  />
)}

        <AnimatePresence>
          {showError && error && (
            <motion.div
              key="form-error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="text-destructive font-semibold text-center mb-2"
              style={{ minHeight: 24 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
        {(data.cargoType && mode !== "combined") && (<BookingForm />)}
        { (data.mode || data.pol && data.pod)  && (
          <motion.section ref={submitRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={transition} className="flex justify-center ">
            <Button type="submit" size="lg" className="px-12 py-4 text-lg  bg-primary hover:bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300">
              {hasSubmitted ? "COMPARE OPTIONS" : "COMPARE OPTIONS"}
            </Button>
          </motion.section>
          )} 

      </form>

{enableServicePopup && ["air", "ecommerce"].includes(data.mode) && showSuccessPopup && (
  <PopUp 
    showSuccessPopup={showSuccessPopup} 
    setShowSuccessPopup={(val) => {
      setShowSuccessPopup(val);
      if (!val) {
        // Popup closed — continue submission
        const payload = toApiShipment(data);
        completeSubmission(payload);
      }
    }} 
  />
)}

  </div>
  )
}
