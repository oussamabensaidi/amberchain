import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, ArrowRight, ArrowLeft, Package, MapPin, Truck, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useShipmentStore } from "@/store/shipmentStore"
import useAuthStore from "@/store/authStore"
import { locationLabels } from "@/features/compareOptions/utils/modeLabels"
import LocationSection from "@/features/compareOptions/step1/LocationSection"
import BookModeCargoShipmentForm from "@/features/book/bookComponent/BookModeCargoShipmentForm"
import QuoteHelperCard from "@/features/book/step1/QuoteHelperCard"
import ServiceAddonsSection from "@/features/compareOptions/step1/bookingForm/ServiceAddonsSection"
import PopUp from "../../compareOptions/step1/PopUp"


import BookQuotationDetails from "@/features/book/step1/BookQuotationDetails"
export default function BookBookingForm({ enableServicePopup = true, onComplete, onBack }) {
  const { data, setField } = useShipmentStore()
  const { user } = useAuthStore()
  const { mode, shipmentType, cargoType } = data

  const [activeStep, setActiveStep] = useState(1)
  const [initializedFromStore, setInitializedFromStore] = useState(false)

  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [error, setError] = useState("")
  const [showError, setShowError] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [direction, setDirection] = useState(1)

  const modeRef = useRef(null)
  const shipmentTypeRef = useRef(null)
  const locationsRef = useRef(null)
  const cargoTypeRef = useRef(null)

  const applyQuoteToStore = (quote) => {
    setField("mode", quote.mode)
    setField("shipmentType", quote.shipmentType || "")
    setField("containerType", quote.containerType || "")
    setField("pol", quote.pol)
    setField("pod", quote.pod)
    setField("cargoType", quote.cargoType)
    setField("commodity", quote.commodity)
    setField("grossWeight", quote.grossWeight)
  }


  useEffect(() => {
    if (initializedFromStore) return

    const hasRoute = !!(data.pol && data.pod)
    const hasMode = !!mode
    const needsShipmentType = hasMode && !["air", "ecommerce", "combined"].includes(mode)
    const hasShipmentType = !!shipmentType
    const hasCargo = !!(cargoType && data.commodity && data.grossWeight)

    let nextStep = 1
    if (!hasRoute) {
      nextStep = 1
    } else if (!hasMode || (needsShipmentType && !hasShipmentType)) {
      nextStep = 2
    } else if (!hasCargo) {
      nextStep = 3
    } else {
      nextStep = 4
    }

    setActiveStep(nextStep)
    setInitializedFromStore(true)
  }, [initializedFromStore, data.pol, data.pod, data.commodity, data.grossWeight, mode, shipmentType, cargoType])

  const handleUseQuote = (quote) => {
    applyQuoteToStore(quote)

    // Decide next step based on quote contents (not store timing)
    const hasRoute = !!(quote.data?.pol || quote.pol) && !!(quote.data?.pod || quote.pod)
    const hasMode = !!quote.mode
    const needsShipmentType = hasMode && !["air", "ecommerce", "combined"].includes(quote.mode)
    const hasShipmentType = !!quote.shipmentType
    const hasCargo = !!(quote.cargoType && quote.commodity && quote.grossWeight)

    let nextStep = 1
    if (!hasRoute) {
      nextStep = 1
    } else if (!hasMode || (needsShipmentType && !hasShipmentType)) {
      nextStep = 2
    } else if (!hasCargo) {
      nextStep = 3
    } else {
      nextStep = 4
    }

    setDirection(1)
    setActiveStep(nextStep)
  }

  const validateStep = (step) => {
    const errors = {}

    // Step 1: Route details
    if (step === 1) {
      if (!data.pol) errors.pol = `Please enter a valid ${locationLabels[mode] ? locationLabels[mode][0] : "POL"}.`
      if (!data.pod) errors.pod = `Please enter a valid ${locationLabels[mode] ? locationLabels[mode][1] : "POD"}.`
      if (data.pickupChecked && !data.pickupLocation) errors.pickupLocation = "Please enter a valid Pickup location."
      if (data.returnChecked && !data.returnLocation) errors.returnLocation = "Please enter a valid Return location."
    }

    // Step 2: Mode and shipment type
    if (step === 2) {
      if (!mode) errors.mode = "Please select a mode of transport."

      if (mode && mode !== "air" && mode !== "ecommerce" && mode !== "combined" && !shipmentType) {
        errors.shipmentType = "Please select a shipment type."
      }

      // PLOR/PLOD are rendered under ModeSelector in this step in BookBookingForm,
      // so enforce their requirement here when checked.
      if (data.plorChecked && !data.plor) {
        errors.plor = `Please enter a valid ${mode ? `${locationLabels[mode] ? locationLabels[mode][0] : "POL"} — Place/Return of Loading (PLOR)` : "Place of Loading (PLOR)"}.`
      }
      if (data.plodChecked && !data.plod) {
        errors.plod = `Please enter a valid ${mode ? `${locationLabels[mode] ? locationLabels[mode][1] : "POD"} — Place/Return of Discharge (PLOD)` : "Place of Discharge (PLOD)"}.`
      }

      // Validate commodity and grossWeight since they are rendered in this step
      if (!cargoType) errors.cargoType = "Please select a cargo type."
      if (!data.commodity) errors.commodity = "Please select a commodity."
      if (!data.grossWeight) errors.grossWeight = "Please enter gross weight."
    }

    // Step 3: Additional cargo information
    if (step === 3) {
      if (!cargoType) errors.cargoType = "Please select a cargo type."
    }

    return errors
  }

  const validateForm = () => {
    const errors = {}

    if (!data.pol) errors.pol = `Please enter a valid ${locationLabels[mode] ? locationLabels[mode][0] : "POL"}.`
    if (!data.pod) errors.pod = `Please enter a valid ${locationLabels[mode] ? locationLabels[mode][1] : "POD"}.`

    if (data.plorChecked && !data.plor) errors.plor = `Please enter a valid ${mode ? `${locationLabels[mode] ? locationLabels[mode][0] : "POL"} — Place/Return of Loading (PLOR)` : "Place of Loading (PLOR)"}.`
    if (data.plodChecked && !data.plod) errors.plod = `Please enter a valid ${mode ? `${locationLabels[mode] ? locationLabels[mode][1] : "POD"} — Place/Return of Discharge (PLOD)` : "Place of Discharge (PLOD)"}.`
    if (data.pickupChecked && !data.pickupLocation) errors.pickupLocation = "Please enter a valid Pickup location."
    if (data.returnChecked && !data.returnLocation) errors.returnLocation = "Please enter a valid Return location."

    if (!mode) errors.mode = "Please select a mode of transport."

    if (mode && mode !== "air" && mode !== "ecommerce" && mode !== "combined" && !shipmentType) {
      errors.shipmentType = "Please select a shipment type."
    }

    if (!cargoType) errors.cargoType = "Please select a cargo type."
    if (!data.commodity) errors.commodity = "Please select a commodity."
    if (!data.grossWeight) errors.grossWeight = "Please enter gross weight."

    return errors
  }

  const completeSubmission = () => {
    if (onComplete) onComplete()
    console.log("Book page form submitted with data:", data)
  }

  const handleNext = () => {
    const stepErrors = validateStep(activeStep)
    
    if (Object.keys(stepErrors).length > 0) {
      setFieldErrors(stepErrors)
      setShowError(true)
      setError("Please fill in all required fields")
      setTimeout(() => setShowError(false), 3000)
      return
    }

    setFieldErrors({})
    setError("")
    setShowError(false)
    setDirection(1)
    setActiveStep(prev => Math.min(prev + 1, 4))
  }

  const handleBack = () => {
    setDirection(-1)
    setActiveStep(prev => Math.max(prev - 1, 1))
    setFieldErrors({})
    setError("")
    setShowError(false)
  }

  const handleSubmit = () => {
    const validationErrors = validateForm()
    
    if (validationErrors && Object.keys(validationErrors).length) {
      setFieldErrors(validationErrors)
      setShowError(true)
      setError("Please complete all previous steps")
      setTimeout(() => setShowError(false), 3000)
      return
    }

    setError("")
    setShowError(false)
    setFieldErrors({})

    const requiresPopup = enableServicePopup && ["air", "ecommerce"].includes(data.mode)

    if (requiresPopup) {
      setShowSuccessPopup(true)
      return
    }

    completeSubmission()
  }

  const steps = [
    { number: 1, title: "Route Details", icon: MapPin, subtitle: "Set pickup and delivery locations" },
    { number: 2, title: "Transport Mode", icon: Truck, subtitle: "Choose your shipping method" },
    { number: 3, title: "Cargo Information", icon: Package, subtitle: "Specify your cargo details" },
    { number: 4, title: "Services & Book", icon: Settings, subtitle: "Additional services and confirmation" },
  ]

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  return (
    <div className="w-full mx-auto">
      <div className="space-y-6">
        {/* Header with Progress */}
        <div className="rounded-2xl border bg-gradient-to-br from-card to-muted/20 p-6 shadow-lg">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Book a shipment</h2>
            <p className="text-sm text-muted-foreground">Complete your booking in 4 easy steps</p>
          </div>

          {/* Horizontal Step Indicator */}
          <div className="relative flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = activeStep >= step.number
              const isCurrent = activeStep === step.number
              
              return (
                <div key={step.number} className="relative flex flex-1 items-center">
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <motion.div
                      initial={false}
                      animate={{
                        scale: isCurrent ? 1.15 : 1,
                        backgroundColor: isActive ? "hsl(var(--primary))" : "hsl(var(--muted))",
                      }}
                      transition={{ duration: 0.3 }}
                      className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full shadow-md"
                    >
                      {isActive && !isCurrent ? (
                        <CheckCircle className="h-6 w-6 " />
                      ) : isActive ? (
                        <Icon className="h-5 w-5 " />
                      ) : (
                        <span className="text-sm font-semibold text-muted-foreground">
                          {step.number}
                        </span>
                      )}
                    </motion.div>
                    <div className="text-center hidden sm:block">
                      <p className={`text-xs font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className="relative mx-2 h-0.5 flex-1 bg-muted">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: isActive ? "100%" : "0%" }}
                        transition={{ duration: 0.5 }}
                        className="absolute h-full bg-primary"
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="relative min-h-[500px] grid gap-6 lg:grid-cols-[3fr_1fr]">
          <div>
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={activeStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="rounded-xl border bg-card p-8 shadow-lg"
              >
                {/* Step Header */}
                <div className="mb-6 pb-4 border-b">
                  <div className="flex items-center gap-3 mb-2">
                    {(() => {
                      const Icon = steps[activeStep - 1].icon
                      return <Icon className="h-6 w-6" />
                    })()}
                    <h3 className="text-xl font-semibold">{steps[activeStep - 1].title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground ml-9">{steps[activeStep - 1].subtitle}</p>
                </div>

                {/* Step Content */}
                <div className="space-y-6">
                  {/* Step 1: Route Details */}
                  {activeStep === 1 && (
                    <div className="space-y-4">
                      <LocationSection
                        data={data}
                        setField={setField}
                        labels={[locationLabels[mode] ? locationLabels[mode][0] : "POL", locationLabels[mode] ? locationLabels[mode][1] : "POD"]}
                        plorPlodLabels={[mode ? `${locationLabels[mode] ? locationLabels[mode][0] : "POL"} — Place/Return of Loading (PLOR)` : "Place of Loading (PLOR)", mode ? `${locationLabels[mode] ? locationLabels[mode][1] : "POD"} — Place/Return of Discharge (PLOD)` : "Place of Discharge (PLOD)"]}
                        errors={fieldErrors}
                        forwardedRef={locationsRef}
                        showPlorPlod={false}
                      />
                    </div>
                  )}

                  {/* Step 2: Transport Mode */}
                  {activeStep === 2 && (
                    <div className="space-y-4">
                      {/* <ModeSelector
                        mode={mode}
                        setField={setField}
                        error={fieldErrors.mode}
                        forwardedRef={modeRef}
                        showPlorPlod
                        data={data}
                        errors={fieldErrors}
                      /> */}
                      <BookModeCargoShipmentForm  
                            data={data}
                            setField={setField}
                            errors={fieldErrors}
                            forwardedRef={shipmentTypeRef}/>

                      {/* {mode && mode !== "air" && mode !== "ecommerce" && mode !== "combined" && (
                        <div className="pt-4">
                          <ShipmentTypeSection
                            mode={mode}
                            shipmentType={shipmentType}
                            setField={setField}
                            error={fieldErrors.shipmentType}
                            forwardedRef={shipmentTypeRef}
                          />
                        </div>
                      )} */}
                    </div>
                  )}

                  {/* Step 3: Cargo Information */}
                  {activeStep === 3 && (
                    <div className="space-y-4">
                        <BookQuotationDetails />
                    </div>
                  )}

                  {/* Step 4: Services & Book */}
                  {activeStep === 4 && (
                    <div className="space-y-4">
                      {(data.cargoType && mode !== "combined") ? (
                        <ServiceAddonsSection data={data} setField={setField} errors={fieldErrors}/>
                      ) : (
                        <div className="flex h-32 items-center justify-center">
                          <p className="text-center text-sm text-muted-foreground">
                            No Addons avaible for this mode and this selected details , you can click book shipment below
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {showError && error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 overflow-hidden"
                    >
                      <div className="rounded-lg bg-destructive/10 p-3 text-center text-sm font-medium text-destructive">
                        {error}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="mt-8 flex items-center justify-between gap-4 pt-6 border-t">
                  <Button
                    onClick={activeStep === 1 ? onBack : handleBack}
                    variant="outline"
                    size="lg"
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>

                  <div className="text-xs text-muted-foreground">
                    Step {activeStep} of {steps.length}
                  </div>

                  {activeStep < 4 ? (
                    <Button
                      onClick={handleNext}
                      size="lg"
                      className="gap-2 min-w-[120px]"
                    >
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      size="lg"
                      className="gap-2 min-w-[180px] bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    >
                      Book shipment
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Quote helper card on the right */}
          <div className="hidden lg:block">
            <QuoteHelperCard onSelectQuote={handleUseQuote} user={user} />
          </div>
        </div>
      </div>

      {enableServicePopup && ["air", "ecommerce"].includes(data.mode) && (
        <PopUp
          showSuccessPopup={showSuccessPopup}
          setShowSuccessPopup={(val) => {
            setShowSuccessPopup(val)
            if (!val) {
              completeSubmission()
            }
          }}
        />
      )}
    </div>
  )
}