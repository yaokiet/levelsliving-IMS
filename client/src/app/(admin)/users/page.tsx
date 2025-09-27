"use client";

import React from "react";
import UsersTable from "@/components/table/users/users-table";
import { UserAddModal } from "@/components/ui/user/user-add-modal";

// This is the main page export
export default function UserPage() {

  return (
    <div className="container mx-auto py-10 px-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Users</h2>
        <UserAddModal
          onCreated={() => {
            // Add logic to refresh the table after creating a user
          }}
          dialogTitle="Create New User"
          buttonName="Create User"
          confirmButtonText="Create User"
        />
      </div>
      <UsersTable />
    </div>
  );
}
