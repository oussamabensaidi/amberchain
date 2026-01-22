import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Package, MapPin, Ship, Train, Truck, Plane, ShoppingCart, ArrowRightLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
export default function ShipmentSummaryCard({ data = {}, onAction }) {
  const [isMinimized, setIsMinimized] = useState(false);

  // Format addon display label
  const formatAddonLabel = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  // Get enabled addons with details
  const getEnabledAddons = () => {
    const addons = data.addons || {};
    const enabled = [];
    
    // Check complex addons with their details
    if (addons.stuffing?.enabled) {
      enabled.push({
        name: 'Stuffing',
        details: addons.stuffing.equipment ? `Equipment: ${addons.stuffing.equipment}` : null
      });
    }
    if (addons.unstuffing?.enabled) {
      enabled.push({
        name: 'Unstuffing',
        details: addons.unstuffing.equipment ? `Equipment: ${addons.unstuffing.equipment}` : null
      });
    }
    if (addons.customsBrokerage?.enabled) {
      const locations = [];
      if (addons.customsBrokerage.origin) locations.push('Origin');
      if (addons.customsBrokerage.destination) locations.push('Destination');
      enabled.push({
        name: 'Customs Brokerage',
        details: locations.length > 0 ? `${locations.join(' & ')}` : null
      });
    }
    if (addons.inspection?.enabled) {
      enabled.push({
        name: 'Inspection',
        details: addons.inspection.type ? `Type: ${addons.inspection.type}` : null
      });
    }
    if (addons.insurance?.enabled) {
      enabled.push({
        name: 'Insurance',
        details: addons.insurance.cargoValue ? `Value: ${addons.insurance.cargoValue} ${addons.insurance.currency}` : null
      });
    }
    
    // Check boolean addons
    const booleanAddons = [
      'portAgent', 'reposition', 'trackLive', 'trokeTrace', 
      'socForAll', 'readyToLoad', 'changeDestination', 
      'extraFreeTime', 'reduceEmission'
    ];
    
    booleanAddons.forEach(addon => {
      if (addons[addon]) {
        enabled.push({
          name: formatAddonLabel(addon),
          details: null
        });
      }
    });
    
    return enabled;
  };

  // Placeholder commercial addons
  const placeholderAddons = [
    { name: 'Port Agent', details: null },
    { name: 'Track Live', details: null },
    { name: 'Customs Brokerage', details: null },
    { name: 'Insurance', details: null },
  ];

  const modeIcons = {
    sea: <Ship className="w-5 h-5 text-blue-500" />,
    road: <Truck className="w-5 h-5 text-amber-500" />,
    air: <Plane className="w-5 h-5 text-sky-500" />,
    rail: <Train className="w-5 h-5 text-purple-500" />,
    combined: <ArrowRightLeft className="w-5 h-5 text-green-500" />,
    ecommerce: <ShoppingCart className="w-5 h-5 text-green-500" />,
  };

  const modeLabels = {
    sea: "Sea Freight",
    road: "Road Transport",
    air: "Air Freight",
    rail: "Rail Transport",
    combined: "Combined Method",
    ecommerce: "E-Commerce Shipment",
  };

  // Shipment type only shown for sea, rail, road modes
  const shouldShowShipmentType = ["sea", "rail", "road"].includes(data.mode);

  // Build shipment details dynamically based on mode
  const baseDetails = [
    { label: "Mode", value: modeLabels[data.mode] || data.mode || "Not Selected" },
    { label: "Origin", value: data.pol || "—", icon: <MapPin className="w-4 h-4" /> },
    { label: "Destination", value: data.pod || "—", icon: <MapPin className="w-4 h-4" /> },
  ];

  // Conditionally add shipment type
  const shipmentDetails = [
    ...baseDetails,
    ...(shouldShowShipmentType ? [{ label: "Shipment Type", value: data.shipmentType || "—" }] : []),
    { label: "Cargo Type", value: data.cargoType || "—" },
    { label: "Commodity", value: data.commodity || "—" },
    { label: "Gross Weight", value: data.grossWeight ? `${data.grossWeight} kg` : "—" },
  ];

  const filledFields = shipmentDetails.filter(
    (detail) => detail.value && detail.value !== "—" && detail.value !== "Not Selected"
  ).length;

  const completionPercentage = Math.round((filledFields / shipmentDetails.length) * 100);

  return (
    <div className="space-y-3">
      <Card className="h-fit border shadow-md bg-gradient-to-br from-card via-card to-muted/10">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2.5 bg-primary/10 rounded-lg">
                {modeIcons[data.mode] || <Package className="w-5 h-5 text-primary" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base text-foreground line-clamp-1">
                  {modeLabels[data.mode] || "Shipment Summary"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {completionPercentage}% Complete
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {isMinimized ? "+" : "−"}
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-3 w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary via-primary to-primary/80 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="space-y-3">
            {shipmentDetails.map((detail, idx) => (
              <div key={idx} className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0">
                <div className="flex items-center gap-2">
                  {detail.icon && <span className="text-muted-foreground">{detail.icon}</span>}
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {detail.label}
                  </span>
                </div>
                <span
                  className={`text-sm font-semibold line-clamp-2 text-right ${
                    detail.value === "—" ? "text-muted-foreground" : "text-foreground"
                  }`}
                >
                  {detail.value}
                </span>
              </div>
            ))}

            {/* Additional info section */}
            {/* <div className="mt-4 pt-3 border-t border-border/40"> */}
              <div className="text-xs text-muted-foreground space-y-1">
                {data.plorChecked && data.plor && (
                  <div className="flex justify-between">
                    <span>PLOR:</span>
                    <span className="text-foreground font-medium">{data.plor}</span>
                  </div>
                )}
                {data.plodChecked && data.plod && (
                  <div className="flex justify-between">
                    <span>PLOD:</span>
                    <span className="text-foreground font-medium">{data.plod}</span>
                  </div>
                )}
                {data.pickupChecked && data.pickupLocation && (
                  <div className="flex justify-between">
                    <span>Pickup:</span>
                    <span className="text-foreground font-medium line-clamp-1">{data.pickupLocation}</span>
                  </div>
                )}
                {data.returnChecked && data.returnLocation && (
                  <div className="flex justify-between">
                    <span>Return:</span>
                    <span className="text-foreground font-medium line-clamp-1">{data.returnLocation}</span>
                  </div>
                )}
              </div>
            {/* </div> */}

            {/* Service Addons Section */}
            {getEnabledAddons().length > 0 ? (
              <div className="mt-4 pt-3 border-t border-border/40">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Service Addons
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {getEnabledAddons().map((addon, idx) => (
                    <div key={idx} className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></span>
                        <span className="text-foreground font-medium">{addon.name}</span>
                      </div>
                      {addon.details && (
                        <span className="text-muted-foreground text-xs ml-4">{addon.details}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-4 pt-3 border-t border-border/40">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Suggested Add-ons
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {placeholderAddons.map((addon, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full flex-shrink-0"></span>
                      <span className="text-muted-foreground">{addon.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          <div className="mt-4 pt-3 border-t border-border/40">
            <Button 
                onClick={onAction}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                size="lg"
              >
                Compare Options
              </Button>
          </div>

          </CardContent>
        )}
      </Card>
    </div>
  );
}
