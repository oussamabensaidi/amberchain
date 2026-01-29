import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Boxes, Container, Truck, Package } from "lucide-react"
import ContainerTypeSearchSelect from "./ContainerTypeSearchSelect"
import TruckTypeSearchSelect from "./TruckTypeSearchSelect"
import { useShipmentStore } from "@/store/shipmentStore"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import LocationInput from "./LocationInput"
export default function ShipmentTypeSection({ mode, shipmentType, setField, error, forwardedRef }) {
  const shipmentOptions = mode === "sea" || mode === "rail" ? ["FCL", "LCL"] : mode === "road" ? ["FCL", "FTL", "LTL"] : []
  const transition = { duration: 0.35, ease: "easeOut" }
  const { data } = useShipmentStore()
  return (
    <motion.section ref={forwardedRef} className="shipment-type-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={transition}>
      <h2 className="text-2xl font-semibold text-center mb-3">Shipment Type</h2>
      {/**
       * Responsive layout:
       * - If there are exactly 2 options, render as a centered horizontal row for better balance.
       * - Otherwise use a responsive grid (1/2/3 cols) which keeps cards evenly sized.
       */}
      {(() => {
        const isTwo = shipmentOptions.length === 2
        return (
          <div className={`max-w-2xl mx-auto ${isTwo ? 'flex justify-center gap-6' : 'grid sm:grid-cols-2 lg:grid-cols-3 gap-4'}`}>
            {shipmentOptions.map(type => {
              const descriptions = {
                FCL: "Full Container Load",
                LCL: "Less than Container Load",
                FTL: "Full Truck Load",
                LTL: "Less than Truck Load"
              };
              const Icon = type === 'FCL' ? Container : type === 'LCL' ? Package : type === 'FTL' ? Truck : Package;
              return (
                <Button
                  key={type}
                  type="button"
                  aria-pressed={shipmentType === type}
                  variant={shipmentType === type ? "default" : "outline"}
                  className={`relative flex flex-col items-center text-center h-full gap-3 p-4 rounded-xl transition-all min-w-[160px] ${
                    shipmentType === type
                      ? "bg-primary text-primary-foreground shadow-lg ring-2 ring-primary ring-offset-2"
                      : "bg-card hover:bg-accent hover:text-accent-foreground"
                  }`}
                  onClick={() => {
                    if (shipmentType === type) {
                      setField("shipmentType", "")
                      setField("cargoType", "")
                    } else {
                      setField("shipmentType", type)
                      setField("cargoType", "")
                    }
                  }}
                >
                  <Icon className="size-12 w-12 h-12 mb-1 flex-shrink-0" />
                  <div className="font-medium text-base">{type}</div>
                  <div className="text-sm opacity-90 max-w-[220px]">{descriptions[type]}</div>
                </Button>
              )
            })}
          </div>
        )
      })()}
      

      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-destructive text-sm text-center mt-2" 
          role="alert"
        >
          {error}
        </motion.p>
      )}

      {(mode === "sea" || mode === "rail" || mode === "road") && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={transition} className="mt-4 space-y-3">
          {(() => {
            const isFCL = shipmentType === "FCL"
            return (
              <>
                {isFCL && (
                  <div>
                    <ContainerTypeSearchSelect
                      label="Container Type"
                      value={data.containerType || ""}
                      onChange={(v) => setField("containerType", v)}
                      placeholder="Search container types"
                    />
                  </div>
                )}
                {mode === "road" && (shipmentType === "FTL" || shipmentType === "LTL") && (
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
                            setField('pickupCity', v.cityName || v.city)
                            setField('pickupCountry', v.countryName || v.country)
                            setField('pickupCountryCode', v.countryCode)
                            setField('pickupLat', v.lat)
                            setField('pickupLon', v.lon)
                            setField('pickupLocationId', v.id)
                            setField('pickupUnicode', v.unicode)
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
                            setField('returnCity', v.cityName || v.city)
                            setField('returnCountry', v.countryName || v.country)
                            setField('returnCountryCode', v.countryCode)
                            setField('returnLat', v.lat)
                            setField('returnLon', v.lon)
                            setField('returnLocationId', v.id)
                            setField('returnUnicode', v.unicode)
                          } else {
                            setField('returnLocation', v)
                          }
                        }}
                        placeholder="Enter return location"
                      />
                    )}
                  </div>
                </div>
              </>
            )
          })()}
        </motion.div>
      )}
    </motion.section>
  )
}
