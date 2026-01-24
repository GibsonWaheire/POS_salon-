import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { apiRequest } from "@/lib/api"

export default function SlotBlockerDialog({ open, onOpenChange, blocker = null, staffList = [], onSuccess }) {
  const [formData, setFormData] = useState({
    staff_id: blocker?.staff_id || null,
    start_date: blocker?.start_date ? new Date(blocker.start_date).toISOString().slice(0, 16) : '',
    end_date: blocker?.end_date ? new Date(blocker.end_date).toISOString().slice(0, 16) : '',
    reason: blocker?.reason || '',
    is_recurring: blocker?.is_recurring || false,
    recurring_pattern: blocker?.recurring_pattern || ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (blocker) {
      setFormData({
        staff_id: blocker.staff_id || null,
        start_date: blocker.start_date ? new Date(blocker.start_date).toISOString().slice(0, 16) : '',
        end_date: blocker.end_date ? new Date(blocker.end_date).toISOString().slice(0, 16) : '',
        reason: blocker.reason || '',
        is_recurring: blocker.is_recurring || false,
        recurring_pattern: blocker.recurring_pattern || ''
      })
    } else {
      setFormData({
        staff_id: null,
        start_date: '',
        end_date: '',
        reason: '',
        is_recurring: false,
        recurring_pattern: ''
      })
    }
    setError("")
  }, [blocker, open])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!formData.start_date || !formData.end_date) {
      setError("Start date and end date are required")
      setLoading(false)
      return
    }

    if (new Date(formData.end_date) <= new Date(formData.start_date)) {
      setError("End date must be after start date")
      setLoading(false)
      return
    }

    try {
      const payload = {
        staff_id: formData.staff_id || null,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
        reason: formData.reason || null,
        is_recurring: formData.is_recurring,
        recurring_pattern: formData.is_recurring ? formData.recurring_pattern : null
      }

      if (blocker) {
        await apiRequest(`/slot-blockers/${blocker.id}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        })
      } else {
        await apiRequest("/slot-blockers", {
          method: "POST",
          body: JSON.stringify(payload)
        })
      }

      if (onSuccess) onSuccess()
      onOpenChange(false)
    } catch (err) {
      setError(err.message || "Failed to save slot blocker")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{blocker ? "Edit Slot Blocker" : "Create Slot Blocker"}</DialogTitle>
          <DialogDescription>
            Block time slots for days off, breaks, or unavailable times. Leave staff blank to apply to all staff.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Staff (optional - leave blank for all staff)</Label>
              <Select
                value={formData.staff_id?.toString() || "all"}
                onValueChange={(v) => setFormData({ ...formData, staff_id: v === "all" ? null : parseInt(v) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select staff or leave for all" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Staff</SelectItem>
                  {staffList.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id.toString()}>
                      {staff.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date & Time *</Label>
                <Input
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>End Date & Time *</Label>
                <Input
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Reason (optional)</Label>
              <Textarea
                placeholder="e.g., Day Off, Break Time, Maintenance"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                rows={2}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="recurring"
                checked={formData.is_recurring}
                onCheckedChange={(checked) => setFormData({ ...formData, is_recurring: checked })}
              />
              <Label htmlFor="recurring">Recurring blocker</Label>
            </div>

            {formData.is_recurring && (
              <div className="space-y-2">
                <Label>Recurring Pattern *</Label>
                <Select
                  value={formData.recurring_pattern}
                  onValueChange={(v) => setFormData({ ...formData, recurring_pattern: v })}
                  required={formData.is_recurring}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select pattern" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : blocker ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
