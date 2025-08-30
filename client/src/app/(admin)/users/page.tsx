"use client";

import React from "react";
import UsersTable from "@/components/table/users/users-table";

// This is the main page export
export default function UserPage() {

  return (
    <div className="container mx-auto py-10 px-6">
      <UsersTable />
    </div>
  );
}
