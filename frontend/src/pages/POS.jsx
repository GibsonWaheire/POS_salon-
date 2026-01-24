import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/AuthContext"
import ReceiptTemplate from "@/components/ReceiptTemplate"
import { toast } from "sonner"
import { 
  Plus,
  Trash2,
  Wallet,
  User,
  Phone,
  Coins,
  LogOut,
  Users,
  Printer,
  History,
  Clock,
  CheckCircle2,
  Calendar,
  MapPin,
  UserCheck,
  UserX,
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SERVICE_CATEGORIES, getCategoryName, getBusinessTypeName } from "@/lib/serviceCategories"

// Services will be fetched from API

const formatKES = (amount) => {
  // Handle undefined, null, NaN, or non-numeric values
  if (amount === undefined || amount === null || Number.isNaN(amount) || amount === '') {
    return 'KES 0'
  }
  // Convert to number if it's a string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount)
  if (Number.isNaN(numAmount) || !isFinite(numAmount)) {
    return 'KES 0'
  }
  return `KES ${numAmount.toLocaleString('en-KE')}`
}

const defaultCommissionRate = 0.50 // 50% commission rate for Kenyan salons

export default function POS() {
  const { staff, staffLogout, isDemoUser, demoMode } = useAuth()
  const navigate = useNavigate()
  const receiptPrintRef = useRef(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedService, setSelectedService] = useState("")
  const [currentSaleServices, setCurrentSaleServices] = useState([])
  const [currentSaleProducts, setCurrentSaleProducts] = useState([])
  const [clientName, setClientName] = useState("")
  const [clientPhone, setClientPhone] = useState("")
  const [receiptPrinted, setReceiptPrinted] = useState(false)
  const [receiptNumber, setReceiptNumber] = useState("")
  const [showReceipt, setShowReceipt] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [sessionLocked, setSessionLocked] = useState(false)
  const [transactionSaved, setTransactionSaved] = useState(false)
  const [transactionCode, setTransactionCode] = useState("")
  const [showTransactionInput, setShowTransactionInput] = useState(false)
  const [staffStats, setStaffStats] = useState({
    clients_served_today: 0,
    commission_today: 0,
    commission_weekly: 0
  })
  const [loadingStats, setLoadingStats] = useState(true)
  const [recentTransactions, setRecentTransactions] = useState([])
  const [services, setServices] = useState([])
  const [loadingServices, setLoadingServices] = useState(true)
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [activeTab, setActiveTab] = useState("services")
  const [selectedProduct, setSelectedProduct] = useState("")
  const [pendingAppointments, setPendingAppointments] = useState([])
  const [loadingAppointments, setLoadingAppointments] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [serviceLocation, setServiceLocation] = useState("salon")
  const [homeServiceAddress, setHomeServiceAddress] = useState("")
  const [serviceStartTime, setServiceStartTime] = useState(null)
  const [serviceEndTime, setServiceEndTime] = useState(null)
  const [serviceDuration, setServiceDuration] = useState(null)
  const [businessType, setBusinessType] = useState(null)

  // Fetch services, products, appointments, and public settings (business type for labels)
  useEffect(() => {
    fetchServices()
    fetchProducts()
    fetchPendingAppointments()
    fetchBusinessType()
  }, [])

  const fetchBusinessType = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/settings/public")
      if (res.ok) {
        const data = await res.json()
        setBusinessType(data.business_type ?? null)
      }
    } catch {
      /* ignore */
    }
  }

  const fetchServices = async () => {
    setLoadingServices(true)
    try {
      const response = await fetch("http://localhost:5001/api/services")
      if (response.ok) {
        const data = await response.json()
        // Map API services to include commissionRate and category
        // Default commission rate is 50% for all services
        const mappedServices = data.map(service => ({
          ...service,
          commissionRate: 0.50, // Default commission rate
          category: (service.category || "general").toLowerCase() // Default category if not provided
        }))
        setServices(mappedServices)
      } else {
        console.error("Failed to fetch services")
      }
    } catch (err) {
      console.error("Failed to fetch services:", err)
    } finally {
      setLoadingServices(false)
    }
  }

  const fetchProducts = async () => {
    setLoadingProducts(true)
    try {
      const response = await fetch("http://localhost:5001/api/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      } else {
        console.error("Failed to fetch products")
      }
    } catch (err) {
      console.error("Failed to fetch products:", err)
    } finally {
      setLoadingProducts(false)
    }
  }

  const fetchPendingAppointments = async () => {
    setLoadingAppointments(true)
    try {
      const demoModeParam = isDemoUser ? 'true' : (demoMode ? 'true' : 'false')
      const staffIdParam = staff?.id ? `&staff_id=${staff.id}` : ''
      const url = `http://localhost:5001/api/appointments/pending?demo_mode=${demoModeParam}${staffIdParam}`
      
      console.log('Fetching appointments from:', url)
      console.log('Staff ID:', staff?.id)
      console.log('Demo mode:', demoModeParam)
      
      const response = await fetch(url)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || 'Failed to fetch appointments'
        console.error('Appointment fetch error:', errorMessage, 'Status:', response.status)
        toast.error(errorMessage)
        setPendingAppointments([])
        return
      }
      
      const data = await response.json()
      console.log('Fetched appointments:', data.length, data)
      setPendingAppointments(data || [])
      
      if (data.length === 0) {
        console.log('No appointments found. Check:')
        console.log('- Are there any appointments in the database?')
        console.log('- Do appointments have status "scheduled" or "pending"?')
        console.log('- Do appointments match demo_mode filter?')
        console.log('- Are appointments assigned to this staff or unassigned?')
      }
    } catch (err) {
      const errorMessage = err.message || 'An error occurred while fetching appointments'
      console.error('Appointment fetch exception:', err)
      toast.error(errorMessage)
      setPendingAppointments([])
    } finally {
      setLoadingAppointments(false)
    }
  }

  const handleAcceptAppointment = async (appointment) => {
    if (sessionLocked) {
      toast.error("Session ended. Please log in again.")
      return
    }
    
    if (!staff?.id) {
      toast.error("Staff information not available")
      return
    }
    
    try {
      const demoModeParam = isDemoUser ? 'true' : (demoMode ? 'true' : 'false')
      const response = await fetch(`http://localhost:5001/api/appointments/${appointment.id}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staff_id: staff.id })
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || 'Failed to accept appointment'
        toast.error(errorMessage)
        return
      }
      
      const updatedAppointment = await response.json()
      
      // Update local state
      setPendingAppointments(prev => 
        prev.map(apt => apt.id === appointment.id ? updatedAppointment : apt)
      )
      
      toast.success(`Appointment accepted: ${updatedAppointment.customer?.name || 'Customer'}`)
    } catch (err) {
      const errorMessage = err.message || 'An error occurred while accepting the appointment'
      toast.error(errorMessage)
      console.error("Failed to accept appointment:", err)
    }
  }

  const handleSelectAppointment = (appointment) => {
    if (sessionLocked) {
      toast.error("Session ended. Please log in again.")
      return
    }
    
    setSelectedAppointment(appointment)
    
    // Auto-populate customer
    if (appointment.customer) {
      setClientName(appointment.customer.name || "")
      setClientPhone(appointment.customer.phone || "")
    }
    
    // Auto-populate services
    if (appointment.services && appointment.services.length > 0) {
      const appointmentServices = appointment.services.map(service => ({
        ...service,
        quantity: 1,
        commission: (service.price || 0) * defaultCommissionRate,
        commissionRate: defaultCommissionRate,
        type: 'service'
      }))
      setCurrentSaleServices(appointmentServices)
    }
    
    // Auto-populate location
    setServiceLocation(appointment.service_location || "salon")
    setHomeServiceAddress(appointment.home_service_address || "")
    
    toast.success(`Appointment selected: ${appointment.customer?.name || "Customer"}`)
  }

  const handleStartService = () => {
    if (sessionLocked) {
      toast.error("Session ended. Please log in again.")
      return
    }
    
    const startTime = new Date()
    setServiceStartTime(startTime)
    toast.success("Service started")
  }

  const handleEndService = () => {
    if (!serviceStartTime) {
      toast.error("Please start the service first")
      return
    }
    
    const endTime = new Date()
    setServiceEndTime(endTime)
    
    // Calculate duration
    const durationMs = endTime - serviceStartTime
    const durationMinutes = Math.floor(durationMs / 60000)
    setServiceDuration(durationMinutes)
    
    toast.success(`Service ended. Duration: ${durationMinutes} minutes`)
  }

  // Fetch staff stats
  useEffect(() => {
    if (staff?.id) {
      fetchStaffStats()
      fetchRecentTransactions()
      
      // Auto-refresh stats every 30 seconds to stay in sync
      const interval = setInterval(() => {
        fetchStaffStats()
        fetchRecentTransactions()
      }, 30000)
      
      return () => clearInterval(interval)
    }
  }, [staff])

  const fetchStaffStats = async () => {
    if (!staff?.id) return
    setLoadingStats(true)
    try {
      const demoModeParam = isDemoUser ? 'true' : (demoMode ? 'true' : 'false')
      const response = await fetch(`http://localhost:5001/api/staff/${staff.id}/stats?demo_mode=${demoModeParam}`)
      if (response.ok) {
        const data = await response.json()
        const stats = {
          clients_served_today: data.clients_served_today || 0,
          commission_today: data.commission_today || 0,
          commission_weekly: data.commission_weekly || 0
        }
        setStaffStats(stats)
      }
    } catch (err) {
      console.error("Failed to fetch staff stats:", err)
    } finally {
      setLoadingStats(false)
    }
  }

  const fetchRecentTransactions = async () => {
    if (!staff?.id) return
    try {
      // Fetch recent completed sales for this staff
      // Add demo_mode parameter: true for demo users, use demoMode for others
      const demoModeParam = isDemoUser ? 'true' : (demoMode ? 'true' : 'false')
      const response = await fetch(`http://localhost:5001/api/sales?staff_id=${staff.id}&status=completed&limit=10&demo_mode=${demoModeParam}`)
      if (response.ok) {
        const data = await response.json()
        // Transform API response to match frontend expectations
        const transformedData = data.map(sale => {
          const transformed = {
            ...sale,
            grand_total: sale.grand_total ?? sale.total_amount ?? 0,
            commission: sale.commission ?? sale.commission_amount ?? 0,
            client_name: sale.client_name ?? sale.customer_name ?? 'Walk-in',
            time: sale.time ?? (sale.created_at ? new Date(sale.created_at).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }) : ''),
            payment_method: sale.payment_method ?? sale.payment?.payment_method ?? null
          }
          return transformed
        })
        setRecentTransactions(transformedData.slice(0, 10) || [])
      }
    } catch (err) {
      console.error("Failed to fetch recent transactions:", err)
    }
  }

  const filteredServices = selectedCategory === "all"
    ? services
    : services.filter((s) => (s.category || "general").toLowerCase() === selectedCategory)

  // Group services by category for better organization in dropdown
  const servicesByCategory = filteredServices.reduce((acc, service) => {
    const cat = (service.category || "general").toLowerCase()
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(service)
    return acc
  }, {})

  // Sort groups by category name for stable order
  const servicesByCategoryEntries = Object.entries(servicesByCategory).sort(([a], [b]) =>
    (getCategoryName(a) || a).localeCompare(getCategoryName(b) || b)
  )

  const handleServiceSelect = (serviceId) => {
    const service = services.find(s => s.id === parseInt(serviceId))
    if (service) {
      addServiceToSale(service)
      setSelectedService("") // Reset dropdown after selection
    }
  }

  const handleProductSelect = (productId) => {
    const product = products.find(p => p.id === parseInt(productId))
    if (product) {
      addProductToSale(product)
      setSelectedProduct("") // Reset dropdown after selection
    }
  }

  // Default commission rate (50%)
  const defaultCommissionRate = 0.50

  const addServiceToSale = (service) => {
    if (sessionLocked) {
      toast.error("Session ended. Please log in again.")
      return
    }
    const existingItem = currentSaleServices.find(item => item.id === service.id)
    const commissionRate = service.commissionRate || defaultCommissionRate
    
    if (existingItem) {
      setCurrentSaleServices(currentSaleServices.map(item =>
        item.id === service.id
          ? { 
              ...item, 
              quantity: item.quantity + 1,
              commission: (item.price * (item.quantity + 1)) * commissionRate
            }
          : item
      ))
    } else {
      setCurrentSaleServices([...currentSaleServices, { 
        ...service, 
        quantity: 1,
        commission: service.price * commissionRate,
        type: 'service'
      }])
    }
    // Reset receipt printed status when cart changes
    if (receiptPrinted) {
      setReceiptPrinted(false)
    }
  }

  const addProductToSale = (product) => {
    if (sessionLocked) {
      toast.error("Session ended. Please log in again.")
      return
    }
    const existingItem = currentSaleProducts.find(item => item.id === product.id)
    const sellingPrice = product.selling_price || product.unit_price || 0
    
    if (existingItem) {
      setCurrentSaleProducts(currentSaleProducts.map(item =>
        item.id === product.id
          ? { 
              ...item, 
              quantity: item.quantity + 1,
              total_price: sellingPrice * (item.quantity + 1)
            }
          : item
      ))
    } else {
      setCurrentSaleProducts([...currentSaleProducts, { 
        ...product,
        price: sellingPrice,
        quantity: 1,
        total_price: sellingPrice,
        type: 'product'
      }])
    }
    // Reset receipt printed status when cart changes
    if (receiptPrinted) {
      setReceiptPrinted(false)
    }
  }

  // Legacy addToSale function for backward compatibility
  const addToSale = (item) => {
    if (item.type === 'product') {
      addProductToSale(item)
    } else {
      addServiceToSale(item)
    }
  }

  const updateServiceQuantity = (id, change) => {
    if (sessionLocked) {
      toast.error("Session ended. Please log in again.")
      return
    }
    setCurrentSaleServices(currentSaleServices.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change
        const finalQuantity = newQuantity > 0 ? newQuantity : 1
        const commissionRate = item.commissionRate || defaultCommissionRate
        return { 
          ...item, 
          quantity: finalQuantity,
          commission: (item.price * finalQuantity) * commissionRate
        }
      }
      return item
    }))
    if (receiptPrinted) {
      setReceiptPrinted(false)
    }
  }

  const updateProductQuantity = (id, change) => {
    if (sessionLocked) {
      toast.error("Session ended. Please log in again.")
      return
    }
    setCurrentSaleProducts(currentSaleProducts.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change
        const finalQuantity = newQuantity > 0 ? newQuantity : 1
        return { 
          ...item, 
          quantity: finalQuantity,
          total_price: (item.price || 0) * finalQuantity
        }
      }
      return item
    }))
    if (receiptPrinted) {
      setReceiptPrinted(false)
    }
  }

  // Legacy function for backward compatibility
  const updateQuantity = (id, change, type) => {
    if (type === 'product') {
      updateProductQuantity(id, change)
    } else {
      updateServiceQuantity(id, change)
    }
  }

  const removeServiceFromSale = (id) => {
    if (sessionLocked) {
      toast.error("Session ended. Please log in again.")
      return
    }
    setCurrentSaleServices(currentSaleServices.filter(item => item.id !== id))
    if (receiptPrinted) {
      setReceiptPrinted(false)
    }
  }

  const removeProductFromSale = (id) => {
    if (sessionLocked) {
      toast.error("Session ended. Please log in again.")
      return
    }
    setCurrentSaleProducts(currentSaleProducts.filter(item => item.id !== id))
    if (receiptPrinted) {
      setReceiptPrinted(false)
    }
  }

  // Legacy function for backward compatibility
  const removeFromSale = (id, type) => {
    if (type === 'product') {
      removeProductFromSale(id)
    } else {
      removeServiceFromSale(id)
    }
  }

  const clearSale = () => {
    setCurrentSaleServices([])
    setCurrentSaleProducts([])
    setClientName("")
    setClientPhone("")
    setSelectedAppointment(null)
    setServiceLocation("salon")
    setHomeServiceAddress("")
    setServiceStartTime(null)
    setServiceEndTime(null)
    setServiceDuration(null)
    setReceiptPrinted(false)
    setReceiptNumber("")
    setShowReceipt(false)
    setPaymentMethod("")
    setTransactionSaved(false)
    setSessionLocked(false)
  }

  // Calculate totals from both services and products
  const servicesTotal = currentSaleServices.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0)
  const productsTotal = currentSaleProducts.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0)
  const total = servicesTotal + productsTotal
  // Extract subtotal and tax from tax-inclusive total
  const subtotal = Math.round((total / 1.16) * 100) / 100 // Subtotal excluding tax (rounded to 2 decimals)
  const tax = Math.round((total - subtotal) * 100) / 100 // Tax amount (rounded to 2 decimals)
  // Commission is calculated only on services subtotal (excluding tax)
  const totalCommission = currentSaleServices.reduce((sum, item) => {
    const commissionRate = item.commissionRate || defaultCommissionRate
    const itemSubtotal = ((item.price || 0) * (item.quantity || 0)) / 1.16
    return sum + (itemSubtotal * commissionRate)
  }, 0)

  const handlePrintReceipt = async () => {
    if (currentSaleServices.length === 0 && currentSaleProducts.length === 0) {
      toast.warning("Please add items to the sale first")
      return
    }

    if (!paymentMethod) {
      toast.warning("Please select a payment method first")
      return
    }

    // Validate M-Pesa transaction code if M-Pesa payment method
    if (paymentMethod === "M-Pesa" && (!transactionCode || !validateMpesaCode(transactionCode))) {
      toast.warning("Please enter a valid M-Pesa transaction code (10 alphanumeric characters, e.g., QGH7X2K9L8)")
      setShowTransactionInput(true)
      return
    }

    // Lock session immediately to prevent further entries
    setSessionLocked(true)
    
    try {
      // STEP 1: Create Sale (walk-in transaction)
      const saleResponse = await fetch("http://localhost:5001/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staff_id: staff?.id,
          appointment_id: selectedAppointment?.id || null,
          customer_name: clientName || null,
          customer_phone: clientPhone || null,
          service_location: serviceLocation,
          home_service_address: serviceLocation === "home" ? homeServiceAddress : null,
          services: currentSaleServices.map(item => ({
            service_id: item.id,
            name: item.name,
            price: item.price,
            duration: item.duration || 30,
            quantity: item.quantity,
            commission_rate: item.commissionRate || defaultCommissionRate
          })),
          products: currentSaleProducts.map(item => ({
            product_id: item.id,
            name: item.name,
            quantity: item.quantity
          }))
        })
      })

      if (!saleResponse.ok) {
        const errorData = await saleResponse.json()
        throw new Error(errorData.error || "Failed to create sale")
      }

      const saleData = await saleResponse.json()
      const saleId = saleData.id
      
      // STEP 2: Complete Sale (deducts stock, finalizes commission, creates payment)
      const receiptNum = `RCP-${Date.now().toString().slice(-6)}`
      setReceiptNumber(receiptNum)
      
      const completeResponse = await fetch(`http://localhost:5001/api/sales/${saleId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_method: paymentMethod,
          transaction_code: paymentMethod === "M-Pesa" ? transactionCode : null,
          receipt_number: receiptNum,
          service_start_time: serviceStartTime ? serviceStartTime.toISOString() : null,
          service_end_time: serviceEndTime ? serviceEndTime.toISOString() : null,
          service_location: serviceLocation,
          home_service_address: serviceLocation === "home" ? homeServiceAddress : null
        })
      })

      if (!completeResponse.ok) {
        const errorData = await completeResponse.json()
        throw new Error(errorData.error || "Failed to complete sale")
      }

      const completedSale = await completeResponse.json()
      
      // Transaction is now saved to database
      setTransactionSaved(true)
      
      // Wait a moment to ensure database commit
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Refresh stats to show the new transaction
      await fetchStaffStats()
      await fetchRecentTransactions()
      
      // Refresh appointments list to remove completed appointment
      await fetchPendingAppointments()
      
      // STEP 3: Show receipt and print
      setShowReceipt(true)
      
      // Trigger print after a short delay to ensure receipt is rendered
      setTimeout(() => {
        // Save original document title
        const originalTitle = document.title
        
        // Set document title to receipt number for PDF filename
        document.title = receiptNum
        
        // Trigger print dialog
        window.print()
        
        // Restore original title after a short delay
        setTimeout(() => {
          document.title = originalTitle
        }, 500)
        
        setReceiptPrinted(true)
        // Show success popup - no automatic logout
      }, 100)
    } catch (err) {
      console.error("Failed to save transaction:", err)
      toast.error(`Error saving transaction: ${err.message}. Please try again.`)
      setSessionLocked(false) // Unlock session on error
      setTransactionSaved(false) // Reset transaction saved state
    }
  }

  const handlePayment = (method) => {
    // Just set the payment method - transaction will be saved when receipt is printed
    if (sessionLocked) {
      toast.error("Session ended. Please log in again.")
      return
    }
    
    if (currentSaleServices.length === 0 && currentSaleProducts.length === 0) {
      toast.warning("Please add items to the sale first")
      return
    }
    
    // Set payment method for receipt display
    setPaymentMethod(method)
    
    // If M-Pesa, show transaction code input dialog
    if (method === "M-Pesa") {
      setShowTransactionInput(true)
    } else {
      setTransactionCode("") // Clear transaction code for non-M-Pesa payments
    }
  }

  const validateMpesaCode = (code) => {
    // M-Pesa codes are 10 alphanumeric characters (uppercase)
    const mpesaPattern = /^[A-Z0-9]{10}$/
    return mpesaPattern.test(code.toUpperCase())
  }

  const handleMpesaCodeSubmit = () => {
    if (!transactionCode || !validateMpesaCode(transactionCode)) {
      toast.warning("Please enter a valid M-Pesa transaction code (10 alphanumeric characters, e.g., QGH7X2K9L8)")
      return
    }
    setShowTransactionInput(false)
  }

  const handleLogout = () => {
    // Clear all sale data before logout
    clearSale()
    setTransactionSaved(false)
    setSessionLocked(false)
    staffLogout()
    navigate("/staff-login")
  }

  const handleDismissSuccessModal = () => {
    // Dismiss the modal but keep session active
    setSessionLocked(false)
    // Don't clear transactionSaved - keep it for reference
    // User can continue working
  }

  const now = new Date()
  const receiptDate = now.toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' })
  const receiptTime = now.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="min-h-screen bg-background">
      {/* Transaction Saved Success Popup */}
      {sessionLocked && transactionSaved && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={handleDismissSuccessModal}
        >
          <div 
            className="bg-white rounded-lg p-8 max-w-md mx-4 text-center shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-green-600">Transaction Saved Successfully</h2>
            <p className="text-gray-700 mb-4">
              Your transaction has been recorded in the database.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Receipt Number:</span>
                <span className="text-sm font-semibold">{receiptNumber}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Total Amount:</span>
                <span className="text-sm font-semibold">{formatKES(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Payment Method:</span>
                <span className="text-sm font-semibold capitalize">{paymentMethod || "Cash"}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={handleDismissSuccessModal}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                Continue Working
              </Button>
              <Button 
                onClick={handleLogout}
                className="flex-1 bg-primary hover:bg-primary/90 text-white text-lg py-6 font-semibold"
                size="lg"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Click outside or "Continue Working" to dismiss, or logout when ready
            </p>
          </div>
        </div>
      )}
      
      {/* Receipt for Printing */}
      {showReceipt && (currentSaleServices.length > 0 || currentSaleProducts.length > 0) && (
        <>
        <ReceiptTemplate
          receiptNumber={receiptNumber}
          date={receiptDate}
          time={receiptTime}
          staffName={staff?.name || "Staff"}
          clientName={clientName}
          clientPhone={clientPhone}
          services={currentSaleServices.map(item => ({ 
            name: item.name, 
            price: item.price, 
            quantity: item.quantity 
          }))}
          products={currentSaleProducts.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity
          }))}
          subtotal={subtotal}
          tax={tax}
          total={total}
          paymentMethod={paymentMethod || "Cash"}
          transactionCode={transactionCode}
          kraPin="P051234567K"
        />
        </>
      )}

      {/* Header with Compact Stats */}
      <header className="border-b bg-white px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold">
              {businessType ? `${getBusinessTypeName(businessType)} POS` : "POS System"}
            </h1>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Today: {loadingStats ? "..." : staffStats.clients_served_today} Clients</span>
                <span className="text-xs text-muted-foreground ml-2">| Weekly Commission: {loadingStats ? "..." : formatKES(Math.round(staffStats.commission_weekly || 0))}</span>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-600">
                  {loadingStats ? "..." : formatKES(Math.round(staffStats.commission_today || 0))}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate("/commission-history")}
              className="gap-2"
            >
              <History className="h-4 w-4" />
              Commission History
            </Button>
            <span className="text-sm text-muted-foreground">{now.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}</span>
            <span className="text-sm font-medium">{staff?.name || "Staff"}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-65px)]">
        {/* Left Panel - Services/Products List (60%) */}
        <div className="w-[60%] border-r bg-white flex flex-col overflow-hidden">
          {/* Pending Appointments Section */}
          <div className="p-4 border-b bg-blue-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Pending Appointments ({pendingAppointments.length})
              </h3>
              {loadingAppointments && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <div className="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                  Loading...
                </span>
              )}
            </div>
            {loadingAppointments ? (
              <div className="text-center py-4 text-xs text-muted-foreground">
                Loading appointments...
              </div>
            ) : pendingAppointments.length > 0 ? (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {pendingAppointments.map((appointment) => {
                  const isAssignedToMe = appointment.staff_id === staff?.id
                  const isUnassigned = !appointment.staff_id
                  
                  return (
                    <Card 
                      key={appointment.id} 
                      className={`transition-all ${
                        selectedAppointment?.id === appointment.id 
                          ? 'border-blue-500 bg-blue-100' 
                          : isAssignedToMe
                            ? 'border-green-300 bg-green-50 hover:border-green-400'
                            : isUnassigned
                              ? 'border-yellow-300 bg-yellow-50 hover:border-yellow-400'
                              : 'hover:border-blue-300'
                      }`}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div 
                            className="flex-1 cursor-pointer"
                            onClick={() => {
                              if (isAssignedToMe || isUnassigned) {
                                handleSelectAppointment(appointment)
                              } else {
                                toast.warning("This appointment is assigned to another staff member")
                              }
                            }}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="font-semibold text-sm">{appointment.customer?.name || "Customer"}</div>
                              {isAssignedToMe && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full border border-green-300">
                                  <UserCheck className="h-3 w-3" />
                                  Assigned to You
                                </span>
                              )}
                              {isUnassigned && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full border border-yellow-300">
                                  <UserX className="h-3 w-3" />
                                  Unassigned
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {new Date(appointment.appointment_date).toLocaleString('en-KE', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                            {appointment.services && appointment.services.length > 0 && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {appointment.services.map(s => s.name).join(", ")}
                              </div>
                            )}
                            {appointment.staff && !isAssignedToMe && (
                              <div className="text-xs text-muted-foreground mt-1">
                                Staff: {appointment.staff.name}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {appointment.service_location && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                {appointment.service_location === "home" ? "Home" : "Salon"}
                              </div>
                            )}
                            {isUnassigned && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs border-yellow-400 text-yellow-700 hover:bg-yellow-100"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleAcceptAppointment(appointment)
                                }}
                                disabled={sessionLocked}
                              >
                                Accept
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-muted-foreground space-y-2">
                <p>No pending appointments found.</p>
                <p className="text-[10px] text-gray-500">
                  Appointments will appear here when:
                  <br />• Status is "scheduled" or "pending"
                  <br />• Assigned to you OR unassigned
                  <br />• Demo mode matches your session
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs mt-2"
                  onClick={fetchPendingAppointments}
                >
                  Refresh
                </Button>
              </div>
            )}
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            <TabsList className="mx-4 mt-4">
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
            </TabsList>

            {/* Services Tab */}
            <TabsContent value="services" className="flex-1 overflow-hidden flex flex-col">
              {/* Category Filters */}
              <div className="p-4 border-b bg-gray-50">
                <div className="flex gap-2 mb-4 flex-wrap">
                  {SERVICE_CATEGORIES.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      onClick={() => {
                        setSelectedCategory(category.id)
                        setSelectedService("") // Reset service selection when category changes
                      }}
                      disabled={sessionLocked}
                      className="h-10 px-4 text-sm font-medium"
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
                
                {/* Services Dropdown */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Select Service to Add</Label>
                  <Select
                    key={selectedCategory}
                    value={selectedService || undefined}
                    onValueChange={handleServiceSelect}
                    disabled={sessionLocked || filteredServices.length === 0}
                  >
                    <SelectTrigger className="h-12 text-base" disabled={sessionLocked || filteredServices.length === 0}>
                      <SelectValue placeholder="Choose a service..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[500px] w-full p-2" position="popper" sideOffset={4}>
                      {filteredServices.length === 0 ? (
                        <div className="py-6 px-4 text-center text-sm text-muted-foreground">
                          No services in this category
                        </div>
                      ) : (
                        servicesByCategoryEntries.map(([category, categoryServices], groupIndex) => (
                        <SelectGroup key={category}>
                          <SelectLabel className="font-bold text-xs uppercase text-blue-700 px-3 py-2.5 bg-blue-50 sticky top-0 z-10 border-b border-blue-200 mb-1">
                            {getCategoryName(category)}
                          </SelectLabel>
                          {categoryServices.map((service) => (
                            <SelectItem
                              key={service.id}
                              value={service.id.toString()}
                              className="cursor-pointer"
                            >
                              {service.name}
                            </SelectItem>
                          ))}
                          {groupIndex < servicesByCategoryEntries.length - 1 && (
                            <SelectSeparator className="my-2" />
                          )}
                        </SelectGroup>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {loadingServices ? (
                    <p className="text-xs text-muted-foreground">Loading services...</p>
                  ) : filteredServices.length > 0 ? (
                    <p className="text-xs text-muted-foreground">
                      {filteredServices.length} services available in {selectedCategory === "all" ? "all categories" : getCategoryName(selectedCategory)}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">No services available</p>
                  )}
                </div>
              </div>

              {/* Service cards – demo-style grid */}
              {!loadingServices && (
                <div className="p-4 border-b bg-white flex-1 overflow-y-auto">
                  <h3 className="text-sm font-semibold mb-3">
                    {selectedCategory === "all" ? "All services" : getCategoryName(selectedCategory)}
                  </h3>
                  {filteredServices.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-8 text-center">No services in this category</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {filteredServices.map((service) => (
                        <div
                          key={service.id}
                          className="bg-white rounded-lg p-3 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all flex items-center justify-between"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm text-gray-900 truncate">{service.name}</div>
                            <div className="text-xs text-gray-600 mt-1">{formatKES(service.price)}</div>
                          </div>
                          <Button
                            size="sm"
                            className="h-8 w-8 p-0 rounded-full bg-[#ef4444] hover:bg-[#dc2626] flex-shrink-0 ml-2"
                            onClick={() => addServiceToSale(service)}
                            disabled={sessionLocked}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="flex-1 overflow-hidden flex flex-col">
              <div className="p-4 border-b bg-gray-50">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Select Product to Add</Label>
                  <Select
                    value={selectedProduct || undefined}
                    onValueChange={handleProductSelect}
                    disabled={sessionLocked}
                  >
                    <SelectTrigger className="h-12 text-base" disabled={sessionLocked}>
                      <SelectValue placeholder="Choose a product..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[500px] w-full p-2" position="popper" sideOffset={4}>
                      {products.map((product) => (
                        <SelectItem
                          key={product.id}
                          value={product.id.toString()}
                          className="cursor-pointer"
                        >
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {loadingProducts ? (
                    <p className="text-xs text-muted-foreground">Loading products...</p>
                  ) : products.length > 0 ? (
                    <p className="text-xs text-muted-foreground">
                      {products.length} products available
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">No products available</p>
                  )}
                </div>
              </div>

              {/* Quick Add Products */}
              {!loadingProducts && products.length > 0 && (
                <div className="p-4 border-b bg-white">
                  <h3 className="text-sm font-semibold mb-3">Quick Add Products</h3>
                  <div className="flex flex-wrap gap-2">
                    {products.slice(0, 8).map((product) => {
                      const sellingPrice = product.selling_price || product.unit_price || 0
                      return (
                        <Button
                          key={product.id}
                          variant="outline"
                          size="sm"
                          onClick={() => addProductToSale(product)}
                          disabled={sessionLocked || (product.stock_quantity !== undefined && product.stock_quantity <= 0)}
                          className="h-10 text-xs font-medium"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          {product.name} - {formatKES(sellingPrice)}
                        </Button>
                      )
                    })}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel - Cart & Payment (40%) */}
        <div className="w-[40%] bg-gray-50 flex flex-col overflow-hidden">
          <div className="p-4 border-b bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Current Sale</h2>
              <Button variant="ghost" size="sm" onClick={clearSale} disabled={sessionLocked} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
          </div>

          <div className="p-4 overflow-y-auto flex-1 space-y-4">
            {/* Client Information */}
            <div className="space-y-3 bg-white p-4 rounded border">
              <div>
                <Label htmlFor="clientName" className="text-sm font-semibold mb-2 block">Client Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="clientName"
                    placeholder="Enter client name (Optional)"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    disabled={sessionLocked}
                    className="pl-10 h-11 text-base border"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="clientPhone" className="text-sm font-semibold mb-2 block">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="clientPhone"
                    placeholder="07XX XXX XXX (Optional)"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    disabled={sessionLocked}
                    className="pl-10 h-11 text-base border"
                  />
                </div>
              </div>
            </div>

            {/* Service Location & Time Tracking */}
            {(selectedAppointment || currentSaleServices.length > 0) && (
              <div className="space-y-3 bg-white p-4 rounded border">
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Service Location</Label>
                  <Select value={serviceLocation} onValueChange={setServiceLocation} disabled={sessionLocked}>
                    <SelectTrigger className="h-11 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="salon">Salon</SelectItem>
                      <SelectItem value="home">Home Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {serviceLocation === "home" && (
                  <div>
                    <Label htmlFor="homeServiceAddress" className="text-sm font-semibold mb-2 block">Home Service Address</Label>
                    <Input
                      id="homeServiceAddress"
                      placeholder="Enter full address"
                      value={homeServiceAddress}
                      onChange={(e) => setHomeServiceAddress(e.target.value)}
                      disabled={sessionLocked}
                      className="h-11 text-base border"
                    />
                  </div>
                )}
                
                {/* Service Time Tracking */}
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Service Time</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={serviceStartTime ? "default" : "outline"}
                      size="sm"
                      onClick={handleStartService}
                      disabled={sessionLocked || !!serviceStartTime}
                      className="flex-1"
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      {serviceStartTime ? "Started" : "Start Service"}
                    </Button>
                    <Button
                      variant={serviceEndTime ? "default" : "outline"}
                      size="sm"
                      onClick={handleEndService}
                      disabled={sessionLocked || !serviceStartTime || !!serviceEndTime}
                      className="flex-1"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      {serviceEndTime ? "Ended" : "End Service"}
                    </Button>
                  </div>
                  {serviceStartTime && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      Started: {serviceStartTime.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                  {serviceEndTime && serviceDuration !== null && (
                    <div className="mt-1 text-xs font-semibold text-green-600">
                      Duration: {serviceDuration} minutes
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sale Items */}
            {currentSaleServices.length === 0 && currentSaleProducts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded border">
                <p className="text-sm text-muted-foreground">No items in sale</p>
                <p className="text-xs text-muted-foreground mt-1">Add services or products to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Services Section */}
                {currentSaleServices.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2 text-green-700">Services</h3>
                    <div className="space-y-2">
                      {currentSaleServices.map((item) => {
                        const itemCommission = item.commission ?? ((item.price || 0) * (item.quantity || 0) * (item.commissionRate || defaultCommissionRate))
                        return (
                          <Card key={`service-${item.id}`} className="border">
                            <CardContent className="p-3">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-sm mb-1">{item.name}</h4>
                                  <p className="text-xs text-muted-foreground">{formatKES(item.price || 0)} × {item.quantity || 0}</p>
                                  <div className="mt-1 flex items-center gap-1 bg-green-50 px-2 py-1 rounded text-xs">
                                    <Coins className="h-3 w-3 text-green-600" />
                                    <span className="font-semibold text-green-700">Commission: {formatKES(itemCommission)}</span>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => removeServiceFromSale(item.id)}
                                  disabled={sessionLocked}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="flex items-center justify-between pt-2 border-t">
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => updateServiceQuantity(item.id, -1)}
                                    disabled={sessionLocked}
                                  >
                                    -
                                  </Button>
                                  <span className="text-sm font-semibold w-8 text-center">{item.quantity}</span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => updateServiceQuantity(item.id, 1)}
                                    disabled={sessionLocked}
                                  >
                                    +
                                  </Button>
                                </div>
                                <p className="font-bold text-primary">{formatKES((item.price || 0) * (item.quantity || 0))}</p>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Products Section */}
                {currentSaleProducts.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2 text-blue-700">Products</h3>
                    <div className="space-y-2">
                      {currentSaleProducts.map((item) => {
                        return (
                          <Card key={`product-${item.id}`} className="border">
                            <CardContent className="p-3">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-sm mb-1">{item.name}</h4>
                                  <p className="text-xs text-muted-foreground">{formatKES(item.price || 0)} × {item.quantity || 0}</p>
                                  {item.stock_quantity !== undefined && (
                                    <div className="mt-1 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded text-xs">
                                      <span className="text-blue-700">Stock: {item.stock_quantity} {item.unit || 'pcs'}</span>
                                    </div>
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => removeProductFromSale(item.id)}
                                  disabled={sessionLocked}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="flex items-center justify-between pt-2 border-t">
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => updateProductQuantity(item.id, -1)}
                                    disabled={sessionLocked}
                                  >
                                    -
                                  </Button>
                                  <span className="text-sm font-semibold w-8 text-center">{item.quantity}</span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => updateProductQuantity(item.id, 1)}
                                    disabled={sessionLocked}
                                  >
                                    +
                                  </Button>
                                </div>
                                <p className="font-bold text-primary">{formatKES((item.price || 0) * (item.quantity || 0))}</p>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Summary */}
            {(currentSaleServices.length > 0 || currentSaleProducts.length > 0) && (
              <div className="bg-white p-4 rounded border space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">{formatKES(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">VAT (16% inclusive)</span>
                  <span className="font-semibold">{formatKES(tax)}</span>
                </div>
                <div className="bg-green-50 p-3 rounded border border-green-200">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-700">Your Commission</span>
                    </div>
                    <span className="text-lg font-bold text-green-700">
                      {formatKES(totalCommission)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">{formatKES(total)}</span>
                </div>
              </div>
            )}

            {/* Recent Transactions */}
            {recentTransactions.length > 0 && (
              <div className="bg-white p-4 rounded border">
                <h3 className="text-sm font-semibold mb-3">Recent Transactions</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {recentTransactions.slice(0, 5).map((txn) => {
                    return (
                      <div key={txn.id} className="text-xs border-b pb-2 last:border-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{txn.client_name || txn.customer_name}</div>
                            <div className="text-muted-foreground">{txn.time || (txn.created_at ? new Date(txn.created_at).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }) : '')} • {txn.payment_method?.toUpperCase()}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{formatKES(txn.grand_total ?? txn.total_amount ?? 0)}</div>
                            <div className="text-green-600 text-xs">{formatKES(txn.commission ?? txn.commission_amount ?? 0)}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Payment Buttons - Fixed at Bottom */}
          <div className="p-4 border-t bg-white space-y-2">
            {/* Print Receipt Button */}
            {(currentSaleServices.length > 0 || currentSaleProducts.length > 0) && (
              <Button 
                className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handlePrintReceipt}
                disabled={receiptPrinted || sessionLocked}
              >
                <Printer className="h-5 w-5 mr-2" />
                {receiptPrinted ? "Receipt Printed ✓" : "Print Receipt"}
              </Button>
            )}

            {/* Payment Method Selection - Must be selected before printing */}
            {(currentSaleServices.length > 0 || currentSaleProducts.length > 0) && !receiptPrinted && (
              <>
                <p className="text-xs text-center mb-2 text-muted-foreground">Select payment method, then print receipt</p>
                <Button 
                  className="w-full h-14 text-base font-semibold bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handlePayment("M-Pesa")}
                  disabled={sessionLocked}
                  variant={paymentMethod === "M-Pesa" ? "default" : "outline"}
                >
                  <Phone className="h-5 w-5 mr-2" />
                  {paymentMethod === "M-Pesa" ? "✓ M-Pesa Selected" : "Select M-Pesa"}
                </Button>
                <Button 
                  className="w-full h-14 text-base font-semibold bg-gray-800 hover:bg-gray-900 text-white" 
                  onClick={() => handlePayment("Cash")}
                  disabled={sessionLocked}
                  variant={paymentMethod === "Cash" ? "default" : "outline"}
                >
                  <Wallet className="h-5 w-5 mr-2" />
                  {paymentMethod === "Cash" ? "✓ Cash Selected" : "Select Cash"}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* M-Pesa Transaction Code Dialog */}
      <Dialog open={showTransactionInput} onOpenChange={setShowTransactionInput}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter M-Pesa Transaction Code</DialogTitle>
            <DialogDescription>
              Please enter the M-Pesa transaction code from the customer's phone (10 alphanumeric characters)
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="transaction-code">Transaction Code</Label>
              <Input
                id="transaction-code"
                placeholder="e.g., QGH7X2K9L8"
                value={transactionCode}
                maxLength={10}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
                  setTransactionCode(value)
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && transactionCode && validateMpesaCode(transactionCode)) {
                    handleMpesaCodeSubmit()
                  }
                }}
              />
              {transactionCode && !validateMpesaCode(transactionCode) && (
                <p className="text-xs text-red-600">Please enter a valid 10-character M-Pesa code</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowTransactionInput(false)
              setTransactionCode("")
              setPaymentMethod("")
            }}>
              Cancel
            </Button>
            <Button onClick={handleMpesaCodeSubmit} disabled={!transactionCode || !validateMpesaCode(transactionCode)}>
              Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
