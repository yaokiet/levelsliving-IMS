import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export type LowStockItem = {
  name: string;
  remaining: number;
  status: "Low" | "Medium" | "High";
  imageUrl?: string;
};

interface LowQuantityStockProps {
  items: LowStockItem[];
}

const statusVariant: Record<"Low" | "Medium" | "High", "destructive" | "secondary" | "default"> = {
  Low: "destructive",
  Medium: "secondary",
  High: "default",
};

export const LowQuantityStock: React.FC<LowQuantityStockProps> = ({ items }) => {
  return (
    <div className="bg-background rounded-lg border p-6 w-full max-w-lg mt-8 mb-6 ml-6">
      <h2 className="text-lg font-semibold mb-4 text-center">Low Quantity Stock</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Remaining</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.name}>
              <TableCell>
                <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                  <span className="text-sm text-gray-500">Image</span>
                </div>
              </TableCell>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.remaining} Packet</TableCell>
              <TableCell>
                <Badge variant={statusVariant[item.status]}>{item.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LowQuantityStock;
