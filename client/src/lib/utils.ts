import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toQueryString(params?: Record<string, any>): string {
  if (!params) return "";
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => usp.append(key, v));
    } else if (value !== undefined && value !== null) {
      usp.append(key, value);
    }
  });
  return usp.toString() ? `?${usp.toString()}` : "";
}

// Clean PDF export function
export function exportToPDF(htmlContent: string, filename: string = 'document') {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow pop-ups to enable PDF export');
    return;
  }

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Wait for content to load, then trigger print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };
}

export function getFilterableColumns(columns: any[]) {
  return columns
    .filter((col) => typeof col.accessorKey === "string" && col.meta?.label)
    .map((col) => ({
      key: col.accessorKey,
      label: col.meta.label,
    }));
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-SG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateLong(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-SG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: 'SGD',
  }).format(amount);
}