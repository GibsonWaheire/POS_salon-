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
import { Eye, Search, Calendar, User, MapPin, Clock, CheckCircle2, XCircle, X } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"

export default function Appointments() {
  const { demoMode, isDemoUser } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [filteredAppointments, setFilteredAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  
  // Filters
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchAppointments()
  }, [])

  useEffect(() => {
    fetchAppointments()
  }, [selectedStatus, startDate, endDate, demoMode])

  useEffect(() => {
    // Filter appointments based on search query
    if (!searchQuery.trim()) {
      setFilteredAppointments(appointments)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredAppointments(
        appointments.filter(
          (appointment) =>
            appointment.customer?.name?.toLowerCase().includes(query) ||
            appointment.customer?.phone?.toLowerCase().includes(query) ||
            appointment.id?.toString().includes(query)
        )
      )
    }
  }, [searchQuery, appointments])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      setError("")
      let url = "http://localhost:5001/api/appointments"
      const params = new URLSearchParams()
      if (selectedStatus && selectedStatus !== "all") params.append("status", selectedStatus)
      if (startDate) params.append("start_date", startDate)
      if (endDate) params.append("end_date", endDate)
      const demoModeParam = isDemoUser ? 'true' : (demoMode ? 'true' : 'false')
      params.append("demo_mode", demoModeParam)
      if (params.toString()) url += "?" + params.toString()
      
      const response = await fetch(url)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || 'Failed to fetch appointments'
        setError(errorMessage)
        toast.error(errorMessage)
        return
      }
      
      const data = await response.json()
      setAppointments(data)
      setFilteredAppointments(data)
    } catch (err) {
      const errorMessage = err.message || 'An error occurred while fetching appointments'
      setError(errorMessage)
      toast.error(errorMessage)
      console.error("Failed to fetch appointments:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchAppointmentDetails = async (id) => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5001/api/appointments/${id}`)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || 'Failed to fetch appointment details'
        toast.error(errorMessage)
        return
      }
      const data = await response.json()
      setSelectedAppointment(data)
      setIsDetailsOpen(true)
    } catch (err) {
      const errorMessage = err.message || 'An error occurred while fetching appointment details'
      toast.error(errorMessage)
      console.error("Failed to fetch appointment details:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return
    }
    
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5001/api/appointments/${appointmentId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || 'Failed to cancel appointment'
        toast.error(errorMessage)
        return
      }
      
      const updatedAppointment = await response.json()
      
      // Update local state
      setAppointments(prev => 
        prev.map(apt => apt.id === appointmentId ? updatedAppointment : apt)
      )
      setFilteredAppointments(prev => 
        prev.map(apt => apt.id === appointmentId ? updatedAppointment : apt)
      )
      
      // Update selected appointment if it's the one being cancelled
      if (selectedAppointment?.id === appointmentId) {
        setSelectedAppointment(updatedAppointment)
      }
      
      toast.success("Appointment cancelled successfully")
    } catch (err) {
      const errorMessage = err.message || 'An error occurred while cancelling the appointment'
      toast.error(errorMessage)
      console.error("Failed to cancel appointment:", err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'completed':
        return 'default'
      case 'scheduled':
      case 'pending':
        return 'secondary'
      case 'cancelled':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const totalAppointments = filteredAppointments.length
  const pendingAppointments = filteredAppointments.filter(a => a.status === 'scheduled' || a.status === 'pending').length
  const completedAppointments = filteredAppointments.filter(a => a.status === 'completed').length

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Appointments</h1>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAppointments}</div>
            <p className="text-xs text-muted-foreground">All appointments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAppointments}</div>
            <p className="text-xs text-muted-foreground">Scheduled/Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedAppointments}</div>
            <p className="text-xs text-muted-foreground">Completed appointments</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by customer name, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
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

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Appointments</CardTitle>
          <CardDescription>
            {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-2 text-muted-foreground">Loading appointments...</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {error ? (
                <div>
                  <p className="text-red-600 mb-2">{error}</p>
                  <Button variant="outline" onClick={fetchAppointments}>Retry</Button>
                </div>
              ) : (
                "No appointments found."
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Services</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">#{appointment.id}</TableCell>
                    <TableCell>
                      {appointment.appointment_date
                        ? new Date(appointment.appointment_date).toLocaleString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {appointment.customer?.name || "Unknown"}
                      {appointment.customer?.phone && (
                        <div className="text-xs text-muted-foreground">{appointment.customer.phone}</div>
                      )}
                    </TableCell>
                    <TableCell>{appointment.staff?.name || "-"}</TableCell>
                    <TableCell>
                      {appointment.services && appointment.services.length > 0 ? (
                        <div className="text-sm">
                          {appointment.services.slice(0, 2).map(s => s.name).join(", ")}
                          {appointment.services.length > 2 && ` +${appointment.services.length - 2} more`}
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {appointment.service_location ? (
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3" />
                          <span className="capitalize">{appointment.service_location}</span>
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {(appointment.status === 'scheduled' || appointment.status === 'pending') && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelAppointment(appointment.id)}
                            disabled={loading}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => fetchAppointmentDetails(appointment.id)}
                          disabled={loading}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Appointment Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              Appointment #{selectedAppointment?.id}
            </DialogDescription>
          </DialogHeader>
              {selectedAppointment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Appointment ID</Label>
                  <p className="font-medium">#{selectedAppointment.id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Date & Time</Label>
                  <p className="font-medium">
                    {selectedAppointment.appointment_date
                      ? new Date(selectedAppointment.appointment_date).toLocaleString()
                      : "-"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Customer</Label>
                  <p className="font-medium">
                    {selectedAppointment.customer?.name || "Unknown"}
                  </p>
                  {selectedAppointment.customer?.phone && (
                    <p className="text-sm text-muted-foreground">{selectedAppointment.customer.phone}</p>
                  )}
                </div>
                <div>
                  <Label className="text-muted-foreground">Staff</Label>
                  <p className="font-medium">{selectedAppointment.staff?.name || "-"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge variant={getStatusBadgeVariant(selectedAppointment.status)}>
                    {selectedAppointment.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Service Location
                  </Label>
                  <p className="font-medium capitalize">
                    {selectedAppointment.service_location || "Salon"}
                    {selectedAppointment.service_location === "home" && selectedAppointment.home_service_address && (
                      <span className="text-sm text-muted-foreground block mt-1">{selectedAppointment.home_service_address}</span>
                    )}
                  </p>
                </div>
                {selectedAppointment.sale_id && (
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Linked Sale</Label>
                    <p className="font-medium text-blue-600">Sale #{selectedAppointment.sale_id}</p>
                  </div>
                )}
              </div>

              {selectedAppointment.services && selectedAppointment.services.length > 0 && (
                <div>
                  <Label className="text-muted-foreground mb-2 block">Services</Label>
                  <div className="space-y-2">
                    {selectedAppointment.services.map((service, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <p className="font-medium">{service.name}</p>
                        {service.price && (
                          <p className="text-sm text-muted-foreground">KES {service.price.toLocaleString()}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedAppointment.notes && (
                <div>
                  <Label className="text-muted-foreground mb-2 block">Notes</Label>
                  <p className="text-sm">{selectedAppointment.notes}</p>
                </div>
              )}

              {(selectedAppointment.status === 'scheduled' || selectedAppointment.status === 'pending') && (
                <div className="flex justify-end pt-4 border-t">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleCancelAppointment(selectedAppointment.id)
                    }}
                    disabled={loading}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel Appointment
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
