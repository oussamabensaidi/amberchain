import React from "react";
import DetailItem from "@/features/quotations/components/DetailItem";

export default function CompareConditions({ conditions, fallbackTransitDays }) {
  const safeDate = (d) => {
    const dt = d ? new Date(d) : null;
    return dt && !isNaN(dt) ? dt.toLocaleDateString() : '-';
  };

  const merged = {
    validFrom: conditions?.validFrom ?? new Date(),
    validTo: conditions?.validTo ?? new Date(Date.now() + 14 * 24 * 3600 * 1000),
    shipmentConditions: conditions?.shipmentConditions ?? 'Standard shipment conditions apply.',
    transitTimeDays: conditions?.transitTimeDays ?? fallbackTransitDays ?? '-',
    carbonFootprint: conditions?.carbonFootprint ?? '-',
    additionalInfo: {
      cargoTypes: conditions?.additionalInfo?.cargoTypes ?? ["General", "Hazardous", "Perishable"],
    }
  };

  const validity = [
    { label: 'Valid From', value: safeDate(merged.validFrom) },
    { label: 'Valid To', value: safeDate(merged.validTo) },
  ];

  const other = [
    { label: 'Shipment Conditions', value: merged.shipmentConditions },
    { label: 'Transit Time', value: merged.transitTimeDays !== '-' ? `${merged.transitTimeDays} days` : '-' },
    { label: 'Carbon Footprint', value: merged.carbonFootprint !== '-' ? `${merged.carbonFootprint} CO2(t)` : '-' },
  ];

  return (
    <div className="rounded-md p-4 sm:p-6">
      <div className="space-y-4 text-sm">
        <div className="max-w-md">
          <div className="font-medium mb-2">Validity</div>
          {validity.map((item, i) => (
            <DetailItem key={i} label={item.label} value={item.value} />
          ))}
        </div>
        <div className="max-w-md">
          {other.map((item, i) => (
            <DetailItem key={i} label={item.label} value={item.value} />
          ))}
        </div>

        <div className="mt-6 pt-4 text-sm/6 max-w-3xl border-t border-primary/50">
          <div className="font-medium mb-2">Additional Information</div>
          <p>Rates are subject to space and equipment availability.</p>
          <p>Local charges may apply at origin and destination.</p>
          <p>Applicable for cargo types: {merged.additionalInfo.cargoTypes.join(', ')}</p>
          <p>All surcharges are subject to change without prior notice.</p>
        </div>
      </div>
    </div>
  );
}
