import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function DataTablePagination({ table, paginationMetadata }) {
  const { t } = useTranslation();

  // Use server-side pagination metadata if available, otherwise client-side
  const pageSize = table.getState().pagination.pageSize;
  const pageIndex = table.getState().pagination.pageIndex;
  const currentPage = pageIndex + 1;

  let totalPages, pageCount, selectedCount, totalCount, canNextPage, canPreviousPage;

  if (paginationMetadata) {
    // Server-side pagination
    totalPages = paginationMetadata.totalPages;
    pageCount = totalPages;
    selectedCount = table.getFilteredSelectedRowModel().rows.length;
    totalCount = paginationMetadata.total;
    canNextPage = paginationMetadata.hasNextPage;
    canPreviousPage = paginationMetadata.hasPreviousPage;
  } else {
    // Client-side pagination
    totalPages = table.getPageCount();
    pageCount = table.getPageCount();
    selectedCount = table.getFilteredSelectedRowModel().rows.length;
    totalCount = table.getFilteredRowModel().rows.length;
    canNextPage = table.getCanNextPage();
    canPreviousPage = table.getCanPreviousPage();
  }

  return (
    <div className="dataTablePagination flex items-center justify-start sm:justify-between flex-col sm:flex-row">
      <div className="text-muted-foreground w-full sm:w-fit sm:flex-1 text-sm">
        {t("pagination.selected", {
          count: selectedCount,
          total: totalCount,
        })}
      </div>
      <div className="flex items-center flex-wrap sm:flex-nowrap w-full sm:w-fit">
        <div className="flex items-center gap-2 w-full sm:w-fit justify-between sm:justify-start">
          <p className="text-sm font-medium">{t("pagination.rowsPerPage")}</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 25, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between sm:justify-center w-full sm:w-fit ml-4">
          <div className="flex items-center text-sm font-medium mr-4">
            {t("pagination.pageInfo", {
              currentPage,
              totalPages: pageCount,
            })}
          </div>
          <div className="flex items-center space-x-2 -mr-2 sm:mr-0">
            <Button
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!canPreviousPage}
            >
              <span className="sr-only">{t("pagination.firstPage")}</span>
              <ChevronsLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.previousPage()}
              disabled={!canPreviousPage}
            >
              <span className="sr-only">{t("pagination.previousPage")}</span>
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.nextPage()}
              disabled={!canNextPage}
            >
              <span className="sr-only">{t("pagination.nextPage")}</span>
              <ChevronRight />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex"
              onClick={() => table.setPageIndex(pageCount - 1)}
              disabled={!canNextPage}
            >
              <span className="sr-only">{t("pagination.lastPage")}</span>
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}