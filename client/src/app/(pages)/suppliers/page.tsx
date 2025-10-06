"use client";

import React, { useState, useRef } from "react";
import SupplierPageTable, { SupplierTableRef } from "@/components/table/supplier/supplier-page-table";
import { DialogWithTrigger } from "@/components/table/reusable/dialog-with-trigger";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createSupplier } from "@/lib/api/supplierApi";
import { toast } from "sonner";

function SuppliersPageContent() {
  const tableRef = useRef<SupplierTableRef>(null)

  return (
    <div className="container mx-auto py-10 px-6">
      <div className="flex gap-4 mb-6">
        <AddSupplierDialog onSupplierAdded={() => tableRef.current?.refreshData()} />
      </div>
      
      <SupplierPageTable ref={tableRef} />
    </div>
  );
}

function AddSupplierDialog({ onSupplierAdded }: { onSupplierAdded?: () => void }) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [email, setEmail] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isFormValid = name.trim().length > 0 && 
                      description.trim().length > 0 && 
                      email.trim().length > 0 && 
                      isValidEmail(email.trim()) &&
                      contactNumber.trim().length > 0;

  const handleAddSupplier = async () => {
    // Clear previous errors
    setError("")
    
    // Validate required fields
    if (!name.trim()) {
      setError("Supplier name is required!")
      return false
    }
    if (!description.trim()) {
      setError("Description is required!")
      return false
    }
    if (!email.trim()) {
      setError("Email is required!")
      return false
    }
    if (!isValidEmail(email.trim())) {
      setError("Please enter a valid email address!")
      return false
    }
    if (!contactNumber.trim()) {
      setError("Contact number is required!")
      return false
    }

    setIsLoading(true)
    
    try {
      const supplierData = {
        name: name.trim(),
        description: description.trim() || undefined,
        email: email.trim() || undefined,
        contact_number: contactNumber.trim() || undefined
      }

      await createSupplier(supplierData)
      
      // Reset form
      setName("")
      setDescription("")
      setEmail("")
      setContactNumber("")
      setError("")
      
      toast.success("Success!", {
        description: `Supplier ${name} added successfully.`,
      });
      // Refresh the table data
      onSupplierAdded?.();
      return true
    } catch (error) {
      console.error("Error creating supplier:", error)
      setError("Failed to create supplier. Please try again.")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DialogWithTrigger
      buttonText="Add Supplier"
      dialogTitle="Add New Supplier"
      dialogDescription="Enter supplier details below."
      cancelButtonText="Cancel"
      confirmButtonText={isLoading ? "Adding..." : "Add Supplier"}
      onConfirm={isFormValid && !isLoading ? handleAddSupplier : undefined}
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
          <Label htmlFor="supplier-description">
            Description <span className="text-red-500">*</span>
          </Label>
          <Input 
            id="supplier-description" 
            type="text" 
            value={description} 
            onChange={e => setDescription(e.target.value)}
            placeholder="Enter supplier description (required)"
            required
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="supplier-contact">
            Contact Number <span className="text-red-500">*</span>
          </Label>
          <Input 
            id="supplier-contact" 
            type="text" 
            value={contactNumber} 
            onChange={e => setContactNumber(e.target.value)}
            placeholder="Enter contact number (required)"
            required
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="supplier-email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input 
            id="supplier-email" 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter email address (required)"
            required
          />
        </div>
        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error}
          </div>
        )}
      </div>
    </DialogWithTrigger>
  )
}

// This is the main page export
export default function SuppliersPage() {
  return (
    <SuppliersPageContent />
  );
}
