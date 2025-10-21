import { useState, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react'
import { Supplier } from "@/types/supplier"
import { createColumns } from "./supplier-page-columns"
import { ReusableTable } from "@/components/table/reusable/reusable-table"
import { getAllSuppliers } from "@/lib/api/supplierApi"
import { getFilterableColumns } from "@/lib/utils"

export interface SupplierTableRef {
  refreshData: () => Promise<void>
}

const SupplierPageTable = forwardRef<SupplierTableRef>((props, ref) => {
  const [data, setData] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSuppliers = async () => {
    try {
      setLoading(true)
      setError(null)
      const suppliers = await getAllSuppliers()
      console.log("Fetched suppliers:", suppliers)
      setData(suppliers)
    } catch (error) {
      console.error("Error fetching suppliers:", error)
      setError("Failed to load suppliers. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Create columns with the refresh callback
  const columns = createColumns()

  const filterableColumns = useMemo(
    () => getFilterableColumns(columns),
    [columns]
  )

  useEffect(() => {
    fetchSuppliers()
  }, [])

  // Expose the refresh function to parent components
  useImperativeHandle(ref, () => ({
    refreshData: fetchSuppliers
  }))
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-lg">Loading suppliers...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-2">Error</div>
          <div className="text-sm text-muted-foreground">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <ReusableTable 
      columns={columns} 
      data={data} 
      filterableColumns={filterableColumns}
      searchPlaceholder="Search suppliers..."
      showViewOptions={true}
      showPagination={true}
    />
  )
})

SupplierPageTable.displayName = 'SupplierPageTable'

export default SupplierPageTable
