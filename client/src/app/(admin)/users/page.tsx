"use client";

import React, { useEffect, useMemo, useState } from "react";
import UsersTable from "@/components/table/users/users-table";
import { UserAddModal } from "@/components/ui/user/user-add-modal";
import { getAllUsers } from "@/lib/api/userApi";
import { PaginatedUsers } from "@/types/user";
import { OnChangeFn, PaginationState, SortingState } from "@tanstack/react-table";
import { columns } from "@/components/table/users/user-page-columns";
import { getFilterableColumns } from "@/lib/utils";

// This is the main page export
export default function UserPage() {
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

  // For filterable columns in search
  const filterableColumns = useMemo(
    () => getFilterableColumns(columns(fetchUsers)),
    [columns]
  );

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
    <div className="container mx-auto py-10 px-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Users</h2>
        <UserAddModal
          onCreated={() => fetchUsers()}
          dialogTitle="Create New User"
          buttonName="Create User"
          confirmButtonText="Create User"
        />
      </div>
      <UsersTable
        loading={loading}
        fetchUsers={fetchUsers}
        data={data}
        search={search}
        setSearch={setSearch}
        searchColumns={searchColumns}
        setSearchColumns={setSearchColumns}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        onSearch={onSearch}
        filterableColumns={filterableColumns}
        handlePaginationChange={handlePaginationChange}
        handleSortingChange={handleSortingChange}
      />
    </div>
  );
}
