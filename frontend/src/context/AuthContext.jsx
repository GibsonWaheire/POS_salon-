import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(null) 
// createContext is a function that creates a new context object.

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [staff, setStaff] = useState(null)
  const [isStaffAuthenticated, setIsStaffAuthenticated] = useState(false)

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

  const login = (email, password) => {
    // TODO: Replace with actual API call
    // For now, simple validation - in production, call backend API
    if (email && password) {
      // Mock user data - replace with actual API response
      const userData = {
        email,
        role: email.includes("admin") ? "admin" : "manager", // Simple role detection
        name: email.split("@")[0]
      }
      setUser(userData)
      setIsAuthenticated(true)
      localStorage.setItem("salon_user", JSON.stringify(userData))
      localStorage.setItem("salon_auth", "true")
      return { success: true }
    }
    return { success: false, error: "Email and password are required" }
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
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/89a825d3-7bb4-45cb-8c0c-0aecf18f6961',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.jsx:64',message:'Client validation failed: PIN format invalid',data:{hasDigit,hasSpecial},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
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
          error: "Cannot connect to server. Please ensure the backend server is running on http://localhost:5001" 
        }
      }
      
      let data
      try {
        data = await response.json()
      } catch (jsonErr) {
        return { 
          success: false, 
          error: `Server error (${response.status}). Please check if the backend is running correctly.` 
        }
      }
      
      if (data.success && data.staff) {
        const staffData = {
          ...data.staff,
          role: "staff",
          login_log_id: data.login_log_id // Store login log ID for logout tracking
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
      staffLogout
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

