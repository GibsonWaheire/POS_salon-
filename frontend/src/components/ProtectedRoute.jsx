import { Navigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

const ALLOWED_STATUSES = ["active", "trialing"]

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Allow demo users and admins to access dashboard without subscription
  if (user?.is_demo || user?.role === "admin") {
    return children
  }

  const status = user?.subscription_status || "none"
  const hasAccess = ALLOWED_STATUSES.includes(status)
  if (!hasAccess) {
    return <Navigate to="/pricing?upgrade=1" replace />
  }

  return children
}
