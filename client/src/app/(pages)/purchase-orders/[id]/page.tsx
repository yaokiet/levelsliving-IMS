'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PurchaseOrderWithDetails } from '@/types/purchase-order';
import { getPurchaseOrderWithDetails } from '@/lib/api/purchaseOrderApi';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Printer, Edit } from 'lucide-react';
import Link from 'next/link';

export default function PurchaseOrderDetailPage() {
  const params = useParams();
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrderWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const id = typeof params.id === 'string' ? parseInt(params.id) : null;

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-SG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
              <Link href="/purchase-orders">
                <Button>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Purchase Orders
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link href="/purchase-orders">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Purchase Orders
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Purchase Order Document */}
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-0">
          {/* Document Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-white/20 p-2 rounded">
                    <div className="text-2xl font-bold">L</div>
                  </div>
                  <h1 className="text-2xl font-bold">Levels Living</h1>
                </div>
                <p className="text-blue-100">Inventory Management System</p>
              </div>
              <div className="text-right">
                <h2 className="text-3xl font-bold mb-1">PURCHASE ORDER</h2>
                <p className="text-blue-100">PO #{purchaseOrder.id.toString().padStart(4, '0')}</p>
              </div>
            </div>
          </div>

          {/* Document Body */}
          <div className="p-8 space-y-8">
            {/* Order Info & Addresses */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Order Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Order Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="font-medium">{formatDate(purchaseOrder.order_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created By:</span>
                    <span className="font-medium">{purchaseOrder.user?.full_name || `User ${purchaseOrder.user_id}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                </div>
              </div>

              {/* Supplier Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Supplier</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {purchaseOrder.supplier?.name || `Supplier ${purchaseOrder.supplier_id}`}
                  </h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    {purchaseOrder.supplier?.description && (
                      <p><span className="font-medium">Description:</span> {purchaseOrder.supplier.description}</p>
                    )}
                    {purchaseOrder.supplier?.email && (
                      <p><span className="font-medium">Email:</span> {purchaseOrder.supplier.email}</p>
                    )}
                    {purchaseOrder.supplier?.contact_number && (
                      <p><span className="font-medium">Phone:</span> {purchaseOrder.supplier.contact_number}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Items Placeholder */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Items</h3>
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <p className="text-gray-600 mb-2">Items data not available</p>
                <p className="text-sm text-gray-500">
                  The purchase order items require additional API endpoints to display full details.
                </p>
              </div>
            </div>

            {/* Notes/Terms */}
            <div className="border-t pt-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Terms & Conditions</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>• Payment terms: Net 30 days from invoice date</p>
                <p>• Delivery should be made to the address specified above</p>
                <p>• Please include this PO number on all correspondence and invoices</p>
                <p>• Goods remain the property of supplier until payment is received in full</p>
              </div>
            </div>
          </div>

          {/* Document Footer */}
          <div className="bg-gray-50 p-6 text-center text-sm text-gray-600">
            <p>This is an electronically generated purchase order and does not require a signature.</p>
            <p className="mt-1">For any queries, please contact us at procurement@levelsliving.com</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
