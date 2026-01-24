import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Package, Plus, Edit, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

const formatKES = (amount) => {
  return `KES ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default function Inventory() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false)
  const [adjustmentAmount, setAdjustmentAmount] = useState("")
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "hair_products",
    sku: "",
    unit_price: "",
    selling_price: "",
    stock_quantity: "",
    min_stock_level: "5",
    unit: "piece",
    supplier: ""
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (err) {
      console.error("Failed to fetch products:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAdd = () => {
    setSelectedProduct(null)
    setFormData({
      name: "",
      description: "",
      category: "hair_products",
      sku: "",
      unit_price: "",
      selling_price: "",
      stock_quantity: "",
      min_stock_level: "5",
      unit: "piece",
      supplier: ""
    })
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (product) => {
    setSelectedProduct(product)
    setFormData({
      name: product.name || "",
      description: product.description || "",
      category: product.category || "hair_products",
      sku: product.sku || "",
      unit_price: product.unit_price || "",
      selling_price: product.selling_price || "",
      stock_quantity: product.stock_quantity || "",
      min_stock_level: product.min_stock_level || "5",
      unit: product.unit || "piece",
      supplier: product.supplier || ""
    })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    try {
      const url = selectedProduct 
        ? `http://localhost:5001/api/products/${selectedProduct.id}`
        : "http://localhost:5001/api/products"
      
      const method = selectedProduct ? "PUT" : "POST"
      
      const payload = {
        name: formData.name,
        description: formData.description || null,
        category: formData.category,
        sku: formData.sku || null,
        unit_price: parseFloat(formData.unit_price) || 0,
        selling_price: formData.selling_price ? parseFloat(formData.selling_price) : null,
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        min_stock_level: parseInt(formData.min_stock_level) || 5,
        unit: formData.unit,
        supplier: formData.supplier || null
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        setIsDialogOpen(false)
        fetchProducts()
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to save product")
      }
    } catch (err) {
      console.error("Error saving product:", err)
      toast.error("An error occurred while saving product")
    }
  }

  const handleAdjustStock = async () => {
    if (!selectedProduct || !adjustmentAmount) return

    try {
      const response = await fetch(`http://localhost:5001/api/products/${selectedProduct.id}/adjust-stock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adjustment: parseInt(adjustmentAmount) })
      })

      if (response.ok) {
        setIsAdjustDialogOpen(false)
        setAdjustmentAmount("")
        setSelectedProduct(null)
        fetchProducts()
      } else {
        toast.error("Failed to adjust stock")
      }
    } catch (err) {
      console.error("Error adjusting stock:", err)
      toast.error("An error occurred while adjusting stock")
    }
  }

  const lowStockProducts = products.filter(p => p.is_low_stock)

  const categories = [
    { value: "hair_products", label: "Hair Products" },
    { value: "nail_products", label: "Nail Products" },
    { value: "tools", label: "Tools" },
    { value: "supplies", label: "Supplies" },
    { value: "other", label: "Other" }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">Manage products and stock levels</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              <DialogDescription>
                {selectedProduct ? "Update product information" : "Enter product details below"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  placeholder="Shampoo 500ml"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Product description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    placeholder="PROD-001"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="unit_price">Cost Price (KES) *</Label>
                  <Input
                    id="unit_price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.unit_price}
                    onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="selling_price">Selling Price (KES)</Label>
                  <Input
                    id="selling_price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.selling_price}
                    onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="stock_quantity">Current Stock *</Label>
                  <Input
                    id="stock_quantity"
                    type="number"
                    placeholder="0"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="min_stock_level">Min Stock Level *</Label>
                  <Input
                    id="min_stock_level"
                    type="number"
                    placeholder="5"
                    value={formData.min_stock_level}
                    onChange={(e) => setFormData({ ...formData, min_stock_level: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    placeholder="piece, bottle, box"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Input
                  id="supplier"
                  placeholder="Supplier name"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!formData.name || !formData.unit_price}>
                {selectedProduct ? "Update" : "Add"} Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {lowStockProducts.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Low Stock Alert:</strong> {lowStockProducts.length} product(s) are below minimum stock level.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>Manage inventory and track stock levels</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading products...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Cost Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No products found.
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category?.replace('_', ' ').toUpperCase() || 'N/A'}</Badge>
                      </TableCell>
                      <TableCell>{product.sku || "-"}</TableCell>
                      <TableCell>{formatKES(product.unit_price)}</TableCell>
                      <TableCell>
                        {product.stock_quantity} {product.unit}
                      </TableCell>
                      <TableCell>
                        {product.is_low_stock ? (
                          <Badge variant="destructive">Low Stock</Badge>
                        ) : (
                          <Badge variant="default">In Stock</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedProduct(product)
                              setIsAdjustDialogOpen(true)
                            }}
                          >
                            Adjust Stock
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEdit(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Adjust Stock Dialog */}
      <Dialog open={isAdjustDialogOpen} onOpenChange={setIsAdjustDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Stock: {selectedProduct?.name}</DialogTitle>
            <DialogDescription>
              Current stock: {selectedProduct?.stock_quantity} {selectedProduct?.unit}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="adjustment">Adjustment Amount</Label>
              <Input
                id="adjustment"
                type="number"
                placeholder="Enter positive to add, negative to subtract"
                value={adjustmentAmount}
                onChange={(e) => setAdjustmentAmount(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Example: +10 to add 10 units, -5 to subtract 5 units
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAdjustDialogOpen(false)
              setAdjustmentAmount("")
            }}>
              Cancel
            </Button>
            <Button onClick={handleAdjustStock} disabled={!adjustmentAmount}>
              Adjust Stock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

