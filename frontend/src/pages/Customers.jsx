import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Trash2, Search, Eye, Star, Calendar, DollarSign, Package } from "lucide-react"
import { apiRequest } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const formatKES = (amount) => {
  return `KES ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default function Customers() {
  const { demoMode } = useAuth()
  const [customers, setCustomers] = useState([])
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [customerSales, setCustomerSales] = useState([])
  const [loadingSales, setLoadingSales] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: ""
  })

  useEffect(() => {
    fetchCustomers()
  }, [demoMode])

  useEffect(() => {
    // Filter customers based on search query
    if (!searchQuery.trim()) {
      setFilteredCustomers(customers)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredCustomers(
        customers.filter(
          (customer) =>
            customer.name?.toLowerCase().includes(query) ||
            customer.phone?.toLowerCase().includes(query) ||
            customer.email?.toLowerCase().includes(query)
        )
      )
    }
  }, [searchQuery, customers])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      setError("")
      const demoModeParam = demoMode ? 'true' : 'false'
      const response = await fetch(`http://localhost:5001/api/customers?demo_mode=${demoModeParam}`)
      if (response.ok) {
        const data = await response.json()
        setCustomers(data)
        setFilteredCustomers(data)
      } else {
        setError("Failed to fetch customers")
      }
    } catch (err) {
      setError("Unable to load customers. Please check your connection.")
      console.error("Failed to fetch customers:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomerSales = async (customerId) => {
    try {
      setLoadingSales(true)
      const demoModeParam = demoMode ? 'true' : 'false'
      const response = await fetch(`http://localhost:5001/api/customers/${customerId}/sales?demo_mode=${demoModeParam}`)
      if (response.ok) {
        const data = await response.json()
        setCustomerSales(data)
      }
    } catch (err) {
      console.error("Failed to fetch customer sales:", err)
    } finally {
      setLoadingSales(false)
    }
  }

  const handleCreate = () => {
    setEditingCustomer(null)
    setFormData({
      name: "",
      phone: "",
      email: ""
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (customer) => {
    setEditingCustomer(customer)
    setFormData({
      name: customer.name || "",
      phone: customer.phone || "",
      email: customer.email || ""
    })
    setIsDialogOpen(true)
  }

  const handleViewDetails = async (customer) => {
    setSelectedCustomer(customer)
    setIsDetailsOpen(true)
    await fetchCustomerSales(customer.id)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      if (editingCustomer) {
        // Update existing customer
        await apiRequest(`/customers/${editingCustomer.id}`, {
          method: "PUT",
          body: JSON.stringify(formData)
        })
      } else {
        // Create new customer
        const demoModeParam = demoMode ? 'true' : 'false'
        const response = await fetch(`http://localhost:5001/api/customers?demo_mode=${demoModeParam}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to create customer")
        }
      }
      setIsDialogOpen(false)
      fetchCustomers()
    } catch (err) {
      setError(err.message || "Failed to save customer")
    }
  }

  const handleDelete = async (customerId) => {
    try {
      await apiRequest(`/customers/${customerId}`, {
        method: "DELETE"
      })
      fetchCustomers()
    } catch (err) {
      setError(err.message || "Failed to delete customer")
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage your customer database</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name, phone, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
          <CardDescription>
            {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading customers...</div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? "No customers match your search." : "No customers found."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Loyalty Points</TableHead>
                  <TableHead>Total Visits</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.phone || "-"}</TableCell>
                    <TableCell>{customer.email || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                        <Star className="h-3 w-3" />
                        {customer.loyalty_points || 0}
                      </Badge>
                    </TableCell>
                    <TableCell>{customer.total_visits || 0}</TableCell>
                    <TableCell>{formatKES(customer.total_spent || 0)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(customer)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(customer)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Customer</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {customer.name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(customer.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCustomer ? "Edit Customer" : "Add New Customer"}</DialogTitle>
            <DialogDescription>
              {editingCustomer ? "Update customer information" : "Enter customer information below."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="+254712345678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingCustomer ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Customer Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              View customer information and purchase history
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <Tabs defaultValue="profile" className="w-full">
              <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="history">Purchase History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Name</Label>
                    <p className="font-medium">{selectedCustomer.name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <p className="font-medium">{selectedCustomer.phone || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{selectedCustomer.email || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Loyalty Points</Label>
                    <p className="font-medium flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      {selectedCustomer.loyalty_points || 0}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Total Visits</Label>
                    <p className="font-medium">{selectedCustomer.total_visits || 0}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Total Spent</Label>
                    <p className="font-medium">{formatKES(selectedCustomer.total_spent || 0)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Last Visit</Label>
                    <p className="font-medium">
                      {selectedCustomer.last_visit
                        ? new Date(selectedCustomer.last_visit).toLocaleDateString()
                        : "Never"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Member Since</Label>
                    <p className="font-medium">
                      {selectedCustomer.created_at
                        ? new Date(selectedCustomer.created_at).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="space-y-4">
                {loadingSales ? (
                  <div className="text-center py-8">Loading purchase history...</div>
                ) : customerSales.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No purchase history found.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {customerSales.map((sale) => (
                      <Card key={sale.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">{sale.sale_number}</CardTitle>
                              <CardDescription>
                                {sale.created_at
                                  ? new Date(sale.created_at).toLocaleString()
                                  : "Unknown date"}
                              </CardDescription>
                            </div>
                            <Badge variant={sale.status === 'completed' ? 'default' : 'secondary'}>
                              {sale.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total Amount:</span>
                              <span className="font-semibold">{formatKES(sale.total_amount || 0)}</span>
                            </div>
                            {sale.staff && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Staff:</span>
                                <span>{sale.staff.name}</span>
                              </div>
                            )}
                            {sale.payment && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Payment Method:</span>
                                <Badge variant="outline">
                                  {sale.payment.payment_method?.toUpperCase().replace('_', '-') || 'N/A'}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
