"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
  ExpandedState,
  OnChangeFn,
  PaginationState, // For expanding rows
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTableSearch } from "./data-table-search";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableViewFilterOptions } from "./data-table-column-visibility";
import { DropdownFilterSelect } from "./data-table-dropdown-filter";
import { ColumnMultiSelect } from "./column-multi-select";

interface ReusableTableProps<TData extends Record<string, any>, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  showViewOptions?: boolean;
  showPagination?: boolean;
  filterKey?: string;
  filterLabel?: string;
  filterOptions?: string[];
  filterValue?: string;
  renderSubRows?: (row: any, colSpan: number) => React.ReactNode;
  className?: string;
  containerClassName?: string;
  // For search
  searchValue?: string;
  onSearch?: (value: string) => void;
  filterableColumns?: { key: string; label: string }[];
  searchColumns?: string[];
  onSearchColumnsChange?: (cols: string[]) => void;
  // For server-side pagination
  manualPagination?: boolean;
  pageCount?: number;
  pagination?: { pageIndex: number; pageSize: number };
  onPaginationChange?: OnChangeFn<PaginationState>
}

export function ReusableTable<TData extends Record<string, any>, TValue>({
  columns,
  data,
  searchPlaceholder = "Search...",
  showViewOptions = true,
  showPagination = true,
  filterKey,
  filterLabel,
  filterOptions = [],
  className = "",
  containerClassName = "w-5/5 rounded-xl shadow-xl p-8",
  renderSubRows,
  // For search
  searchValue,
  onSearch,
  filterableColumns = [],
  searchColumns = [],
  onSearchColumnsChange,
  // For server-side pagination
  manualPagination = false,
  pageCount = -1,
  onPaginationChange = undefined,
  pagination,
}: ReusableTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [expanded, setExpanded] = React.useState<ExpandedState>({}); // For expanding rows
  const currentFilterValue = String(
    columnFilters.find((filter) => filter.id === filterKey)?.value || ""
  );

  // Ensure we always pass a valid array to the table
  const safeData = React.useMemo<TData[]>(
    () => (Array.isArray(data) ? data : []),
    [data]
  );

  const table = useReactTable({
    data: safeData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    // getExpandedRowModel: getExpandedRowModel(), // For expanding rows
    // For server-side pagination
    manualPagination: manualPagination,
    pageCount: manualPagination ? pageCount : undefined,
    ...(onPaginationChange ? { onPaginationChange } : {}),
    /**
     * Determine if a row can expand.
     *
     * If the row has sub-rows, it can expand.
     * @param row The row to check.
     * @returns {boolean} Whether the row can expand.
     */
    getRowCanExpand: (row) =>
      Array.isArray(row.original.subRows) && row.original.subRows.length > 0,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      expanded,
      // For server-side pagination
      ...(pagination ? { pagination } : {}),
    },
    getSubRows: (row) => row.subRows, // For getting sub-rows
    maxLeafRowFilterDepth: 0, // Add this to disable filtering subRows
  });

  const computedFilterOptions = React.useMemo(
    () =>
      filterOptions && filterOptions.length > 0
        ? filterOptions
        : filterKey
          ? Array.from(
            new Set(
              safeData
                .map((item) => item[filterKey])
                .filter((v) => v !== undefined && v !== null && v !== "")
            )
          )
        : [],
    [filterOptions, safeData, filterKey]
  );

  // Debugging
  console.log(table.getRowModel().rows);

  return (
    <div className={`justify-center ${className}`}>
      <div className={`${containerClassName}`}>
        {/* Search bar and view options */}
        {(onSearch || showViewOptions) && (
          <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
            <div className="flex-1 min-w-[220px] flex gap-2">
              {onSearch && (
                <DataTableSearch
                  value={searchValue ?? ""}
                  onSearch={onSearch}
                  placeholder={searchPlaceholder}
                />
              )}
              {filterableColumns.length > 0 && onSearchColumnsChange && (
                <ColumnMultiSelect
                  options={filterableColumns}
                  value={searchColumns}
                  onChange={onSearchColumnsChange}
                  placeholder="Select columns"
                />
              )}
            </div>
            {filterKey && (
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium" htmlFor={`filter-${filterKey}`}>
                  Filter {filterLabel} column
                </label>
                <DropdownFilterSelect
                  filterKey={filterKey}
                  // label={filterLabel}
                  options={computedFilterOptions}
                  value={currentFilterValue || "__all__"}
                  onChange={(value) => {
                    setColumnFilters((prev) => {
                      if (value === "__all__") {
                        return prev.filter((f) => f.id !== filterKey);
                      }
                      const found = prev.find((f) => f.id === filterKey);
                      if (found) {
                        return prev.map((f) =>
                          f.id === filterKey ? { ...f, value } : f
                        );
                      }
                      return [...prev, { id: filterKey, value }];
                    });
                  }}
                />
              </div>
            )}
            {showViewOptions && (
              <div className="flex-shrink-0">
                <DataTableViewFilterOptions table={table} />
              </div>
            )}
          </div>
        )}
        {/* Table */}
        <div className={`overflow-hidden rounded-lg border`}>
          <Table className="w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="font-semibold border-b px-4 py-3"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <React.Fragment key={row.id}>
                    <TableRow
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-muted/50 data-[state=selected]:bg-muted transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="border-b px-4 py-2"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                    {/* Expand Subrows below parent */}
                    {row.getIsExpanded() &&
                      row.subRows &&
                      row.subRows.length > 0 &&
                      renderSubRows &&
                      renderSubRows(row, columns.length)
                    }
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/* Pagination */}
        {showPagination && (
          <div className="py-4 flex justify-end">
            <DataTablePagination table={table} />
          </div>
        )}
      </div>
    </div>
  );
};