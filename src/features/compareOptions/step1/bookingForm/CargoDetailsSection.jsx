import React, { memo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info } from "lucide-react";

const FormField = memo(({ label, children, info = false, className = "" }) => (
  <div className={`space-y-1.5 ${className}`}>
    <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
      {label}
      {info && <Info className="h-3 w-3" />}
    </Label>
    {children}
  </div>
));

const Section = memo(({ title, children, className = "" }) => (
  <div className={`p-4 rounded-lg border border-border/50 bg-card/30 space-y-3 ${className}`}>
    {title && <h4 className="text-sm font-semibold text-foreground mb-3">{title}</h4>}
    {children}
  </div>
));

function CargoDetailsSection({ data, setField }) {
  return (
    <Section title="Cargo Details">
      <div className="grid grid-cols-2 gap-3">
        {(data.cargoType == "Hazardous" && ["sea", "rail", "road", "air"].includes(data.mode))  && (
          <>
            <FormField label="Class IMO">
              <Input
                value={data.cargo?.class || ""}
                onChange={(e) => setField("cargo", { ...data.cargo, class: e.target.value })}
                className="h-9"
              />
            </FormField>
            <FormField label="UN Number">
              <Input
                value={data.cargo?.unNumber || ""}
                onChange={(e) => setField("cargo", { ...data.cargo, unNumber: e.target.value })}
                className="h-9"
              />
            </FormField>
          </>
        )}

        {((data.cargoType == "Oversized" && ["sea", "rail", "road"].includes(data.mode)) ||
          (data.mode == "road" && data.shipmentType == "LTL") ||
          ["air", "ecommerce", "combined"].includes(data.mode) ) && (
          <>
            <FormField label="Width">
              <Input
                value={data.cargo?.width || ""}
                onChange={(e) => setField("cargo", { ...data.cargo, width: e.target.value })}
                className="h-9"
              />
            </FormField>
            <FormField label="Length">
              <Input
                value={data.cargo?.length || ""}
                onChange={(e) => setField("cargo", { ...data.cargo, length: e.target.value })}
                className="h-9"
              />
            </FormField>
            <FormField label="Height">
              <Input
                value={data.cargo?.height || ""}
                onChange={(e) => setField("cargo", { ...data.cargo, height: e.target.value })}
                className="h-9"
              />
            </FormField>
            <FormField label="Unit">
              <Select
                value={data.cargo?.lengthMetrics || ""}
                onValueChange={(val) => setField("cargo", { ...data.cargo, lengthMetrics: val })}
              >
                <SelectTrigger className="h-9 rounded-lg">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inch">Inch</SelectItem>
                  <SelectItem value="meter">Meter</SelectItem>
                  <SelectItem value="feet">Feet</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </>
        )}

        {((data.shipmentType == "LCL" && ["sea", "rail"].includes(data.mode)) ||
          (data.shipmentType == "LTL" && data.mode == "road") ||
          ["air", "ecommerce"].includes(data.mode) ) && (
          <>
            <FormField label="Package Type">
              <Input
                value={data.cargo?.packageType || ""}
                onChange={(e) => setField("cargo", { ...data.cargo, packageType: e.target.value })}
                className="h-9"
              />
            </FormField>
            <FormField label="Number of Packages">
              <Input
                type="number"
                value={data.cargo?.numberOfPackages || ""}
                onChange={(e) => setField("cargo", { ...data.cargo, numberOfPackages: e.target.value })}
                className="h-9"
              />
            </FormField>
            <FormField label="Volume" className="col-span-2">
              <Input
                value={data.cargo?.volume || ""}
                onChange={(e) => setField("cargo", { ...data.cargo, volume: e.target.value })}
                className="h-9"
              />
            </FormField>
          </>
        )}

        {data.mode == "road" && data.shipmentType == "FTL" && (
          <>
            <FormField label="Number of Pallets">
              <Input
                value={data.cargo?.numberOfPallet || ""}
                onChange={(e) => setField("cargo", { ...data.cargo, numberOfPallet: e.target.value })}
                className="h-9"
              />
            </FormField>
            <FormField label="Package Type">
              <Input
                value={data.cargo?.packageType || ""}
                onChange={(e) => setField("cargo", { ...data.cargo, packageType: e.target.value })}
                className="h-9"
              />
            </FormField>
          </>
        )}

        {data.mode == "air" && (
          <>
            <FormField label="Stackable Cargo" className="col-span-2">
              <RadioGroup
                value={data.cargo.stackableCargo ? "yes" : "no"}
                onValueChange={(val) => setField("cargo", { ...data.cargo, stackableCargo: val == "yes" })}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="yes" id="stackable-yes" />
                  <label htmlFor="stackable-yes" className="text-sm">Yes</label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="no" id="stackable-no" />
                  <label htmlFor="stackable-no" className="text-sm">No</label>
                </div>
              </RadioGroup>
            </FormField>
          </>
        )}
      </div>
    </Section>
  );
}

export default memo(CargoDetailsSection);