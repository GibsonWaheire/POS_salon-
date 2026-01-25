import { Navigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

const ALLOWED_STATUSES = ["active", "trialing"]

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const status = user?.subscription_status || "none"
  const hasAccess = ALLOWED_STATUSES.includes(status)
  if (!hasAccess) {
    return <Navigate to="/pricing?upgrade=1" replace />
  }

  return children
}
