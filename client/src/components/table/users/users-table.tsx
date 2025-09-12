'use client'

import { useState, useEffect, useMemo } from 'react'
import { ReusableTable } from "../reusable/reusable-table"
import { getAllUsers } from "@/lib/api/userApi"
import { PaginatedUsers } from "@/types/user"
import { columns } from "./user-page-columns"
import { OnChangeFn, PaginationState, SortingState } from '@tanstack/react-table'

export default function UsersTable() {
  const [data, setData] = useState<PaginatedUsers>({
    meta: {
      total: 0, page: 1, size: 10,
      has_prev: false,
      has_next: false,
      sort: [],
      filters: undefined
    }, data: []
  })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [searchColumns, setSearchColumns] = useState<string[]>(["name"])
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });
  const [sorting, setSorting] = useState<SortingState>([]);

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
    getAllUsers({
      q: search, search_columns: searchColumns,
      page: pagination.pageIndex + 1,
      size: pagination.pageSize,
      sort: sorting.map(
        (s) => `${s.id}:${s.desc ? "desc" : "asc"}`
      )
    }).then(res => {
      setData(res)
      setLoading(false)
    }).catch(error => {
      console.error("Error fetching users:", error)
      setLoading(false)
    })
  }

  const handlePaginationChange: OnChangeFn<PaginationState> = (updaterOrValue) => {
    setPagination((prev) =>
      typeof updaterOrValue === "function"
        ? updaterOrValue(prev)
        : updaterOrValue
    );
  };

  const handleSortingChange: OnChangeFn<SortingState> = (updaterOrValue) => {
    setSorting((prev) =>
      typeof updaterOrValue === "function" ? updaterOrValue(prev) : updaterOrValue
    );
  };

  const onSearch = (value: string) => {
    if (value !== search) {
      setSearch(value)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [search, pagination.pageIndex, pagination.pageSize, sorting])

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Users</h2>
      {loading ? (
        <div>Loading users...</div>
      ) : (
        <ReusableTable
          columns={columns}
          data={data.data}
          searchPlaceholder="Search users..."
          showViewOptions={true}
          // For search
          manualSearch={true}
          searchValue={search}
          onSearch={onSearch}
          filterableColumns={filterableColumns} // need for both client and server side search
          searchColumns={searchColumns}
          onSearchColumnsChange={setSearchColumns}
          // For server-side pagination
          manualPagination={true}
          pageCount={data.meta.pages || -1}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
          // For server-side sorting
          manualSorting={true}
          sorting={sorting}
          onSortingChange={handleSortingChange}
        />
      )}
    </>
  )
}