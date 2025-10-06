"use client"
// This file defines the columns for the user page table.

import { ColumnDef } from "@tanstack/react-table"
import { User } from "@/types/user"
import { DataTableColumnHeader } from "../reusable/data-table-column-header"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { useState } from "react"
import { UserEditModal } from "@/components/ui/user/user-edit-modal"

// Define columns for the users table
export const columns = (
  onItemUpdated?: () => void | Promise<void>
): ColumnDef<User>[] => [
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
    // Actions column
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        const [editOpen, setEditOpen] = useState(false);
        const [dropdownOpen, setDropdownOpen] = useState(false);

        return (
          <>
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(user.name)}
                >
                  Copy Name
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { setEditOpen(true); setDropdownOpen(false); }}>
                  Edit user
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { (true); setDropdownOpen(false); }} className="text-red-600">
                  Delete user
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <UserEditModal
              user={user}
              isOpen={editOpen}
              setIsOpen={setEditOpen}
              onUpdated={onItemUpdated}
            />
          </>
        );
      },
    },
  ]