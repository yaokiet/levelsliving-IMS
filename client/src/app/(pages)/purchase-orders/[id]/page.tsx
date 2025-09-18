'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PurchaseOrderWithDetails } from '@/types/purchase-order';
import { getPurchaseOrderWithDetails } from '@/lib/api/purchaseOrderApi';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PurchaseOrderDocument } from '@/components/ui/purchase-order/purchase-order-document';
import { PurchaseOrderPdfActions } from '@/components/ui/purchase-order/purchase-order-pdf-actions';

export default function PurchaseOrderDetailPage() {
  const params = useParams();
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrderWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load purchase order');
      } finally {
        setLoading(false);
      }
    };

    loadPurchaseOrder();
  }, [id]);

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
        <div></div> {/* Empty div to maintain layout */}
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
