import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(null)

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
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/89a825d3-7bb4-45cb-8c0c-0aecf18f6961',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.jsx:26',message:'Admin login function called',data:{email,hasPassword:!!password},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion
    // TODO: Replace with actual API call
    // For now, simple validation - in production, call backend API
    if (email && password) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/89a825d3-7bb4-45cb-8c0c-0aecf18f6961',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.jsx:31',message:'Admin login validation passed - creating mock user',data:{email},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
      // #endregion
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
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/89a825d3-7bb4-45cb-8c0c-0aecf18f6961',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.jsx:40',message:'Admin login successful - state set',data:{email,role:userData.role},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
      // #endregion
      return { success: true }
    }
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/89a825d3-7bb4-45cb-8c0c-0aecf18f6961',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.jsx:43',message:'Admin login validation failed',data:{hasEmail:!!email,hasPassword:!!password},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion
    return { success: false, error: "Email and password are required" }
  }

  const staffLogin = async (staffId, pin) => {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/89a825d3-7bb4-45cb-8c0c-0aecf18f6961',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.jsx:45',message:'Staff login function called',data:{staffId:staffId?.toString(),pinLength:pin?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C,D'})}).catch(()=>{});
    // #endregion
    try {
      // Validate Staff ID
      if (!staffId || !staffId.toString().trim()) {
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/89a825d3-7bb4-45cb-8c0c-0aecf18f6961',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.jsx:49',message:'Client validation failed: Staff ID missing',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
        return { success: false, error: "Staff ID is required" }
      }

      // Validate PIN format on client side first
      if (!pin || pin.length !== 5) {
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/89a825d3-7bb4-45cb-8c0c-0aecf18f6961',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.jsx:54',message:'Client validation failed: PIN length incorrect',data:{pinLength:pin?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        return { success: false, error: "PIN must be exactly 5 characters" }
      }
      
      // Check if PIN contains at least one digit and one special character
      const hasDigit = /\d/.test(pin)
      const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]/.test(pin)
      
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/89a825d3-7bb4-45cb-8c0c-0aecf18f6961',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.jsx:60',message:'Client PIN format check',data:{hasDigit,hasSpecial},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      
      if (!hasDigit || !hasSpecial) {
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/89a825d3-7bb4-45cb-8c0c-0aecf18f6961',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.jsx:64',message:'Client validation failed: PIN format invalid',data:{hasDigit,hasSpecial},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        return { success: false, error: "PIN must contain at least one digit and one special character" }
      }
      
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/89a825d3-7bb4-45cb-8c0c-0aecf18f6961',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.jsx:68',message:'About to call backend API',data:{url:'http://localhost:5001/api/staff/login',staffId:staffId.toString().trim()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      
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
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/89a825d3-7bb4-45cb-8c0c-0aecf18f6961',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.jsx:98',message:'Network error - fetch failed',data:{error:fetchErr.message,errorType:fetchErr.constructor.name,errorName:fetchErr.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        console.error("Staff login network error:", fetchErr)
        return { 
          success: false, 
          error: "Cannot connect to server. Please ensure the backend server is running on http://localhost:5001" 
        }
      }
      
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/89a825d3-7bb4-45cb-8c0c-0aecf18f6961',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.jsx:106',message:'Backend API response received',data:{status:response.status,statusText:response.statusText,ok:response.ok},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      
      let data
      try {
        data = await response.json()
      } catch (jsonErr) {
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/89a825d3-7bb4-45cb-8c0c-0aecf18f6961',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.jsx:112',message:'Failed to parse JSON response',data:{status:response.status,error:jsonErr.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        return { 
          success: false, 
          error: `Server error (${response.status}). Please check if the backend is running correctly.` 
        }
      }
      
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/89a825d3-7bb4-45cb-8c0c-0aecf18f6961',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.jsx:118',message:'Backend API response data parsed',data:{success:data.success,hasStaff:!!data.staff,error:data.error},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,C'})}).catch(()=>{});
      // #endregion
      
      if (data.success && data.staff) {
        const staffData = {
          ...data.staff,
          role: "staff",
          login_log_id: data.login_log_id // Store login log ID for logout tracking
        }
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/89a825d3-7bb4-45cb-8c0c-0aecf18f6961',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.jsx:125',message:'Staff login successful - setting state',data:{staffId:staffData.id,staffName:staffData.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        // Store in memory only, NOT in localStorage for security
        setStaff(staffData)
        setIsStaffAuthenticated(true)
        // Explicitly do NOT save to localStorage
        return { success: true }
      } else {
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/89a825d3-7bb4-45cb-8c0c-0aecf18f6961',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.jsx:133',message:'Staff login failed from backend',data:{error:data.error},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        return { success: false, error: data.error || "Invalid Staff ID or PIN" }
      }
    } catch (err) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/89a825d3-7bb4-45cb-8c0c-0aecf18f6961',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuthContext.jsx:137',message:'Staff login exception caught',data:{error:err.message,errorType:err.constructor.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
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

