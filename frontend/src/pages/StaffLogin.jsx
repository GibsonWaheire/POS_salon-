import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"

export default function StaffLogin() {
  const [staffId, setStaffId] = useState("")
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showDemo, setShowDemo] = useState(false)
  const { staffLogin } = useAuth()
  const navigate = useNavigate()
  const staffIdRef = useRef(null)
  const pinRef = useRef(null)

  // Focus input on mount and clear any stored values
  useEffect(() => {
    // Clear any autocomplete/autofill data
    if (staffIdRef.current) {
      staffIdRef.current.focus()
      staffIdRef.current.value = ""
    }
    // Clear local state
    setStaffId("")
    setPin("")
    setError("")
  }, [])

  // Handle Staff ID input
  const handleStaffIdChange = (e) => {
    const value = e.target.value.replace(/\D/g, "") // Only allow numbers
    if (value.length <= 10) { // Reasonable max for ID
      setStaffId(value)
      setError("")
    }
  }

  // Handle Staff ID Enter key - move to PIN field
  const handleStaffIdKeyDown = (e) => {
    if (e.key === "Enter" && staffId.trim()) {
      e.preventDefault()
      if (pinRef.current) {
        pinRef.current.focus()
      }
    }
  }

  // Prevent autocomplete/autofill for PIN
  const handlePinChange = (e) => {
    const value = e.target.value
    // Only allow 5 characters
    if (value.length <= 5) {
      setPin(value)
      setError("")
    }
  }

  // Handle paste to prevent pasting invalid values for PIN
  const handlePinPaste = (e) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData("text").slice(0, 5)
    setPin(pastedText)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    
    // Validate Staff ID
    if (!staffId || !staffId.trim()) {
      setError("Staff ID is required")
      if (staffIdRef.current) {
        staffIdRef.current.focus()
      }
      return
    }

    // Validate PIN format
    if (!pin || pin.length !== 5) {
      setError("PIN must be exactly 5 characters")
      if (pinRef.current) {
        pinRef.current.focus()
      }
      return
    }

    const hasDigit = /\d/.test(pin)
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]/.test(pin)
    
    if (!hasDigit || !hasSpecial) {
      setError("PIN must contain at least one digit and one special character")
      if (pinRef.current) {
        pinRef.current.focus()
      }
      return
    }

    setLoading(true)

    try {
      const result = await staffLogin(staffId.trim(), pin)
      if (result.success) {
        // Clear fields after successful login
        setStaffId("")
        setPin("")
        if (staffIdRef.current) staffIdRef.current.value = ""
        if (pinRef.current) pinRef.current.value = ""
        navigate("/pos")
      } else {
        setError(result.error || "Invalid Staff ID or PIN")
        // Clear PIN on error for security, keep Staff ID for retry
        setPin("")
        if (pinRef.current) {
          pinRef.current.focus()
        }
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      setPin("")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Staff Login</h1>
          <p className="text-muted-foreground">Enter your Staff ID and PIN</p>
          <p className="text-xs text-muted-foreground mt-1">PIN format: 4 digits + 1 special character</p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Secure Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} autoComplete="off">
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md mb-4">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                {/* Staff ID Field */}
                <div className="space-y-2">
                  <Label htmlFor="staffId" className="text-base font-medium">
                    Staff ID
                  </Label>
                  <Input
                    ref={staffIdRef}
                    id="staffId"
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter Staff ID"
                    value={staffId}
                    onChange={handleStaffIdChange}
                    onKeyDown={handleStaffIdKeyDown}
                    required
                    disabled={loading}
                    className="h-12 text-lg text-center font-semibold"
                    autoFocus
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    data-form-type="other"
                    data-lpignore="true"
                    data-1p-ignore="true"
                  />
                </div>

                {/* PIN Field */}
                <div className="space-y-2">
                  <Label htmlFor="pin" className="text-base font-medium">
                    Staff PIN
                  </Label>
                  <Input
                    ref={pinRef}
                    id="pin"
                    type="text"
                    inputMode="text"
                    placeholder="Enter 5-char PIN"
                    value={pin}
                    onChange={handlePinChange}
                    onPaste={handlePinPaste}
                    required
                    disabled={loading}
                    className="h-12 text-lg text-center font-mono tracking-widest"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    maxLength={5}
                    // Prevent browser autofill/password managers
                    data-form-type="other"
                    data-lpignore="true"
                    data-1p-ignore="true"
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    Example format: 4 digits + 1 special character
                  </p>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold mt-4" 
                disabled={loading || !staffId || pin.length !== 5}
              >
                {loading ? "Logging in..." : "Login to POS"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-4">
          PIN is not saved on this device for security
        </p>

        {/* Demo Access Toggle */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowDemo(!showDemo)}
            className="w-full h-10 rounded-xl border-2 border-border bg-muted/50 text-foreground text-sm font-semibold hover:bg-muted transition-all flex items-center justify-center gap-2"
          >
            {showDemo ? "Hide Demo Access" : "Try a Demo Account"}
            <span className="text-xs">{showDemo ? "▲" : "▼"}</span>
          </button>

          {showDemo && (
            <div className="mt-3 p-4 rounded-2xl bg-muted/40 border-2 border-border">
              <p className="text-xs text-muted-foreground mb-3 text-center">
                Contact us via WhatsApp to get a demo Staff ID and PIN
              </p>
              <a
                href="https://wa.me/254727957175?text=Hi%2C%20I%27d%20like%20the%20demo%20Staff%20ID%20and%20PIN%20for%20Salonyst"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full h-10 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                  alt="WhatsApp"
                  className="w-5 h-5"
                />
                Get Demo Access on WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
