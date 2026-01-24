import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Phone, Calendar, DollarSign, Package, FileText } from "lucide-react"
import { apiRequest } from "@/lib/api"

const formatKES = (amount) => {
  return `KES ${amount?.toLocaleString('en-KE') || '0'}`
}

export default function AppointmentNotesDialog({ open, onOpenChange, appointment, onNoteAdded }) {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("")
  const [loading, setLoading] = useState(false)
  const [customerHistory, setCustomerHistory] = useState(null)

  useEffect(() => {
    if (appointment && open) {
      fetchNotes()
      fetchCustomerHistory()
    }
  }, [appointment?.id, open])

  const fetchNotes = async () => {
    if (!appointment?.id) return
    try {
      const data = await apiRequest(`/appointments/${appointment.id}/notes`)
      setNotes(data || [])
    } catch (err) {
      console.error("Failed to fetch notes:", err)
    }
  }

  const fetchCustomerHistory = async () => {
    if (!appointment?.customer_id) return
    try {
      // Fetch customer's purchase history and appointments
      const demoModeParam = appointment.is_demo ? 'true' : 'false'
      const [salesRes, appointmentsRes] = await Promise.all([
        fetch(`http://localhost:5001/api/sales?customer_id=${appointment.customer_id}&demo_mode=${demoModeParam}`).catch(() => null),
        fetch(`http://localhost:5001/api/appointments?customer_id=${appointment.customer_id}&demo_mode=${demoModeParam}`).catch(() => null)
      ])
      
      const sales = salesRes?.ok ? await salesRes.json() : []
      const appointments = appointmentsRes?.ok ? await appointmentsRes.json() : []
      
      setCustomerHistory({
        sales: sales || [],
        appointments: appointments || []
      })
    } catch (err) {
      console.error("Failed to fetch customer history:", err)
    }
  }

  const handleAddNote = async () => {
    if (!newNote.trim() || !appointment?.id) return
    
    setLoading(true)
    try {
      await apiRequest(`/appointments/${appointment.id}/notes`, {
        method: "POST",
        body: JSON.stringify({ note_text: newNote })
      })
      setNewNote("")
      await fetchNotes()
      if (onNoteAdded) onNoteAdded()
    } catch (err) {
      console.error("Failed to add note:", err)
    } finally {
      setLoading(false)
    }
  }

  if (!appointment) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Appointment Notes & Customer Info</DialogTitle>
          <DialogDescription>
            Appointment #{appointment.id} - {appointment.customer?.name || 'Customer'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="notes" className="w-full">
          <TabsList>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="customer">Customer Info</TabsTrigger>
            <TabsTrigger value="history">Purchase History</TabsTrigger>
            <TabsTrigger value="appointments">Scheduled Appointments</TabsTrigger>
          </TabsList>

          <TabsContent value="notes" className="space-y-4">
            <div className="space-y-2">
              <Label>Add Note</Label>
              <div className="flex gap-2">
                <Textarea
                  placeholder="Add a note about this appointment..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                />
                <Button onClick={handleAddNote} disabled={loading || !newNote.trim()}>
                  Add
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Existing Notes</Label>
              {notes.length === 0 ? (
                <p className="text-sm text-muted-foreground">No notes yet</p>
              ) : (
                <div className="space-y-2">
                  {notes.map((note) => (
                    <Card key={note.id}>
                      <CardContent className="p-3">
                        <p className="text-sm">{note.note_text}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {note.created_at ? new Date(note.created_at).toLocaleString() : ''}
                          {note.creator && ` by ${note.creator.name}`}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="customer" className="space-y-4">
            {appointment.customer && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-muted-foreground">Name</Label>
                    <p className="font-medium">{appointment.customer.name}</p>
                  </div>
                  {appointment.customer.phone && (
                    <div>
                      <Label className="text-muted-foreground flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone
                      </Label>
                      <p className="font-medium">{appointment.customer.phone}</p>
                    </div>
                  )}
                  {appointment.customer.email && (
                    <div>
                      <Label className="text-muted-foreground">Email</Label>
                      <p className="font-medium">{appointment.customer.email}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-muted-foreground">Total Visits</Label>
                    <p className="font-medium">{appointment.customer.total_visits || 0}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Total Spent
                    </Label>
                    <p className="font-medium">{formatKES(appointment.customer.total_spent || 0)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Loyalty Points</Label>
                    <p className="font-medium">{appointment.customer.loyalty_points || 0}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {customerHistory ? (
              customerHistory.sales.length === 0 ? (
                <p className="text-sm text-muted-foreground">No purchase history</p>
              ) : (
                <div className="space-y-2">
                  {customerHistory.sales.slice(0, 10).map((sale) => (
                    <Card key={sale.id}>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Sale #{sale.sale_number || sale.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {sale.created_at ? new Date(sale.created_at).toLocaleDateString() : ''}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatKES(sale.total_amount || 0)}</p>
                            <Badge variant={sale.status === 'completed' ? 'default' : 'secondary'}>
                              {sale.status}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )
            ) : (
              <p className="text-sm text-muted-foreground">Loading...</p>
            )}
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            {customerHistory ? (
              customerHistory.appointments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No other appointments</p>
              ) : (
                <div className="space-y-2">
                  {customerHistory.appointments
                    .filter(apt => apt.id !== appointment.id)
                    .slice(0, 10)
                    .map((apt) => (
                      <Card key={apt.id}>
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Appointment #{apt.id}</p>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {apt.appointment_date ? new Date(apt.appointment_date).toLocaleString() : ''}
                              </p>
                            </div>
                            <Badge variant={
                              apt.status === 'completed' ? 'default' :
                              apt.status === 'cancelled' ? 'destructive' :
                              'secondary'
                            }>
                              {apt.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )
            ) : (
              <p className="text-sm text-muted-foreground">Loading...</p>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
