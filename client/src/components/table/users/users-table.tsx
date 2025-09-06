'use client'

import { useState, useEffect, useMemo } from 'react'
import { ReusableTable } from "../reusable/reusable-table"
import { getAllUsers } from "@/lib/api/userApi"
import { User } from "@/types/user"
import { columns } from "./user-page-columns"

export default function UsersTable() {
  const [data, setData] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [searchColumns, setSearchColumns] = useState<string[]>(["name"])

  // Get filterable columns from the columns definition
  // Type guard to check if column has accessorKey and header
  function hasAccessorKeyAndHeader(col: any): col is { accessorKey: string; header?: string } {
    return typeof col.accessorKey === "string";
  }

  const filterableColumns = useMemo(
    () =>
      columns
        .filter(hasAccessorKeyAndHeader)
        .map(col => ({
          key: col.accessorKey,
          label: typeof col.header === "string" ? col.header : col.accessorKey
        })),
    []
  )

  const fetchUsers = () => {
    setLoading(true)
    getAllUsers({ q: search, search_columns: searchColumns }).then(res => {
      setData(res.data)
      setLoading(false)
    }).catch(error => {
      console.error("Error fetching users:", error)
      setLoading(false)
    })
  }

  const onSearch = (value: string) => {
    if (value === search) {
      fetchUsers()
    }
    else {
      setSearch(value)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [search])

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Users</h2>
      {loading ? (
        <div>Loading users...</div>
      ) : (
        <ReusableTable
          columns={columns}
          data={data}
          searchPlaceholder="Search users..."
          showViewOptions={true}
          searchValue={search}
          onSearch={onSearch}
          filterableColumns={filterableColumns}
          searchColumns={searchColumns}
          onSearchColumnsChange={setSearchColumns}
        />
      )}
    </>
  )
}