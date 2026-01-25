import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "sonner"
import { AuthProvider } from "./context/AuthContext"
import Layout from "./components/Layout"
import ScrollToTop from "./components/ScrollToTop"
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
import Appointments from "./pages/Appointments"
import Settings from "./pages/Settings"
import AboutUs from "./pages/AboutUs"
import WhyChooseUs from "./pages/WhyChooseUs"
import SuccessStories from "./pages/SuccessStories"
import Blog from "./pages/Blog"
import BlogPost from "./pages/BlogPost"
import HelpCenter from "./pages/HelpCenter"
import Pricing from "./pages/Pricing"
import PrivacyPolicy from "./pages/PrivacyPolicy"
import TermsOfService from "./pages/TermsOfService"
import SlotBlockers from "./pages/SlotBlockers"
import DragDropReschedule from "./pages/DragDropReschedule"
import PopupNotesHistory from "./pages/PopupNotesHistory"
import RecurringBookings from "./pages/RecurringBookings"
import ColorCodedAppointments from "./pages/ColorCodedAppointments"
import ResourceScheduling from "./pages/ResourceScheduling"
import CalendarSyncExport from "./pages/CalendarSyncExport"
import EasyRescheduling from "./pages/EasyRescheduling"

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/solutions" element={<Navigate to="/solutions/hair" replace />} />
          <Route path="/solutions/:posType" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/staff-login" element={<StaffLogin />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/why-choose-us" element={<WhyChooseUs />} />
          <Route path="/success-stories" element={<SuccessStories />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          
          {/* Appointment Management Feature Pages */}
          <Route path="/features/slot-blockers" element={<SlotBlockers />} />
          <Route path="/features/drag-drop-reschedule" element={<DragDropReschedule />} />
          <Route path="/features/popup-notes-history" element={<PopupNotesHistory />} />
          <Route path="/features/recurring-bookings" element={<RecurringBookings />} />
          <Route path="/features/color-coded-appointments" element={<ColorCodedAppointments />} />
          <Route path="/features/resource-scheduling" element={<ResourceScheduling />} />
          <Route path="/features/calendar-sync-export" element={<CalendarSyncExport />} />
          <Route path="/features/easy-rescheduling" element={<EasyRescheduling />} />
          
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
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
