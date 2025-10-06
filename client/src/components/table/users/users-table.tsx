'use client'

import { ReusableTable } from "../reusable/reusable-table"
import { PaginatedUsers } from "@/types/user"
import { columns } from "./user-page-columns"
import { OnChangeFn, PaginationState, SortingState } from '@tanstack/react-table'

interface UsersTableProps {
  loading?: boolean;
  fetchUsers?: () => void;
  data: PaginatedUsers;
  search: string;
  setSearch: (search: string) => void;
  searchColumns: string[];
  setSearchColumns: (cols: string[]) => void;
  pagination: PaginationState;
  setPagination: (updaterOrValue: PaginationState | ((old: PaginationState) => PaginationState)) => void;
  sorting: SortingState;
  setSorting: (updaterOrValue: SortingState | ((old: SortingState) => SortingState)) => void;
  onSearch?: (value: string) => void;
  filterableColumns?: {
    key: any;
    label: any;
  }[];
  handlePaginationChange?: OnChangeFn<PaginationState>;
  handleSortingChange?: OnChangeFn<SortingState>;
}

export default function UsersTable({
  loading = false,
  fetchUsers = () => { },
  data,
  search,
  setSearch,
  searchColumns,
  setSearchColumns,
  pagination,
  setPagination,
  sorting,
  setSorting,
  onSearch = (value: string) => { setSearch(value) },
  filterableColumns = [],
  handlePaginationChange = (updaterOrValue) => {
    setPagination((prev) =>
      typeof updaterOrValue === "function"
        ? updaterOrValue(prev)
        : updaterOrValue
    )
  },
  handleSortingChange = (updaterOrValue) => {
    setSorting((prev) =>
      typeof updaterOrValue === "function"
        ? updaterOrValue(prev)
        : updaterOrValue
    )
  }
}: UsersTableProps
) {

  return (
    <>
      {loading ? (
        <div>Loading users...</div>
      ) : (
        <ReusableTable
          columns={columns(fetchUsers)}
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