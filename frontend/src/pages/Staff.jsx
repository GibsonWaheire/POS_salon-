import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Edit, Trash2, History, TrendingUp } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { toast } from "sonner"

const formatKES = (amount) => {
  return `KES ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default function Staff() {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [loginHistory, setLoginHistory] = useState([])
  const [staffPerformance, setStaffPerformance] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [staffToDelete, setStaffToDelete] = useState(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    role: "stylist",
    pin: "",
    is_active: true
  })

  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/staff")
      if (response.ok) {
        const data = await response.json()
        setStaff(data)
      }
    } catch (err) {
      console.error("Failed to fetch staff:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchStaffDetails = async (staffId) => {
    try {
      // Fetch login history
      const historyResponse = await fetch(`http://localhost:5001/api/staff/${staffId}/login-history?limit=20`)
      if (historyResponse.ok) {
        const historyData = await historyResponse.json()
        setLoginHistory(historyData.login_history || [])
      }

      // Fetch performance
      const perfResponse = await fetch(`http://localhost:5001/api/staff/${staffId}/performance?today_only=true`)
      if (perfResponse.ok) {
        const perfData = await perfResponse.json()
        setStaffPerformance(perfData)
      }
    } catch (err) {
      console.error("Failed to fetch staff details:", err)
    }
  }

  const handleOpenDetails = (staffMember) => {
    setSelectedStaff(staffMember)
    setIsDetailsOpen(true)
    fetchStaffDetails(staffMember.id)
  }

  const handleOpenEdit = (staffMember) => {
    setSelectedStaff(staffMember)
    setFormData({
      name: staffMember.name || "",
      phone: staffMember.phone || "",
      email: staffMember.email || "",
      role: staffMember.role || "stylist",
      pin: "",
      is_active: staffMember.is_active !== false
    })
    setIsDialogOpen(true)
  }

  const handleOpenAdd = () => {
    setSelectedStaff(null)
    setFormData({
      name: "",
      phone: "",
      email: "",
      role: "stylist",
      pin: "",
      is_active: true
    })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    try {
      const url = selectedStaff 
        ? `http://localhost:5001/api/staff/${selectedStaff.id}`
        : "http://localhost:5001/api/staff"
      
      const method = selectedStaff ? "PUT" : "POST"
      
      const payload = {
        name: formData.name,
        phone: formData.phone || null,
        email: formData.email || null,
        role: formData.role,
        is_active: formData.is_active
      }

      // Only include PIN if it's provided (for new staff or when updating)
      if (formData.pin) {
        payload.pin = formData.pin
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        setIsDialogOpen(false)
        fetchStaff()
        setFormData({
          name: "",
          phone: "",
          email: "",
          role: "stylist",
          pin: "",
          is_active: true
        })
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to save staff member")
      }
    } catch (err) {
      console.error("Error saving staff:", err)
      toast.error("An error occurred while saving staff member")
    }
  }

  const handleDelete = async () => {
    if (!staffToDelete) return

    try {
      const response = await fetch(`http://localhost:5001/api/staff/${staffToDelete.id}`, {
        method: "DELETE"
      })

      if (response.ok) {
        setIsDeleteOpen(false)
        setStaffToDelete(null)
        fetchStaff()
      } else {
        toast.error("Failed to delete staff member")
      }
    } catch (err) {
      console.error("Error deleting staff:", err)
      alert("An error occurred while deleting staff member")
    }
  }

  const handleRoleUpdate = async (staffId, newRole) => {
    try {
      const response = await fetch(`http://localhost:5001/api/staff/${staffId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole })
      })

      if (response.ok) {
        fetchStaff()
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to update role")
      }
    } catch (err) {
      console.error("Error updating role:", err)
      toast.error("An error occurred while updating role")
    }
  }

  const validatePIN = (pin) => {
    if (!pin) return true // PIN is optional for updates
    if (pin.length !== 5) return false
    const hasDigit = /\d/.test(pin)
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]/.test(pin)
    return hasDigit && hasSpecial
  }

  const roles = [
    { value: "manager", label: "Manager" },
    { value: "stylist", label: "Stylist" },
    { value: "receptionist", label: "Receptionist" },
    { value: "nail_technician", label: "Nail Technician" },
    { value: "facial_specialist", label: "Facial Specialist" },
    { value: "admin", label: "Admin" }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Staff Management</h1>
          <p className="text-muted-foreground">Manage staff members, roles, and view activity</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenAdd}>Add Staff Member</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedStaff ? "Edit Staff Member" : "Add New Staff Member"}</DialogTitle>
              <DialogDescription>
                {selectedStaff ? "Update staff member information" : "Enter staff member information below"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="Jane Smith"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="+254 712 345 678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jane@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role *</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pin">
                  PIN {selectedStaff ? "(leave blank to keep current)" : "*"}
                </Label>
                <Input
                  id="pin"
                  type="text"
                  placeholder="1234@"
                  value={formData.pin}
                  onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                  maxLength={5}
                />
                <p className="text-xs text-muted-foreground">
                  5 characters: 4 digits + 1 special character
                </p>
                {formData.pin && !validatePIN(formData.pin) && (
                  <p className="text-xs text-red-600">Invalid PIN format</p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">Active</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!formData.name || (!selectedStaff && (!formData.pin || !validatePIN(formData.pin)))}
              >
                {selectedStaff ? "Update" : "Add"} Staff Member
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Staff Members</CardTitle>
          <CardDescription>View and manage staff information</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading staff...</div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No staff members found.
                  </TableCell>
                </TableRow>
              ) : (
                staff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.phone || "-"}</TableCell>
                    <TableCell>{member.email || "-"}</TableCell>
                      <TableCell>
                        <Select
                          value={member.role || "stylist"}
                          onValueChange={(value) => handleRoleUpdate(member.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role.value} value={role.value}>
                                {role.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Badge variant={member.is_active !== false ? "default" : "secondary"}>
                          {member.is_active !== false ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {member.last_login
                          ? new Date(member.last_login).toLocaleDateString()
                          : "Never"}
                      </TableCell>
                    <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDetails(member)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEdit(member)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog open={isDeleteOpen && staffToDelete?.id === member.id} onOpenChange={(open) => {
                            if (!open) {
                              setIsDeleteOpen(false)
                              setStaffToDelete(null)
                            }
                          }}>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setStaffToDelete(member)
                                  setIsDeleteOpen(true)
                                }}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete {member.name}. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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

      {/* Staff Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Staff Details: {selectedStaff?.name}</DialogTitle>
            <DialogDescription>View login history and performance</DialogDescription>
          </DialogHeader>
          {selectedStaff && (
            <Tabs defaultValue="profile" className="w-full">
              <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="history">Login History</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>
              <TabsContent value="profile" className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <Label>Name</Label>
                    <p className="font-medium">{selectedStaff.name}</p>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <p>{selectedStaff.phone || "-"}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p>{selectedStaff.email || "-"}</p>
                  </div>
                  <div>
                    <Label>Role</Label>
                    <p className="capitalize">{selectedStaff.role || "-"}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge variant={selectedStaff.is_active !== false ? "default" : "secondary"}>
                      {selectedStaff.is_active !== false ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div>
                    <Label>Last Login</Label>
                    <p>{selectedStaff.last_login ? new Date(selectedStaff.last_login).toLocaleString() : "Never"}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="history" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4" />
                    <h3 className="font-semibold">Login History</h3>
                  </div>
                  {loginHistory.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Login Time</TableHead>
                          <TableHead>Logout Time</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>IP Address</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loginHistory.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell>
                              {log.login_time ? new Date(log.login_time).toLocaleString() : "N/A"}
                            </TableCell>
                            <TableCell>
                              {log.logout_time ? new Date(log.logout_time).toLocaleString() : "Active"}
                            </TableCell>
                            <TableCell>
                              {log.session_duration
                                ? `${Math.floor(log.session_duration / 60)}m ${log.session_duration % 60}s`
                                : "-"}
                            </TableCell>
                            <TableCell>{log.ip_address || "-"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-sm text-muted-foreground">No login history found</p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="performance" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <h3 className="font-semibold">Today's Performance</h3>
                  </div>
                  {staffPerformance ? (
                    <div className="grid gap-4 md:grid-cols-3">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Total Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{formatKES(staffPerformance.total_revenue)}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Total Commission</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold text-green-600">
                            {formatKES(staffPerformance.total_commission)}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Transactions</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{staffPerformance.transaction_count}</p>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No performance data available</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
