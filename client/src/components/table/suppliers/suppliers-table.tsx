"use client"

import * as React from "react"
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
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { DataTablePagination } from "../reusable/data-table-pagination"
import { Search } from "lucide-react"

// Define the Supplier type
type Supplier = {
  id: string
  supplierName: string
  product: string
  contact: string
  email: string
  type: string
  onTheWay: string | number
}

// Define the columns for the table
const columns: ColumnDef<Supplier>[] = [
  {
    accessorKey: "supplierName",
    header: () => <span className="text-sm font-semibold text-left">Supplier Name</span>,
    cell: info => <span className="text-sm text-left">{String(info.getValue())}</span>
  },
  {
    accessorKey: "product",
    header: () => <span className="text-sm font-semibold text-left">Product</span>,
    cell: info => <span className="text-sm text-left">{String(info.getValue())}</span>
  },
  {
    accessorKey: "contact",
    header: () => <span className="text-sm font-semibold text-left">Contact Number</span>,
    cell: info => <span className="text-sm text-left">{String(info.getValue())}</span>
  },
  {
    accessorKey: "email",
    header: () => <span className="text-sm font-semibold text-left">Email</span>,
    cell: info => <span className="text-sm text-left">{String(info.getValue())}</span>
  },
  {
    accessorKey: "type",
    header: () => <span className="text-sm font-semibold text-left">Type</span>,
    cell: info => {
      const value = String(info.getValue());
      const isTaking = value.toLowerCase().includes("taking");
      const color = isTaking ? "text-green-500" : "text-red-500";
      return <span className={`text-sm font-medium ${color}`}>{value}</span>;
    }
  },
  {
    accessorKey: "onTheWay",
    header: () => <span className="text-sm font-semibold text-right">On the way</span>,
    cell: info => <span className="text-sm text-right">{String(info.getValue())}</span>
  },
]

// Sample data for the table
const sampleData: Supplier[] = [
  { id: "1", supplierName: "Richard Martin", product: "Kit Kat", contact: "7687764556", email: "richard@gmail.com", type: "Taking Return", onTheWay: "13" },
  { id: "2", supplierName: "Tom Homan", product: "Maaza", contact: "9867545368", email: "tomhoman@gmail.com", type: "Taking Return", onTheWay: "-" },
  { id: "3", supplierName: "Veandir", product: "Dairy Milk", contact: "9867545566", email: "veandir@gmail.com", type: "Not Taking Return", onTheWay: "-" },
  { id: "4", supplierName: "Charin", product: "Tomato", contact: "9267545457", email: "charin@gmail.com", type: "Taking Return", onTheWay: "12" }
]

// Suppliers Search Component
function SuppliersSearch<TData>({
  table,
  searchKey,
  placeholder = "Search suppliers..."
}: {
  table: any,
  searchKey: string,
  placeholder?: string
}) {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
        onChange={(event) => 
          table.getColumn(searchKey)?.setFilterValue(event.target.value)
        }
        className="pl-8 w-full bg-background border-muted"
      />
    </div>
  )
}

// Main Suppliers Table Component
export function SuppliersTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data: sampleData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4 justify-between">
        <SuppliersSearch table={table} searchKey="supplierName" placeholder="Search suppliers..." />
        <div className="flex items-center">
          <span className="text-sm font-medium">View</span>
        </div>
      </div>

      <div className="rounded-md border mt-2">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="px-6 py-4">
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
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6 py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="py-6">
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}
