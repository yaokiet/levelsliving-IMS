'use client';

import React, { useState } from "react";
import type { ColDef } from "ag-grid-community";
import { DataTable } from "./table-component";
import { Button, buttonVariants } from "@/components/ui/button";

const CellActionsButton = (props: any) => (
  <Button
    className={buttonVariants({ variant: "default" })}
    onClick={() => alert(`Action for ${props.data.make} ${props.data.model} clicked!`)}
  >
    Click Me
  </Button>
);

export function MainPageTable() {
  const [rowData] = useState([
    { make: "Toyota", model: "Celica", price: 35000, electric: false },
    { make: "Ford", model: "Mondeo", price: 32000, electric: false },
    { make: "Porsche", model: "Boxster", price: 72000, electric: true },
  ]);

  const columnDefs: ColDef[] = [
    { field: "make" },
    { field: "model" },
    {
      field: "price",
      valueFormatter: (params) => `$${params.value.toLocaleString()}`,
    },
    { field: "electric", headerName: "Electric Vehicle" },
    { field: "actions", cellRenderer: CellActionsButton },
  ];

  return <DataTable rowData={rowData} columnDefs={columnDefs} />;
}