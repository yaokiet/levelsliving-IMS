"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Table } from "@tanstack/react-table"

interface TableSearchProps<TData> {
  table: Table<TData>
  searchKey: string
  placeholder?: string
  className?: string
}

export function DataTableSearch<TData>({
  table,
  searchKey,
  placeholder = "Search...", // Placeholder text, only used if not provided
  className = "max-w-sm"
}: TableSearchProps<TData>) {
  return (
    <Input
      placeholder={placeholder}
      value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
      onChange={(event) => 
        table.getColumn(searchKey)?.setFilterValue(event.target.value)
      }
      className={className}
    />
  )
}
