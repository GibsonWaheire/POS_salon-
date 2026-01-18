import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export default function Appointments() {
  const [appointments] = useState([])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-muted-foreground">Manage and schedule appointments</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>New Appointment</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
              <DialogDescription>Enter appointment details below.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="customer">Customer</Label>
                <Input id="customer" placeholder="Select customer" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date & Time</Label>
                <Input id="date" type="datetime-local" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="service">Service</Label>
                <Input id="service" placeholder="Select service" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="staff">Staff Member</Label>
                <Input id="staff" placeholder="Select staff" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Schedule Appointment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Appointments</CardTitle>
          <CardDescription>View and manage all scheduled appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No appointments found.
                  </TableCell>
                </TableRow>
              ) : (
                appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>{appointment.customer?.name}</TableCell>
                    <TableCell>{new Date(appointment.appointment_date).toLocaleString()}</TableCell>
                    <TableCell>{appointment.services?.map(s => s.name).join(", ")}</TableCell>
                    <TableCell>{appointment.staff?.name}</TableCell>
                    <TableCell>
                      <Badge variant={appointment.status === "scheduled" ? "default" : "secondary"}>
                        {appointment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

