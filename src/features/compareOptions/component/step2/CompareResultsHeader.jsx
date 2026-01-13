import React, { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Weight,
  Plane,
  Truck,
  Ship,
  Package,
  CalendarClock,
  AlertCircle,
  Clock,
  Package2,
  Container,
  Building2,
  Timer,
  ShoppingCart,
  ChevronDown,
  Train,
  AlertTriangle,
  Snowflake,
  Maximize,
  Droplets,
  Calendar,
  ArrowRight
} from "lucide-react"
import { useShipmentStore } from "@/store/shipmentStore"
import { BookingConfirmationPopup } from "@/components/ui/booking-confirmation-popup"
import TransportationIcon from "@/components/icons/TransportationIcon"

export default function CompareResultsHeader({ 
  data = {}, 
  expanded = false,
  setExpanded = () => {},
  price, 
  ctaLabel = "Book Now", 
  enableBookingPopup = true, 
  onCtaClick, 
  toggle_button = true, 
  popupVariant = "booking",
  scheduleData = {}, // NEW PROP
  resultMeta = {} // NEW PROP - contains per-result data
}) {
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false)
  const shipmentData = useShipmentStore((s) => s.data)
  const setField = useShipmentStore((s) => s.setField)

  const handleBookNow = useCallback(
    (e) => {
      e.stopPropagation()
      console.log("Booking data:", shipmentData)
      if (onCtaClick) {
        onCtaClick()
        return
      }
      if (enableBookingPopup) {
        setShowConfirmationPopup(true)
      }
    },
    [shipmentData, onCtaClick, enableBookingPopup]
  )

  // Helper functions for schedule data
  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const formatTransitTime = (hours) => {
    if (!hours) return null
    const days = Math.ceil(hours / 24)
    return `${days} ${days === 1 ? 'day' : 'days'}`
  }

  const calculateDaysUntilDeparture = (departureDate) => {
    if (!departureDate) return null
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const departure = new Date(departureDate)
    departure.setHours(0, 0, 0, 0)
    const diffTime = departure - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays < 0) return `Departed`
    if (diffDays === 0) return `Today`
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'}`
  }

  const mode = (data?.mode || "").toLowerCase()
  const shipmentType = (data?.shipmentType || "").toUpperCase()
  const modeIconColor = "text-muted-foreground"

  let modeIcon
  if (mode === 'air') {
    modeIcon = <Plane className={`w-5 h-5 ${modeIconColor}`} />
  } else if (mode === 'rail') {
    modeIcon = <Train className={`w-5 h-5 ${modeIconColor}`} />
  } else if (mode === 'ecommerce') {
    modeIcon = <ShoppingCart className={`w-5 h-5 ${modeIconColor}`} />
  } else if (mode === 'road') {
    modeIcon = shipmentType === 'FTL'
      ? <Truck className={`w-5 h-5 ${modeIconColor}`} />
      : <Package2 className={`w-5 h-5 ${modeIconColor}`} />
  } else if (mode === 'sea') {
    modeIcon = shipmentType === 'FCL'
      ? <Ship className={`w-5 h-5 ${modeIconColor}`} />
      : <Container className={`w-5 h-5 ${modeIconColor}`} />
  } else {
    modeIcon = <Package className={`w-5 h-5 ${modeIconColor}`} />
  }

  const cargoIcon = {
    "General": <Package className="w-5 h-5 text-secondary" />,
    "Hazardous": <AlertTriangle className="w-5 h-5 text-secondary" />,
    "Perishable": <Snowflake className="w-5 h-5 text-secondary" />,
    "Oversized": <Maximize className="w-5 h-5 text-secondary" />,
    "Liquid": <Droplets className="w-5 h-5 text-secondary" />,
  }

  const cargoType = data?.cargoType || data?.commodity || "General Cargo"
  const selectedCargoIcon = cargoIcon[cargoType] || <Package className="w-5 h-5 text-secondary" />

  return (
    <>
      <div className="w-full flex flex-wrap items-center gap-4 md:gap-6">
        {/* Left section: summary info */}
        <div className="flex-1 min-w-0 flex flex-wrap items-center gap-4 md:gap-6">
          {/* Company Info - Replace with schedule carrier if available */}
          <div className="flex items-center gap-3 shrink md:shrink-0">
            <div className="rounded-lg bg-primary/10 p-2 ring-1 ring-primary/20">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div className="flex flex-col gap-0.2">
              <span className="font-bold text-lg leading-tight whitespace-nowrap capitalize">
                {resultMeta?.company || scheduleData?.company || "Amber Chains Logistics"}
              </span>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {resultMeta?.solutionNumber ? `Solution #${resultMeta.solutionNumber}` : "ID: F122228"}
              </span>
            </div>
          </div>

          {/* Mode & Shipment Type */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-muted border border-border/50 shrink md:shrink-0">
            {modeIcon}
            <span className="text-sm font-medium whitespace-nowrap">
              {data?.mode ? data.mode.charAt(0).toUpperCase() + data.mode.slice(1) : "—"}
              {data?.shipmentType && mode !== 'combined' && (
                <span className="ml-1 text-muted-foreground"> / {data.shipmentType}</span>
              )}
            </span>
          </div>

          {/* Cargo Type */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-muted border border-border/50 shrink md:shrink-0">
            {selectedCargoIcon}
            <span className="text-sm font-medium whitespace-nowrap">{cargoType}</span>
          </div>

          {/* Weight & Transit/Departure Info */}
          <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-muted border border-border/50 shrink md:shrink-0">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <Weight className={`w-4 h-4 ${modeIconColor}`} />
              <span className="text-sm font-medium">
                {data?.grossWeight ? `${data.grossWeight} kg` : "—"}
              </span>
            </div>
            <div className="w-px h-4 bg-border" />
            {scheduleData?.transitTime ? (
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <Clock className={`w-4 h-4 ${modeIconColor}`} />
                <span className="text-sm font-medium">{formatTransitTime(scheduleData.transitTime)}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <Timer className={`w-4 h-4 ${modeIconColor}`} />
                <span className="text-sm font-medium">
                  {calculateDaysUntilDeparture(scheduleData?.departureDate) || "—"}
                </span>
              </div>
            )}
          </div>

          {/* Departure & Arrival Dates - Replace Route if schedule data exists */}
          {scheduleData?.departureDate && scheduleData?.arrivalDate ? (
            <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-muted border border-border/50 shrink md:shrink-0">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <Calendar className={`w-4 h-4 ${modeIconColor}`} />
                <span className="text-sm font-medium">{formatDate(scheduleData.departureDate)}</span>
              </div>
              <ArrowRight className="w-3 h-3 text-muted-foreground" />
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <Calendar className={`w-4 h-4 ${modeIconColor}`} />
                <span className="text-sm font-medium">{formatDate(scheduleData.arrivalDate)}</span>
              </div>
            </div>
          ) : (
            /* Route - Original */
            <div className="flex items-center gap-2.5 min-w-0 shrink md:shrink-0">
              <div className="rounded-md bg-muted p-1.5">
                <MapPin className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="font-semibold text-base whitespace-nowrap max-w-[160px] truncate">
                {data?.pol ? data.pol.split(',')[0].trim() : "—"}
              </span>
              <div className="flex items-center gap-1 flex-shrink-0">
                <div className="h-px w-6 bg-border" />
                <div className="w-2 h-2 rotate-45 border-r-2 border-t-2 border-muted-foreground" />
              </div>
              <span className="font-semibold text-base whitespace-nowrap max-w-[160px] truncate">
                {data?.pod ? data.pod.split(',')[0].trim() : "—"}
              </span>
            </div>
          )}

          <div className="hidden md:block flex-grow" />
        </div>

        {/* Right section: price & actions */}
        <div className="w-full md:w-auto ml-0 md:ml-auto flex items-center gap-3 md:gap-4 justify-between md:justify-end">
          {/* Price */}
          <div className="px-4 py-2 rounded-lg bg-muted/50 dark:bg-muted/30 border">
            <div className="text-3xl font-bold text-foreground leading-none whitespace-nowrap">
              {price ? `$${price}` : '—'}
            </div>
          </div>

          {/* CTA */}
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 h-12 text-base whitespace-nowrap shadow-sm"
            onClick={handleBookNow}
          >
            {ctaLabel}
          </Button>

          {/* Toggle Button */}
          {toggle_button && (
            <Button
              variant="outline"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                setExpanded(!expanded)
              }}
              className="h-12 w-12"
              aria-label={expanded ? "Hide details" : "Show details"}
            >
              <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${expanded ? "rotate-180" : "rotate-0"}`} />
            </Button>
          )}
        </div>
      </div>

      {/* Booking Confirmation Popup */}
      {enableBookingPopup && (
        <BookingConfirmationPopup
          isOpen={showConfirmationPopup}
          onClose={() => setShowConfirmationPopup(false)}
          bookingData={shipmentData}
          popupVariant={popupVariant}
        />
      )}
    </>
  )
}