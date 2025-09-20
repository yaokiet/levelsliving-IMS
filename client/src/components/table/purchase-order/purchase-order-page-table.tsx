import { useState, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react'
import { PurchaseOrderTableRow } from "@/types/purchase-order"
import { createColumns } from "./purchase-order-page-columns"
import { ReusableTable } from "@/components/table/reusable/reusable-table"
import { getPurchaseOrdersForTable } from "@/lib/api/purchaseOrderApi"
import { getFilterableColumns } from "@/lib/utils"

export interface PurchaseOrderTableRef {
  refreshData: () => Promise<void>
}

const PurchaseOrderPageTable = forwardRef<PurchaseOrderTableRef>((props, ref) => {
  const [data, setData] = useState<PurchaseOrderTableRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const purchaseOrders = await getPurchaseOrdersForTable()
      console.log("Fetched purchase orders:", purchaseOrders)
      setData(purchaseOrders)
    } catch (error) {
      console.error("Error fetching purchase orders:", error)
      if (error instanceof Error) {
        if (error.message.includes('Not authenticated') || error.message.includes('Session expired')) {
          setError('Please log in to view purchase orders')
        } else {
          setError(error.message)
        }
      } else {
        setError("Failed to load purchase orders. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Create columns
  const columns = createColumns()

  const filterableColumns = useMemo(
    () => getFilterableColumns(columns),
    [columns]
  )

  useEffect(() => {
    fetchPurchaseOrders()
  }, [])

  // Expose the refresh function to parent components
  useImperativeHandle(ref, () => ({
    refreshData: fetchPurchaseOrders
  }))
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <div className="text-lg mt-2">Loading purchase orders...</div>
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
      searchPlaceholder="Search purchase orders..."
      showViewOptions={true}
      showPagination={true}
    />
  )
})

PurchaseOrderPageTable.displayName = 'PurchaseOrderPageTable'

export default PurchaseOrderPageTable