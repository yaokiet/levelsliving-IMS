"use client"

import React, { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface DataTableSearchProps {
  value: string
  onSearch: (value: string) => void
  placeholder?: string
}

export function DataTableSearch({
  value,
  onSearch,
  placeholder = "Search..."
}: DataTableSearchProps) {
  const [input, setInput] = useState(value)

  // Keep local input in sync if parent resets value
  useEffect(() => {
    setInput(value)
  }, [value])

  return (
    <div className="flex gap-2">
      <Input
        placeholder={placeholder}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter") {
            onSearch(input)
          }
        }}
        className="max-w-sm"
        type="text"
      />
      <Button onClick={() => onSearch(input)}>
        Search
      </Button>
    </div>
  )
}