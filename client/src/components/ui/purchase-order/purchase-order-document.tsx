'use client';

import { PurchaseOrderWithDetails } from '@/types/purchase-order';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDateLong } from '@/lib/utils';

interface PurchaseOrderDocumentProps {
  purchaseOrder: PurchaseOrderWithDetails;
  showActions?: boolean;
  className?: string;
}

export function PurchaseOrderDocument({ 
  purchaseOrder, 
  showActions = true,
  className = ""
}: PurchaseOrderDocumentProps) {

  return (
    <Card className={`max-w-4xl mx-auto ${className}`}>
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
              <h2 className="text-3xl font-bold mb-1 text-white drop-shadow-lg">PURCHASE ORDER</h2>
              <p className="text-blue-100">PO #{purchaseOrder.id.toString().padStart(4, '0')}</p>
            </div>
          </div>
        </div>

        {/* Document Body */}
        <div className="p-8 space-y-8 bg-white dark:bg-gray-900">
          {/* Order Info & Addresses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Order Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Order Date:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{formatDateLong(purchaseOrder.order_date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Created By:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{purchaseOrder.user?.full_name || `User ${purchaseOrder.user_id}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <Badge variant="secondary">{purchaseOrder.status}</Badge>
                </div>
              </div>
            </div>

            {/* Supplier Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Supplier</h3>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {purchaseOrder.supplier_name || purchaseOrder.supplier?.name || `Supplier ${purchaseOrder.supplier_id}`}
                </h4>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  {(purchaseOrder.supplier_description || purchaseOrder.supplier?.description) && (
                    <p><span className="font-medium">Description:</span> {purchaseOrder.supplier_description || purchaseOrder.supplier?.description}</p>
                  )}
                  {(purchaseOrder.supplier_email || purchaseOrder.supplier?.email) && (
                    <p><span className="font-medium">Email:</span> {purchaseOrder.supplier_email || purchaseOrder.supplier?.email}</p>
                  )}
                  {(purchaseOrder.supplier_phone || purchaseOrder.supplier?.contact_number) && (
                    <p><span className="font-medium">Phone:</span> {purchaseOrder.supplier_phone || purchaseOrder.supplier?.contact_number}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Items</h3>
            {purchaseOrder.po_items && purchaseOrder.po_items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">
                        SKU
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">
                        Item Name
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">
                        Variant
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">
                        Quantity
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900">
                    {purchaseOrder.po_items.map((item, index) => (
                      <tr key={item.item_id} className={index !== purchaseOrder.po_items.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-mono">
                          {item.sku}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                          {item.item_name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {item.variant}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 text-right font-medium">
                          {item.ordered_qty}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* Summary */}
                <div className="mt-4 flex justify-end">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Total Items: </span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {purchaseOrder.po_items.reduce((sum, item) => sum + item.ordered_qty, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-2">No items found</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  This purchase order does not contain any items.
                </p>
              </div>
            )}
          </div>

          {/* Notes/Terms */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Terms & Conditions</h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <p>• Payment terms: Net 30 days from invoice date</p>
              <p>• Delivery should be made to the address specified above</p>
              <p>• Please include this PO number on all correspondence and invoices</p>
              <p>• Goods remain the property of supplier until payment is received in full</p>
            </div>
          </div>
        </div>

        {/* Document Footer */}
        <div className="bg-gray-50 dark:bg-gray-800 p-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>This is an electronically generated purchase order and does not require a signature.</p>
          <p className="mt-1">For any queries, please contact us at procurement@levelsliving.com</p>
        </div>
      </CardContent>
    </Card>
  );
}
