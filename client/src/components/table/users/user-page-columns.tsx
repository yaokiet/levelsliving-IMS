"use client"
// This file defines the columns for the user page table.

import { ColumnDef } from "@tanstack/react-table"
import { User } from "@/types/user"
import { DataTableColumnHeader } from "../reusable/data-table-column-header"
import { useRouter } from "next/navigation"

// Define columns for the users table
export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="ID"
      />
    ),
    meta: { label: "ID" },
    cell: ({ row }) => {
      const id = row.original.id
      const router = useRouter();

      return (
        <div
          className="font-medium cursor-pointer text-blue-600 hover:text-blue-800 hover:underline"
          onClick={() => router.push(`/users/${id}`)} // Placeholder for navigation
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              router.push(`/users/${id}`) // Placeholder for navigation
            }
          }}
          tabIndex={0}
          role="link"
          aria-label={`View details for ${id}`}
        >
          {id}
        </div>
      )
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Name"
      />
    ),
    meta: { label: "Name" },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Email"
      />
    ),
    meta: { label: "Email" },
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Role"
      />
    ),
    meta: { label: "Role" },
  },
]