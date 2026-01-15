import React, { useState, useMemo, useCallback, memo } from "react";
import { useShipmentStore } from "@/store/shipmentStore";
import CargoDetailsSection from "./CargoDetailsSection";
// import TemperatureControlSection from "./TemperatureControlSection";
import DeliveryRequirementsSection from "./DeliveryRequirementsSection";
import ServiceAddonsSection from "./ServiceAddonsSection";
import LeftColumnBanner from "./LeftColumnBanner";

function BookingForm() {
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

  const isLeftColumnEmpty = useMemo(() => {
    return !shouldShowCargoInfo && data.mode !== "road";
  }, [shouldShowCargoInfo, data.mode]);

  const showLeftBanner = useMemo(() => {
    const mode = data.mode;
    const shipmentType = data.shipmentType;
    const cargoType = data.cargoType;

    // if (mode === "combined") return true;

    const isRoadFCLCase = mode === "road" && shipmentType === "FCL" && ["General", "Hazardous", "Liquid", "Perishable"].includes(cargoType);
    const isRoadFTLCase = mode === "road" && shipmentType === "FTL" && ["Perishable", "General", "Liquid", "Hazardous"].includes(cargoType);
    const isSeaRailLCLCase = ["sea", "rail"].includes(mode) && shipmentType === "LCL" && ["Perishable", "General", "Liquid", "Hazardous"].includes(cargoType);
    const isSeaRailFCLCase = ["sea", "rail"].includes(mode) && shipmentType === "FCL" && ["Oversized", "Hazardous"].includes(cargoType);

    return isRoadFCLCase || isRoadFTLCase || isSeaRailLCLCase || isSeaRailFCLCase;
  }, [data.mode, data.shipmentType, data.cargoType]);

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-6 space-y-6">
      <div className="border-b border-border/50 pb-3">
        <h3 className="text-lg font-semibold text-foreground">Quotation Details</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Configure your shipment settings</p>
      </div>

      <div className={`grid grid-cols-1 ${!isLeftColumnEmpty || showLeftBanner ? "lg:grid-cols-2" : ""} gap-6 w-full`}>
        {(!isLeftColumnEmpty || showLeftBanner) && (
          <div className="space-y-6">
                {!isLeftColumnEmpty && (
                  <>
                    {shouldShowCargoInfo && <CargoDetailsSection data={data} setField={setField} />}

                {/* {data.cargoType == "Perishable" && ["sea", "rail", "road", "air"].includes(data.mode) && (
                  <TemperatureControlSection data={data} setField={setField} />
                )} */}

                    {data.mode == "road" && <DeliveryRequirementsSection data={data} setField={setField} />}
                    {showLeftBanner && <LeftColumnBanner mode={data.mode} />}
                  </>
                )}

                {isLeftColumnEmpty && showLeftBanner && <LeftColumnBanner mode={data.mode} />}
          </div>
        )}

        <ServiceAddonsSection data={data} setField={setField} />
      </div>

   
    </div>
  );
}

export default memo(BookingForm);