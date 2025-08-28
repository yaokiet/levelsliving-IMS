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
import { DataTablePagination } from "../reusable/data-table-pagination"
import { DataTableSearch } from "../reusable/data-table-search"
import { DataTableColumnHeader } from "../reusable/data-table-column-header"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Define the Supplier type to match the image structure
type Supplier = {
  id: string
  supplierName: string
  product: string
  contactNumber: string
  email: string
  type: string
  onTheWay: string | number
}

// Define the columns for the table (matching supplier image structure)
const columns: ColumnDef<Supplier>[] = [
  // Select checkbox column
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // Supplier Name column
  {
    accessorKey: "supplierName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supplier Name" />
    ),
  },
  // Product column
  {
    accessorKey: "product",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
  },
  // Contact Number column
  {
    accessorKey: "contactNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact Number" />
    ),
  },
  // Email column
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  // Type column with color coding
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("type") as string;
      const isTakingReturn = value.toLowerCase().includes("taking return");
      const colorClass = isTakingReturn ? "text-green-500" : "text-red-500";
      return (
        <span className={`font-medium ${colorClass}`}>
          {value}
        </span>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  // On the way column
  {
    accessorKey: "onTheWay",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="On the way" />
    ),
  },
  // Actions column
  {
    id: "actions",
    cell: ({ row }) => {
      const supplier = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(supplier.supplierName)}
            >
              Copy Supplier Name
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit supplier</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              Remove supplier
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
]

// Sample data for the table (matching supplier image structure)
const sampleData: Supplier[] = [
  { id: "1", supplierName: "Richard Martin", product: "Kit Kat", contactNumber: "7687764556", email: "richard@gmail.com", type: "Taking Return", onTheWay: "13" },
  { id: "2", supplierName: "Tom Homan", product: "Maaza", contactNumber: "9867545368", email: "tomhoman@gmail.com", type: "Taking Return", onTheWay: "-" },
  { id: "3", supplierName: "Veandir", product: "Dairy Milk", contactNumber: "9867545566", email: "veandier@gmail.com", type: "Not Taking Return", onTheWay: "-" },
  { id: "4", supplierName: "Charin", product: "Tomato", contactNumber: "9267545457", email: "charin@gmail.com", type: "Taking Return", onTheWay: "12" },
  { id: "5", supplierName: "Hoffman", product: "Milk Bikis", contactNumber: "9367546531", email: "hoffman@gmail.com", type: "Taking Return", onTheWay: "-" },
  { id: "6", supplierName: "Fainden Juke", product: "Marie Gold", contactNumber: "9667545982", email: "fainden@gmail.com", type: "Not Taking Return", onTheWay: "9" },
  { id: "7", supplierName: "Martin", product: "Saffola", contactNumber: "9867545457", email: "martin@gmail.com", type: "Taking Return", onTheWay: "-" },
  { id: "8", supplierName: "Joe Nike", product: "Good day", contactNumber: "9567545769", email: "joenike@gmail.com", type: "Taking Return", onTheWay: "-" },
  { id: "9", supplierName: "Dender Luke", product: "Apple", contactNumber: "9667545980", email: "dender@gmail.com", type: "Not Taking Return", onTheWay: "7" },
  { id: "10", supplierName: "Joe Nike", product: "Good day", contactNumber: "9567545769", email: "joenike@gmail.com", type: "Taking Return", onTheWay: "-" }
]

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
        <DataTableSearch table={table} searchKey="supplierName" placeholder="Search suppliers..." />
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
