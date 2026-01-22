import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus, AlertTriangle } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

const formatKES = (amount) => {
  return `KES ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default function Services() {
  const { user } = useAuth()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  
  // Form states
  const [editingService, setEditingService] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: ""
  })
  const [priceChangeWarning, setPriceChangeWarning] = useState(false)
  const [originalPrice, setOriginalPrice] = useState(null)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("http://localhost:5001/api/services")
      if (response.ok) {
        const data = await response.json()
        setServices(data)
      } else {
        setError("Failed to fetch services")
      }
    } catch (err) {
      setError("Unable to load services. Please check your connection and try again.")
      console.error("Failed to fetch services:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddService = async (e) => {
    e.preventDefault()
    setError("")
    
    if (!formData.name || !formData.price || !formData.duration) {
      setError("Name, price, and duration are required")
      return
    }

    try {
      const response = await fetch("http://localhost:5001/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          price: parseFloat(formData.price),
          duration: parseInt(formData.duration)
        })
      })

      if (response.ok) {
        await fetchServices()
        setAddDialogOpen(false)
        resetForm()
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to create service")
      }
    } catch (err) {
      setError("Failed to create service. Please try again.")
      console.error("Error creating service:", err)
    }
  }

  const handleEditService = (service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      description: service.description || "",
      price: service.price.toString(),
      duration: service.duration.toString()
    })
    setOriginalPrice(service.price)
    setPriceChangeWarning(false)
    setEditDialogOpen(true)
  }

  const handleUpdateService = async (e) => {
    e.preventDefault()
    setError("")
    
    if (!formData.name || !formData.price || !formData.duration) {
      setError("Name, price, and duration are required")
      return
    }

    const newPrice = parseFloat(formData.price)
    const priceChanged = originalPrice !== newPrice

    try {
      const response = await fetch(`http://localhost:5001/api/services/${editingService.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          price: newPrice,
          duration: parseInt(formData.duration),
          price_change_notes: priceChanged ? `Price changed from ${formatKES(originalPrice)} to ${formatKES(newPrice)}` : null
        })
      })

      if (response.ok) {
        await fetchServices()
        setEditDialogOpen(false)
        resetForm()
        setEditingService(null)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to update service")
      }
    } catch (err) {
      setError("Failed to update service. Please try again.")
      console.error("Error updating service:", err)
    }
  }

  const handleDeleteService = async () => {
    if (!editingService) return
    
    setError("")
    try {
      const response = await fetch(`http://localhost:5001/api/services/${editingService.id}`, {
        method: "DELETE"
      })

      if (response.ok) {
        await fetchServices()
        setDeleteDialogOpen(false)
        setEditingService(null)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to delete service")
      }
    } catch (err) {
      setError("Failed to delete service. Please try again.")
      console.error("Error deleting service:", err)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      duration: ""
    })
    setPriceChangeWarning(false)
    setOriginalPrice(null)
    setError("")
  }

  const handlePriceChange = (value) => {
    setFormData({ ...formData, price: value })
    if (editingService && originalPrice !== null) {
      const newPrice = parseFloat(value) || 0
      setPriceChangeWarning(newPrice !== originalPrice)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="text-muted-foreground">Manage salon services and pricing</p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <form onSubmit={handleAddService}>
              <DialogHeader>
                <DialogTitle>Add New Service</DialogTitle>
                <DialogDescription>Enter service details below.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="add-name">Service Name *</Label>
                  <Input
                    id="add-name"
                    placeholder="Haircut & Style"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="add-description">Description</Label>
                  <Textarea
                    id="add-description"
                    placeholder="Service description (optional)"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="add-price">Price (KES) *</Label>
                  <Input
                    id="add-price"
                    type="number"
                    placeholder="3000.00"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Price is inclusive of 16% VAT</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="add-duration">Duration (minutes) *</Label>
                  <Input
                    id="add-duration"
                    type="number"
                    placeholder="60"
                    min="1"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Service</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && !addDialogOpen && !editDialogOpen && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Services</CardTitle>
          <CardDescription>View and manage available services. Price changes are tracked for commission integrity.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading services...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No services found. Click "Add Service" to create one.
                    </TableCell>
                  </TableRow>
                ) : (
                  services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell>{service.description || "-"}</TableCell>
                      <TableCell className="font-semibold">{formatKES(service.price)}</TableCell>
                      <TableCell>{service.duration} min</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditService(service)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingService(service)
                              setDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
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

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleUpdateService}>
            <DialogHeader>
              <DialogTitle>Edit Service</DialogTitle>
              <DialogDescription>Update service details below.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {priceChangeWarning && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Price Change Detected:</strong> Changing the price will not affect existing sales or commissions. 
                    The price history will be recorded for audit purposes.
                  </AlertDescription>
                </Alert>
              )}
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Service Name *</Label>
                <Input
                  id="edit-name"
                  placeholder="Haircut & Style"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Service description (optional)"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-price">Price (KES) *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  placeholder="3000.00"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">Price is inclusive of 16% VAT</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-duration">Duration (minutes) *</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  placeholder="60"
                  min="1"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => {
                setEditDialogOpen(false)
                resetForm()
              }}>
                Cancel
              </Button>
              <Button type="submit">Update Service</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{editingService?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteService}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
