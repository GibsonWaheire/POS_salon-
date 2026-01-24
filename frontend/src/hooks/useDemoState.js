import { useState, useMemo } from "react"
import { demoStaffPOSData } from "@/data/landingDemoData"

/**
 * Custom hook to manage all demo-related state and calculations
 * @returns {Object} Demo state and handlers
 */
export function useDemoState() {
  // Demo state
  const [demoViewMode, setDemoViewMode] = useState("manager") // "manager" | "staff"
  const [demoSelectedSidebar, setDemoSelectedSidebar] = useState("dashboard")
  const [demoSelectedServices, setDemoSelectedServices] = useState([])
  const [demoClientName, setDemoClientName] = useState("")
  const [demoClientPhone, setDemoClientPhone] = useState("")
  const [demoServiceLocation, setDemoServiceLocation] = useState("salon")
  const [demoActiveTab, setDemoActiveTab] = useState("services")
  const [demoSelectedCategory, setDemoSelectedCategory] = useState("all")

  // Demo handlers
  const handleDemoAddService = (service) => {
    setDemoSelectedServices([...demoSelectedServices, { ...service, quantity: 1 }])
  }

  const handleDemoRemoveService = (serviceId) => {
    if (serviceId === -1) {
      // Clear all services
      setDemoSelectedServices([])
    } else {
      setDemoSelectedServices(demoSelectedServices.filter(s => s.id !== serviceId))
    }
  }

  // Demo calculations
  const demoTotal = useMemo(() => {
    return demoSelectedServices.reduce((sum, s) => sum + (s.price * s.quantity), 0)
  }, [demoSelectedServices])

  const demoSubtotal = useMemo(() => {
    return Math.round((demoTotal / 1.16) * 100) / 100
  }, [demoTotal])

  const demoTax = useMemo(() => {
    return Math.round((demoTotal - demoSubtotal) * 100) / 100
  }, [demoTotal, demoSubtotal])

  const demoCommission = useMemo(() => {
    return demoSelectedServices.reduce((sum, s) => {
      const itemSubtotal = (s.price * s.quantity) / 1.16
      return sum + (itemSubtotal * 0.50)
    }, 0)
  }, [demoSelectedServices])

  return {
    // State
    demoViewMode,
    setDemoViewMode,
    demoSelectedSidebar,
    setDemoSelectedSidebar,
    demoSelectedServices,
    setDemoSelectedServices,
    demoClientName,
    setDemoClientName,
    demoClientPhone,
    setDemoClientPhone,
    demoServiceLocation,
    setDemoServiceLocation,
    demoActiveTab,
    setDemoActiveTab,
    demoSelectedCategory,
    setDemoSelectedCategory,
    // Handlers
    handleDemoAddService,
    handleDemoRemoveService,
    // Calculations
    demoTotal,
    demoSubtotal,
    demoTax,
    demoCommission,
    // Constants
    demoStaffPOSData,
  }
}
