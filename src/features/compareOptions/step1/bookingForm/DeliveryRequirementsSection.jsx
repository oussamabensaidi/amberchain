import React, { memo } from "react";
import { Label } from "@/components/ui/label";
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

function DeliveryRequirementsSection({ data, setField }) {
  return (
    <Section title="Delivery Requirements">
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Liftgate Required">
          <RadioGroup
            value={data.liftgate.required ? "yes" : "no"}
            onValueChange={(val) => setField("liftgate", { ...data.liftgate, required: val == "yes" })}
            className="flex gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="yes" id="liftgate-yes" />
              <label htmlFor="liftgate-yes" className="text-sm">Yes</label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="no" id="liftgate-no" />
              <label htmlFor="liftgate-no" className="text-sm">No</label>
            </div>
          </RadioGroup>
        </FormField>

        <FormField label="Access Conditions" info>
          <Select
            value={data.accessConditions || ""}
            onValueChange={(val) => setField("accessConditions", val)}
          >
            <SelectTrigger className="h-9 rounded-lg">
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy access</SelectItem>
              <SelectItem value="limited">Limited access</SelectItem>
              <SelectItem value="difficult">Difficult access</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      </div>
    </Section>
  );
}

export default memo(DeliveryRequirementsSection);