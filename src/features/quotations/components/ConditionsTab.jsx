import DetailItem from "./DetailItem";

export default function ConditionsTab({ conditions, t }) {
    const conditionItems = [
        { label: t('quotations.conditions.from'), value: new Date(conditions.validFrom).toLocaleDateString() },
        { label: t('quotations.conditions.to'), value: new Date(conditions.validTo).toLocaleDateString() },
    ];
    const otherDetails = [
        { label: t('quotations.conditions.shipmentConditions'), value: conditions.shipmentConditions },
        { label: t('quotations.conditions.transitTime'), value: `${conditions.transitTimeDays} ${t('quotations.conditions.days')}` },
        { label: t('quotations.conditions.carbonFootprint'), value: `${conditions.carbonFootprint} CO2(t)` },
    ];

    return (
        <div className="rounded-md p-4 sm:p-6">
            <div className="space-y-4 text-sm">
                <div className="max-w-md">
                    <div className="font-medium mb-2">{t('quotations.conditions.validity')}</div>
                    {conditionItems.map((item, index) => (
                        <DetailItem key={index} label={item.label} value={item.value} />
                    ))}
                </div>
                <div className="max-w-md">
                    {otherDetails.map((item, index) => (
                        <DetailItem key={index} label={item.label} value={item.value} />
                    ))}
                </div>

                <div className="mt-6 pt-4 text-sm/6 max-w-3xl border-t border-primary/50">
                    <div className="font-medium mb-2">{t('quotations.conditions.additionalInfo.title')}</div>
                    <p>{t('quotations.conditions.additionalInfo.line1')}</p>
                    <p>{t('quotations.conditions.additionalInfo.line2')}</p>
                    {/* <p>{t('quotations.conditions.additionalInfo.line3', { cargoTypes: conditions.additionalInfo.cargoTypes.join(', ') })}</p> */}
                    <p>{t('quotations.conditions.additionalInfo.line4')}</p>
                </div>
            </div>
        </div>
    );
}


