import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar } from "lucide-react"
import { apiRequest } from "@/lib/api"

export default function RecurringBookingDialog({ open, onOpenChange, templateData, onSuccess }) {
  const [formData, setFormData] = useState({
    pattern: 'weekly',
    start_date: '',
    end_date: '',
    preview_count: 5
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [previewDates, setPreviewDates] = useState([])

  const generatePreview = () => {
    if (!formData.start_date || !formData.end_date || !formData.pattern) return
    
    const start = new Date(formData.start_date)
    const end = new Date(formData.end_date)
    const dates = []
    let current = new Date(start)
    
    const deltaMap = {
      daily: 1,
      weekly: 7,
      monthly: 30
    }
    
    const deltaDays = deltaMap[formData.pattern] || 7
    
    while (current <= end && dates.length < formData.preview_count) {
      dates.push(new Date(current))
      current = new Date(current.getTime() + deltaDays * 24 * 60 * 60 * 1000)
    }
    
    setPreviewDates(dates)
  }

  useEffect(() => {
    if (open && formData.start_date && formData.end_date) {
      generatePreview()
    }
  }, [formData.start_date, formData.end_date, formData.pattern, formData.preview_count, open])

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
      await apiRequest("/appointments/recurring", {
        method: "POST",
        body: JSON.stringify({
          template: templateData,
          pattern: formData.pattern,
          start_date: new Date(formData.start_date).toISOString(),
          end_date: new Date(formData.end_date).toISOString()
        })
      })

      if (onSuccess) onSuccess()
      onOpenChange(false)
      setFormData({ pattern: 'weekly', start_date: '', end_date: '', preview_count: 5 })
    } catch (err) {
      setError(err.message || "Failed to create recurring appointments")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Recurring Appointments</DialogTitle>
          <DialogDescription>
            Create a series of appointments that repeat automatically.
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
              <Label>Recurring Pattern *</Label>
              <Select
                value={formData.pattern}
                onValueChange={(v) => {
                  setFormData({ ...formData, pattern: v })
                  generatePreview()
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => {
                    setFormData({ ...formData, start_date: e.target.value })
                    setTimeout(generatePreview, 100)
                  }}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>End Date *</Label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => {
                    setFormData({ ...formData, end_date: e.target.value })
                    setTimeout(generatePreview, 100)
                  }}
                  required
                />
              </div>
            </div>

            {previewDates.length > 0 && (
              <div className="space-y-2">
                <Label>Preview (first {formData.preview_count} appointments)</Label>
                <div className="border rounded-lg p-3 max-h-40 overflow-y-auto">
                  <div className="space-y-1">
                    {previewDates.map((date, idx) => (
                      <div key={idx} className="text-sm flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Recurring Series"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
