import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import LocationInput from "./LocationInput";

export default function LocationSection({ data, setField, labels, errors = {}, forwardedRef, showPlorPlod = true }) {
  const [polLabel, podLabel] = labels;

  // Define full labels for PLOR & PLOD based on mode
  const modeLabels = {
    sea: { plor: "Place of Loading (Origin)", plod: "Place of Discharge (Destination)" },
    air: { plor: "Place of receipt", plod: "Place Of Delivery" },
    road: { plor: "Pickup Location", plod: "Delivery Location" },
    rail: { plor: "Rail Terminal of Loading", plod: "Rail Terminal of Destination" },
    ecommerce: { plor: "Warehouse / Fulfillment Center", plod: "Customer Delivery Location" },
    // sea: { plor: "Place Of Receipt", plod: "Place Of Delivery" },
    // air: { plor: "Place Of Receipt", plod: "Place Of Delivery" },
    // road: { plor: "Place Of Receipt", plod: "Place Of Delivery" },
    // rail: { plor: "Place Of Receipt", plod: "Place Of Delivery" },
    // ecommerce: { plor: "Warehouse / Fulfillment Center", plod: "Customer Delivery Location" },
  };

  const currentLabels = modeLabels[data.mode] || {
    plor: "Place of receipt",
    plod: "Place of delivery",
  };

  return (
    <motion.section
      ref={forwardedRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-semibold text-center"></h2>

      {/* POL & POD */}
      <div className="grid md:grid-cols-2 gap-4">
        <LocationInput
          id="pol"
          label={polLabel}
          value={data.pol || ""}
onChange={(v) => {
  if (v && typeof v === 'object') {
    setField('pol', v.display_name)
    setField('polCity', v.cityName)        // ← Changed from v.city
    setField('polCountry', v.countryName)  // ← Changed from v.country
    setField('polCountryCode', v.countryCode)
    setField('polLat', v.lat)
    setField('polLon', v.lon)
    setField('polLocationId', v.id)
    setField('polUnicode', v.unicode)      // ← ADD THIS (critical for API)
  } else {
    setField('pol', v)
  }
}}
          placeholder={`Enter ${polLabel}`}
          error={errors.pol}
          mode={data.mode}
        />
        <LocationInput
          id="pod"
          label={podLabel}
          value={data.pod || ""}
         onChange={(v) => {
  if (v && typeof v === 'object') {
    setField('pod', v.display_name)
    setField('podCity', v.cityName)        // ← Changed
    setField('podCountry', v.countryName)  // ← Changed
    setField('podCountryCode', v.countryCode)
    setField('podLat', v.lat)
    setField('podLon', v.lon)
    setField('podLocationId', v.id)
    setField('podUnicode', v.unicode)      // ← ADD THIS
  } else {
    setField('pod', v)
  }
}}
          placeholder={`Enter ${podLabel}`}
          error={errors.pod}
          mode={data.mode}

        />
      </div>

      {/* PLOR & PLOD (hidden for combined mode) */}
      {(data.mode !== "combined" && showPlorPlod) && (
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {["plor", "plod"].map((field) => {
            const checked = data[`${field}Checked`] || false;
            const label = currentLabels[field];

            return (
              <div key={field} className="space-y-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={field}
                    checked={checked}
                    onCheckedChange={(val) => {
                      setField(`${field}Checked`, val);
                      if (!val) setField(field, "");
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
    setField(`${field}City`, v.cityName)        // ← Changed
    setField(`${field}Country`, v.countryName)  // ← Changed
    setField(`${field}CountryCode`, v.countryCode)
    setField(`${field}Lat`, v.lat)
    setField(`${field}Lon`, v.lon)
    setField(`${field}LocationId`, v.id)
    setField(`${field}Unicode`, v.unicode)      // ← ADD THIS
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
            );
          })}
        </div>
      )}
    </motion.section>
  );
}
