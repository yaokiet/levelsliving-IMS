'use client'

import { useState, useEffect } from 'react'
import { Supplier, mockSuppliers } from "@/types/supplier"
import { columns } from "./supplier-page-columns"
import { ReusableTable } from "@/components/table/reusable/reusable-table"
import { ReusableDialog } from "@/components/table/reusable/reusable-dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function SupplierPageTable() {
  const [data, setData] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  
  // Dialog form state
  const [name, setName] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [email, setEmail] = useState("")
  const [product, setProduct] = useState("")

  const handleAddSupplier = () => {
    // Handle adding supplier logic here
    console.log("Adding supplier:", { name, contactNumber, email, product })
    
    // Reset form
    setName("")
    setContactNumber("")
    setEmail("")
    setProduct("")
    
    // You can add the supplier to the data array or make an API call
    // For now, just show an alert
    alert(`Supplier "${name}" added successfully!`)
  }

  useEffect(() => {
    setData(mockSuppliers)
    setLoading(false)
  }, [])

// Fetch suppliers when the component mounts
//   useEffect(() => {
//       try {
//         getAllSuppliers().then(suppliers => {
//           console.log("Fetched suppliers:", suppliers)
//           setData(suppliers)
//           setLoading(false)
//         })
//       }
//       catch (error) {
//         console.error("Error fetching suppliers:", error)
//       }

//     }, []);
  
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
              <Label htmlFor="supplier-name">Name</Label>
              <Input 
                id="supplier-name" 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)}
                placeholder="Enter supplier name"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="supplier-contact">Contact Number</Label>
              <Input 
                id="supplier-contact" 
                type="text" 
                value={contactNumber} 
                onChange={e => setContactNumber(e.target.value)}
                placeholder="Enter contact number"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="supplier-email">Email</Label>
              <Input 
                id="supplier-email" 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter email address"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="supplier-product">Product</Label>
              <Input 
                id="supplier-product" 
                type="text" 
                value={product} 
                onChange={e => setProduct(e.target.value)}
                placeholder="Enter main product"
              />
            </div>
          </div>
        </ReusableDialog>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <ReusableTable 
          columns={columns} 
          data={data} 
          searchKey="supplierName" 
          searchPlaceholder="Filter suppliers by name"
          showViewOptions={true}
          showPagination={true}
        />
      )}
    </div>
  )
}
