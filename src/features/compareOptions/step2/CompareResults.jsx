// Updated CompareResults.jsx
import {useState, useEffect} from "react"
import { Button } from "@/components/ui/button"
import { useShipmentStore } from "@/store/shipmentStore"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { AlertCircle, Clock, MapPin } from "lucide-react"
import CompareResultTimeline from "@/components/CompareResultTimeline"
import ShipmentMap from "@/components/map/ShipmentMap"
import { useGeocoding } from "@/hooks/useGeocoding"
import CompareResultsHeader from "./CompareResultsHeader"
import TransportationIcon from "@/components/icons/TransportationIcon"
import CompareCostBreakdown from "./CompareCostBreakdown"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { BookingConfirmationPopup } from "@/components/ui/booking-confirmation-popup"
import CompareConditions from "./CompareConditions"
import BookingRoute from "@/features/bookings/components/BookingRoute"
import { normalizeScheduleData } from "../utils/scheduleUtils"
import "@/App.css"
import { Ship, ArrowRight } from "lucide-react"
export default function CompareResults({ 
  onBack, 
  ctaLabel = "Book now", 
  enableBookingPopup = true, 
  onCtaClick, 
  priceOverride, 
  resultMeta,
  headerOnly = false, 
  toggle_button = true, 
  popupVariant = "booking" 
}) {
  const { data } = useShipmentStore()
  const [expanded, setExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState("cost")
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false)
  

  // Get the raw schedule data (it's already in the format we need)
  const rawScheduleData = resultMeta?.schedule || resultMeta?._raw || resultMeta;
  
  // Normalize schedule data using util
  const normalizedSchedule = normalizeScheduleData(rawScheduleData);
  
  const price = resultMeta?.price ?? priceOverride ?? "-"
  
  // Determine button label based on price
  // Determine button label based on price (unless headerOnly, then use the provided ctaLabel)
  const finalCtaLabel = headerOnly ? ctaLabel : (price === null || price === "-") ? "Pre Book" : ctaLabel
  
  // Get shipment query context from store
  const shipmentContext = data.shipmentQueryContext || {}
// Inside CompareResults.jsx
// Use resultMeta as primary source, fallback to store if needed
const shipmentData = {
  mode: resultMeta?.mode || data.mode || "",
  shipmentType: resultMeta?.shipmentType || data.shipmentType || "",
  pol: resultMeta?.pol || data.pol || "",
  pod: resultMeta?.pod || data.pod || "",
  plor: resultMeta?.plor || data.plor || "",
  plod: resultMeta?.plod || data.plod || "",
  cargoType: resultMeta?.cargoType || data.cargoType || "",
  commodity: resultMeta?.commodity || data.commodity || "",
  grossWeight: resultMeta?.grossWeight || data.grossWeight || "",
  pickupLocation: resultMeta?.pickupLocation || data.pickupLocation || "",
  returnLocation: resultMeta?.returnLocation || data.returnLocation || "",
  polCity: resultMeta?.polCity || data.polCity || "",
  polCountry: resultMeta?.polCountry || data.polCountry || "",
  podCity: resultMeta?.podCity || data.podCity || "",
  podCountry: resultMeta?.podCountry || data.podCountry || "",
};
  const { coordinates: originCoords, isLoading: originLoading, error: originError } = useGeocoding(shipmentData.pol)
  const { coordinates: destinationCoords, isLoading: destLoading, error: destError } = useGeocoding(shipmentData.pod)

  const mode = (shipmentData.mode || '').toLowerCase()
  const shipmentType = (shipmentData.shipmentType || '').toUpperCase()
  const modeIconColor = "text-muted-foreground"
  const cargoType = shipmentData.cargoType || shipmentData.commodity || "General Cargo"
  const timelineItems = []

  const modeLabels = {
    sea: { pol: "Port of Loading (POL)", pod: "Port of Discharge (POD)" },
    rail: { pol: "Rail Ramp origin", pod: "Rail Ramp Destination" },
    road: { pol: "Place Of Pick Up ", pod: "Place of Delivery" },
    air: { pol: "Airport of Departure", pod: "Airport of Arrival" },
    ecommerce: { pol: "Pickup Adress", pod: "Delivery Adress " },
  }

  const labels = modeLabels[mode] || modeLabels.road

  const handleBookNow = (e) => {
    e.stopPropagation()
    if (onCtaClick) {
      onCtaClick()
      return
    }
    if (enableBookingPopup) {
      setShowConfirmationPopup(true)
    }
  }

  timelineItems.push({
    label: labels.pol,
    title: shipmentData.pol || "—",
    icon: <TransportationIcon className="w-5 h-5" />,
    content: null,
  })

  if (shipmentData.plor) {
    timelineItems.push({
      label: "",
      title: shipmentData.plor,
      icon: null,
      content: (
        <span className="text-xs text-muted-foreground italic ml-6 block">
          {shipmentData.plor}
        </span>
      ),
      optional: true,
    })
  }

  if (shipmentData.plod) {
    timelineItems.push({
      label: "",
      title: shipmentData.plod,
      icon: null,
      content: (
        <span className="text-xs text-muted-foreground italic ml-6 block">
          {shipmentData.plod}
        </span>
      ),
      optional: true,
    })
  }

  timelineItems.push({
    label: labels.pod,
    title: shipmentData.pod || "—",
    icon: <TransportationIcon className="w-5 h-5" />,
    content: null,
  })

  return (
    <Card
      className="mx-auto my-2 border shadow-sm transition-all duration-300 bg-card text-card-foreground w-full max-w-[95vw] 2xl:max-w-[1600px] cursor-pointer hover:shadow-md"
      onClick={() => !headerOnly && setExpanded(!expanded)}
    >
      {onBack && (
        <div className="px-8 pt-4 flex justify-start">
          <Button variant="outline" size="sm" onClick={e => { e.stopPropagation(); onBack(); }}>
            ← Back
          </Button>
        </div>
      )}
      <CardHeader className="border-none px-8 gap-0">
        <CompareResultsHeader
          data={shipmentData}
          expanded={expanded}
          setExpanded={setExpanded}
          scheduleData={normalizedSchedule}
          price={price}
          resultMeta={resultMeta}
          ctaLabel={finalCtaLabel}
          enableBookingPopup={enableBookingPopup}
          onCtaClick={onCtaClick}
          toggle_button={toggle_button}
          popupVariant={popupVariant}
          headerOnly={headerOnly}
        />
      </CardHeader>

      {!headerOnly && (
        <CardContent className="p-0 w-full">
          {expanded && (
          <div className="p-6 space-y-6 w-full" onClick={(e) => e.stopPropagation()}>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[420px] w-full">
              <div className="lg:col-span-5 flex flex-col h-full min-w-0">
                <div className="bg-card rounded-xl border p-6 shadow-sm flex-1 flex flex-col min-h-[400px] w-full">
                  <h3 className="text-lg font-bold mb-4 text-foreground flex items-center gap-2">
                    <Clock className={`w-6 h-6 ${modeIconColor}`} />
                    Route Timeline
                  </h3>
                  <CompareResultTimeline items={timelineItems} />
                </div>
              </div>
              <div className="lg:col-span-7 flex flex-col h-full min-w-0">
                <div className="bg-card rounded-xl border shadow-sm overflow-hidden h-[400px] w-full flex-1">
                  {originLoading || destLoading ? (
                    <div className="flex items-center justify-center h-full bg-muted/50">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        Loading map coordinates...
                      </div>
                    </div>
                  ) : originError || destError ? (
                    <div className="flex items-center justify-center h-full bg-muted/50">
                      <div className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        Unable to load map coordinates
                      </div>
                    </div>
                  ) : originCoords && destinationCoords ? (
                    <ShipmentMap
                      origin={originCoords}
                      destination={destinationCoords}
                      mapHeight="400px"
                      mode={data.mode}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-muted/50">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        Enter valid locations to view map
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
{/* Add this inside the {expanded && (...)} block in CompareResults.jsx */}
<div className="bg-muted/30 rounded-xl border p-6 shadow-sm">
  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
    <Ship className="w-6 h-6 text-primary" />
    Vessel & Voyage Details
  </h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {normalizedSchedule?.legs?.map((leg, idx) => (
      <div key={idx} className="bg-background p-4 rounded-lg border border-border">
        <div className="text-xs font-bold text-primary uppercase mb-2">
          Leg {leg.sequenceNumber}: {leg.transport?.modeOfTransport}
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Vessel:</span>
            <span className="text-sm font-semibold">{leg.transport?.vessel?.name || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Voyage:</span>
            <span className="text-sm font-semibold">{leg.transport?.servicePartners?.[0]?.carrierExportVoyageNumber || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Service:</span>
            <span className="text-sm font-semibold">{leg.transport?.servicePartners?.[0]?.carrierServiceName || "N/A"}</span>
          </div>
          <div className="mt-2 pt-2 border-t flex justify-between text-xs">
 <span>
    {leg.departure?.dateTime
      ? new Date(leg.departure.dateTime).toLocaleDateString()
      : "—"}
  </span>

  <ArrowRight className="w-3 h-3" />

  <span>
    {leg.arrival?.dateTime
      ? new Date(leg.arrival.dateTime).toLocaleDateString()
      : "—"}
  </span>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
            <div className="group w-full bg-card hover:bg-accent border rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between gap-3">
                <ToggleGroup
                  type="single"
                  variant="outline"
                  value={activeTab}
                  onValueChange={(v) => v && setActiveTab(v)}
                >
                  <ToggleGroupItem value="cost" className={'bg-background '}>
                    Cost Breakdown
                  </ToggleGroupItem>
                  <ToggleGroupItem value="conditions" className={'bg-background'}>
                    Conditions
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              <div className="mt-4">
                {activeTab === 'cost' ? (
                  <CompareCostBreakdown
                    price={price}
                    currency={resultMeta?.currency}
                    costBreakdown={resultMeta?.costBreakdown}
                  />
                ) : (
                  <CompareConditions
                    conditions={resultMeta?.conditions}
                    fallbackTransitDays={normalizedSchedule?.transitTimeDays || resultMeta?.transitDays}
                    scheduleData={normalizedSchedule}
                  />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 mt-4">
              {(() => {
                const origin = shipmentData.pol ? shipmentData.pol.split(',')[0].trim() : null
                const viaPlor = shipmentData.plor || null
                const viaPlod = shipmentData.plod || null
                const destination = shipmentData.pod ? shipmentData.pod.split(',')[0].trim() : null
                const route = [origin, viaPlor, viaPlod, destination].filter(Boolean)
                return route.length > 0 ? (
                  <BookingRoute route={route} />
                ) : <div />
              })()}
              <Button onClick={handleBookNow}>{finalCtaLabel}</Button>
            </div>

            {enableBookingPopup && (
              <BookingConfirmationPopup
                isOpen={showConfirmationPopup}
                onClose={() => setShowConfirmationPopup(false)}
                bookingData={data}
                popupVariant={popupVariant}
              />
            )}
          </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}