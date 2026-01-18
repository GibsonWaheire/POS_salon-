import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Layout from "./components/Layout"
import ProtectedRoute from "./components/ProtectedRoute"
import StaffProtectedRoute from "./components/StaffProtectedRoute"
import Login from "./pages/Login"
import StaffLogin from "./pages/StaffLogin"
import POS from "./pages/POS"
import StaffCommissionHistory from "./pages/StaffCommissionHistory"
import Dashboard from "./pages/Dashboard"
import Appointments from "./pages/Appointments"
import Customers from "./pages/Customers"
import Services from "./pages/Services"
import Staff from "./pages/Staff"
import Payments from "./pages/Payments"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/staff-login" element={<StaffLogin />} />
          
          {/* Staff-only routes */}
          <Route
            path="/pos"
            element={
              <StaffProtectedRoute>
                <POS />
              </StaffProtectedRoute>
            }
          />
          <Route
            path="/commission-history"
            element={
              <StaffProtectedRoute>
                <StaffCommissionHistory />
              </StaffProtectedRoute>
            }
          />
          
          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
          </Route>
          
          <Route
            path="/appointments"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Appointments />} />
          </Route>
          
          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Customers />} />
          </Route>
          
          <Route
            path="/services"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Services />} />
          </Route>
          
          <Route
            path="/staff"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Staff />} />
          </Route>
          
          <Route
            path="/payments"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Payments />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
