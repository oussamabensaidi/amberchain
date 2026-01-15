import React, { memo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Info,
  ShieldCheck,
  PackagePlus,
  PackageMinus,
  Search,
  Building2,
  RefreshCcw,
  Radio,
  Users,
  MapPin,
  Clock,
  Leaf,
  CheckCircle2,
  Activity,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";

const Section = memo(({ title, children, className = "" }) => (
  <Card className={`bg-card/50 border-border/50 shadow-sm ${className}`}>
    <CardHeader className="pb-2">
      {title && (
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
          {title}
        </CardTitle>
      )}
    </CardHeader>
    <CardContent className="space-y-4">{children}</CardContent>
  </Card>
));

function ServiceAddonsSection({ data, setField }) {
  return (
    <TooltipProvider>
      <Section title="Service Add-Ons">
        <div className="grid grid-cols-1 gap-6">
          {/* Complex Add-Ons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           

           
            {/* Stuffing */}
            {["sea", "rail", "road", "air", "combined"].includes(data.mode) && (
              <div className="flex flex-col gap-2 rounded-xl border border-border/40 bg-background/60 p-3 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PackagePlus className="h-4 w-4 text-primary" />
                    <label className="text-sm font-medium">Stuffing</label>
                  </div>
                  <Checkbox
                    checked={data.addons?.stuffing?.enabled || false}
                    onCheckedChange={(checked) =>
                      setField("addons", {
                        ...data.addons,
                        stuffing: {
                          ...data.addons?.stuffing,
                          enabled: checked,
                        },
                      })
                    }
                  />
                </div>
                <AnimatePresence initial={false}>
                  {data.addons?.stuffing?.enabled && (
                    <motion.div
                      className="flex items-center gap-2"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                    >
                      <Select
                        value={data.addons?.stuffing?.equipment || ""}
                        onValueChange={(val) => {
                          const isManual = val === "manually";
                          setField("addons", {
                            ...data.addons,
                            stuffing: {
                              ...data.addons?.stuffing,
                              equipment: val,
                              resources: isManual ? data.addons?.stuffing?.resources || "" : "",
                            },
                          });
                        }}
                      >
                        <SelectTrigger className="h-8 w-32 text-xs">
                          <SelectValue placeholder="Equipment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="forklift">Forklift</SelectItem>
                          <SelectItem value="manually">Manually</SelectItem>
                        </SelectContent>
                      </Select>
                      {data.addons?.stuffing?.equipment === "manually" && (
                        <Select
                          value={data.addons?.stuffing?.resources || ""}
                          onValueChange={(val) =>
                            setField("addons", {
                              ...data.addons,
                              stuffing: {
                                ...data.addons?.stuffing,
                                resources: val,
                              },
                            })
                          }
                        >
                          <SelectTrigger className="h-8 w-28 text-xs">
                            <SelectValue placeholder="Workers" />
                          </SelectTrigger>
                          <SelectContent>
                            {[2, 3, 4, 5].map((n) => (
                              <SelectItem key={n} value={n.toString()}>
                                {n}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Unstuffing */}
            {["sea", "rail", "road", "air", "combined"].includes(data.mode) && (
              <div className="flex flex-col gap-2 rounded-xl border border-border/40 bg-background/60 p-3 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PackageMinus className="h-4 w-4 text-primary" />
                    <label className="text-sm font-medium">Unstuffing</label>
                  </div>
                  <Checkbox
                    checked={data.addons?.unstuffing?.enabled || false}
                    onCheckedChange={(checked) =>
                      setField("addons", {
                        ...data.addons,
                        unstuffing: {
                          ...data.addons?.unstuffing,
                          enabled: checked,
                        },
                      })
                    }
                  />
                </div>
                <AnimatePresence initial={false}>
                  {data.addons?.unstuffing?.enabled && (
                    <motion.div
                      className="flex items-center gap-2"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                    >
                      <Select
                        value={data.addons?.unstuffing?.equipment || ""}
                        onValueChange={(val) => {
                          const isManual = val === "manually";
                          setField("addons", {
                            ...data.addons,
                            unstuffing: {
                              ...data.addons?.unstuffing,
                              equipment: val,
                              resources: isManual ? data.addons?.unstuffing?.resources || "" : "",
                            },
                          });
                        }}
                      >
                        <SelectTrigger className="h-8 w-32 text-xs">
                          <SelectValue placeholder="Equipment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="forklift">Forklift</SelectItem>
                          <SelectItem value="manually">Manually</SelectItem>
                        </SelectContent>
                      </Select>
                      {data.addons?.unstuffing?.equipment === "manually" && (
                        <Select
                          value={data.addons?.unstuffing?.resources || ""}
                          onValueChange={(val) =>
                            setField("addons", {
                              ...data.addons,
                              unstuffing: {
                                ...data.addons?.unstuffing,
                                resources: val,
                              },
                            })
                          }
                        >
                          <SelectTrigger className="h-8 w-28 text-xs">
                            <SelectValue placeholder="Workers" />
                          </SelectTrigger>
                          <SelectContent>
                            {[2, 3, 4, 5].map((n) => (
                              <SelectItem key={n} value={n.toString()}>
                                {n}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}



 {/* Customs Brokerage */}
            {["sea", "rail", "road", "air", "ecommerce", "combined"].includes(data.mode) && (
              <div className="flex flex-col gap-2 rounded-xl border border-border/40 bg-background/60 p-3 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <label className="text-sm font-medium">Customs Brokerage</label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3.5 h-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="text-xs">Assist with customs clearance at origin or destination.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Checkbox
                    checked={data.addons?.customsBrokerage?.enabled || false}
                    onCheckedChange={(checked) => {
                      const current = data.addons?.customsBrokerage || {};
                      if (checked) {
                        const origin = current.origin || current.location === "origin" || current.location === "both" || true;
                        const destination = current.destination || current.location === "destination" || current.location === "both" || false;
                        const location = origin && destination ? "both" : origin ? "origin" : destination ? "destination" : "origin";
                        setField("addons", {
                          ...data.addons,
                          customsBrokerage: {
                            ...current,
                            enabled: true,
                            origin: location === "origin" || location === "both",
                            destination: location === "destination" || location === "both",
                            location,
                          },
                        });
                      } else {
                        setField("addons", {
                          ...data.addons,
                          customsBrokerage: {
                            ...current,
                            enabled: false,
                            origin: false,
                            destination: false,
                            location: undefined,
                          },
                        });
                      }
                    }}
                  />
                </div>
                <AnimatePresence initial={false}>
                  {data.addons?.customsBrokerage?.enabled && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            className="h-4 w-4"
                            checked={Boolean(data.addons?.customsBrokerage?.origin)}
                            onCheckedChange={(checked) => {
                              const origin = Boolean(checked);
                              const destination = Boolean(data.addons?.customsBrokerage?.destination);
                              const enabled = origin || destination;
                              const location = origin && destination ? "both" : origin ? "origin" : destination ? "destination" : undefined;
                              setField("addons", {
                                ...data.addons,
                                customsBrokerage: {
                                  ...data.addons?.customsBrokerage,
                                  origin,
                                  destination,
                                  enabled,
                                  location,
                                },
                              });
                            }}
                          />
                          <span className="text-xs">Origin</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            className="h-4 w-4"
                            checked={Boolean(data.addons?.customsBrokerage?.destination)}
                            onCheckedChange={(checked) => {
                              const destination = Boolean(checked);
                              const origin = Boolean(data.addons?.customsBrokerage?.origin);
                              const enabled = origin || destination;
                              const location = origin && destination ? "both" : origin ? "origin" : destination ? "destination" : undefined;
                              setField("addons", {
                                ...data.addons,
                                customsBrokerage: {
                                  ...data.addons?.customsBrokerage,
                                  origin,
                                  destination,
                                  enabled,
                                  location,
                                },
                              });
                            }}
                          />
                          <span className="text-xs">Destination</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            {/* Inspection */}
            {["sea", "rail", "road", "air", "ecommerce", "combined"].includes(data.mode) && (
              <div className="flex flex-col gap-2 rounded-xl border border-border/40 bg-background/60 p-3 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-primary" />
                    <label className="text-sm font-medium">Inspection</label>
                  </div>
                  <Checkbox
                    checked={data.addons?.inspection?.enabled || false}
                    onCheckedChange={(checked) =>
                      setField("addons", {
                        ...data.addons,
                        inspection: {
                          ...data.addons?.inspection,
                          enabled: checked,
                        },
                      })
                    }
                  />
                </div>
                <AnimatePresence initial={false}>
                  {data.addons?.inspection?.enabled && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                    >
                      <Select
                        value={data.addons?.inspection?.type || ""}
                        onValueChange={(val) =>
                          setField("addons", {
                            ...data.addons,
                            inspection: {
                              ...data.addons?.inspection,
                              type: val,
                            },
                          })
                        }
                      >
                        <SelectTrigger className="h-8 w-full text-xs">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="quality">Quality</SelectItem>
                          <SelectItem value="quantity">Quantity</SelectItem>
                          <SelectItem value="customs">Customs</SelectItem>
                          <SelectItem value="phytosanitary">Phytosanitary</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
 {/* Insurance */}
            {["sea", "rail", "road", "air", "combined"].includes(data.mode) && (
              <div className="flex flex-col gap-2 rounded-xl border border-border/40 bg-background/60 p-3 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <label className="text-sm font-medium">Insurance</label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3.5 h-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="text-xs">Optional cargo insurance for your shipment.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Checkbox
                    checked={data.addons?.insurance?.enabled || false}
                    onCheckedChange={(checked) =>
                      setField("addons", {
                        ...data.addons,
                        insurance: {
                          ...data.addons?.insurance,
                          enabled: checked,
                        },
                      })
                    }
                  />
                </div>
                <AnimatePresence initial={false}>
                  {data.addons?.insurance?.enabled && (
                    <motion.div
                      className="flex items-center gap-2"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                    >
                      <span className="text-xs text-muted-foreground">Cargo Value :</span>
                      <Input
                        type="number"
                        value={data.addons?.insurance?.cargoValue || ""}
                        onChange={(e) =>
                          setField("addons", {
                            ...data.addons,
                            insurance: {
                              ...data.addons?.insurance,
                              cargoValue: e.target.value,
                            },
                          })
                        }
                        className="h-8 w-28 text-xs"
                        placeholder="Value"
                      />
                      <Select
                        value={data.addons?.insurance?.currency || "USD"}
                        className=""
                        onValueChange={(val) =>
                          setField("addons", {
                            ...data.addons,
                            insurance: {
                              ...data.addons?.insurance,
                              currency: val,
                            },
                          })
                        }
                      >
                        <SelectTrigger className="h-8 w-24 text-xs rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="MAD">MAD</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

          {/* Simple Add-Ons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-4">
            {[
              { key: "portAgent", label: "Port Agent", modes: ["sea", "combined"] },
              { key: "reposition", label: "Repositioning", modes: ["sea", "rail", "combined"] },
              { key: "trackLive", label: "Live Tracking", modes: ["sea", "rail", "road", "air", "ecommerce", "combined"] },
              { key: "trokeTrace", label: "Troke Trace", modes: ["sea", "rail", "road", "air", "ecommerce", "combined"] },
              { key: "socForAll", label: "SOC for All", modes: ["sea", "rail", "combined"] },
              { key: "readyToLoad", label: "Ready To Load", modes: ["sea", "rail", "road", "combined"] },
              { key: "changeDestination", label: "Change Destination", modes: ["sea", "rail", "road", "air", "ecommerce", "combined"] },
              { key: "extraFreeTime", label: "Extra Free Time", modes: ["sea", "rail", "road", "air", "ecommerce", "combined"] },
              { key: "reduceEmission", label: "Reduce Emission", modes: ["sea", "rail", "road", "air", "ecommerce", "combined"] },
            ]
              .filter((item) => item.modes.includes(data.mode))
              .map((item) => (
                <div
                  key={item.key}
                  className="group flex items-center justify-between px-3 py-2 rounded-md border border-border/30 bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer hover:shadow-sm hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-2">
                    {item.key === "portAgent" && <Building2 className="h-3.5 w-3.5 text-muted-foreground" />}
                    {item.key === "reposition" && <RefreshCcw className="h-3.5 w-3.5 text-muted-foreground" />}
                    {item.key === "trackLive" && <Radio className="h-3.5 w-3.5 text-muted-foreground" />}
                    {item.key === "trokeTrace" && <Activity className="h-3.5 w-3.5 text-muted-foreground" />}
                    {item.key === "socForAll" && <Users className="h-3.5 w-3.5 text-muted-foreground" />}
                    {item.key === "readyToLoad" && <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />}
                    {item.key === "changeDestination" && <MapPin className="h-3.5 w-3.5 text-muted-foreground" />}
                    {item.key === "extraFreeTime" && <Clock className="h-3.5 w-3.5 text-muted-foreground" />}
                    {item.key === "reduceEmission" && <Leaf className="h-3.5 w-3.5 text-muted-foreground" />}
                    <label className="text-xs font-medium cursor-pointer">{item.label}</label>
                  </div>
                  <Checkbox
                    checked={data.addons?.[item.key] || false}
                    onCheckedChange={(checked) =>
                      setField("addons", { ...data.addons, [item.key]: checked })
                    }
                  />
                </div>
              ))}
          </div>
        </div>
      </Section>
    </TooltipProvider>
  );
}

export default memo(ServiceAddonsSection);
