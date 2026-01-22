import React, { useState, useRef } from "react"
import { useTranslation } from "react-i18next"
import DashNav from "@/components/dashboard/DashNav"
import ShipmentForm from "../compareOptions/step1/ShipmentForm"
import CompareResults from "../compareOptions/step2/CompareResults"
import ShipmentSummaryCard from "@/components/ShipmentSummaryCard"
import { useShipmentStore } from "@/store/shipmentStore"

export default function CompareOptions() {
  const { t } = useTranslation()
  const { data } = useShipmentStore() // Access global data for the card
  const [showResults, setShowResults] = useState(false)
  const formRef = useRef(null) // Create the ref for remote submission

  const dummyResults = data.comparisonResults || []

  // Remote trigger function
  const handleTriggerSubmit = () => {
    if (formRef.current) {
      formRef.current.requestSubmit()
    }
  }

  const handleFormComplete = () => {
    setShowResults(true)
  }

  return (
    <div className="gap-4 flex flex-col">
      <DashNav DashTitle={t("pageTitles.quote")} />
      
      <h2 className="text-base font-semibold">
        {t("quote.pageTitle")}
      </h2>

      {!showResults ? (
        /* TWO-COLUMN LAYOUT */
        <div className="flex gap-6">
          {/* Main Form Area */}
          <div className="flex-1">
            <ShipmentForm 
              ref={formRef} // Attach the ref here
              onFormComplete={handleFormComplete} 
              enableServicePopup={false} 
            />
          </div>

          {/* Sticky Summary Card */}
          <div className="w-80 sticky top-4 h-fit">
            <ShipmentSummaryCard 
              data={data} 
              onAction={handleTriggerSubmit} 
            />
          </div>
        </div>
      ) : (
        /* RESULTS VIEW */
        <div className="flex flex-col gap-3">
          {dummyResults.map((res) => (
            <CompareResults
              key={res.id}
              ctaLabel="Request a Quote"
              enableBookingPopup={true}
              popupVariant="quote"
              priceOverride={res.price ?? undefined}
              resultMeta={res}
              headerOnly={true}
              toggle_button={false}
              
            />
          ))}
        </div>
      )}
    </div>
  )
}