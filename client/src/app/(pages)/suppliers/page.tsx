"use client";

import { useState } from "react";
import { SuppliersTable } from "@/components/table/suppliers/suppliers-table";
import { Button } from "@/components/ui/button";
import { ReusableDialog } from "@/components/table/reusable/reusable-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Download, Filter } from "lucide-react";

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
          
          <SuppliersTable />
        </div>
      </div>
    </div>
  );
}
