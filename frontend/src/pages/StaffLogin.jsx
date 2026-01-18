import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"

export default function StaffLogin() {
  const [pinOrId, setPinOrId] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { staffLogin } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await staffLogin(pinOrId)
      if (result.success) {
        navigate("/pos")
      } else {
        setError(result.error || "Invalid Staff ID or PIN")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Staff Login</h1>
          <p className="text-muted-foreground">Enter your Staff ID or PIN</p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="pinOrId" className="text-base font-medium">
                  Staff ID / PIN
                </Label>
                <Input
                  id="pinOrId"
                  type="text"
                  placeholder="Enter your Staff ID or PIN"
                  value={pinOrId}
                  onChange={(e) => setPinOrId(e.target.value)}
                  required
                  disabled={loading}
                  className="h-12 text-lg text-center font-semibold"
                  autoFocus
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold" 
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login to POS"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-4">
          For manager access, use the main login page
        </p>
      </div>
    </div>
  )
}

