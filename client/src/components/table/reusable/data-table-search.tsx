"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Table } from "@tanstack/react-table"

interface DataTableSearchProps<TData> {
  table: Table<TData>
  searchKey: string
  placeholder?: string
}

export function DataTableSearch<TData>({
  table,
  searchKey,
  placeholder = "Search..."
}: DataTableSearchProps<TData>) {
  return (
    <Input
      placeholder={placeholder}
      value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
      onChange={(event) => 
        table.getColumn(searchKey)?.setFilterValue(event.target.value)
      }
      className="max-w-sm"
    />
  )
}
