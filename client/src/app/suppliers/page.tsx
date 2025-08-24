"use client";
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/sidebar/app-sidebar";
import { ReusableTable } from "@/components/table/reusable/reusable-table";
import { ColumnDef } from "@tanstack/react-table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";

export default function SuppliersPage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-black">
        <AppSidebar />
        <main className="flex-1 w-full h-full p-8">
          <h1 className="text-2xl font-bold mb-6">Suppliers</h1>
          <div className="rounded-xl border bg-card p-6 shadow-2xl w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow">
                      Add Supplier
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>New Supplier</DialogTitle>
                    </DialogHeader>
                    <form className="flex flex-col gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Supplier Name</label>
                        <input type="text" className="border rounded-lg px-4 py-2 w-full" placeholder="Enter supplier name" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Product</label>
                        <input type="text" className="border rounded-lg px-4 py-2 w-full" placeholder="Enter product" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select className="border rounded-lg px-4 py-2 w-full">
                          <option value="">Select product category</option>
                          <option value="Food">Food</option>
                          <option value="Beverage">Beverage</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Buying Price</label>
                        <input type="number" className="border rounded-lg px-4 py-2 w-full" placeholder="Enter buying price" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Contact Number</label>
                        <input type="text" className="border rounded-lg px-4 py-2 w-full" placeholder="Enter supplier contact number" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Type</label>
                        <div className="flex gap-2">
                          <button type="button" className="border rounded-lg px-4 py-2 w-full">Not taking return</button>
                          <button type="button" className="border rounded-lg px-4 py-2 w-full">Taking return</button>
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <button type="button" className="border rounded-lg px-4 py-2">Discard</button>
                        </DialogClose>
                        <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">Add Supplier</button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
                <button className="border border-input px-4 py-2 rounded-lg bg-background">
                  Filters
                </button>
                <button className="border border-input px-4 py-2 rounded-lg bg-background">
                  Download all
                </button>
              </div>
            </div>
            <div className="overflow-x-auto w-full">
              {/* Supplier table columns and data inline */}
              {
                (() => {
                  type Supplier = {
                    supplierName: string;
                    product: string;
                    contactNumber: string;
                    email: string;
                    type: "Taking Return" | "Not Taking Return";
                    onTheWay: string | number;
                  };

                  const supplierTableColumns: ColumnDef<Supplier>[] = [
                    { accessorKey: "supplierName", header: "Supplier Name" },
                    { accessorKey: "product", header: "Product" },
                    { accessorKey: "contactNumber", header: "Contact Number" },
                    { accessorKey: "email", header: "Email" },
                    {
                      accessorKey: "type",
                      header: "Type",
                      cell: ({ row }) => (
                        <span className={row.getValue("type") === "Taking Return" ? "text-green-600" : "text-red-600"}>
                          {row.getValue("type")}
                        </span>
                      ),
                    },
                    { accessorKey: "onTheWay", header: "On the way" },
                  ];

                  const supplierTableData: Supplier[] = [
                    { supplierName: "Richard Martin", product: "Kit Kat", contactNumber: "7687764556", email: "richard@gmail.com", type: "Taking Return", onTheWay: 13 },
                    { supplierName: "Tom Homan", product: "Maaza", contactNumber: "9867545368", email: "tomhoman@gmail.com", type: "Taking Return", onTheWay: "-" },
                    { supplierName: "Veandir", product: "Dairy Milk", contactNumber: "9867545566", email: "veandir@gmail.com", type: "Not Taking Return", onTheWay: "-" },
                    { supplierName: "Charin", product: "Tomato", contactNumber: "9267545457", email: "charin@gmail.com", type: "Taking Return", onTheWay: 12 },
                  ];

                  return (
                    <ReusableTable
                      columns={supplierTableColumns}
                      data={supplierTableData}
                      searchKey="supplierName"
                      searchPlaceholder="Search suppliers..."
                      showViewOptions={true}
                      showPagination={true}
                    />
                  );
                })()
              }
            </div>
            <div className="flex justify-between items-center mt-4">
              <button className="border border-input px-4 py-2 rounded-lg bg-background">
                Previous
              </button>
              <span>Page 1 of 10</span>
              <button className="border border-input px-4 py-2 rounded-lg bg-background">
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
