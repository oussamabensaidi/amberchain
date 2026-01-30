import { useTranslation } from "react-i18next";
import DashNav from "@/components/dashboard/DashNav";
import { DataTable } from "@/components/tables/DataTable";
import { getColumns } from "./columns";
import ShipmentDetails from "./ShipmentDetails";
import { useMemo, useState } from "react";
import DashboardSearch from "@/components/dashboard/DashboardSearch";
import { useShipmentsQuery } from "@/queries/useShipmentsQuery";

export default function ActiveShipmentsOverview({ data: propData }) {

    const { t } = useTranslation();
    const [columnFilters, setColumnFilters] = useState([]);

    const { data: fetchedData, isLoading: isFetching } = useShipmentsQuery({
        enabled: !propData,
    });

    const tableData = propData || fetchedData;
    const isLoading = propData ? false : isFetching;

    const activeMode = useMemo(() => {
        const modeFilter = columnFilters.find(f => f.id === 'mode');
        return modeFilter ? modeFilter.value : 'all';
    }, [columnFilters]);

    const columns = useMemo(() => getColumns(t, activeMode), [activeMode, t]);

    const modeFilterOptions = [
        { value: "Sea", label: t('modes.sea') },
        { value: "Air", label: t('modes.air') },
        { value: "Road", label: t('modes.road') },
        { value: "Rail", label: t('modes.rail') },
        { value: "E-BUSINESS", label: t('modes.ebusiness') },
    ];

    const statusFilterOptions = [
        { value: "active", label: t('shipments.status.active') },
        { value: "finished", label: t('shipments.status.finished') },
    ];

    const shipmentBulkActions = [
        {
            label: "Log selected IDs",
            onSelect: (selectedRows) => {
                const selectedIds = selectedRows.map(row => row.original.id);
                console.log("Selected shipment IDs:", selectedIds);
                alert(`Logged ${selectedIds.length} shipment IDs to the console.`);
            },
        },
        {
            label: "Export selected",
            onSelect: (selectedRows) => {
                const data = selectedRows.map(row => row.original);
                console.log("Exported data:", data);
                alert(`Exported ${data.length} shipments. Check the console for data.`);
            },
        },
    ];

    return (
        <>
            {!propData && (
                <div className="gap-4 flex flex-col">
                    <DashNav DashTitle={t('pageTitles.multimodal')} />
                    <DashboardSearch />
                </div>
            )}
            <div className="flex flex-col gap-4">
                <DataTable
                    columns={columns}
                    data={tableData || []}
                    isLoading={isLoading}
                    expandable={true}
                    renderExpandedRow={(shipmentObj) => <ShipmentDetails shipment={shipmentObj} />}
                    columnFilters={columnFilters}
                    setColumnFilters={setColumnFilters}
                    tabsFilter={{
                        columnId: "mode",
                        options: modeFilterOptions,
                        allLabel: t('common.all'),
                    }}
                    dropdownFilters={[
                        {
                            columnId: "status",
                            title: t('filters.status'),
                            options: statusFilterOptions,
                        },
                    ]}
                    initialColumnVisibility={{ mode: false }}
                    bulkActions={shipmentBulkActions}
                />
            </div>
        </>
    );
}