import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import DashNav from "@/components/dashboard/DashNav"
import ShipmentForm from "./step1/ShipmentForm"
import CompareResults from "./step2/CompareResults"
import { useShipmentStore } from "@/store/shipmentStore"
import { DUMMY_SHIPMENT } from "@/constants/dummyShipment"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function CompareOptions({
  enableServicePopup = true,
  resultsCtaLabel = "Book now",
  enableBookingPopup = true,
  onResultsCtaClick,
  prefillDummy = false,
} = {}) {
  const { t } = useTranslation()

  const {
    data,
    setField,
    setWizardSelection,
    reset, // 👈 REQUIRED
  } = useShipmentStore()

  const comparisonResults = data.comparisonResults || []

  // 👇 Show results if they already exist
  const [showResults, setShowResults] = useState(
    comparisonResults.length > 0
  )

  /**
   * Keep UI in sync if results appear later (API response, etc.)
   */
  useEffect(() => {
    if (comparisonResults.length > 0) {
      setShowResults(true)
    }
  }, [comparisonResults.length])

  /**
   * Prefill dummy data (dev mode)
   */
  useEffect(() => {
    if (!prefillDummy) return

    Object.entries(DUMMY_SHIPMENT).forEach(([key, value]) => {
      if (key === "wizardSelection") return
      setField(key, value)
    })

    if (DUMMY_SHIPMENT.wizardSelection) {
      setWizardSelection(DUMMY_SHIPMENT.wizardSelection)
    }

    setShowResults(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillDummy])

  const handleFormComplete = () => {
    setShowResults(true)
  }

  const handleBack = () => {
    reset()               // 👈 clear store
    setShowResults(false) // 👈 return to form
  }

  return (
    <div className="gap-4 flex flex-col">
      <DashNav DashTitle={t("pageTitles.compare-options")} />

      <h2 className="text-base font-semibold">
        {t("compareOptions.pageTitle")}
      </h2>

      {!showResults ? (
        <ShipmentForm
          onFormComplete={handleFormComplete}
          enableServicePopup={enableServicePopup}
        />
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between bg-muted/20 border rounded-md px-3 py-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <div className="text-sm text-muted-foreground">
              {comparisonResults.length > 0
                ? `${comparisonResults.length} options found`
                : "No results available"}
            </div>
          </div>

          {comparisonResults.length > 0 ? (
            comparisonResults.map((opt, index) => (
              <CompareResults
                key={opt.routingReference ?? index}
                resultMeta={opt}
              />
            ))
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No comparison results available. Please submit a new quote.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
