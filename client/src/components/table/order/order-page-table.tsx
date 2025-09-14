"use client";

// This file defines the columns for the main page table.

import { useState, useEffect, useMemo } from "react";
import { columns, orderTableFilterableColumns } from "./order-page-columns";
import { ReusableTable } from "@/components/table/reusable/reusable-table";
import { getAllOrders } from "@/lib/api/ordersApi";
import OrderPageSubTable from "./order-page-sub-table";
import { PaginatedOrderItems } from "@/types/order-item";
import {
  OnChangeFn,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";

export default function OrderPageTable() {
  const [data, setData] = useState<PaginatedOrderItems>({
    meta: {
      total: 0,
      page: 1,
      size: 10,
      has_prev: false,
      has_next: false,
      sort: [],
      filters: undefined,
    },
    data: [],
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchColumns, setSearchColumns] = useState<string[]>(["name"]);
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [error, setError] = useState<string | null>(null);
  const filterableColumns = useMemo(() => orderTableFilterableColumns, []);

  const fetchOrders = () => {
    setLoading(true);
    getAllOrders({
      q: search,
      search_columns: searchColumns,
      page: pagination.pageIndex + 1,
      size: pagination.pageSize,
      sort: sorting.map((s) => `${s.id}:${s.desc ? "desc" : "asc"}`),
    })
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  };

  const handlePaginationChange: OnChangeFn<PaginationState> = (
    updaterOrValue
  ) => {
    setPagination((prev) =>
      typeof updaterOrValue === "function"
        ? updaterOrValue(prev)
        : updaterOrValue
    );
  };

  const handleSortingChange: OnChangeFn<SortingState> = (updaterOrValue) => {
    setSorting((prev) =>
      typeof updaterOrValue === "function"
        ? updaterOrValue(prev)
        : updaterOrValue
    );
  };

  const onSearch = (value: string) => {
    if (value !== search) {
      setSearch(value);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [search, pagination.pageIndex, pagination.pageSize, sorting]);

  const renderSubRows = (row: any) => (
    <tr>
      <td colSpan={columns.length} className="p-0" style={{ padding: 0 }}>
        <OrderPageSubTable
          data={row.subRows.map((r: { original: any }) => r.original)}
        />
      </td>
    </tr>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <ReusableTable
      columns={columns}
      data={data.data}
      searchPlaceholder="Search orders..."
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
      // subRowColumns={orderItemColumns}
      // filterKey="status"
      // filterLabel="Status"
      renderSubRows={renderSubRows}
    />
  );
}
