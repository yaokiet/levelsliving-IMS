'use client';

import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import type { AgGridReactProps } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
// Register all Community features

ModuleRegistry.registerModules([AllCommunityModule]);

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

type DataTableProps = {
  rowData: any[];
  columnDefs: ColDef[];
  height?: number;
  defaultColDef?: ColDef;
} & Omit<AgGridReactProps, "rowData" | "columnDefs" | "defaultColDef">;

export const DataTable: React.FC<DataTableProps> = ({
  rowData,
  columnDefs,
  height = 400,
  defaultColDef,
  ...rest
}) => {
  const memoDefaultColDef = useMemo(
    () =>
      defaultColDef || {
        filter: true,
        floatingFilter: true,
      },
    [defaultColDef]
  );

  return (
    <div className="ag-theme-quartz" style={{ height }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={memoDefaultColDef}
        {...rest}
      />
    </div>
  );
};