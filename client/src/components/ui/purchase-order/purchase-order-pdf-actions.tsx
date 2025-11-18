'use client';

import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import { PurchaseOrderWithDetails } from '@/types/purchase-order';
import { generatePurchaseOrderHTML } from '@/lib/pdf-export';
import { exportToPDF } from '@/lib/utils';

interface PurchaseOrderPdfActionsProps {
  purchaseOrder: PurchaseOrderWithDetails;
  variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showPrint?: boolean;
  showDownload?: boolean;
  className?: string;
  onError?: (error: Error) => void;
}

export function PurchaseOrderPdfActions({
  purchaseOrder,
  variant = 'outline',
  size = 'sm',
  showPrint = false,
  showDownload = true,
  className = '',
  onError
}: PurchaseOrderPdfActionsProps) {
  const handleDownloadPDF = async () => {
    if (!purchaseOrder) return;
    
    try {
      const htmlContent = generatePurchaseOrderHTML(purchaseOrder);
      const filename = `purchase-order-${purchaseOrder.id.toString().padStart(4, '0')}`;
      exportToPDF(htmlContent, filename);
    } catch (error) {
      console.error('Failed to export PDF:', error);
      onError?.(error instanceof Error ? error : new Error('Failed to export PDF'));
    }
  };

  const handlePrint = async () => {
    if (!purchaseOrder) return;
    
    try {
      const htmlContent = generatePurchaseOrderHTML(purchaseOrder);
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      } else {
        throw new Error('Unable to open print window. Please check your browser settings.');
      }
    } catch (error) {
      console.error('Failed to print:', error);
      onError?.(error instanceof Error ? error : new Error('Failed to print'));
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      {showPrint && (
        <Button variant={variant} size={size} onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
      )}
      {showDownload && (
        <Button variant={variant} size={size} onClick={handleDownloadPDF}>
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      )}
    </div>
  );
}