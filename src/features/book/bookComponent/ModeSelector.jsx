import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Ship, Train, Truck, Plane, ShoppingCart, ArrowRightLeft } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import LocationInput from "./LocationInput"

export default function ModeSelector({ mode, setField, error, forwardedRef, showPlorPlod = false, data, errors = {} }) {

  const modes = ["sea", "rail", "road", "air", "ecommerce", "combined"]
  const modeIcons = { 
    sea: Ship, 
    rail: Train, 
    road: Truck, 
    air: Plane, 
    ecommerce: ShoppingCart,
    combined: ArrowRightLeft
  }

  // Define full labels for PLOR & PLOD based on mode (same as LocationSection)
  const modeLabels = {
    sea: { plor: "Place of Loading (Origin)", plod: "Place of Discharge (Destination)" },
    air: { plor: "Place of receipt", plod: "Place Of Delivery" },
    road: { plor: "Pickup Location", plod: "Delivery Location" },
    rail: { plor: "Rail Terminal of Loading", plod: "Rail Terminal of Destination" },
    ecommerce: { plor: "Warehouse / Fulfillment Center", plod: "Customer Delivery Location" },
  }

  const currentLabels = (data && modeLabels[data.mode]) || {
    plor: "Place of receipt",
    plod: "Place of delivery",
  }

  const disabledModes = []

  return (
    <section ref={forwardedRef} className="space-y-8">
      <h2 className="text-2xl font-semibold text-center pt-8 ">Mode of Transport</h2>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-destructive text-sm text-center"
          role="alert"
        >
          {error}
        </motion.p>
      )}
      <div className="flex overflow-x-auto gap-4 pb-2 -mx-2 px-2 pt-4">
        {modes.map(m => {
          const Icon = modeIcons[m]
          const active = mode === m

          return (
            <motion.div key={m} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}
              className="flex-1 min-w-[140px] md:min-w-[160px]">
              <Card 
                className={`transition-all duration-300 border-2 ${
                  disabledModes.includes(m) 
                    ? "opacity-50 cursor-not-allowed" 
                    : "cursor-pointer " + (active 
                      ? "border-primary bg-primary text-primary-foreground shadow-md" 
                      : "hover:border-primary hover:bg-accent hover:text-accent-foreground")
                }`}
                onClick={() => {
                  if (disabledModes.includes(m)) return;
                  if (active) {
                    setField("mode", "")
                    setField("shipmentType", "")
                    setField("cargoType", "")
                  } else {
                    setField("mode", m)
                    setField("shipmentType", "")
                    setField("cargoType", "")
                  }
                }}
              >
                <CardContent className="flex flex-col items-center justify-center py-6 gap-2">
                  <Icon className="w-10 h-10" />
                  <span className="capitalize font-medium">{m}</span>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* PLOR & PLOD (hidden for combined mode) */}
      {showPlorPlod && data && data.mode !== "combined" && (
        <div className="grid md:grid-cols-2 gap-6 mt-6">
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
                  <Label htmlFor={field} className="font-medium text-sm">
                    {label}
                  </Label>
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
    </section>
  )
}