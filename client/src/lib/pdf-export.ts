import { PurchaseOrderTableRow, PurchaseOrderWithDetails } from '@/types/purchase-order';
import { exportToPDF } from '@/lib/utils';
import { getPurchaseOrderWithDetails } from '@/lib/api/purchaseOrderApi';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: 'SGD',
  }).format(amount);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-SG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function generatePurchaseOrderHTML(purchaseOrder: PurchaseOrderWithDetails): string {
  const formatDateLong = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-SG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Purchase Order #${purchaseOrder.id.toString().padStart(4, '0')}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            font-size: 14px;
            line-height: 1.5;
            color: #1a1a1a;
            background: white;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .document-container {
            max-width: 56rem;
            margin: 0 auto;
            background: white;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          
          /* Document Header */
          .document-header {
            background: linear-gradient(to right, #2563eb, #1d4ed8);
            color: white;
            padding: 2rem;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .header-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            flex-wrap: wrap;
            gap: 1rem;
          }
          
          .company-info {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 0.5rem;
          }
          
          .company-logo {
            background: rgba(255, 255, 255, 0.2);
            padding: 0.5rem;
            border-radius: 0.25rem;
            font-size: 1.5rem;
            font-weight: bold;
          }
          
          .company-name {
            font-size: 1.5rem;
            font-weight: bold;
          }
          
          .company-subtitle {
            color: #bfdbfe;
            font-size: 0.875rem;
          }
          
          .po-title-section {
            text-align: right;
          }
          
          .po-title {
            font-size: 1.875rem;
            font-weight: bold;
            margin-bottom: 0.25rem;
            color: white;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          }
          
          .po-number {
            color: #bfdbfe;
          }
          
          /* Document Body */
          .document-body {
            padding: 2rem;
            background: white;
            color: #1a1a1a;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin-bottom: 2rem;
          }
          
          .info-section {
            margin-bottom: 2rem;
          }
          
          .section-title {
            font-size: 1.125rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: #1a1a1a;
          }
          
          .order-info {
            font-size: 0.875rem;
          }
          
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
          }
          
          .info-label {
            color: #6b7280;
          }
          
          .info-value {
            font-weight: 500;
            color: #1a1a1a;
          }
          
          .status-badge {
            background: #f3f4f6;
            color: #374151;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 500;
          }
          
          .supplier-card {
            background: #f8fafc;
            padding: 1rem;
            border-radius: 0.5rem;
          }
          
          .supplier-name {
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 0.5rem;
          }
          
          .supplier-details {
            font-size: 0.875rem;
            color: #6b7280;
          }
          
          .supplier-details p {
            margin-bottom: 0.25rem;
          }
          
          .supplier-details .detail-label {
            font-weight: 500;
          }
          
          .items-section {
            margin-bottom: 2rem;
          }
          
          .items-placeholder {
            background: #f8fafc;
            padding: 2rem;
            border-radius: 0.5rem;
            text-align: center;
          }
          
          .items-placeholder p:first-child {
            color: #6b7280;
            margin-bottom: 0.5rem;
          }
          
          .items-placeholder p:last-child {
            font-size: 0.875rem;
            color: #9ca3af;
          }
          
          .terms-section {
            border-top: 1px solid #e5e7eb;
            padding-top: 2rem;
            margin-bottom: 2rem;
          }
          
          .terms-list {
            font-size: 0.875rem;
            color: #6b7280;
          }
          
          .terms-list p {
            margin-bottom: 0.5rem;
          }
          
          .document-footer {
            background: #f8fafc;
            padding: 1.5rem;
            text-align: center;
            font-size: 0.875rem;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
          }
          
          .document-footer p {
            margin-bottom: 0.25rem;
          }
          
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            .document-container {
              box-shadow: none;
              max-width: none;
            }
            
            .document-header {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
          
          @page {
            margin: 0.5in;
            size: A4;
          }
        </style>
      </head>
      <body>
        <div class="document-container">
          <!-- Document Header -->
          <div class="document-header">
            <div class="header-content">
              <div>
                <div class="company-info">
                  <div class="company-logo">L</div>
                  <h1 class="company-name">Levels Living</h1>
                </div>
                <p class="company-subtitle">Inventory Management System</p>
              </div>
              <div class="po-title-section">
                <h2 class="po-title">PURCHASE ORDER</h2>
                <p class="po-number">PO #${purchaseOrder.id.toString().padStart(4, '0')}</p>
              </div>
            </div>
          </div>

          <!-- Document Body -->
          <div class="document-body">
            <!-- Order Info & Supplier Information -->
            <div class="info-grid">
              <!-- Order Information -->
              <div>
                <h3 class="section-title">Order Information</h3>
                <div class="order-info">
                  <div class="info-row">
                    <span class="info-label">Order Date:</span>
                    <span class="info-value">${formatDateLong(purchaseOrder.order_date)}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Created By:</span>
                    <span class="info-value">${purchaseOrder.user?.full_name || `User ${purchaseOrder.user_id}`}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Status:</span>
                    <span class="status-badge">Pending</span>
                  </div>
                </div>
              </div>

              <!-- Supplier Information -->
              <div>
                <h3 class="section-title">Supplier</h3>
                <div class="supplier-card">
                  <h4 class="supplier-name">${purchaseOrder.supplier?.name || `Supplier ${purchaseOrder.supplier_id}`}</h4>
                  <div class="supplier-details">
                    ${purchaseOrder.supplier?.description ? `<p><span class="detail-label">Description:</span> ${purchaseOrder.supplier.description}</p>` : ''}
                    ${purchaseOrder.supplier?.email ? `<p><span class="detail-label">Email:</span> ${purchaseOrder.supplier.email}</p>` : ''}
                    ${purchaseOrder.supplier?.contact_number ? `<p><span class="detail-label">Phone:</span> ${purchaseOrder.supplier.contact_number}</p>` : ''}
                  </div>
                </div>
              </div>
            </div>

            <!-- Items Section -->
            <div class="info-section">
              <h3 class="section-title">Items</h3>
              <div class="items-placeholder">
                <p>Items data not available</p>
                <p>The purchase order items require additional API endpoints to display full details.</p>
              </div>
            </div>

            <!-- Terms & Conditions -->
            <div class="terms-section">
              <h3 class="section-title">Terms & Conditions</h3>
              <div class="terms-list">
                <p>• Payment terms: Net 30 days from invoice date</p>
                <p>• Delivery should be made to the address specified above</p>
                <p>• Please include this PO number on all correspondence and invoices</p>
                <p>• Goods remain the property of supplier until payment is received in full</p>
              </div>
            </div>
          </div>

          <!-- Document Footer -->
          <div class="document-footer">
            <p>This is an electronically generated purchase order and does not require a signature.</p>
            <p>For any queries, please contact us at procurement@levelsliving.com</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function generateSummaryHTML(purchaseOrders: PurchaseOrderTableRow[]): string {
  const tableRows = purchaseOrders.map(po => `
    <tr>
      <td style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0;">#${po.id.toString().padStart(4, '0')}</td>
      <td style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0;">${formatDate(po.order_date)}</td>
      <td style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0;">${po.supplier_name}</td>
      <td style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0;">${po.user_name}</td>
      <td style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0; text-align: center;">${po.total_items}</td>
      <td style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0; text-align: right;">${formatCurrency(po.total_cost)}</td>
      <td style="padding: 0.75rem; border-bottom: 1px solid #e2e8f0;">
        <span style="background: #dbeafe; color: #1e40af; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600;">${po.status}</span>
      </td>
    </tr>
  `).join('');

  const totalItems = purchaseOrders.reduce((sum, po) => sum + po.total_items, 0);
  const totalCost = purchaseOrders.reduce((sum, po) => sum + po.total_cost, 0);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Purchase Orders Summary</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 2rem;
            color: #1f2937;
            background: #f9fafb;
            line-height: 1.6;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .header h1 {
            font-size: 2.25rem;
            font-weight: 700;
            margin: 0 0 0.5rem 0;
          }
          
          .header p {
            font-size: 1.125rem;
            margin: 0;
            opacity: 0.9;
          }
          
          .summary-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            padding: 2rem;
            background: #f8fafc;
            border-bottom: 1px solid #e2e8f0;
          }
          
          .stat-card {
            background: white;
            padding: 1.5rem;
            border-radius: 0.5rem;
            text-align: center;
            border: 1px solid #e2e8f0;
          }
          
          .stat-value {
            font-size: 2rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 0.5rem;
          }
          
          .stat-label {
            color: #6b7280;
            font-size: 0.875rem;
            font-weight: 500;
          }
          
          .table-container {
            padding: 2rem;
          }
          
          .table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 0.5rem;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          
          .table th {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem;
            text-align: left;
            font-weight: 600;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .footer {
            text-align: center;
            padding: 2rem;
            color: #6b7280;
            font-size: 0.875rem;
            border-top: 1px solid #e2e8f0;
            background: #f8fafc;
          }
          
          @media print {
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            .container {
              max-width: none;
              margin: 0;
              border-radius: 0;
              box-shadow: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Purchase Orders Summary</h1>
            <p>Generated on ${new Date().toLocaleDateString('en-SG')}</p>
          </div>
          
          <div class="summary-stats">
            <div class="stat-card">
              <div class="stat-value">${purchaseOrders.length}</div>
              <div class="stat-label">Total Orders</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${totalItems}</div>
              <div class="stat-label">Total Items</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${formatCurrency(totalCost)}</div>
              <div class="stat-label">Total Value</div>
            </div>
          </div>
          
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>PO Number</th>
                  <th>Order Date</th>
                  <th>Supplier</th>
                  <th>Created By</th>
                  <th style="text-align: center;">Items</th>
                  <th style="text-align: right;">Total Cost</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
          </div>
          
          <div class="footer">
            <p>Levels Living Inventory Management System</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function exportPurchaseOrderToPDF(purchaseOrder: PurchaseOrderTableRow) {
  try {
    // Fetch detailed purchase order data
    const detailedPO = await getPurchaseOrderWithDetails(purchaseOrder.id);
    const htmlContent = generatePurchaseOrderHTML(detailedPO);
    const filename = `purchase-order-${purchaseOrder.id}`;
    exportToPDF(htmlContent, filename);
  } catch (error) {
    console.error('Error exporting purchase order PDF:', error);
    throw error;
  }
}

export function exportAllPurchaseOrdersToPDF(purchaseOrders: PurchaseOrderTableRow[]) {
  const htmlContent = generateSummaryHTML(purchaseOrders);
  const filename = 'purchase-orders-summary';
  exportToPDF(htmlContent, filename);
}