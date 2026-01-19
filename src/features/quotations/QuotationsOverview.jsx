import { useTranslation } from "react-i18next";
import { DataTable } from "@/components/tables/DataTable";
import { getColumns } from "./columns";
import QuotationDetails from "./QuotationDetails.jsx";
import { useMemo, useState, useEffect } from "react";
import DashboardSearch from "@/components/dashboard/DashboardSearch";
import DashNav from "@/components/dashboard/DashNav";
import { useQuotationsQuery } from "@/queries/useQuotationsQuery";
import { useUserQuotes } from "@/queries/useUserQuotes";
import useCurrentUserQuery from "@/queries/useCurrentUserQuery";
import SuccessBanner from "@/components/ui/SuccessBanner";
import { useSubmittedBookingBanner } from "@/hooks/useSubmittedBookingBanner";

export default function QuotationsOverview({ data: propData }) {
    const { t } = useTranslation();
    const [columnFilters, setColumnFilters] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const { show: showSuccessBanner, dismiss } = useSubmittedBookingBanner();

    // Get current user
    const { data: currentUser } = useCurrentUserQuery();

    console.log('QuotationsOverview - currentUser:', currentUser);
    console.log('QuotationsOverview - propData:', propData);

    // Reset pagination to first page when filters change
    useEffect(() => {
        setPagination({
            pageIndex: 0,
            pageSize: 10,
        });
    }, [columnFilters]);

    // Use useUserQuotes for server-side pagination and filtering
    // Falls back to useQuotationsQuery if propData is provided
    const { data: userQuotesData, isLoading: isUserQuotesLoading } = useUserQuotes(
        propData ? null : currentUser?.id,
        pagination.pageIndex,
        pagination.pageSize,
        columnFilters
    );

    // Support both propData and API-fetched data
    const tableData = propData || userQuotesData?.quotes || [];
    const isLoading = propData ? false : isUserQuotesLoading;

    const activeMode = useMemo(() => {
        const modeFilter = columnFilters.find(f => f.id === 'mode');
        return modeFilter ? String(modeFilter.value) : 'all';
    }, [columnFilters]);

    const columns = useMemo(() => getColumns(t, activeMode), [activeMode, t]);

    const modeFilterOptions = [
        { value: "Sea", label: t('quotations.modes.sea') },
        { value: "Air", label: t('quotations.modes.air') },
        { value: "Road", label: t('quotations.modes.road') },
        { value: "Rail", label: t('quotations.modes.rail') },
        { value: "E-BUSINESS", label: t('quotations.modes.ebusiness') },
    ];

    const statusFilterOptions = [
        { value: "pending", label: t('quotations.common.pending') },
        { value: "expired", label: t('quotations.common.expired') },
        { value: "confirmed", label: t('quotations.common.confirmed') },
    ];

    // Handle pagination changes - trigger new API call with updated pageIndex or pageSize
    const handlePaginationChange = (newPagination) => {
        console.log('Pagination changed:', newPagination);
        setPagination(newPagination);
    };

    return (
        <>
            {showSuccessBanner && (
                <SuccessBanner
                    title="Your booking has been successfully submitted!"
                    onClose={dismiss}
                    className="animate-slideDown"
                >
                    <p>
                        Request Reference Number: <span className="font-medium text-green-900 dark:text-green-200">REF-125258</span>
                    </p>
                    <p>You will shortly receive an email confirming your submission</p>
                    <p className="font-semibold text-green-900 dark:text-green-100 mt-1">
                        Thank you for choosing our service — we appreciate your trust.
                    </p>
                </SuccessBanner>
            )}
            {!propData && (
                <div className="gap-4 flex flex-col">
                    <DashNav DashTitle={t('quotations.pageTitle')} />
                    <DashboardSearch />
                </div>
            )}
            <div className="flex flex-col gap-4">
                <DataTable
                    columns={columns}
                    data={tableData || []}
                    isLoading={isLoading}
                    expandable={true}
                    renderExpandedRow={(qObj) => <QuotationDetails quotation={qObj} />}
                    columnFilters={columnFilters}
                    setColumnFilters={setColumnFilters}
                    tabsFilter={{
                        columnId: "mode",
                        options: modeFilterOptions,
                        allLabel: t('quotations.common.all'),
                    }}
                    dropdownFilters={[{
                        columnId: "status",
                        title: t('quotations.filters.status'),
                        options: statusFilterOptions,
                    }]}
                    initialColumnVisibility={{ mode: false }}
                    // Server-side pagination props
                    pagination={!propData ? pagination : undefined}
                    onPaginationChange={!propData ? handlePaginationChange : undefined}
                    paginationMetadata={!propData ? userQuotesData?.pagination : undefined}
                />
            </div>
            
        </>
    );
}