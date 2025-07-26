"use client"
// This file defines the columns for the main page table.

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Importing of Data Table Components (For easier reuse)
import { DataTableColumnHeader } from "../reusable/data-table-column-header"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Inventory = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

// This is the main page table columns definition.
// It defines the columns that will be displayed in the table.
export const columns: ColumnDef<Inventory>[] = [
    // This column is for selecting rows.
    // It allows users to select multiple rows for bulk actions.
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
  {
    accessorKey: "status",
    header: () => <div>Status</div>,
    cell: ({ row }) => {
      const status = row.getValue("status")
      // Return a div with the status, styled as a badge
      // This is useful for displaying the status in a consistent style.
      return <div className={`badge badge-${status}`}>{String(status)}</div>
    },
    
  },
  // This column displays the email address of the user.
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Email"
        />
      )
    },
  },
    // This column formats the amount as currency.
    // You can customize the formatting as needed.
  { 
    accessorKey: "amount",
    header: () => <div>Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="font-medium">{formatted}</div>
    },
  },
  // This column is for actions, such as viewing details or copying the ID.
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original
 
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
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
