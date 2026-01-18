import { Navigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

export default function StaffProtectedRoute({ children }) {
  const { isStaffAuthenticated } = useAuth()

  if (!isStaffAuthenticated) {
    return <Navigate to="/staff-login" replace />
  }

  return children
}

