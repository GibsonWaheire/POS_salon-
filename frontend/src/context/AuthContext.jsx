import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(null) 
// createContext is a function that creates a new context object.

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [staff, setStaff] = useState(null)
  const [isStaffAuthenticated, setIsStaffAuthenticated] = useState(false)
  const [isDemoUser, setIsDemoUser] = useState(false)
  const [demoSessionExpiresAt, setDemoSessionExpiresAt] = useState(null)
  const [demoMode, setDemoMode] = useState(false) // For admin/manager toggle

  // Check localStorage on mount (only for manager/admin, NOT for staff)
  useEffect(() => {
    const storedUser = localStorage.getItem("salon_user")
    const storedAuth = localStorage.getItem("salon_auth")
    if (storedUser && storedAuth === "true") {
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
    
    // Staff authentication is NOT persisted - must login each session
    // Clear any old staff data that might be in localStorage
    localStorage.removeItem("salon_staff")
    localStorage.removeItem("salon_staff_auth")
  }, [])

  // Auto-logout timer for demo users
  useEffect(() => {
    if (!isDemoUser || !demoSessionExpiresAt) return

    const checkSession = async () => {
      if (!staff?.login_log_id && !staff?.id) return

      try {
        const url = staff.login_log_id
          ? `http://localhost:5001/api/staff/check-session?login_log_id=${staff.login_log_id}`
          : `http://localhost:5001/api/staff/check-session?staff_id=${staff.id}`
        
        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          if (data.expired) {
            // Session expired - auto logout
            alert("Demo session expired. Logging out...")
            await staffLogout()
            window.location.href = "/staff-login"
          }
        }
      } catch (err) {
        console.error("Failed to check session:", err)
      }
    }

    // Check every minute
    const interval = setInterval(checkSession, 60000)
    
    // Also check immediately
    checkSession()

    return () => clearInterval(interval)
  }, [isDemoUser, demoSessionExpiresAt, staff])

  const login = async (email, password) => {
    try {
      if (!email || !password) {
        return { success: false, error: "Email and password are required" }
      }

      // Call backend API for authentication
      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: email.trim(),
          password: password 
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return { 
          success: false, 
          error: errorData.error || "Invalid email or password" 
        }
      }

      const data = await response.json()
      
      if (data.success && data.user) {
        // Store user data
        setUser(data.user)
        setIsAuthenticated(true)
        localStorage.setItem("salon_user", JSON.stringify(data.user))
        localStorage.setItem("salon_auth", "true")
        return { success: true }
      } else {
        return { success: false, error: "Invalid email or password" }
      }
    } catch (err) {
      console.error("Login error:", err)
      return { 
        success: false, 
        error: "Unable to connect. Please check your internet connection and try again." 
      }
    }
  }

  const staffLogin = async (staffId, pin) => {
    try {
      // Validate Staff ID
      if (!staffId || !staffId.toString().trim()) {
        return { success: false, error: "Staff ID is required" }
      }

      // Validate PIN format on client side first
      if (!pin || pin.length !== 5) {
        return { success: false, error: "PIN must be exactly 5 characters" }
      }
      
      // Check if PIN contains at least one digit and one special character
      const hasDigit = /\d/.test(pin)
      const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]/.test(pin)
      
      if (!hasDigit || !hasSpecial) {
        return { success: false, error: "PIN must contain at least one digit and one special character" }
      }
      
      // Call backend API for staff authentication with BOTH Staff ID and PIN
      let response
      try {
        response = await fetch("http://localhost:5001/api/staff/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          staff_id: staffId.toString().trim(), 
          pin: pin 
        }),
      })
      } catch (fetchErr) {
        console.error("Staff login network error:", fetchErr)
        return { 
          success: false, 
          error: "Unable to connect. Please check your internet connection and try again." 
        }
      }
      
      let data
      try {
        data = await response.json()
      } catch (jsonErr) {
        return { 
          success: false, 
          error: "Login failed. Please check your credentials and try again." 
        }
      }
      
      if (data.success && data.staff) {
        const staffData = {
          ...data.staff,
          role: "staff",
          login_log_id: data.login_log_id, // Store login log ID for logout tracking
          isDemo: data.is_demo || false // Store demo flag
        }
        
        // Store demo session info
        setIsDemoUser(data.is_demo || false)
        if (data.demo_session_expires_at) {
          setDemoSessionExpiresAt(new Date(data.demo_session_expires_at))
        } else {
          setDemoSessionExpiresAt(null)
        }
        
        // Store in memory only, NOT in localStorage for security
        setStaff(staffData)
        setIsStaffAuthenticated(true)
        // Explicitly do NOT save to localStorage
        return { success: true }
      } else {
        return { success: false, error: data.error || "Invalid Staff ID or PIN" }
      }
    } catch (err) {
      console.error("Staff login error:", err)
      return { success: false, error: "An error occurred. Please try again." }
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("salon_user")
    localStorage.removeItem("salon_auth")
  }

  const staffLogout = async () => {
    // Log logout event to backend if staff is logged in
    if (staff) {
      try {
        await fetch("http://localhost:5001/api/staff/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            login_log_id: staff.login_log_id,
            staff_id: staff.id
          })
        })
      } catch (err) {
        console.error("Failed to log logout event:", err)
        // Continue with logout even if backend call fails
      }
    }
    
    // Reset demo state
    setIsDemoUser(false)
    setDemoSessionExpiresAt(null)
    
    setStaff(null)
    setIsStaffAuthenticated(false)
    // Clear any staff data from localStorage (shouldn't be there, but clean up anyway)
    localStorage.removeItem("salon_staff")
    localStorage.removeItem("salon_staff_auth")
    // Clear sessionStorage as well
    sessionStorage.removeItem("salon_staff")
    sessionStorage.removeItem("salon_staff_auth")
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      logout,
      staff,
      isStaffAuthenticated,
      staffLogin,
      staffLogout,
      isDemoUser,
      demoSessionExpiresAt,
      demoMode,
      setDemoMode
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

