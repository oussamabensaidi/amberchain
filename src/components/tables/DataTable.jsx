import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getExpandedRowModel,
} from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { DataTablePagination } from "./DataTablePagination";
import DataTableToolbar from "./DataTableToolbar";
import DataTableBody from "./DataTableBody";

export function DataTable({
    columns,
    data,
    isLoading,
    tabsFilter,
    dropdownFilters,
    initialColumnVisibility,
    expandable = false,
    renderExpandedRow = () => null,
    columnFilters,
    setColumnFilters,
    searchTerm,
    onClearSearch,
    bulkActions,
    allowSearchFiltering = false,
    globalFilter,
    setGlobalFilter,
    actionTitle,
    setSelectedRows,
    externalRowSelectionResetKey,
    initialExpandedRowIndex,
    // Server-side pagination props
    pagination,
    onPaginationChange,
    paginationMetadata,
}) {
    const [sorting, setSorting] = useState([]);
    const [rowSelection, setRowSelection] = useState({});
    const [expanded, setExpanded] = useState({});
    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility || {});

    // Use external pagination state if provided, otherwise use internal
    const internalPagination = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [internalPaginationState, setInternalPaginationState] = internalPagination;
    
    const activePaginationState = pagination || internalPaginationState;

    const table = useReactTable({
        data,
        columns,
        autoResetPageIndex: false,
        state: {
            sorting,
            rowSelection,
            columnFilters,
            columnVisibility,
            globalFilter,
            pagination: activePaginationState,
            ...(expandable && { expanded }),
        },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        // Only apply client-side pagination in non-manual mode
        ...(!(!!onPaginationChange) && { getPaginationRowModel: getPaginationRowModel() }),
        ...(expandable && { getExpandedRowModel: getExpandedRowModel() }),
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onExpandedChange: setExpanded,
        onPaginationChange: (updater) => {
            const newPagination = typeof updater === 'function' ? updater(activePaginationState) : updater;
            if (onPaginationChange) {
                // Server-side pagination mode
                onPaginationChange(newPagination);
            } else {
                // Client-side pagination mode
                setInternalPaginationState(newPagination);
            }
        },
        // For server-side pagination, use manual pagination
        manualPagination: !!onPaginationChange,
        rowCount: paginationMetadata?.total,
    });

    useEffect(() => {
        // Only reset page index in client-side mode
        if (!onPaginationChange) {
            table.setPageIndex(0);
        }
    }, [columnFilters, sorting, onPaginationChange, table]);

    useEffect(() => {
        if (searchTerm && data.length === 1) {
            setExpanded({ "0": true });
        } else {
            setExpanded({});
        }
    }, [data, searchTerm]);

    // Allow parent to request an initial expanded row (by row index)
    useEffect(() => {
        if (!expandable) return;
        if (initialExpandedRowIndex === undefined || initialExpandedRowIndex === null) return;
        if (!data.length) return;
        setExpanded({ [String(initialExpandedRowIndex)]: true });
    }, [initialExpandedRowIndex, expandable, data]);

    // Expose selected rows to parent when requested
    useEffect(() => {
        if (!setSelectedRows) return;
        const selected = table.getFilteredSelectedRowModel().rows.map(r => r.original);
        setSelectedRows(selected);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowSelection, table]);

    // Allow parent to request clearing selection
    useEffect(() => {
        if (externalRowSelectionResetKey === undefined) return;
        setRowSelection({});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [externalRowSelectionResetKey]);

    const handleRowClick = (row) => {
        const newExpandedState = {};
        if (!row.getIsExpanded()) {
            newExpandedState[row.id] = true;
        }
        setExpanded(newExpandedState);
    };

    return (
        <>
            <DataTableToolbar
                table={table}
                tabsFilter={tabsFilter}
                dropdownFilters={dropdownFilters}
                searchTerm={searchTerm}
                onClearSearch={onClearSearch}
                bulkActions={bulkActions}
                allowSearchFiltering={allowSearchFiltering}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                actionTitle={actionTitle}
            />
            <DataTableBody
                table={table}
                columns={columns}
                expandable={expandable}
                renderExpandedRow={renderExpandedRow}
                onRowClick={handleRowClick}
                isLoading={isLoading}
            />
            <DataTablePagination table={table} paginationMetadata={paginationMetadata} />
        </>
    );
}