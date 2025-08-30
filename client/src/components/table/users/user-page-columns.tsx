"use client"
// This file defines the columns for the user page table.

import { ColumnDef } from "@tanstack/react-table"
import { User } from "@/types/user"

// Define columns for the users table
export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
]