import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, X } from "lucide-react"
import { apiRequest } from "@/lib/api"

export default function ResourceSelector({ value, onValueChange, resources = [], onResourcesChange, isAdmin = false }) {
  const [manageDialogOpen, setManageDialogOpen] = useState(false)
  const [newResourceName, setNewResourceName] = useState("")
  const [newResourceType, setNewResourceType] = useState("room")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleCreateResource = async () => {
    if (!newResourceName.trim()) {
      setError("Resource name is required")
      return
    }

    setLoading(true)
    setError("")
    try {
      const newResource = await apiRequest("/resources", {
        method: "POST",
        body: JSON.stringify({
          name: newResourceName,
          type: newResourceType,
          is_active: true
        })
      })
      
      if (onResourcesChange) {
        onResourcesChange([...resources, newResource])
      }
      setNewResourceName("")
      setNewResourceType("room")
      setManageDialogOpen(false)
    } catch (err) {
      setError(err.message || "Failed to create resource")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Resource (optional)</Label>
        {isAdmin && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setManageDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Manage
          </Button>
        )}
      </div>
      <Select
        value={value?.toString() || "none"}
        onValueChange={(v) => onValueChange(v === "none" ? null : parseInt(v))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select resource" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No Resource</SelectItem>
          {resources
            .filter(r => r.is_active)
            .map((resource) => (
              <SelectItem key={resource.id} value={resource.id.toString()}>
                {resource.name}
                {resource.type && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    {resource.type}
                  </Badge>
                )}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      {isAdmin && (
        <Dialog open={manageDialogOpen} onOpenChange={setManageDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Resources</DialogTitle>
              <DialogDescription>
                Create rooms, equipment, or other resources that can be scheduled.
              </DialogDescription>
            </DialogHeader>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Resource Name *</Label>
                <Input
                  placeholder="e.g., Massage Room 1, Tanning Bed A"
                  value={newResourceName}
                  onChange={(e) => setNewResourceName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Resource Type</Label>
                <Select
                  value={newResourceType}
                  onValueChange={setNewResourceType}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="room">Room</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setManageDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateResource} disabled={loading || !newResourceName.trim()}>
                {loading ? "Creating..." : "Create Resource"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
