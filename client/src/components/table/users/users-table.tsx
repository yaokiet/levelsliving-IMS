'use client'

// Just a sample table to test the reusable table component

import { useState, useEffect } from 'react'
import { ColumnDef } from "@tanstack/react-table"
import { ReusableTable } from "../reusable/reusable-table"

// Define the type for user data
type User = {
  id: string
  name: string
  role: string
  active: boolean
}

// Define columns for the users table
const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => (
      <div className={`font-medium ${row.getValue("active") ? "text-green-600" : "text-red-600"}`}>
        {row.getValue("active") ? "Active" : "Inactive"}
      </div>
    ),
  },
]

// Sample data function
function getUsersData(): Promise<User[]> {
  return Promise.resolve([
    { id: "1", name: "John Doe", role: "Admin", active: true },
    { id: "2", name: "Jane Smith", role: "User", active: false },
    { id: "3", name: "Bob Johnson", role: "Editor", active: true },
  ])
}

export default function UsersTable() {
  const [data, setData] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUsersData()
      .then(result => {
        setData(result)
        setLoading(false)
      })
      .catch(error => {
        console.error("Failed to fetch users:", error)
        setLoading(false)
      })
  }, [])

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Users</h2>
      {loading ? (
        <div>Loading users...</div>
      ) : (
        <ReusableTable 
          columns={columns} 
          data={data} 
          searchKey="name" 
          searchPlaceholder="Search users..." 
          showViewOptions={true}
        />
      )}
    </>
  )
}
