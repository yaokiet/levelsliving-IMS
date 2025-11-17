'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PurchaseOrderWithDetails, PurchaseOrderStatus } from '@/types/purchase-order';
import { getPurchaseOrderWithDetails } from '@/lib/api/purchaseOrderApi';
import { Card, CardContent } from '@/components/ui/card';
import { PurchaseOrderDocument } from '@/components/ui/purchase-order/purchase-order-document';
import { PurchaseOrderPdfActions } from '@/components/ui/purchase-order/purchase-order-pdf-actions';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function PurchaseOrderDetailPage() {
  const params = useParams();
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrderWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<PurchaseOrderStatus>(PurchaseOrderStatus.Pending); // Track the current status

  const id = typeof params.id === 'string' ? parseInt(params.id) : null;

  const handleError = (error: Error) => {
    console.error('PDF operation failed:', error);
    // You can add toast notification here if needed
    // toast.error(error.message);
  };

  useEffect(() => {
    if (!id) return;

    const loadPurchaseOrder = async () => {
      try {
        setLoading(true);
        const po = await getPurchaseOrderWithDetails(id);
        setPurchaseOrder(po);
        setStatus(po.status || PurchaseOrderStatus.Pending); // Set the initial status
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load purchase order');
      } finally {
        setLoading(false);
      }
    };

    loadPurchaseOrder();
  }, [id]);

  const handleStatusChange = async (newStatus: PurchaseOrderStatus) => {
    if (!purchaseOrder) return;

    try {
      setStatus(newStatus); // Optimistically update the status in the UI
      // await updatePOStatus(purchaseOrder.id, newStatus);
      toast.success('Status updated successfully');
    } catch (err) {
      console.error('Failed to update status:', err);
      // Revert the status in case of an error
      setStatus(purchaseOrder.status || PurchaseOrderStatus.Pending);
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading purchase order...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !purchaseOrder) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error: {error || 'Purchase order not found'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header with PDF Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
          {/* Status Dropdown */}
          <div>
            <span className="text-sm font-medium text-gray-600">Status: </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {status.charAt(0).toUpperCase() + status.slice(1)} {/* Capitalize the status */}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {Object.values(PurchaseOrderStatus).map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => handleStatusChange(option as PurchaseOrderStatus)}
                    className={option === status ? 'font-bold text-blue-600' : ''}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)} {/* Capitalize the option */}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex gap-2">
          <PurchaseOrderPdfActions
            purchaseOrder={purchaseOrder}
            onError={handleError}
          />
        </div>
      </div>

      {/* Purchase Order Document */}
      <PurchaseOrderDocument purchaseOrder={purchaseOrder} />
    </div>
  );
}
