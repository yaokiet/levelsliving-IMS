'use client'

import { useState, useEffect } from 'react'
import { ReusableTable } from "../reusable/reusable-table"
import { getAllUsers } from "@/lib/api/userApi"
import { User } from "@/types/user"
import { columns } from "./user-page-columns"

export default function UsersTable() {
  const [data, setData] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      getAllUsers().then(users => {
        console.log("Fetched users:", users)
        setData(users)
        setLoading(false)
      })
    }
    catch (error) {
      console.error("Error fetching users:", error)
    }
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
