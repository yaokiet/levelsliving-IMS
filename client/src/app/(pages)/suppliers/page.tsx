"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReusableTable } from "@/components/table/reusable/reusable-table";
import { DataTableColumnHeader } from "@/components/table/reusable/data-table-column-header";
import { ReusableDialog } from "@/components/table/reusable/reusable-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Download, Filter } from "lucide-react";

// Define the Supplier type
type Supplier = {
  id: string
  supplierName: string
  product: string
  contactNumber: string
  email: string
  type: string
  onTheWay: string | number
}

// Sample data for the suppliers table
const suppliersData: Supplier[] = [
  { id: "1", supplierName: "Richard Martin", product: "Kit Kat", contactNumber: "7687764556", email: "richard@gmail.com", type: "Taking Return", onTheWay: "13" },
  { id: "2", supplierName: "Tom Homan", product: "Maaza", contactNumber: "9867545368", email: "tomhoman@gmail.com", type: "Taking Return", onTheWay: "-" },
  { id: "3", supplierName: "Veandir", product: "Dairy Milk", contactNumber: "9867545566", email: "veandier@gmail.com", type: "Not Taking Return", onTheWay: "-" },
  { id: "4", supplierName: "Charin", product: "Tomato", contactNumber: "9267545457", email: "charin@gmail.com", type: "Taking Return", onTheWay: "12" },
  { id: "5", supplierName: "Hoffman", product: "Milk Bikis", contactNumber: "9367546531", email: "hoffman@gmail.com", type: "Taking Return", onTheWay: "-" },
  { id: "6", supplierName: "Fainden Juke", product: "Marie Gold", contactNumber: "9667545982", email: "fainden@gmail.com", type: "Not Taking Return", onTheWay: "9" },
  { id: "7", supplierName: "Martin", product: "Saffola", contactNumber: "9867545457", email: "martin@gmail.com", type: "Taking Return", onTheWay: "-" },
  { id: "8", supplierName: "Joe Nike", product: "Good day", contactNumber: "9567545769", email: "joenike@gmail.com", type: "Taking Return", onTheWay: "-" },
  { id: "9", supplierName: "Dender Luke", product: "Apple", contactNumber: "9667545980", email: "dender@gmail.com", type: "Not Taking Return", onTheWay: "7" },
  { id: "10", supplierName: "Joe Nike", product: "Good day", contactNumber: "9567545769", email: "joenike@gmail.com", type: "Taking Return", onTheWay: "-" }
];

// Define the columns for the suppliers table
const suppliersColumns: ColumnDef<Supplier>[] = [
  // Select checkbox column
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // Supplier Name column
  {
    accessorKey: "supplierName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supplier Name" />
    ),
  },
  // Product column
  {
    accessorKey: "product",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
  },
  // Contact Number column
  {
    accessorKey: "contactNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact Number" />
    ),
  },
  // Email column
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  // Type column with color coding
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("type") as string;
      const isTakingReturn = value.toLowerCase().includes("taking return");
      const colorClass = isTakingReturn ? "text-green-500" : "text-red-500";
      return (
        <span className={`font-medium ${colorClass}`}>
          {value}
        </span>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  // On the way column
  {
    accessorKey: "onTheWay",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="On the way" />
    ),
  },
  // Actions column
  {
    id: "actions",
    cell: ({ row }) => {
      const supplier = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(supplier.supplierName)}
            >
              Copy Supplier Name
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit supplier</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              Remove supplier
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function SuppliersPage() {
  // Sample dialog state
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [product, setProduct] = useState("");

  const handleConfirm = () => {
    alert(`Name: ${name}\nContact: ${contactNumber}\nEmail: ${email}\nProduct: ${product}`);
    // Reset form fields
    setName("");
    setContactNumber("");
    setEmail("");
    setProduct("");
  };

  return (
    <div className="p-4">
      <h2 className="scroll-m-20 pb-6 text-3xl font-semibold tracking-tight">
        Suppliers
      </h2>
      
      <div className="bg-card shadow-lg rounded-lg">
        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <ReusableDialog
              buttonText="Add Supplier"
              dialogTitle="Add New Supplier"
              dialogDescription="Enter supplier details below."
              cancelButtonText="Cancel"
              confirmButtonText="Add Supplier"
              onConfirm={handleConfirm}
            >
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="contact">Contact Number</Label>
                  <Input 
                    id="contact" 
                    type="text" 
                    value={contactNumber} 
                    onChange={e => setContactNumber(e.target.value)} 
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="product">Product</Label>
                  <Input 
                    id="product" 
                    type="text" 
                    value={product} 
                    onChange={e => setProduct(e.target.value)} 
                  />
                </div>
              </div>
            </ReusableDialog>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download all
            </Button>
          </div>
          
          <ReusableTable
            columns={suppliersColumns}
            data={suppliersData}
            searchKey="supplierName"
            searchPlaceholder="Search suppliers..."
            showViewOptions={true}
            showPagination={true}
          />
        </div>
      </div>
    </div>
  );
}
