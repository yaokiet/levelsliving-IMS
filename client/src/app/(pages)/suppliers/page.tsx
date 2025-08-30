"use client";

import React, { useState } from "react";
import SupplierPageTable from "@/components/table/supplier/supplier-page-table";
import { ReusableDialog } from "@/components/table/reusable/reusable-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// This is the main page export
export default function SuppliersPage() {
  // Dialog form state - matching backend schema
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [email, setEmail] = useState("")
  const [contact_number, setContact_number] = useState("")

  const handleAddSupplier = () => {
    // Validate required fields
    if (!name.trim()) {
      alert("Supplier name is required!")
      return
    }

    // Create supplier object matching backend schema
    const supplierData = {
      name: name.trim(),
      description: description.trim() || undefined,
      email: email.trim() || undefined,
      contact_number: contact_number.trim() || undefined
    }

    // Handle adding supplier logic here
    console.log("Adding supplier:", supplierData)
    
    // Reset form
    setName("")
    setDescription("")
    setEmail("")
    setContact_number("")
    
    // You can add the supplier to the data array or make an API call
    // For now, just show an alert
    alert(`Supplier "${name}" added successfully!`)
  }

  return (
    <div className="container mx-auto py-10 px-6">
      <div className="flex gap-4 mb-6">
        <ReusableDialog
          buttonText="Add Supplier"
          dialogTitle="Add New Supplier"
          dialogDescription="Enter supplier details below."
          cancelButtonText="Cancel"
          confirmButtonText="Add Supplier"
          onConfirm={handleAddSupplier}
        >
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="supplier-name">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="supplier-name" 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)}
                placeholder="Enter supplier name (required)"
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="supplier-description">Description</Label>
              <Input 
                id="supplier-description" 
                type="text" 
                value={description} 
                onChange={e => setDescription(e.target.value)}
                placeholder="Enter supplier description (optional)"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="supplier-contact">Contact Number</Label>
              <Input 
                id="supplier-contact" 
                type="text" 
                value={contact_number} 
                onChange={e => setContact_number(e.target.value)}
                placeholder="Enter contact number (optional)"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="supplier-email">Email</Label>
              <Input 
                id="supplier-email" 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter email address (optional)"
              />
            </div>
          </div>
        </ReusableDialog>
      </div>
      
      <SupplierPageTable />
    </div>
  );
}
