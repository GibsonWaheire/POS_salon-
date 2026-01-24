import { useState, useEffect } from "react"
import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, Printer, Search, Calendar, User, DollarSign, Package, Scissors, Calendar as CalendarIcon, MapPin, Clock } from "lucide-react"
import { apiRequest } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp } from "lucide-react"

const formatKES = (amount) => {
  return `KES ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default function Sales() {
  const { demoMode } = useAuth()
  const [sales, setSales] = useState([])
  const [filteredSales, setFilteredSales] = useState([])
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedSale, setSelectedSale] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [expandedRows, setExpandedRows] = useState(new Set())
  
  // Filters
  const [selectedStaffId, setSelectedStaffId] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchStaff()
    fetchSales()
  }, [])

  useEffect(() => {
    fetchSales()
  }, [selectedStaffId, selectedStatus, startDate, endDate, demoMode])

  useEffect(() => {
    // Filter sales based on search query
    if (!searchQuery.trim()) {
      setFilteredSales(sales)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredSales(
        sales.filter(
          (sale) =>
            sale.sale_number?.toLowerCase().includes(query) ||
            sale.customer_name?.toLowerCase().includes(query) ||
            sale.customer_phone?.toLowerCase().includes(query) ||
            sale.receipt_number?.toLowerCase().includes(query)
        )
      )
    }
  }, [searchQuery, sales])

  const fetchStaff = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/staff")
      if (response.ok) {
        const data = await response.json()
        setStaff(data.filter(s => s.is_active !== false))
      }
    } catch (err) {
      console.error("Failed to fetch staff:", err)
    }
  }

  const fetchSales = async () => {
    try {
      setLoading(true)
      setError("")
      let url = "http://localhost:5001/api/sales"
      const params = new URLSearchParams()
      if (selectedStaffId && selectedStaffId !== "all") params.append("staff_id", selectedStaffId)
      if (selectedStatus && selectedStatus !== "all") params.append("status", selectedStatus)
      if (startDate) params.append("start_date", startDate)
      if (endDate) params.append("end_date", endDate)
      const demoModeParam = demoMode ? 'true' : 'false'
      params.append("demo_mode", demoModeParam)
      if (params.toString()) url += "?" + params.toString()
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setSales(data)
        setFilteredSales(data)
      } else {
        setError("Failed to fetch sales")
      }
    } catch (err) {
      setError("Unable to load sales. Please check your connection.")
      console.error("Failed to fetch sales:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchSaleDetails = async (saleId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/sales/${saleId}`)
      if (response.ok) {
        const data = await response.json()
        setSelectedSale(data)
        setIsDetailsOpen(true)
      }
    } catch (err) {
      setError("Failed to fetch sale details")
      console.error("Failed to fetch sale details:", err)
    }
  }

  const handlePrintReceipt = async (sale) => {
    try {
      // Generate receipt PDF
      const response = await fetch(`http://localhost:5001/api/sales/${sale.id}/receipt`, {
        method: "GET"
      })
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `receipt-${sale.sale_number || sale.id}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        setError("Failed to generate receipt")
      }
    } catch (err) {
      setError("Failed to generate receipt")
      console.error("Failed to print receipt:", err)
    }
  }

  const toggleRow = (saleId) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(saleId)) {
      newExpanded.delete(saleId)
    } else {
      newExpanded.add(saleId)
    }
    setExpandedRows(newExpanded)
  }

  const getStaffName = (staffId) => {
    const staffMember = staff.find(s => s.id === staffId)
    return staffMember ? staffMember.name : `Staff #${staffId}`
  }

  const totalRevenue = filteredSales
    .filter(s => s.status === 'completed')
    .reduce((sum, s) => sum + (s.total_amount || 0), 0)

  const totalSales = filteredSales.filter(s => s.status === 'completed').length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sales History</h1>
          <p className="text-muted-foreground">View and manage all sales transactions</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales}</div>
            <p className="text-xs text-muted-foreground">Completed transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatKES(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">From completed sales</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Sale</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalSales > 0 ? formatKES(totalRevenue / totalSales) : formatKES(0)}
            </div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by sale number, customer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Staff Member</Label>
              <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
                <SelectTrigger>
                  <SelectValue placeholder="All staff" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All staff</SelectItem>
                  {staff.map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sales</CardTitle>
          <CardDescription>
            {filteredSales.length} sale{filteredSales.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading sales...</div>
          ) : filteredSales.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No sales found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Sale Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.map((sale) => (
                  <React.Fragment key={sale.id}>
                    <TableRow>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRow(sale.id)}
                        >
                          {expandedRows.has(sale.id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">{sale.sale_number}</TableCell>
                      <TableCell>
                        {sale.created_at
                          ? new Date(sale.created_at).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {sale.customer_name || sale.customer?.name || "Walk-in"}
                      </TableCell>
                      <TableCell>{getStaffName(sale.staff_id)}</TableCell>
                      <TableCell>{formatKES(sale.total_amount || 0)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            sale.status === 'completed'
                              ? 'default'
                              : sale.status === 'pending'
                              ? 'secondary'
                              : 'destructive'
                          }
                        >
                          {sale.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => fetchSaleDetails(sale.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {sale.status === 'completed' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePrintReceipt(sale)}
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedRows.has(sale.id) && (
                      <TableRow>
                        <TableCell colSpan={8} className="bg-muted/50">
                          <div className="p-4 space-y-2">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Receipt Number:</span>{" "}
                                {sale.receipt_number || "-"}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Payment Method:</span>{" "}
                                {sale.payment_method
                                  ? sale.payment_method.toUpperCase().replace("_", "-")
                                  : "-"}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Commission:</span>{" "}
                                {formatKES(sale.commission_amount || 0)}
                              </div>
                              {sale.appointment_id && (
                                <div className="col-span-2 flex items-center gap-2 text-blue-600">
                                  <CalendarIcon className="h-4 w-4" />
                                  <span className="font-semibold">From Appointment #{sale.appointment_id}</span>
                                </div>
                              )}
                              {sale.service_location && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">Location:</span>
                                  <span className="capitalize">{sale.service_location}</span>
                                  {sale.service_location === "home" && sale.home_service_address && (
                                    <span className="text-xs text-muted-foreground">({sale.home_service_address})</span>
                                  )}
                                </div>
                              )}
                              {sale.service_duration_minutes && (
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">Service Duration:</span>
                                  <span>{sale.service_duration_minutes} minutes</span>
                                </div>
                              )}
                              <div>
                                <span className="text-muted-foreground">Time:</span>{" "}
                                {sale.created_at
                                  ? new Date(sale.created_at).toLocaleTimeString()
                                  : "-"}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Sale Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sale Details</DialogTitle>
            <DialogDescription>
              {selectedSale?.sale_number}
            </DialogDescription>
          </DialogHeader>
          {selectedSale && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Sale Number</Label>
                  <p className="font-medium">{selectedSale.sale_number}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Date</Label>
                  <p className="font-medium">
                    {selectedSale.created_at
                      ? new Date(selectedSale.created_at).toLocaleString()
                      : "-"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Customer</Label>
                  <p className="font-medium">
                    {selectedSale.customer_name || selectedSale.customer?.name || "Walk-in"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Staff</Label>
                  <p className="font-medium">{getStaffName(selectedSale.staff_id)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge
                    variant={
                      selectedSale.status === 'completed'
                        ? 'default'
                        : selectedSale.status === 'pending'
                        ? 'secondary'
                        : 'destructive'
                    }
                  >
                    {selectedSale.status}
                  </Badge>
                </div>
                {selectedSale.payment && (
                  <div>
                    <Label className="text-muted-foreground">Payment Method</Label>
                    <p className="font-medium">
                      {selectedSale.payment.payment_method
                        ?.toUpperCase()
                        .replace("_", "-") || "-"}
                    </p>
                  </div>
                )}
                {selectedSale.appointment_id && (
                  <div className="col-span-2">
                    <Label className="text-muted-foreground flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      Linked Appointment
                    </Label>
                    <p className="font-medium text-blue-600">Appointment #{selectedSale.appointment_id}</p>
                  </div>
                )}
                {selectedSale.service_location && (
                  <div>
                    <Label className="text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Service Location
                    </Label>
                    <p className="font-medium capitalize">
                      {selectedSale.service_location}
                      {selectedSale.service_location === "home" && selectedSale.home_service_address && (
                        <span className="text-sm text-muted-foreground block mt-1">{selectedSale.home_service_address}</span>
                      )}
                    </p>
                  </div>
                )}
                {selectedSale.service_duration_minutes && (
                  <div>
                    <Label className="text-muted-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Service Duration
                    </Label>
                    <p className="font-medium">{selectedSale.service_duration_minutes} minutes</p>
                  </div>
                )}
              </div>

              {selectedSale.services && selectedSale.services.length > 0 && (
                <div>
                  <Label className="text-muted-foreground mb-2 block">Services</Label>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedSale.services.map((service) => (
                        <TableRow key={service.id}>
                          <TableCell>{service.service?.name || "Unknown"}</TableCell>
                          <TableCell>{service.quantity}</TableCell>
                          <TableCell>{formatKES(service.unit_price)}</TableCell>
                          <TableCell>{formatKES(service.total_price)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {selectedSale.products && selectedSale.products.length > 0 && (
                <div>
                  <Label className="text-muted-foreground mb-2 block">Products</Label>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedSale.products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.product?.name || "Unknown"}</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>{formatKES(product.unit_price)}</TableCell>
                          <TableCell>{formatKES(product.total_price)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex justify-end">
                  <div className="space-y-2 text-right">
                    <div className="flex justify-between gap-8">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="font-medium">{formatKES(selectedSale.subtotal || 0)}</span>
                    </div>
                    <div className="flex justify-between gap-8">
                      <span className="text-muted-foreground">Tax:</span>
                      <span className="font-medium">{formatKES(selectedSale.tax_amount || 0)}</span>
                    </div>
                    <div className="flex justify-between gap-8 text-lg font-bold">
                      <span>Total:</span>
                      <span>{formatKES(selectedSale.total_amount || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedSale.status === 'completed' && (
                <div className="flex justify-end">
                  <Button onClick={() => handlePrintReceipt(selectedSale)}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print Receipt
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
