import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import DashNav from "@/components/dashboard/DashNav"
import ShipmentForm from "../compareOptions/step1/ShipmentForm"
import CompareResults from "../compareOptions/step2/CompareResults"

export default function CompareOptions() {
  const { t } = useTranslation()
  const [showResults, setShowResults] = useState(false)
  const dummyResults = [
    { id: "r1", price: "1,250", currency: "USD" },
    { id: "r2", price: null, currency: "USD" },
    { id: "r3", price: "980", currency: "USD" },
  ]

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
        <ShipmentForm onFormComplete={handleFormComplete} enableServicePopup={false} />
      ) : (
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
              toggle_button = {false}
            />
          ))}
        </div>
      )}
    </div>
  )
}
