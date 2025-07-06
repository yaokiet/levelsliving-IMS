"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Edit3, Package, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  quantity: number
  minStock: number
  maxStock: number
  unitPrice: number
  supplier: string
  description: string
  lastUpdated: string
  status: "in-stock" | "low-stock" | "out-of-stock"
}

export default function Component() {
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
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)

  // Load Montserrat font
  useEffect(() => {
    const link = document.createElement("link")
    link.href = "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap"
    link.rel = "stylesheet"
    document.head.appendChild(link)

    // Apply font to body
    document.body.style.fontFamily = "Montserrat, sans-serif"

    return () => {
      document.head.removeChild(link)
    }
  }, [])

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
  })

  const categories = ["Electronics", "Furniture", "Office Supplies", "Software", "Hardware"]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-stock":
        return "bg-green-500/20 text-green-700 border-green-500/30"
      case "low-stock":
        return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30"
      case "out-of-stock":
        return "bg-red-500/20 text-red-700 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-700 border-gray-500/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in-stock":
        return <CheckCircle className="w-4 h-4" />
      case "low-stock":
        return <AlertTriangle className="w-4 h-4" />
      case "out-of-stock":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  const determineStatus = (quantity: number, minStock: number): "in-stock" | "low-stock" | "out-of-stock" => {
    if (quantity === 0) return "out-of-stock"
    if (quantity <= minStock) return "low-stock"
    return "in-stock"
  }

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAddItem = () => {
    if (!newItem.name || !newItem.sku) return

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
      status: determineStatus(newItem.quantity || 0, newItem.minStock || 0),
    }

    setItems([...items, item])
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
    })
    setIsAddDialogOpen(false)
  }

  const handleEditItem = () => {
    if (!editingItem) return

    const updatedItems = items.map((item) =>
      item.id === editingItem.id
        ? {
            ...editingItem,
            status: determineStatus(editingItem.quantity, editingItem.minStock),
            lastUpdated: new Date().toISOString().split("T")[0],
          }
        : item,
    )
    setItems(updatedItems)
    setIsEditDialogOpen(false)
    setEditingItem(null)
  }

  const openEditDialog = (item: InventoryItem) => {
    setEditingItem({ ...item })
    setIsEditDialogOpen(true)
  }

  const totalItems = items.length
  const totalValue = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const lowStockItems = items.filter((item) => item.status === "low-stock" || item.status === "out-of-stock").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {/* Glassmorphic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/30 to-pink-400/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Inventory Management</h1>
          <p className="text-gray-600">Manage your inventory with precision and control</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="backdrop-blur-md bg-white/70 border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-3xl font-bold text-gray-800">{totalItems}</p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-md bg-white/70 border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-3xl font-bold text-gray-800">${totalValue.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-md bg-white/70 border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Low Stock Alerts</p>
                  <p className="text-3xl font-bold text-gray-800">{lowStockItems}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="backdrop-blur-md bg-white/70 border-white/20 shadow-xl mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search items, SKU, or supplier..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 backdrop-blur-sm bg-white/50 border-white/30"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-48 backdrop-blur-sm bg-white/50 border-white/30">
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
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="backdrop-blur-md bg-white/90 border-white/20 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Inventory Item</DialogTitle>
                    <DialogDescription>Enter the details for the new inventory item.</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Item Name</Label>
                      <Input
                        id="name"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        className="backdrop-blur-sm bg-white/50 border-white/30"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sku">SKU</Label>
                      <Input
                        id="sku"
                        value={newItem.sku}
                        onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                        className="backdrop-blur-sm bg-white/50 border-white/30"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newItem.category}
                        onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                      >
                        <SelectTrigger className="backdrop-blur-sm bg-white/50 border-white/30">
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
                        className="backdrop-blur-sm bg-white/50 border-white/30"
                      />
                    </div>
                    <div>
                      <Label htmlFor="quantity">Current Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem({ ...newItem, quantity: Number.parseInt(e.target.value) || 0 })}
                        className="backdrop-blur-sm bg-white/50 border-white/30"
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
                        className="backdrop-blur-sm bg-white/50 border-white/30"
                      />
                    </div>
                    <div>
                      <Label htmlFor="minStock">Minimum Stock</Label>
                      <Input
                        id="minStock"
                        type="number"
                        value={newItem.minStock}
                        onChange={(e) => setNewItem({ ...newItem, minStock: Number.parseInt(e.target.value) || 0 })}
                        className="backdrop-blur-sm bg-white/50 border-white/30"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxStock">Maximum Stock</Label>
                      <Input
                        id="maxStock"
                        type="number"
                        value={newItem.maxStock}
                        onChange={(e) => setNewItem({ ...newItem, maxStock: Number.parseInt(e.target.value) || 0 })}
                        className="backdrop-blur-sm bg-white/50 border-white/30"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        className="backdrop-blur-sm bg-white/50 border-white/30"
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddItem}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Add Item
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="backdrop-blur-md bg-white/70 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-800 mb-1">{item.name}</CardTitle>
                    <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                  </div>
                  <Badge className={`${getStatusColor(item.status)} flex items-center gap-1`}>
                    {getStatusIcon(item.status)}
                    {item.status.replace("-", " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Category:</span>
                    <span className="text-sm font-medium">{item.category}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Quantity:</span>
                    <span className="text-sm font-bold text-gray-800">{item.quantity}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Unit Price:</span>
                    <span className="text-sm font-medium">${item.unitPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Value:</span>
                    <span className="text-sm font-bold text-green-600">
                      ${(item.quantity * item.unitPrice).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Supplier:</span>
                    <span className="text-sm font-medium">{item.supplier}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">
                      Stock Range: {item.minStock} - {item.maxStock}
                    </p>
                    <p className="text-xs text-gray-500">Last Updated: {item.lastUpdated}</p>
                  </div>
                  <Button
                    onClick={() => openEditDialog(item)}
                    className="w-full mt-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
                    size="sm"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Item
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="backdrop-blur-md bg-white/90 border-white/20 max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Inventory Item</DialogTitle>
              <DialogDescription>Update the details for this inventory item.</DialogDescription>
            </DialogHeader>
            {editingItem && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Item Name</Label>
                  <Input
                    id="edit-name"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="backdrop-blur-sm bg-white/50 border-white/30"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-sku">SKU</Label>
                  <Input
                    id="edit-sku"
                    value={editingItem.sku}
                    onChange={(e) => setEditingItem({ ...editingItem, sku: e.target.value })}
                    className="backdrop-blur-sm bg-white/50 border-white/30"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={editingItem.category}
                    onValueChange={(value) => setEditingItem({ ...editingItem, category: value })}
                  >
                    <SelectTrigger className="backdrop-blur-sm bg-white/50 border-white/30">
                      <SelectValue />
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
                  <Label htmlFor="edit-supplier">Supplier</Label>
                  <Input
                    id="edit-supplier"
                    value={editingItem.supplier}
                    onChange={(e) => setEditingItem({ ...editingItem, supplier: e.target.value })}
                    className="backdrop-blur-sm bg-white/50 border-white/30"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-quantity">Current Quantity</Label>
                  <Input
                    id="edit-quantity"
                    type="number"
                    value={editingItem.quantity}
                    onChange={(e) => setEditingItem({ ...editingItem, quantity: Number.parseInt(e.target.value) || 0 })}
                    className="backdrop-blur-sm bg-white/50 border-white/30"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-unitPrice">Unit Price ($)</Label>
                  <Input
                    id="edit-unitPrice"
                    type="number"
                    step="0.01"
                    value={editingItem.unitPrice}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, unitPrice: Number.parseFloat(e.target.value) || 0 })
                    }
                    className="backdrop-blur-sm bg-white/50 border-white/30"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-minStock">Minimum Stock</Label>
                  <Input
                    id="edit-minStock"
                    type="number"
                    value={editingItem.minStock}
                    onChange={(e) => setEditingItem({ ...editingItem, minStock: Number.parseInt(e.target.value) || 0 })}
                    className="backdrop-blur-sm bg-white/50 border-white/30"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-maxStock">Maximum Stock</Label>
                  <Input
                    id="edit-maxStock"
                    type="number"
                    value={editingItem.maxStock}
                    onChange={(e) => setEditingItem({ ...editingItem, maxStock: Number.parseInt(e.target.value) || 0 })}
                    className="backdrop-blur-sm bg-white/50 border-white/30"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    className="backdrop-blur-sm bg-white/50 border-white/30"
                    rows={3}
                  />
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleEditItem}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Update Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {filteredItems.length === 0 && (
          <Card className="backdrop-blur-md bg-white/70 border-white/20 shadow-xl">
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No items found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or add a new item to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
