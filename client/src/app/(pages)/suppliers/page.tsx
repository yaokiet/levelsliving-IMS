"use client";

import React, { useState } from "react";
import SupplierPageTable from "@/components/table/supplier/supplier-page-table";
import { ReusableDialog } from "@/components/table/reusable/reusable-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

function SuppliersPageContent() {
  return (
    <div className="container mx-auto py-10 px-6">
      <div className="flex gap-4 mb-6">
        <AddSupplierDialog />
      </div>
      
      <SupplierPageTable />
    </div>
  );
}

function AddSupplierDialog() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [email, setEmail] = useState("")
  const [contact_number, setContact_number] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleAddSupplier = async () => {
    // Validate required fields
    if (!name.trim()) {
      alert("Supplier name is required!")
      return
    }

    setIsLoading(true)
    
    try {
      // This would use the context, but for now let's keep the direct API call
      const { createSupplier } = await import("@/lib/api/supplierApi");
      
      const supplierData = {
        name: name.trim(),
        description: description.trim() || undefined,
        email: email.trim() || undefined,
        contact_number: contact_number.trim() || undefined
      }

      await createSupplier(supplierData)
      
      // Reset form
      setName("")
      setDescription("")
      setEmail("")
      setContact_number("")
      
      alert(`Supplier "${name}" added successfully!`)
      // Trigger a page refresh to update the table
      window.location.reload()
    } catch (error) {
      console.error("Error creating supplier:", error)
      alert("Failed to create supplier. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ReusableDialog
      buttonText="Add Supplier"
      dialogTitle="Add New Supplier"
      dialogDescription="Enter supplier details below."
      cancelButtonText="Cancel"
      confirmButtonText={isLoading ? "Adding..." : "Add Supplier"}
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
  )
}

// This is the main page export
export default function SuppliersPage() {
  return (
    <SuppliersPageContent />
  );
}
