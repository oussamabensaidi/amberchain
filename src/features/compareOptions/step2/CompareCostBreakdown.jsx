import React, { useMemo } from "react";
import DetailItem from "@/features/quotations/components/DetailItem";

export default function CompareCostBreakdown({ price, currency = "USD", costBreakdown }) {
  // Build a safe breakdown, falling back to price-only if detailed breakdown not provided
  const breakdown = useMemo(() => {
    const cur = currency || "USD";
    if (costBreakdown && typeof costBreakdown === "object") {
      const safe = (n) => (typeof n === "number" ? n : Number(n) || 0);
      const oceanFreight = safe(costBreakdown.oceanFreight ?? price ?? 0);
      const energyTransitionSurcharge = safe(costBreakdown.energyTransitionSurcharge);
      const lowSulfurSurcharge = safe(costBreakdown.lowSulfurSurcharge);
      const ispsFee = safe(costBreakdown.ispsFee);
      const thcOrigin = safe(costBreakdown.thcOrigin);
      const thcDestination = safe(costBreakdown.thcDestination);
      const precarriage = safe(costBreakdown.precarriage);
      const oncarriage = safe(costBreakdown.oncarriage);
      const customsBrokerage = safe(costBreakdown.customsBrokerage);
      const insurance = safe(costBreakdown.insurance);
      const certification = safe(costBreakdown.certification);

      const total = safe(
        costBreakdown.total ?? (
          oceanFreight +
          energyTransitionSurcharge +
          lowSulfurSurcharge +
          ispsFee +
          thcOrigin +
          thcDestination +
          precarriage +
          oncarriage +
          customsBrokerage +
          insurance +
          certification
        )
      );

      return {
        currency: cur,
        oceanFreight,
        energyTransitionSurcharge,
        lowSulfurSurcharge,
        ispsFee,
        thcOrigin,
        thcDestination,
        precarriage,
        oncarriage,
        customsBrokerage,
        insurance,
        certification,
        total,
        notes: {
          surchargesCalculationDate: costBreakdown.surchargesCalculationDate,
          exchangeRateDate: costBreakdown.exchangeRateDate,
          subjectTo: costBreakdown.subjectTo,
        }
      };
    }

    const base = Number(price) || 0;
    return {
      currency: cur,
      oceanFreight: base,
      energyTransitionSurcharge: 0,
      lowSulfurSurcharge: 0,
      ispsFee: 0,
      thcOrigin: 0,
      thcDestination: 0,
      precarriage: 0,
      oncarriage: 0,
      customsBrokerage: 0,
      insurance: 0,
      certification: 0,
      total: base,
      notes: {},
    };
  }, [costBreakdown, price, currency]);

  const cur = breakdown.currency || "USD";
  const money = (n) => `${cur} ${Number(n ?? 0).toLocaleString()}`;

  const items = [
    { label: "Ocean Freight", value: money(breakdown.oceanFreight) },
    { label: "Included Charges", value: "USD 0" },
    { label: "Charges Payable As Per Freight", value: money((breakdown.energyTransitionSurcharge || 0) + (breakdown.lowSulfurSurcharge || 0)) },
    { label: "Energy Transition Surcharge", value: money(breakdown.energyTransitionSurcharge) },
    { label: "Low Sulfur Surcharge", value: money(breakdown.lowSulfurSurcharge) },
    { label: "Charges Payable At Import", value: money(breakdown.ispsFee) },
    { label: "ISPS Fee", value: money(breakdown.ispsFee) },
    { label: "THC Origin", value: money(breakdown.thcOrigin) },
    { label: "THC Destination", value: money(breakdown.thcDestination) },
    { label: "Precarriage", value: money(breakdown.precarriage) },
    { label: "Oncarriage", value: money(breakdown.oncarriage) },
    { label: "Customs Brokerage", value: money(breakdown.customsBrokerage) },
    { label: "Insurance", value: money(breakdown.insurance) },
    { label: "Certification", value: money(breakdown.certification) },
  ];

  return (
    <div className="w-full bg-card group-hover:bg-accent shadow-sm p-4">
      <div className="space-y-2 text-sm grid sm:grid-cols-3 justify-between items-stretch gap-x-8">
        {items.map((item, idx) => (
          <DetailItem key={idx} label={item.label} value={item.value} />
        ))}
      </div>
      <DetailItem
        label={"Total per container"}
        value={money(breakdown.total)}
        className="font-semibold text-base"
      />
      {(breakdown.notes?.surchargesCalculationDate || breakdown.notes?.exchangeRateDate || breakdown.notes?.subjectTo) && (
        <div className="text-xs text-muted-foreground mt-6 space-y-1">
          <p>------------------------------------------------------------------</p>
          {breakdown.notes?.surchargesCalculationDate && (
            <p>{`Surcharges calculated on ${breakdown.notes.surchargesCalculationDate}`}</p>
          )}
          {breakdown.notes?.exchangeRateDate && (
            <p>{`Exchange rate as of ${breakdown.notes.exchangeRateDate}`}</p>
          )}
          {breakdown.notes?.subjectTo && (
            <p>{`Subject to: ${breakdown.notes.subjectTo}`}</p>
          )}
        </div>
      )}
    </div>
  );
}
