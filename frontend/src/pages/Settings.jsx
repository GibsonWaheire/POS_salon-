import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Settings as SettingsIcon } from "lucide-react"
import { BUSINESS_TYPES, getBusinessTypeName } from "@/lib/serviceCategories"
import { apiRequest } from "@/lib/api"

export default function Settings() {
  const [businessType, setBusinessType] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    setError("")
    try {
      const data = await apiRequest("/settings")
      setBusinessType(data.business_type ?? "")
    } catch (err) {
      setError(err.message || "Could not load settings")
    } finally {
      setLoading(false)
    }
  }

  const handleBusinessTypeChange = async (value) => {
    setSaving(true)
    setError("")
    try {
      await apiRequest("/settings", {
        method: "PUT",
        body: JSON.stringify({ business_type: value || null }),
      })
      setBusinessType(value ?? "")
    } catch (err) {
      setError(err.message || "Could not save")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Business type and organization config (admin-side). Used for POS labels.</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Business type
          </CardTitle>
          <CardDescription>
            What kind of business are you? This is used in POS headers and receipts. Set here in admin; POS reads it for labels only.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (
            <div className="space-y-2 max-w-md">
              <Label>Business type</Label>
              <Select
                value={businessType || "none"}
                onValueChange={(v) => handleBusinessTypeChange(v === "none" ? "" : v)}
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {BUSINESS_TYPES.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {saving && <p className="text-xs text-muted-foreground">Saving…</p>}
              {businessType && (
                <p className="text-sm text-muted-foreground">
                  Current: {getBusinessTypeName(businessType)}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
