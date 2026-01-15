  import React, { useState, useMemo, useCallback, memo } from "react";
import { useShipmentStore } from "@/store/shipmentStore";
    import CargoDetailsSection from "@/features/compareOptions/step1/bookingForm/CargoDetailsSection";
    import TemperatureControlSection from "@/features/compareOptions/step1/bookingForm/TemperatureControlSection";
    import DeliveryRequirementsSection from "@/features/compareOptions/step1/bookingForm/DeliveryRequirementsSection";
    // import ServiceAddonsSection from "./ServiceAddonsSection";
    // import LeftColumnBanner from "./LeftColumnBanner";


export default function BookQuotationDetails() {
  const data = useShipmentStore((s) => s.data);
  const setField = useShipmentStore((s) => s.setField);

  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);

  const handleBookNow = useCallback(() => {
    console.log("Booking data:", data);
    setShowConfirmationPopup(true);
  }, [data]);

  const shouldShowCargoInfo = useMemo(() => {
    const isHazardous = data.cargoType == "Hazardous" && ["sea", "rail", "road", "air"].includes(data.mode);
    const isOversized = 
      (data.cargoType == "Oversized" && ["sea", "rail", "road"].includes(data.mode)) ||
      (data.mode == "road" && data.shipmentType == "LTL") ||
      ["air", "ecommerce"].includes(data.mode);
    const hasPackageInfo = 
      (data.shipmentType == "LCL" && ["sea", "rail"].includes(data.mode)) ||
      (data.shipmentType == "LTL" && data.mode == "road") ||
      ["air", "ecommerce"].includes(data.mode);
    const isRoadFTL = data.mode == "road" && data.shipmentType == "FTL";
    const isAirStackable = data.mode == "air";

    return isHazardous || isOversized || hasPackageInfo || isRoadFTL || isAirStackable || data.mode == "combined";
  }, [data.cargoType, data.mode, data.shipmentType]);
  const isAllEmpty = useMemo(() => {
  const showCargo = shouldShowCargoInfo;
  const showTemp = data.cargoType == "Perishable" && ["sea", "rail", "road", "air"].includes(data.mode);
  const showDelivery = data.mode == "road";

  return !showCargo && !showTemp && !showDelivery;
}, [shouldShowCargoInfo, data.cargoType, data.mode]);

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-6 space-y-6">
        {isAllEmpty ? (
    <div className="text-sm text-muted-foreground border rounded-md p-4 text-center">
      No extra shipment details required for this quotation.
    </div>
  ) : (
    <><div className="border-b border-border/50 pb-3">
        <h3 className="text-lg font-semibold text-foreground">Quotation Details</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Configure your shipment settings</p>
      </div>

      <div className="grid grid-cols-1 gap-6 w-full">
        <div className="space-y-6">
          {shouldShowCargoInfo && <CargoDetailsSection data={data} setField={setField} />}

          {data.cargoType == "Perishable" && ["sea", "rail", "road", "air"].includes(data.mode) && (
            <TemperatureControlSection data={data} setField={setField} />
          )}

          {data.mode == "road" && <DeliveryRequirementsSection data={data} setField={setField} />}
        </div>
      </div>
    </>
      )}
    </div>
  );
}
