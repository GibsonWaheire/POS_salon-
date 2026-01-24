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
import { Plus, Edit, Clock, LogIn, LogOut, Calendar, User, Search, Trash2 } from "lucide-react"
import { apiRequest } from "@/lib/api"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

export default function Shifts() {
  const [shifts, setShifts] = useState([])
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingShift, setEditingShift] = useState(null)
  const [selectedStaffId, setSelectedStaffId] = useState("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  
  const [formData, setFormData] = useState({
    staff_id: "all",
    shift_date: new Date().toISOString().split('T')[0],
    start_time: "09:00",
    end_time: "17:00",
    notes: ""
  })

  useEffect(() => {
    fetchStaff()
    fetchShifts()
  }, [])

  useEffect(() => {
    fetchShifts()
  }, [selectedStaffId, startDate, endDate])

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

  const fetchShifts = async () => {
    try {
      setLoading(true)
      setError("")
      let url = "http://localhost:5001/api/shifts"
      const params = new URLSearchParams()
      if (selectedStaffId && selectedStaffId !== "all") params.append("staff_id", selectedStaffId)
      if (startDate) params.append("start_date", startDate)
      if (endDate) params.append("end_date", endDate)
      if (params.toString()) url += "?" + params.toString()
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setShifts(data)
      } else {
        setError("Failed to fetch shifts")
      }
    } catch (err) {
      setError("Unable to load shifts. Please check your connection.")
      console.error("Failed to fetch shifts:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingShift(null)
    setFormData({
      staff_id: "all",
      shift_date: new Date().toISOString().split('T')[0],
      start_time: "09:00",
      end_time: "17:00",
      notes: ""
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (shift) => {
    setEditingShift(shift)
    setFormData({
      staff_id: shift.staff_id.toString(),
      shift_date: shift.shift_date,
      start_time: shift.start_time,
      end_time: shift.end_time,
      notes: shift.notes || ""
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      // Validate staff_id
      if (!formData.staff_id || formData.staff_id === "all") {
        setError("Please select a staff member")
        return
      }

      if (editingShift) {
        // Update existing shift
        await apiRequest(`/shifts/${editingShift.id}`, {
          method: "PUT",
          body: JSON.stringify(formData)
        })
      } else {
        // Create new shift
        await apiRequest("/shifts", {
          method: "POST",
          body: JSON.stringify(formData)
        })
      }
      setIsDialogOpen(false)
      fetchShifts()
    } catch (err) {
      setError(err.message || "Failed to save shift")
    }
  }

  const handleClockIn = async (shiftId) => {
    try {
      await apiRequest(`/shifts/${shiftId}/clock-in`, {
        method: "POST"
      })
      fetchShifts()
    } catch (err) {
      setError(err.message || "Failed to clock in")
    }
  }

  const handleClockOut = async (shiftId) => {
    try {
      await apiRequest(`/shifts/${shiftId}/clock-out`, {
        method: "POST"
      })
      fetchShifts()
    } catch (err) {
      setError(err.message || "Failed to clock out")
    }
  }

  const handleDelete = async (shiftId) => {
    try {
      await apiRequest(`/shifts/${shiftId}`, {
        method: "DELETE"
      })
      fetchShifts()
    } catch (err) {
      setError(err.message || "Failed to delete shift")
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      scheduled: "secondary",
      active: "default",
      completed: "outline",
      missed: "destructive"
    }
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>
  }

  const getStaffName = (staffId) => {
    const staffMember = staff.find(s => s.id === staffId)
    return staffMember ? staffMember.name : `Staff #${staffId}`
  }

  const filteredShifts = shifts.filter(shift => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    const staffName = getStaffName(shift.staff_id).toLowerCase()
    return staffName.includes(query) || shift.shift_date.includes(query)
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Shifts Management</h1>
          <p className="text-muted-foreground">Manage staff shifts and attendance</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Shift
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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
                  placeholder="Search by staff or date..."
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

      {/* Shifts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Shifts</CardTitle>
          <CardDescription>
            {filteredShifts.length} shift{filteredShifts.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading shifts...</div>
          ) : filteredShifts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No shifts found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Clock In</TableHead>
                  <TableHead>Clock Out</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShifts.map((shift) => (
                  <TableRow key={shift.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {shift.shift_date ? new Date(shift.shift_date).toLocaleDateString() : "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {getStaffName(shift.staff_id)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {shift.start_time} - {shift.end_time}
                    </TableCell>
                    <TableCell>
                      {shift.clock_in
                        ? new Date(shift.clock_in).toLocaleString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {shift.clock_out
                        ? new Date(shift.clock_out).toLocaleString()
                        : "-"}
                    </TableCell>
                    <TableCell>{getStatusBadge(shift.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {shift.status === 'scheduled' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleClockIn(shift.id)}
                          >
                            <LogIn className="h-4 w-4 mr-1" />
                            Clock In
                          </Button>
                        )}
                        {shift.status === 'active' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleClockOut(shift.id)}
                          >
                            <LogOut className="h-4 w-4 mr-1" />
                            Clock Out
                          </Button>
                        )}
                        {shift.status === 'scheduled' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(shift)}
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
                                  <AlertDialogTitle>Delete Shift</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this shift? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(shift.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                        {shift.status === 'missed' && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Shift</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this missed shift? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(shift.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
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
            <DialogTitle>{editingShift ? "Edit Shift" : "Create New Shift"}</DialogTitle>
            <DialogDescription>
              {editingShift ? "Update shift information" : "Schedule a new shift for a staff member."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="staff_id">Staff Member *</Label>
              <Select
                value={formData.staff_id || "all"}
                onValueChange={(value) => setFormData({ ...formData, staff_id: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  {staff.map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      {s.name} ({s.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="shift_date">Shift Date *</Label>
              <Input
                id="shift_date"
                type="date"
                value={formData.shift_date}
                onChange={(e) => setFormData({ ...formData, shift_date: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start_time">Start Time *</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end_time">End Time *</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                placeholder="Optional notes about this shift"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
                {editingShift ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
