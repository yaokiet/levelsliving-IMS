"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  supplier: string;
  description: string;
  lastUpdated: string;
  status: "in-stock" | "low-stock" | "out-of-stock";
}

export default function InventoryManagementPage() {
  const [items, setItems] = useState<InventoryItem[]>([
    {
      id: "1",
      name: 'MacBook Pro 16"',
      sku: "MBP-16-001",
      category: "Electronics",
      quantity: 45,
      minStock: 10,
      maxStock: 100,
      unitPrice: 2499.99,
      supplier: "Apple Inc.",
      description: "High-performance laptop for professional use",
      lastUpdated: "2024-01-15",
      status: "in-stock",
    },
    {
      id: "2",
      name: "Office Chair Premium",
      sku: "OFC-CHR-002",
      category: "Furniture",
      quantity: 8,
      minStock: 15,
      maxStock: 50,
      unitPrice: 299.99,
      supplier: "Herman Miller",
      description: "Ergonomic office chair with lumbar support",
      lastUpdated: "2024-01-14",
      status: "low-stock",
    },
    {
      id: "3",
      name: "Wireless Mouse",
      sku: "MSE-WRL-003",
      category: "Electronics",
      quantity: 0,
      minStock: 20,
      maxStock: 200,
      unitPrice: 79.99,
      supplier: "Logitech",
      description: "High-precision wireless mouse",
      lastUpdated: "2024-01-13",
      status: "out-of-stock",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    name: "",
    sku: "",
    category: "",
    quantity: 0,
    minStock: 0,
    maxStock: 0,
    unitPrice: 0,
    supplier: "",
    description: "",
  });

  const categories = ["Electronics", "Furniture", "Office Supplies", "Software", "Hardware"];

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = () => {
    if (!newItem.name || !newItem.sku) return;

    const item: InventoryItem = {
      id: Date.now().toString(),
      name: newItem.name,
      sku: newItem.sku,
      category: newItem.category || "Electronics",
      quantity: newItem.quantity || 0,
      minStock: newItem.minStock || 0,
      maxStock: newItem.maxStock || 0,
      unitPrice: newItem.unitPrice || 0,
      supplier: newItem.supplier || "",
      description: newItem.description || "",
      lastUpdated: new Date().toISOString().split("T")[0],
      status: (newItem.quantity ?? 0) === 0
        ? "out-of-stock"
        : (newItem.quantity ?? 0) <= (newItem.minStock ?? 0)
          ? "low-stock"
          : "in-stock",
    };

    setItems([...items, item]);
    setNewItem({
      name: "",
      sku: "",
      category: "",
      quantity: 0,
      minStock: 0,
      maxStock: 0,
      unitPrice: 0,
      supplier: "",
      description: "",
    });
    setIsAddDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Inventory Management</h1>
        <p className="text-gray-600">Manage your inventory with precision and control</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <Input
            placeholder="Search items, SKU, or supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-auto"
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Inventory Item</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={newItem.sku}
                  onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newItem.category}
                  onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="supplier">Supplier</Label>
                <Input
                  id="supplier"
                  value={newItem.supplier}
                  onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="quantity">Current Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: Number.parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="unitPrice">Unit Price ($)</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  step="0.01"
                  value={newItem.unitPrice}
                  onChange={(e) => setNewItem({ ...newItem, unitPrice: Number.parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddItem}>Add Item</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
              <Badge>{item.status}</Badge>
            </CardHeader>
            <CardContent>
              <p>SKU: {item.sku}</p>
              <p>Category: {item.category}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Supplier: {item.supplier}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}