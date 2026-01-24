import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/AuthContext"
import { Badge } from "@/components/ui/badge"

export default function DemoModeToggle() {
  const { user, demoMode, setDemoMode } = useAuth()
  const [loading, setLoading] = useState(false)

  // Check if user can toggle (admin or manager, not demo user)
  const canToggle = user && (user.role === 'admin' || user.role === 'manager')

  // For now, we'll use a simple approach: get staff_id from user email or use a default
  // In production, admin/manager should have Staff records
  const getStaffIdFromUser = () => {
    // Try to find staff by email matching user email
    // For now, return null and handle in backend
    return null
  }

  const handleToggle = async (checked) => {
    if (loading) return
    
    setLoading(true)
    try {
      // For admin/manager, we need to find their Staff record
      // For now, use email to find staff or create endpoint that works with user email
      // Temporary: use staff_id=1 for admin, staff_id=2 for manager (adjust as needed)
      const staffId = user.role === 'admin' ? 1 : 2
      
      const response = await fetch(`http://localhost:5001/api/staff/${staffId}/toggle-demo-mode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ demo_mode: checked })
      })

      if (response.ok) {
        const data = await response.json()
        setDemoMode(data.demo_mode)
        // Trigger page reload to refresh all data with new demo mode
        window.location.reload()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to toggle demo mode")
      }
    } catch (err) {
      console.error("Failed to toggle demo mode:", err)
      alert("Failed to toggle demo mode. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!canToggle) {
    return null
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <Switch
        id="demo-mode"
        checked={demoMode}
        onCheckedChange={handleToggle}
        disabled={loading}
      />
      <Label htmlFor="demo-mode" className="text-sm cursor-pointer text-gray-300">
        Demo Mode
      </Label>
      <Badge variant={demoMode ? "default" : "secondary"} className={`text-xs ${demoMode ? "bg-[#ef4444] text-white" : "bg-gray-700 text-gray-300"}`}>
        {demoMode ? "DEMO" : "LIVE"}
      </Badge>
    </div>
  )
}
