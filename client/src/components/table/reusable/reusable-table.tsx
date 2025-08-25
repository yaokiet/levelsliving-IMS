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
  getExpandedRowModel,
  ExpandedState, // For expanding rows
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

interface ReusableTableProps<TData extends Record<string, any>, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  showViewOptions?: boolean;
  showPagination?: boolean;
  subRowColumns?: { accessorKey: string; header: string }[];
  filterKey?: string;
  filterLabel?: string;
  filterOptions?: string[];
  filterValue?: string;
  renderSubRows?: (row: any, colSpan: number) => React.ReactNode;
}

export function ReusableTable<TData extends Record<string, any>, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  showViewOptions = true,
  showPagination = true,
  subRowColumns = [],
  filterKey,
  filterLabel,
  filterOptions = [],
  renderSubRows,
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

  const table = useReactTable({
    data,
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
    
    // To fix the expand icon from disappearing when filtering
    getRowCanExpand: (row) => 
      Array.isArray(row.original.subRows) && row.original.subRows.length > 0,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      expanded,
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
              data
                .map((item) => item[filterKey])
                .filter((v) => v !== undefined && v !== null && v !== "")
            )
          )
        : [],
    [filterOptions, data, filterKey]
  );

  // Debugging
  console.log(table.getRowModel().rows);

  return (
    <div>
      {/* Search bar and view options */}
      {(searchKey || showViewOptions) && (
        <div className="flex items-center py-4 justify-between">
          {searchKey && (
            // DataTableSearch component for searching
            <DataTableSearch
              table={table} // Pass the table instance
              searchKey={searchKey} // Search key for filtering
              placeholder={searchPlaceholder} // Placeholder text for the search input
            />
          )}
          {/* Dropdown filter for table data */}
          {filterKey && (
            <DropdownFilterSelect
              filterKey={filterKey}
              label={filterLabel}
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
          )}
          {showViewOptions && <DataTableViewFilterOptions table={table} />}
        </div>
      )}
      {/* Table */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          {/* Render the table headers e.g. column names */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
          {/* Render the table rows e.g. data for each row */}
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow data-state={row.getIsSelected() && "selected"}>
                    {/* Render the cells in each row */}
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
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
                    )}
                </React.Fragment>
              ))
            ) : (
              // If no rows, display a message
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
        <div className="py-4">
          <DataTablePagination table={table} />
        </div>
      )}
    </div>
  );
}
