"use client"

import { SectionCards } from "@/components/sample/section-cards";
import TableSection from "../../components/table/table-section";
import LowQuantityStock, { LowStockItem } from "@/components/sample/low-quantity-stock";
import { SalesPurchaseChart } from "@/components/chart/sales-purchase-chart";

// sample imports for dialog
import { useState } from "react";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DialogWithTrigger } from "@/components/table/reusable/dialog-with-trigger";

export default function Page() {
  const lowStockItems: LowStockItem[] = [
    { name: "Mahogany", remaining: 10, status: "Low" },
    { name: "Teak", remaining: 15, status: "Medium" },
    { name: "Oak", remaining: 15, status: "Medium" },
  ];

  // sample state for dialog form
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");

  // sample handler for dialog form
  const handleConfirm = () => {
    alert(`Name: ${name}\nQuantity: ${qty}`);
  };

  return (
    <div>
      <h2 className="scroll-m-20 border-b pb-2 px-4 text-3xl font-semibold tracking-tight first:mt-0">
        Dashboard
      </h2>
      <div className="flex flex-1 flex-col">
        {/* sample dialog button */}
        <DialogWithTrigger
          buttonText="Open Dialog"
          dialogTitle="Edit Item"
          dialogDescription="Update the details below."
          cancelButtonText="Cancel"
          confirmButtonText="Save Changes"
          onConfirm={handleConfirm}
        >
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" type="text"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Quantity</Label>
              <Input id="username-1" type="text"
                value={qty}
                onChange={e => setQty(e.target.value)}
              />
            </div>
          </div>
        </DialogWithTrigger>
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
          </div>
          <div className="flex flex-row justify-between items-center mt-8 gap-4">
            <div className="flex justify-start mr-4">
              <LowQuantityStock items={lowStockItems} />
            </div>
            <div className="flex justify-center p-2 w-full">
              <SalesPurchaseChart />
            </div>
            <div className="flex justify-start mr-4">
              <LowQuantityStock items={lowStockItems} />
            </div>
          </div>
          <div>
            <TableSection />
          </div>
          {/* Center SalesPurchaseChart and align LowQuantityStock to the left with reduced gap */}
        </div>
      </div>
    </div>
  );
}
