import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import { AuthProvider } from "./context/AuthContext"
import Layout from "./components/Layout"
import ProtectedRoute from "./components/ProtectedRoute"
import StaffProtectedRoute from "./components/StaffProtectedRoute"
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import StaffLogin from "./pages/StaffLogin"
import POS from "./pages/POS"
import StaffCommissionHistory from "./pages/StaffCommissionHistory"
import Dashboard from "./pages/Dashboard"
import Customers from "./pages/Customers"
import Services from "./pages/Services"
import Staff from "./pages/Staff"
import Payments from "./pages/Payments"
import CommissionPayments from "./pages/CommissionPayments"
import Inventory from "./pages/Inventory"
import Expenses from "./pages/Expenses"
import Reports from "./pages/Reports"
import Users from "./pages/Users"
import Shifts from "./pages/Shifts"
import Sales from "./pages/Sales"

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
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
            path="/commission-payments"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<CommissionPayments />} />
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
          
          <Route
            path="/inventory"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Inventory />} />
          </Route>
          
          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Expenses />} />
          </Route>
          
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Reports />} />
          </Route>
          
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Users />} />
          </Route>
          
          <Route
            path="/shifts"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Shifts />} />
          </Route>
          
          <Route
            path="/sales"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Sales />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
