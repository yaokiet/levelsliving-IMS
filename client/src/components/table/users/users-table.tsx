'use client'

import { useState, useEffect } from 'react'
import { ReusableTable } from "../reusable/reusable-table"
import { getAllUsers } from "@/lib/api/userApi"
import { User } from "@/types/user"
import { columns } from "./user-page-columns"

export default function UsersTable() {
  const [data, setData] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")


  useEffect(() => {
    setLoading(true)
    try {
      getAllUsers({ q: search, search_columns: ["name"] }).then(res => {
        console.log("Fetched users:", res.data)
        setData(res.data)
        setLoading(false)
      })
    } catch (error) {
      console.error("Error fetching users:", error)
    }
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
          onSearch={setSearch}
        />
      )}
    </>
  )
}
