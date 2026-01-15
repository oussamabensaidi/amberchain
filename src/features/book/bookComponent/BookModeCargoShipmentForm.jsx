import React, { useMemo, useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Ship, Train, Truck, Plane, ShoppingCart, ArrowRightLeft, Package, AlertTriangle, Snowflake, Maximize, Droplets, Container, Boxes } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import LocationInput from "./LocationInput"
import ContainerTypeSearchSelect from "@/features/compareOptions/step1/ContainerTypeSearchSelect"
import TruckTypeSearchSelect from "@/features/compareOptions/step1/TruckTypeSearchSelect"
import CommoditySearchSelect from "./CommoditySearchSelect"


// Combined component: Mode + ShipmentType + CargoType + dependent fields
// Props expected to match your existing pattern so we don't change logic:
// { data, setField, errors = {}, forwardedRef }

export default function BookModeCargoShipmentForm({ data = {}, setField, errors = {}, forwardedRef }) {
  // --- options definition ---
  const modes = [
    { key: "sea", label: "Sea", icon: Ship, hasShipmentTypes: true, subtypes: ["FCL", "LCL"] },
    { key: "rail", label: "Rail", icon: Train, hasShipmentTypes: true, subtypes: ["FCL", "LCL"] },
    { key: "road", label: "Road", icon: Truck, hasShipmentTypes: true, subtypes: ["FTL", "FCL", "LTL"] },
    { key: "air", label: "Air", icon: Plane, hasShipmentTypes: false, subtypes: [] },
    { key: "ecommerce", label: "Ecommerce", icon: ShoppingCart, hasShipmentTypes: false, subtypes: [] },
    { key: "combined", label: "Combined Transport", icon: ArrowRightLeft, hasShipmentTypes: false, subtypes: [] },
  ]

  const shipmentCompositeOptions = useMemo(() => {
    // Produce the flat list: "Sea — FCL" or single "Air"
    const list = []
    modes.forEach((m) => {
      if (m.hasShipmentTypes && m.subtypes.length) {
        m.subtypes.forEach((st) => list.push({ mode: m.key, shipmentType: st, label: `${m.label} — ${st}`, icon: m.icon }))
      } else {
        list.push({ mode: m.key, shipmentType: "", label: m.label, icon: m.icon })
      }
    })
    return list
  }, [])

  // Cargo types (single-select pills)
  const cargoTypes = [
    { value: "General", label: "General", icon: Package },
    { value: "Hazardous", label: "Hazardous", icon: AlertTriangle },
    { value: "Perishable", label: "Perishable", icon: Snowflake },
    { value: "Oversized", label: "Oversized", icon: Maximize },
    { value: "Liquid", label: "Liquid", icon: Droplets }
  ]

  // --- local UI state ---
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [filtered, setFiltered] = useState(shipmentCompositeOptions)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!query) return setFiltered(shipmentCompositeOptions)
    const q = query.trim().toLowerCase()
    setFiltered(shipmentCompositeOptions.filter(o => o.label.toLowerCase().includes(q)))
  }, [query])

  // Helper to select an option
  const selectComposite = (opt) => {
    if (!opt) return
    setField("mode", opt.mode)
    setField("shipmentType", opt.shipmentType || "")

    // Clear dependent values to mimic previous behavior
    setField("cargoType", "")
    setField("containerType", "")
    setField("cargo", { ...(data.cargo || {}), truckType: data?.cargo?.truckType || "" })

    setOpen(false)
    setQuery("")
  }

  // Keyboard helpers and click outside handler
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false)
    }
    const onClickOutside = (e) => {
      if (open && !e.target.closest('.mode-select-dropdown')) {
        setOpen(false)
      }
    }
    
    window.addEventListener("keydown", onKey)
    window.addEventListener("mousedown", onClickOutside)
    
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("mousedown", onClickOutside)
    }
  }, [open])

  // Render helpers for labels used in PLOR/PLOD
  const modeLabels = {
    sea: { plor: "Place of Loading (Origin)", plod: "Place of Discharge (Destination)" },
    air: { plor: "Place of receipt", plod: "Place Of Delivery" },
    road: { plor: "Pickup Location", plod: "Delivery Location" },
    rail: { plor: "Rail Terminal of Loading", plod: "Rail Terminal of Destination" },
    ecommerce: { plor: "Warehouse / Fulfillment Center", plod: "Customer Delivery Location" }
  }

  const currentLabels = (data && modeLabels[data.mode]) || { plor: "Place of receipt", plod: "Place of delivery" }

  // Utility to display currently selected composite label
  const selectedCompositeLabel = useMemo(() => {
    if (!data?.mode) return "Select mode & shipment type"
    const found = shipmentCompositeOptions.find(o => o.mode === data.mode && (o.shipmentType === (data.shipmentType || "")))
    return found ? found.label : "(selected)"
  }, [data?.mode, data?.shipmentType])

  // --- interaction for cargo pills ---
  const onCargoSelect = (val) => {
    if (data?.cargoType === val) {
      setField("cargoType", "")
    } else {
      setField("cargoType", val)
    }
  }

  const transition = { duration: 0.28, ease: "easeOut" }

  return (
    <section ref={forwardedRef} className="space-y-6">
      {/* --- Combined searchable select - Modern Design --- */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Select Transport Mode</h2>
          <p className="text-sm text-muted-foreground">Choose your shipping method and cargo type</p>
        </div>

        <div className="relative group mode-select-dropdown">
          <button
            type="button"
            aria-expanded={open}
            onClick={() => { setOpen(v => !v); setQuery(""); inputRef.current?.focus() }}
            className="w-full text-left bg-gradient-to-r from-card to-card/95 border-2 border-border hover:border-primary/50 rounded-xl p-4 flex items-center justify-between gap-4 transition-all duration-200 hover:shadow-lg group-hover:shadow-xl backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                {(() => {
                  if (!data?.mode) {
                    return <ArrowRightLeft className="w-5 h-5 text-muted-foreground" />
                  }
                  const modeData = modes.find(m => m.key === data.mode)
                  if (modeData && modeData.icon) {
                    const IconComponent = modeData.icon
                    return <IconComponent className="w-5 h-5 text-primary" />
                  }
                  return <Ship className="w-5 h-5 text-primary" />
                })()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-foreground truncate">
                  {selectedCompositeLabel}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {data?.mode ? "Click to change selection" : "Search and select from options below"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                {open ? "Close" : "Search"}
              </span>
              <motion.div
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-muted-foreground"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </div>
          </button>

          <div className={`absolute left-0 right-0 mt-3 z-50 ${open ? "block" : "hidden"}`}>
            <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={transition} className="bg-popover/95 backdrop-blur-lg border border-border/50 rounded-xl shadow-2xl overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-muted/30 to-muted/20 border-b border-border/30">
                <div className="relative">
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search mode or shipment type — e.g. sea fcl, road ftl"
                    className="w-full pl-10 pr-4 py-3 bg-background border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  />
                  <div className="absolute left-3 top-3.5 text-muted-foreground">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="max-h-64 overflow-auto">
                {filtered.length === 0 && (
                  <div className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">No matches found</div>
                    <div className="text-xs text-muted-foreground mt-1">Try different search terms</div>
                  </div>
                )}

                <div className="p-2">
                  {filtered.map((o) => {
                    const Icon = o.icon
                    const active = data?.mode === o.mode && (data?.shipmentType || "") === (o.shipmentType || "")
                    return (
                      <button
                        key={`${o.mode}-${o.shipmentType}`}
                        onClick={() => selectComposite(o)}
                        className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-all duration-200 ${active ? "bg-primary/10 border border-primary/30 shadow-md" : "hover:bg-accent/50 hover:shadow-sm"}`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${active ? "bg-primary/20" : "bg-muted/50"}`}>
                          <Icon className={`w-5 h-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium text-sm truncate ${active ? "text-primary" : "text-foreground"}`}>
                            {o.label}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {o.shipmentType ? `${o.shipmentType} — ${o.mode.toUpperCase()}` : `${o.mode.toUpperCase()}`}
                          </div>
                        </div>
                        {active && (
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* show error if present for mode/shipmentType */}
        {(errors.mode || errors.shipmentType) && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-center">
              <p className="text-destructive text-sm font-medium" role="alert">
                {errors.mode || errors.shipmentType}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* --- Cargo type pills (single-select) - Horizontal Layout --- */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={transition} className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex items-start sm:items-center gap-4 sm:gap-6">
          <h3 className="text-lg font-medium ">Cargo Type</h3>
          <div className="flex flex-wrap gap-2 flex-1">
            {cargoTypes.map((c) => {
              const Icon = c.icon
              const active = data?.cargoType === c.value
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => onCargoSelect(c.value)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-200 ${active ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105" : "bg-card hover:bg-accent/80 border-border hover:border-primary/50 hover:shadow-md"}`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-primary-foreground" : "text-muted-foreground"}`} />
                  <span className="text-sm font-medium">{c.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {errors.cargoType && (
          <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-sm mt-3 text-center" role="alert">
            {errors.cargoType}
          </motion.p>
        )}
      </motion.div>

      {/* --- PLOR & PLOD (hide for combined) --- */}
      {data && data.mode !== "combined" && (
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 mt-6">
          {["plor", "plod"].map((field) => {
            const checked = data[`${field}Checked`] || false
            const label = currentLabels[field]
            return (
              <div key={field} className="space-y-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={field}
                    checked={checked}
                    onCheckedChange={(val) => {
                      setField(`${field}Checked`, val)
                      if (!val) setField(field, "")
                    }}
                    className="w-5 h-5"
                  />
                  <Label htmlFor={field} className="font-medium text-sm">{label}</Label>
                </div>

                {checked && (
                  <LocationInput
                    id={field}
                    value={data[field] || ""}
                    onChange={(v) => {
                      if (v && typeof v === 'object') {
                        setField(field, v.display_name)
                        setField(`${field}City`, v.city)
                        setField(`${field}Country`, v.country)
                        setField(`${field}CountryCode`, v.countryCode)
                        setField(`${field}Lat`, v.lat)
                        setField(`${field}Lon`, v.lon)
                        setField(`${field}LocationId`, v.id)
                      } else {
                        setField(field, v)
                      }
                    }}
                    placeholder={`Enter ${label}`}
                    error={errors[field]}
                    mode={data.mode}
                  />
                )} 
              </div>
            )
          })}
        </div>
      )}

      {/* --- Shipment-specific settings (container / truck / pickup / return) --- */}
      {(data.mode === "sea" || data.mode === "rail" || data.mode === "road") && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={transition} className="max-w-4xl mx-auto mt-6 space-y-4">
          {/* container type shown when shipmentType === FCL */}
          {data.shipmentType === "FCL" && (
            <div>
              <ContainerTypeSearchSelect
                label="Container Type"
                value={data.containerType || ""}
                onChange={(v) => setField("containerType", v)}
                placeholder="Search container types"
              />
            </div>
          )}

          {/* truck type for road FTL/LTL */}
          {data.mode === "road" && (data.shipmentType === "FTL" || data.shipmentType === "LTL") && (
            <div>
              <TruckTypeSearchSelect
                label="Truck Type"
                value={data.cargo?.truckType || ""}
                onChange={(v) => setField("cargo", { ...data.cargo, truckType: v })}
                placeholder="Search truck types"
              />
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-accent/30 p-4 rounded-lg border">
              <div className="flex items-center gap-3 mb-3">
                <Checkbox
                  id="pickup-inline"
                  checked={!!data.pickupChecked || !!data.plorChecked}
                  onCheckedChange={(val) => setField("pickupChecked", val)}
                  disabled={!!data.plorChecked}
                  className="w-5 h-5"
                />
                <Label htmlFor="pickup-inline" className="font-medium">Add Pickup Location</Label>
              </div>
              {(data.pickupChecked || data.plorChecked) && (
                <LocationInput
                  id="pickupLocation-inline"
                  label="Pickup Location"
                  value={data.pickupLocation || ""}
                  onChange={(v) => {
                    if (v && typeof v === 'object') {
                      setField('pickupLocation', v.display_name)
                      setField('pickupCity', v.city)
                      setField('pickupCountry', v.country)
                      setField('pickupCountryCode', v.countryCode)
                      setField('pickupLat', v.lat)
                      setField('pickupLon', v.lon)
                      setField('pickupLocationId', v.id)
                    } else {
                      setField('pickupLocation', v)
                    }
                  }}
                  placeholder="Enter pickup location"
                />
              )} 
            </div>
            <div className="bg-accent/30 p-4 rounded-lg border">
              <div className="flex items-center gap-3 mb-3">
                <Checkbox
                  id="return-inline"
                  checked={!!data.returnChecked || !!data.plodChecked}
                  onCheckedChange={(val) => setField("returnChecked", val)}
                  disabled={!!data.plodChecked}
                  className="w-5 h-5"
                />
                <Label htmlFor="return-inline" className="font-medium">Add Return Location</Label>
              </div>
              {(data.returnChecked || data.plodChecked) && (
                <LocationInput
                  id="returnLocation-inline"
                  label="Return Location"
                  value={data.returnLocation || ""}
                  onChange={(v) => {
                    if (v && typeof v === 'object') {
                      setField('returnLocation', v.display_name)
                      setField('returnCity', v.city)
                      setField('returnCountry', v.country)
                      setField('returnCountryCode', v.countryCode)
                      setField('returnLat', v.lat)
                      setField('returnLon', v.lon)
                      setField('returnLocationId', v.id)
                    } else {
                      setField('returnLocation', v)
                    }
                  }}
                  placeholder="Enter return location"
                />
              )} 
            </div>
          </div>
        </motion.div>
      )}

      {/* --- Commodity & Weight (cargo details) --- */}
      {data.cargoType && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={transition} className="max-w-4xl mx-auto mt-6 border-t pt-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div id="commodity" className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Commodity</Label>
              <CommoditySearchSelect value={data.commodity || ""} onChange={v => setField("commodity", v)} placeholder="Search commodities" />
              {errors.commodity && <p className="text-destructive text-sm mt-1" role="alert">{errors.commodity}</p>}
            </div>
            <div id="grossWeight" className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Gross Weight (kg)</Label>
              <Input type="number" value={data.grossWeight || ""} onChange={e => setField("grossWeight", e.target.value)} placeholder="Enter weight" className="w-full h-11 border-2 focus:border-primary rounded-md" />
              {errors.grossWeight && <p className="text-destructive text-sm mt-1" role="alert">{errors.grossWeight}</p>}
            </div>
          </div>
        </motion.div>
      )}
    </section>
  )
}
