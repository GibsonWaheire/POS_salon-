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
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const categories = [
  { id: "all", name: "All Services" },
  { id: "hair", name: "Hair" },
  { id: "nails", name: "Nails" },
  { id: "facial", name: "Facial & Skin" },
  { id: "bridal", name: "Bridal" },
  { id: "threading", name: "Threading" },
]

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

  // Fetch services from API
  useEffect(() => {
    fetchServices()
    fetchProducts()
  }, [])

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
          category: service.category || "all" // Default category if not provided
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
    : services.filter(s => s.category === selectedCategory || !s.category)

  // Group services by category for better organization in dropdown
  const servicesByCategory = filteredServices.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = []
    }
    acc[service.category].push(service)
    return acc
  }, {})

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
          customer_name: clientName || null,
          customer_phone: clientPhone || null,
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
          receipt_number: receiptNum
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
            <h1 className="text-xl font-bold">POS System</h1>
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
                  {categories.map((category) => (
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
                  <Select value={selectedService} onValueChange={handleServiceSelect} disabled={sessionLocked}>
                    <SelectTrigger className="h-12 text-base" disabled={sessionLocked}>
                      <SelectValue placeholder="Choose a service..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[500px] w-full p-2">
                      {Object.entries(servicesByCategory).map(([category, categoryServices], groupIndex) => (
                        <SelectGroup key={category}>
                          <SelectLabel className="font-bold text-xs uppercase text-blue-700 px-3 py-2.5 bg-blue-50 sticky top-0 z-10 border-b border-blue-200 mb-1">
                            {category}
                          </SelectLabel>
                          {categoryServices.map((service, index) => {
                            const serviceCommission = (service.price || 0) * ((service.commissionRate || defaultCommissionRate))
                            return (
                              <SelectItem 
                                key={service.id} 
                                value={service.id.toString()}
                                className="!py-3 !px-3 !my-1.5 mx-0 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 focus:bg-blue-100 focus:border-blue-400 cursor-pointer transition-all duration-150 shadow-sm hover:shadow"
                              >
                                <div className="flex items-start justify-between w-full pr-6 gap-4">
                                  <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-sm text-gray-900 mb-2 leading-tight">{service.name}</div>
                                    <div className="flex items-center gap-2.5 text-xs text-muted-foreground flex-wrap">
                                      <span className="flex items-center gap-1 text-gray-600">
                                        <Clock className="h-3 w-3" />
                                        {service.duration} min
                                      </span>
                                      {service.category && (
                                        <>
                                          <span className="text-gray-300">|</span>
                                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-[10px] font-medium uppercase">
                                            {service.category}
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-right ml-2 flex-shrink-0 border-l border-gray-200 pl-4">
                                    <div className="font-bold text-base text-green-600 mb-1.5">{formatKES(service.price)}</div>
                                    <div className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded border border-green-200">
                                      Comm: {formatKES(serviceCommission)}
                                    </div>
                                  </div>
                                </div>
                              </SelectItem>
                            )
                          })}
                          {groupIndex < Object.keys(servicesByCategory).length - 1 && (
                            <div className="h-3 border-b border-gray-200 my-2 mx-3"></div>
                          )}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                  {loadingServices ? (
                    <p className="text-xs text-muted-foreground">Loading services...</p>
                  ) : filteredServices.length > 0 ? (
                    <p className="text-xs text-muted-foreground">
                      {filteredServices.length} services available in {selectedCategory === "all" ? "all categories" : selectedCategory}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">No services available</p>
                  )}
                </div>
              </div>

              {/* Quick Add Section */}
              {!loadingServices && (
                <div className="p-4 border-b bg-white">
                  <h3 className="text-sm font-semibold mb-3">Quick Add (Most Popular)</h3>
                  <div className="flex flex-wrap gap-2">
                    {filteredServices.slice(0, 8).map((service) => {
                      const serviceCommission = service.price * (service.commissionRate || defaultCommissionRate)
                      return (
                        <Button
                          key={service.id}
                          variant="outline"
                          size="sm"
                          onClick={() => addServiceToSale(service)}
                          disabled={sessionLocked}
                          className="h-10 text-xs font-medium"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          {service.name} - {formatKES(service.price)}
                        </Button>
                      )
                    })}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="flex-1 overflow-hidden flex flex-col">
              <div className="p-4 border-b bg-gray-50">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Select Product to Add</Label>
                  <Select value={selectedProduct} onValueChange={handleProductSelect} disabled={sessionLocked}>
                    <SelectTrigger className="h-12 text-base" disabled={sessionLocked}>
                      <SelectValue placeholder="Choose a product..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[500px] w-full p-2">
                      {products.map((product) => {
                        const sellingPrice = product.selling_price || product.unit_price || 0
                        return (
                          <SelectItem 
                            key={product.id} 
                            value={product.id.toString()}
                            className="!py-3 !px-3 !my-1.5 mx-0 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 focus:bg-blue-100 focus:border-blue-400 cursor-pointer transition-all duration-150 shadow-sm hover:shadow"
                          >
                            <div className="flex items-start justify-between w-full pr-6 gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-sm text-gray-900 mb-2 leading-tight">{product.name}</div>
                                <div className="flex items-center gap-2.5 text-xs text-muted-foreground flex-wrap">
                                  {product.category && (
                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-[10px] font-medium uppercase">
                                      {product.category}
                                    </span>
                                  )}
                                  {product.stock_quantity !== undefined && (
                                    <>
                                      <span className="text-gray-300">|</span>
                                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                        product.stock_quantity <= (product.min_stock_level || 5)
                                          ? 'bg-red-100 text-red-700'
                                          : 'bg-green-100 text-green-700'
                                      }`}>
                                        Stock: {product.stock_quantity} {product.unit || 'pcs'}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="text-right ml-2 flex-shrink-0 border-l border-gray-200 pl-4">
                                <div className="font-bold text-base text-blue-600 mb-1.5">{formatKES(sellingPrice)}</div>
                                {product.description && (
                                  <div className="text-xs text-muted-foreground mt-1 max-w-[150px] truncate">
                                    {product.description}
                                  </div>
                                )}
                              </div>
                            </div>
                          </SelectItem>
                        )
                      })}
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
