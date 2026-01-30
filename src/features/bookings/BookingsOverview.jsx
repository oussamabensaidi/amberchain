import { useTranslation } from "react-i18next";
import { DataTable } from "@/components/tables/DataTable";
import { getColumns } from "./columns";
import BookingDetails from "./BookingDetails";
import { useMemo, useState, useCallback, useEffect } from "react";
import { useBookingsQuery } from "@/queries/useBookingsQuery";
import DashNav from "@/components/dashboard/DashNav";
import DashboardSearch from "@/components/dashboard/DashboardSearch";
import { buildStatusFilterOptions, buildTabsFilterConfig } from "./utils/filters";
import SuccessBanner from "@/components/ui/SuccessBanner";
import { useSubmittedBookingBanner } from "@/hooks/useSubmittedBookingBanner";
import { useLocation } from "react-router-dom";

export default function BookingsOverview({ data: propData }) {
  const { t } = useTranslation();
  const [columnFilters, setColumnFilters] = useState([]);
  const location = useLocation();
  const { show: showSuccessBanner, dismiss } = useSubmittedBookingBanner();
  const [autoExpandFirstRow, setAutoExpandFirstRow] = useState(false);

  const { data: fetchedData, isLoading: isFetching } = useBookingsQuery({
    enabled: !propData,
  });

  const baseData = propData || fetchedData || [];

  // If we came here from the booking results, build a lightweight booking
  // object from the selected quote and prepend it to the bookings list.
  const quoteFromState = location.state?.fromQuote;

  const quoteBooking = quoteFromState
    ? {
        id: `Q-${quoteFromState.id}`,
        number: quoteFromState.id,
        status: "Pending",
        mode: (quoteFromState.mode || "").charAt(0).toUpperCase() + (quoteFromState.mode || "").slice(1),
        readinessDate: quoteFromState.etd || quoteFromState.createdAt || new Date().toISOString(),
        por: quoteFromState.pol || "",
        origin: quoteFromState.pol || "",
        destination: quoteFromState.pod || "",
        finalPod: quoteFromState.pod || "",
        etd: quoteFromState.etd || "",
        eta: quoteFromState.eta || "",
        carrier: quoteFromState.customer || "Amber Chains",
        smartTool: "Used",
        terminal: "Port",
        task: "Pending",
        originCoord: [0, 0],
        destinationCoord: [0, 0],
        timeline: [
          { step: "New", status: "completed" },
          { step: "Pending", status: "active" },
          { step: "Confirmed", status: "pending" },
        ],
        route: [
          `POL - ${quoteFromState.pol || ""}`,
          `POD - ${quoteFromState.pod || ""}`,
        ],
        equipmentIds: [],
        documentIds: [],
        evgmIds: [],
        shippingInstructionIds: [],
        paymentIds: [],
        participantIds: [],
        actions: [],
        details: {
          info: {
            container: quoteFromState.containerType || "",
            serviceAgreement: "",
            creationDate: quoteFromState.createdAt || "",
            por: quoteFromState.pol || "",
            pol: quoteFromState.pol || "",
            pod: quoteFromState.pod || "",
            numberOfContainers: 1,
            cutoffDate: quoteFromState.cutOff?.cargo || "",
            shippingInstructionsDeadline: "",
            evgmDeadline: "",
            gateInDeadline: "",
          },
          shipping: {
            shippingLine: "",
            service: "",
            vesselName: "",
            terminalOrigin: quoteFromState.pol || "",
            terminalDestination: quoteFromState.pod || "",
            etd: quoteFromState.etd || "",
            eta: quoteFromState.eta || "",
            commodity: quoteFromState.commodity || "",
            grossWeight: quoteFromState.grossWeight || "",
          },
          general: {
            servicesRequested: "",
            comment: "",
            additionalInfo: "",
            terms: "",
          },
        },
      }
    : null;

  const tableData = quoteBooking ? [quoteBooking, ...baseData] : baseData;
  const isLoading = propData ? false : isFetching;

  // When navigated with state from Result.jsx, auto-expand the first row
  useEffect(() => {
    const fromResults = !!quoteFromState;
    if (fromResults && tableData?.length) {
      setAutoExpandFirstRow(true);
    }
  }, [quoteFromState, tableData]);

  // Scroll to the expanded row container when auto expanding
  useEffect(() => {
    if (!autoExpandFirstRow) return;
    const timer = setTimeout(() => {
      const el = document.querySelector(".expanded-row-content");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [autoExpandFirstRow, tableData]);

  const activeMode = useMemo(() => {
    const modeFilter = columnFilters.find((filterItem) => filterItem.id === "mode");
    return modeFilter ? modeFilter.value : "all";
  }, [columnFilters]);

  const columns = useMemo(() => getColumns(t, activeMode), [activeMode, t]);
  const statusFilterOptions = useMemo(() => buildStatusFilterOptions(t), [t]);
  const tabsFilterConfig = useMemo(() => buildTabsFilterConfig(t), [t]);

  const handleSetColumnFilters = useCallback((updater) => {
    setColumnFilters((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      return Array.isArray(next) ? next : prev;
    });
  }, []);

  const dropdownFilters = useMemo(
    () => [
      {
        columnId: "status",
        title: t("filters.status"),
        options: statusFilterOptions,
      },
    ],
    [statusFilterOptions, t]
  );

  const renderExpandedRow = useCallback(
    (bookingObj) => (
      <div className="expanded-row-content">
        <BookingDetails booking={bookingObj} />
      </div>
    ),
    []
  );

  return (
    <>
      {showSuccessBanner && (
        <SuccessBanner
          title="Your booking has been successfully submitted!"
          onClose={dismiss}
          className="animate-slideDown"
        >
          <p>
            Request Reference Number:{" "}
            <span className="font-medium text-green-900 dark:text-green-200">
              REF-125258
            </span>
          </p>
          <p>You will shortly receive an email confirming your submission</p>
          <p className="font-semibold text-green-900 dark:text-green-100 mt-1">
            Thank you for choosing our service — we appreciate your trust.
          </p>
         
        </SuccessBanner>
      )}

      {!propData && (
        <div className="gap-4 flex flex-col">
          <DashNav DashTitle={t("pageTitles.bookings")} />
          <DashboardSearch />
        </div>
      )}

      <div className="flex flex-col gap-4">
        <DataTable
          columns={columns}
          data={tableData || []}
          isLoading={isLoading}
          columnFilters={columnFilters}
          setColumnFilters={handleSetColumnFilters}
          renderExpandedRow={renderExpandedRow}
          expandable={true}
          tabsFilter={tabsFilterConfig}
          dropdownFilters={dropdownFilters}
          initialColumnVisibility={{ mode: false }}
          initialExpandedRowIndex={autoExpandFirstRow ? 0 : undefined}
        />
      </div>
    </>
  );
}
