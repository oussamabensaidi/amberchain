import React, { useState, useCallback, memo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Info, Plus, X } from "lucide-react";

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

function TemperatureControlSection({ data, setField }) {
  const [newBeforeETA, setNewBeforeETA] = useState({ day: "", temperature: "" });
  const [newAfterGateIn, setNewAfterGateIn] = useState({ day: "", temperature: "" });
  const [activeScheduleTab, setActiveScheduleTab] = useState("beforeEta");

  const addBeforeETA = useCallback(() => {
    if (!newBeforeETA.day || !newBeforeETA.temperature) return;
    setField("temperatureSchedule", {
      ...data.temperatureSchedule,
      daysBeforeETA: [...(data.temperatureSchedule?.daysBeforeETA || []), { ...newBeforeETA }],
    });
    setNewBeforeETA({ day: "", temperature: "" });
  }, [newBeforeETA, data.temperatureSchedule, setField]);

  const addAfterGateIn = useCallback(() => {
    if (!newAfterGateIn.day || !newAfterGateIn.temperature) return;
    setField("temperatureSchedule", {
      ...data.temperatureSchedule,
      daysAfterGateIn: [...(data.temperatureSchedule?.daysAfterGateIn || []), { ...newAfterGateIn }],
    });
    setNewAfterGateIn({ day: "", temperature: "" });
  }, [newAfterGateIn, data.temperatureSchedule, setField]);

  const removeBeforeETA = useCallback((index) => {
    const updatedPoints = data.temperatureSchedule?.daysBeforeETA?.filter((_, i) => i !== index) || [];
    setField("temperatureSchedule", { ...data.temperatureSchedule, daysBeforeETA: updatedPoints });
  }, [data.temperatureSchedule, setField]);

  const removeAfterGateIn = useCallback((index) => {
    const updatedPoints = data.temperatureSchedule?.daysAfterGateIn?.filter((_, i) => i !== index) || [];
    setField("temperatureSchedule", { ...data.temperatureSchedule, daysAfterGateIn: updatedPoints });
  }, [data.temperatureSchedule, setField]);

  const handleScheduleTabChange = useCallback((val) => setActiveScheduleTab(val || "beforeEta"), []);

  const handleNewBeforeDayChange = useCallback((e) => {
    const v = e?.target ? e.target.value : e;
    setNewBeforeETA((prev) => ({ ...prev, day: v }));
  }, []);

  const handleNewBeforeTempChange = useCallback((e) => {
    const v = e?.target ? e.target.value : e;
    setNewBeforeETA((prev) => ({ ...prev, temperature: v }));
  }, []);

  const handleNewAfterDayChange = useCallback((e) => {
    const v = e?.target ? e.target.value : e;
    setNewAfterGateIn((prev) => ({ ...prev, day: v }));
  }, []);

  const handleNewAfterTempChange = useCallback((e) => {
    const v = e?.target ? e.target.value : e;
    setNewAfterGateIn((prev) => ({ ...prev, temperature: v }));
  }, []);

  return (
    <Section title="Temperature Control">
      {["sea", "rail", "road"].includes(data.mode) && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Cold Treatment Required" info>
              <RadioGroup
                value={data.coldTreatment.required ? "yes" : "no"}
                onValueChange={(val) =>
                  setField("coldTreatment", { ...data.coldTreatment, required: val == "yes" })
                }
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="yes" id="cold-yes" />
                  <label htmlFor="cold-yes" className="text-sm">Yes</label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="no" id="cold-no" />
                  <label htmlFor="cold-no" className="text-sm">No</label>
                </div>
              </RadioGroup>
            </FormField>

            <FormField label="Temperature (°C)" info>
              <Input
                value={data.coldTreatment.temperature || ""}
                onChange={(e) =>
                  setField("coldTreatment", { ...data.coldTreatment, temperature: e.target.value })
                }
                className="h-9 max-w-xs"
                placeholder="e.g. -18"
              />
            </FormField>
          </div>

          <FormField label="Temperature Set Points" info>
            <ToggleGroup
              type="single"
              value={data.temperatureSchedule?.enabled ? "yes" : "no"}
              onValueChange={(val) =>
                setField("temperatureSchedule", { ...data.temperatureSchedule, enabled: val == "yes" })
              }
              variant="outline"
              className="justify-start"
            >
              <ToggleGroupItem value="yes" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">Yes</ToggleGroupItem>
              <ToggleGroupItem value="no" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">No</ToggleGroupItem>
            </ToggleGroup>
          </FormField>

          {data.temperatureSchedule?.enabled && (
            <div className="border rounded-lg p-3 bg-muted/30 space-y-3">
              <ToggleGroup
                type="single"
                value={activeScheduleTab}
                onValueChange={handleScheduleTabChange}
                variant="outline"
                size="sm"
                className="justify-start"
              >
                <ToggleGroupItem value="beforeEta" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-xs">
                  Before ETA
                </ToggleGroupItem>
                <ToggleGroupItem value="afterGateIn" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground text-xs">
                  After Gate In
                </ToggleGroupItem>
              </ToggleGroup>

              {activeScheduleTab == "beforeEta" ? (
                <div className="space-y-2">
                  {(data.temperatureSchedule?.daysBeforeETA || []).map((d, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <Input value={d.day} readOnly className="w-20 h-8" />
                      <Input value={d.temperature} readOnly className="flex-1 h-8" />
                      <Button size="sm" variant="ghost" onClick={() => removeBeforeETA(idx)} className="h-8 w-8 p-0">
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2 items-center pt-2 border-t border-dashed">
                    <Input
                      value={newBeforeETA.day}
                      onChange={handleNewBeforeDayChange}
                      placeholder="Day"
                      className="w-20 h-8"
                    />
                    <Input
                      value={newBeforeETA.temperature}
                      onChange={handleNewBeforeTempChange}
                      placeholder="Temp"
                      className="flex-1 h-8"
                    />
                    <Button
                      size="sm"
                      onClick={addBeforeETA}
                      disabled={!newBeforeETA.day || !newBeforeETA.temperature}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {(data.temperatureSchedule?.daysAfterGateIn || []).map((d, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <Input value={d.day} readOnly className="w-20 h-8" />
                      <Input value={d.temperature} readOnly className="flex-1 h-8" />
                      <Button size="sm" variant="ghost" onClick={() => removeAfterGateIn(idx)} className="h-8 w-8 p-0">
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2 items-center pt-2 border-t border-dashed">
                    <Input
                      value={newAfterGateIn.day}
                      onChange={handleNewAfterDayChange}
                      placeholder="Day"
                      className="w-20 h-8"
                    />
                    <Input
                      value={newAfterGateIn.temperature}
                      onChange={handleNewAfterTempChange}
                      placeholder="Temp"
                      className="flex-1 h-8"
                    />
                    <Button
                      size="sm"
                      onClick={addAfterGateIn}
                      disabled={!newAfterGateIn.day || !newAfterGateIn.temperature}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="pt-3 border-t grid grid-cols-2 gap-4">
            <FormField label="Humidity Control" info>
              <ToggleGroup
                type="single"
                value={data.humidity.required ? "yes" : "no"}
                onValueChange={(val) =>
                  setField("humidity", { ...data.humidity, required: val == "yes" })
                }
                variant="outline"
                className="justify-start"
              >
                <ToggleGroupItem value="yes" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">Yes</ToggleGroupItem>
                <ToggleGroupItem value="no" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">No</ToggleGroupItem>
              </ToggleGroup>
            </FormField>

            <FormField label="Humidity (%)" info>
              <Input
                value={data.humidity.percentage}
                onChange={(e) =>
                  setField("humidity", { ...data.humidity, percentage: e.target.value })
                }
                className="h-9 max-w-xs"
                placeholder="e.g. 85"
              />
            </FormField>
          </div>

          <div className="pt-3 border-t grid grid-cols-2 gap-4">
            <FormField label="Number Of Cargo Probes" info>
              <Input
                type="number"
                value={data.probes.numberOfCargoProbes}
                onChange={(e) =>
                  setField("probes", { ...data.probes, numberOfCargoProbes: e.target.value })
                }
                className="h-9 max-w-xs"
                placeholder="Number"
              />
            </FormField>

            <FormField label="Drain Holes" info>
              <RadioGroup
                value={data.probes.drainHoles ? "open" : "closed"}
                onValueChange={(val) =>
                  setField("probes", { ...data.probes, drainHoles: val == "open" })
                }
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="open" id="drain-open" />
                  <label htmlFor="drain-open" className="text-sm">Open</label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="closed" id="drain-closed" />
                  <label htmlFor="drain-closed" className="text-sm">Closed</label>
                </div>
              </RadioGroup>
            </FormField>

            <FormField label="Fresh Air Exchange" info>
              <ToggleGroup
                type="single"
                value={data.probes.freshAirExchange}
                onValueChange={(val) => setField("probes", { ...data.probes, freshAirExchange: val })}
                variant="outline"
                className="justify-start"
              >
                <ToggleGroupItem value="open" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">Open</ToggleGroupItem>
                <ToggleGroupItem value="close" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">Close</ToggleGroupItem>
              </ToggleGroup>
            </FormField>

            <FormField label="Ventilation Volume" info>
              <Input
                value={data.probes.ventilationVolume}
                onChange={(e) =>
                  setField("probes", { ...data.probes, ventilationVolume: e.target.value })
                }
                className="h-9 max-w-xs"
                placeholder="Volume"
              />
            </FormField>
          </div>

          <div className="pt-3 border-t">
            <FormField label="Genset" info>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">During Export</Label>
                  <RadioGroup
                    value={data.genset.duringExport ? "yes" : "no"}
                    onValueChange={(val) =>
                      setField("genset", { ...data.genset, duringExport: val == "yes" })
                    }
                    className="flex gap-3"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="yes" id="export-yes" />
                      <label htmlFor="export-yes" className="text-sm">Yes</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="no" id="export-no" />
                      <label htmlFor="export-no" className="text-sm">No</label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">During Import</Label>
                  <RadioGroup
                    value={data.genset.duringImport ? "yes" : "no"}
                    onValueChange={(val) =>
                      setField("genset", { ...data.genset, duringImport: val == "yes" })
                    }
                    className="flex gap-3"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="yes" id="import-yes" />
                      <label htmlFor="import-yes" className="text-sm">Yes</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="no" id="import-no" />
                      <label htmlFor="import-no" className="text-sm">No</label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </FormField>
          </div>
        </>
      )}

      {data.mode == "air" && (
        <FormField label="Temperature (°C)" info>
          <Input
            value={data.coldTreatment.temperature || ""}
            onChange={(e) =>
              setField("coldTreatment", { ...data.coldTreatment, temperature: e.target.value })
            }
            className="h-9 max-w-xs"
            placeholder="e.g. -18"
          />
        </FormField>
      )}
    </Section>
  );
}

export default memo(TemperatureControlSection);