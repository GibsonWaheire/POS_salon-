import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import POS from "./pages/POS"
import Dashboard from "./pages/Dashboard"
import Appointments from "./pages/Appointments"
import Customers from "./pages/Customers"
import Services from "./pages/Services"
import Staff from "./pages/Staff"
import Payments from "./pages/Payments"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/pos" element={<POS />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="customers" element={<Customers />} />
          <Route path="services" element={<Services />} />
          <Route path="staff" element={<Staff />} />
          <Route path="payments" element={<Payments />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
