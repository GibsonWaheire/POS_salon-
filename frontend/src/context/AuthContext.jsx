import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [staff, setStaff] = useState(null)
  const [isStaffAuthenticated, setIsStaffAuthenticated] = useState(false)

  // Check localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("salon_user")
    const storedAuth = localStorage.getItem("salon_auth")
    if (storedUser && storedAuth === "true") {
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
    
    const storedStaff = localStorage.getItem("salon_staff")
    const storedStaffAuth = localStorage.getItem("salon_staff_auth")
    if (storedStaff && storedStaffAuth === "true") {
      setStaff(JSON.parse(storedStaff))
      setIsStaffAuthenticated(true)
    }
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

  const staffLogin = async (pinOrId) => {
    try {
      // Call backend API for staff authentication
      const response = await fetch("http://localhost:5000/api/staff/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pin: pinOrId, staff_id: pinOrId }),
      })
      
      const data = await response.json()
      
      if (data.success && data.staff) {
        const staffData = {
          ...data.staff,
          role: "staff"
        }
        setStaff(staffData)
        setIsStaffAuthenticated(true)
        localStorage.setItem("salon_staff", JSON.stringify(staffData))
        localStorage.setItem("salon_staff_auth", "true")
        return { success: true }
      } else {
        return { success: false, error: data.error || "Invalid Staff ID or PIN" }
      }
    } catch (err) {
      // Fallback to mock authentication for development
      if (pinOrId) {
        const staffData = {
          id: 1,
          name: "Jane Wanjiru",
          pin: pinOrId,
          role: "staff"
        }
        setStaff(staffData)
        setIsStaffAuthenticated(true)
        localStorage.setItem("salon_staff", JSON.stringify(staffData))
        localStorage.setItem("salon_staff_auth", "true")
        return { success: true }
      }
      return { success: false, error: "Staff ID or PIN is required" }
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("salon_user")
    localStorage.removeItem("salon_auth")
  }

  const staffLogout = () => {
    setStaff(null)
    setIsStaffAuthenticated(false)
    localStorage.removeItem("salon_staff")
    localStorage.removeItem("salon_staff_auth")
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

