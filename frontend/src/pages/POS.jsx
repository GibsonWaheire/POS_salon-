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
import { useAuth } from "@/context/AuthContext"
import ReceiptTemplate from "@/components/ReceiptTemplate"
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
} from "lucide-react"

const categories = [
  { id: "all", name: "All Services" },
  { id: "hair", name: "Hair" },
  { id: "nails", name: "Nails" },
  { id: "facial", name: "Facial & Skin" },
  { id: "bridal", name: "Bridal" },
  { id: "threading", name: "Threading" },
]

// Kenyan salon-specific services with 50% commission rate
const services = [
  // Hair Services (1-20)
  { id: 1, name: "Haircut & Style", price: 2000, duration: 45, category: "hair", commissionRate: 0.50 },
  { id: 2, name: "Blowout", price: 1500, duration: 30, category: "hair", commissionRate: 0.50 },
  { id: 3, name: "Color - Full Head", price: 5000, duration: 120, category: "hair", commissionRate: 0.50 },
  { id: 4, name: "Highlights", price: 6000, duration: 150, category: "hair", commissionRate: 0.50 },
  { id: 5, name: "Balayage", price: 7000, duration: 180, category: "hair", commissionRate: 0.50 },
  { id: 6, name: "Deep Conditioning Treatment", price: 1200, duration: 20, category: "hair", commissionRate: 0.50 },
  { id: 7, name: "Finger Wave (Kenyan Style)", price: 2500, duration: 60, category: "hair", commissionRate: 0.50 },
  { id: 8, name: "Cornrows", price: 3000, duration: 90, category: "hair", commissionRate: 0.50 },
  { id: 9, name: "Twists", price: 3500, duration: 120, category: "hair", commissionRate: 0.50 },
  { id: 10, name: "Hair Wash & Conditioning", price: 800, duration: 25, category: "hair", commissionRate: 0.50 },
  { id: 31, name: "Kenyan Braids", price: 4000, duration: 180, category: "hair", commissionRate: 0.50 },
  { id: 32, name: "Box Braids", price: 5000, duration: 240, category: "hair", commissionRate: 0.50 },
  { id: 33, name: "Senegalese Twists", price: 4500, duration: 200, category: "hair", commissionRate: 0.50 },
  { id: 34, name: "Ghana Weaving", price: 6000, duration: 300, category: "hair", commissionRate: 0.50 },
  { id: 35, name: "Crochet Braids", price: 5500, duration: 180, category: "hair", commissionRate: 0.50 },
  { id: 36, name: "Hair Weaving", price: 8000, duration: 240, category: "hair", commissionRate: 0.50 },
  { id: 37, name: "Hair Relaxing", price: 3500, duration: 120, category: "hair", commissionRate: 0.50 },
  { id: 38, name: "Hair Rebonding", price: 10000, duration: 300, category: "hair", commissionRate: 0.50 },
  { id: 39, name: "Keratin Treatment", price: 9000, duration: 240, category: "hair", commissionRate: 0.50 },
  { id: 40, name: "Hair Extensions", price: 12000, duration: 360, category: "hair", commissionRate: 0.50 },
  
  // Nail Services (11-25)
  { id: 11, name: "Classic Manicure", price: 1200, duration: 30, category: "nails", commissionRate: 0.50 },
  { id: 12, name: "Gel Manicure", price: 1800, duration: 45, category: "nails", commissionRate: 0.50 },
  { id: 13, name: "Classic Pedicure", price: 1500, duration: 45, category: "nails", commissionRate: 0.50 },
  { id: 14, name: "Spa Pedicure", price: 2200, duration: 60, category: "nails", commissionRate: 0.50 },
  { id: 15, name: "Nail Art (per nail)", price: 200, duration: 5, category: "nails", commissionRate: 0.50 },
  { id: 16, name: "Gel Polish Removal", price: 500, duration: 15, category: "nails", commissionRate: 0.50 },
  { id: 41, name: "Acrylic Nails - Full Set", price: 3500, duration: 90, category: "nails", commissionRate: 0.50 },
  { id: 42, name: "Acrylic Nails - Fill", price: 2500, duration: 60, category: "nails", commissionRate: 0.50 },
  { id: 43, name: "Dip Powder Manicure", price: 2800, duration: 75, category: "nails", commissionRate: 0.50 },
  { id: 44, name: "French Manicure", price: 2000, duration: 50, category: "nails", commissionRate: 0.50 },
  { id: 45, name: "French Pedicure", price: 2300, duration: 60, category: "nails", commissionRate: 0.50 },
  { id: 46, name: "Paraffin Wax Treatment", price: 1800, duration: 45, category: "nails", commissionRate: 0.50 },
  { id: 47, name: "Nail Repair", price: 800, duration: 30, category: "nails", commissionRate: 0.50 },
  { id: 48, name: "Cuticle Treatment", price: 600, duration: 20, category: "nails", commissionRate: 0.50 },
  { id: 49, name: "Hand Massage", price: 1000, duration: 30, category: "nails", commissionRate: 0.50 },
  
  // Facial & Skin Services (17-27)
  { id: 17, name: "Classic Facial", price: 2800, duration: 60, category: "facial", commissionRate: 0.50 },
  { id: 18, name: "Hydrafacial", price: 4500, duration: 75, category: "facial", commissionRate: 0.50 },
  { id: 19, name: "Microdermabrasion", price: 3200, duration: 60, category: "facial", commissionRate: 0.50 },
  { id: 20, name: "LED Light Therapy", price: 2000, duration: 30, category: "facial", commissionRate: 0.50 },
  { id: 21, name: "Chemical Peel", price: 4000, duration: 45, category: "facial", commissionRate: 0.50 },
  { id: 50, name: "Acne Treatment Facial", price: 3500, duration: 75, category: "facial", commissionRate: 0.50 },
  { id: 51, name: "Anti-Aging Facial", price: 4500, duration: 90, category: "facial", commissionRate: 0.50 },
  { id: 52, name: "Deep Cleansing Facial", price: 3000, duration: 60, category: "facial", commissionRate: 0.50 },
  { id: 53, name: "Whitening Facial", price: 4000, duration: 75, category: "facial", commissionRate: 0.50 },
  { id: 54, name: "Gold Facial", price: 5000, duration: 90, category: "facial", commissionRate: 0.50 },
  { id: 55, name: "Diamond Facial", price: 5500, duration: 90, category: "facial", commissionRate: 0.50 },
  { id: 56, name: "Oxygen Facial", price: 4200, duration: 75, category: "facial", commissionRate: 0.50 },
  
  // Bridal Packages (22-30)
  { id: 22, name: "Bridal Package - Full", price: 25000, duration: 300, category: "bridal", commissionRate: 0.50 },
  { id: 23, name: "Bridal Package - Hair & Makeup", price: 15000, duration: 180, category: "bridal", commissionRate: 0.50 },
  { id: 24, name: "Bridal Package - Makeup Only", price: 8000, duration: 120, category: "bridal", commissionRate: 0.50 },
  { id: 25, name: "Bridal Trial", price: 5000, duration: 90, category: "bridal", commissionRate: 0.50 },
  { id: 57, name: "Bridal Hair Only", price: 10000, duration: 150, category: "bridal", commissionRate: 0.50 },
  { id: 58, name: "Bridal Makeup - Basic", price: 6000, duration: 90, category: "bridal", commissionRate: 0.50 },
  { id: 59, name: "Bridal Makeup - Premium", price: 12000, duration: 120, category: "bridal", commissionRate: 0.50 },
  { id: 60, name: "Bridal Package - Plus", price: 35000, duration: 420, category: "bridal", commissionRate: 0.50 },
  { id: 61, name: "Pre-Wedding Package", price: 20000, duration: 240, category: "bridal", commissionRate: 0.50 },
  
  // Threading (26-35)
  { id: 26, name: "Eyebrow Threading", price: 500, duration: 15, category: "threading", commissionRate: 0.50 },
  { id: 27, name: "Upper Lip Threading", price: 300, duration: 10, category: "threading", commissionRate: 0.50 },
  { id: 28, name: "Chin Threading", price: 400, duration: 10, category: "threading", commissionRate: 0.50 },
  { id: 29, name: "Full Face Threading", price: 1500, duration: 30, category: "threading", commissionRate: 0.50 },
  { id: 30, name: "Sideburns Threading", price: 500, duration: 10, category: "threading", commissionRate: 0.50 },
  { id: 62, name: "Forehead Threading", price: 400, duration: 10, category: "threading", commissionRate: 0.50 },
  { id: 63, name: "Cheek Threading", price: 500, duration: 10, category: "threading", commissionRate: 0.50 },
  { id: 64, name: "Neck Threading", price: 600, duration: 15, category: "threading", commissionRate: 0.50 },
  { id: 65, name: "Arm Threading", price: 1200, duration: 30, category: "threading", commissionRate: 0.50 },
  { id: 66, name: "Leg Threading", price: 2000, duration: 45, category: "threading", commissionRate: 0.50 },
  { id: 67, name: "Underarm Threading", price: 800, duration: 20, category: "threading", commissionRate: 0.50 },
  { id: 68, name: "Bikini Threading", price: 1500, duration: 30, category: "threading", commissionRate: 0.50 },
  { id: 69, name: "Full Body Threading", price: 8000, duration: 180, category: "threading", commissionRate: 0.50 },
  { id: 70, name: "Eyebrow Shaping", price: 600, duration: 20, category: "threading", commissionRate: 0.50 },
]

const formatKES = (amount) => {
  return `KES ${amount.toLocaleString('en-KE')}`
}

export default function POS() {
  const { staff, staffLogout } = useAuth()
  const navigate = useNavigate()
  const receiptPrintRef = useRef(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedService, setSelectedService] = useState("")
  const [currentSale, setCurrentSale] = useState([])
  const [clientName, setClientName] = useState("")
  const [clientPhone, setClientPhone] = useState("")
  const [receiptPrinted, setReceiptPrinted] = useState(false)
  const [receiptNumber, setReceiptNumber] = useState("")
  const [showReceipt, setShowReceipt] = useState(false)
  const [staffStats, setStaffStats] = useState({
    clients_served_today: 0,
    commission_today: 0
  })
  const [loadingStats, setLoadingStats] = useState(true)
  const [recentTransactions, setRecentTransactions] = useState([])

  // Fetch staff stats
  useEffect(() => {
    if (staff?.id) {
      fetchStaffStats()
      fetchRecentTransactions()
    }
  }, [staff])

  const fetchStaffStats = async () => {
    if (!staff?.id) return
    setLoadingStats(true)
    try {
      const response = await fetch(`http://localhost:5000/api/staff/${staff.id}/stats`)
      if (response.ok) {
        const data = await response.json()
        setStaffStats({
          clients_served_today: data.clients_served_today || 0,
          commission_today: data.commission_today || 0
        })
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
      const response = await fetch(`http://localhost:5000/api/staff/${staff.id}/commission-history?limit=10`)
      if (response.ok) {
        const data = await response.json()
        setRecentTransactions(data.transactions?.slice(0, 10) || [])
      }
    } catch (err) {
      console.error("Failed to fetch recent transactions:", err)
    }
  }

  const filteredServices = selectedCategory === "all" 
    ? services 
    : services.filter(s => s.category === selectedCategory)

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
      addToSale(service)
      setSelectedService("") // Reset dropdown after selection
    }
  }

  // Default commission rate (50%)
  const defaultCommissionRate = 0.50

  const addToSale = (service) => {
    const existingItem = currentSale.find(item => item.id === service.id)
    const commissionRate = service.commissionRate || defaultCommissionRate
    
    if (existingItem) {
      setCurrentSale(currentSale.map(item =>
        item.id === service.id
          ? { 
              ...item, 
              quantity: item.quantity + 1,
              commission: (item.price * (item.quantity + 1)) * commissionRate
            }
          : item
      ))
    } else {
      setCurrentSale([...currentSale, { 
        ...service, 
        quantity: 1,
        commission: service.price * commissionRate
      }])
    }
    // Reset receipt printed status when cart changes
    if (receiptPrinted) {
      setReceiptPrinted(false)
    }
  }

  const updateQuantity = (id, change) => {
    setCurrentSale(currentSale.map(item => {
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

  const removeFromSale = (id) => {
    setCurrentSale(currentSale.filter(item => item.id !== id))
    if (receiptPrinted) {
      setReceiptPrinted(false)
    }
  }

  const clearSale = () => {
    setCurrentSale([])
    setClientName("")
    setClientPhone("")
    setReceiptPrinted(false)
    setReceiptNumber("")
    setShowReceipt(false)
  }

  const subtotal = currentSale.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.08 // 8% VAT in Kenya
  const total = subtotal + tax
  const totalCommission = currentSale.reduce((sum, item) => {
    const commissionRate = item.commissionRate || defaultCommissionRate
    return sum + (item.price * item.quantity * commissionRate)
  }, 0)

  const handlePrintReceipt = () => {
    if (currentSale.length === 0) {
      alert("Please add items to the sale first")
      return
    }

    // Generate receipt number
    const receiptNum = `RCP-${Date.now().toString().slice(-6)}`
    setReceiptNumber(receiptNum)
    setShowReceipt(true)
    
    // Trigger print after a short delay to ensure receipt is rendered
    setTimeout(() => {
      window.print()
      setReceiptPrinted(true)
    }, 100)
  }

  const handlePayment = async (method) => {
    if (currentSale.length === 0) {
      alert("Please add items to the sale first")
      return
    }
    
    if (!receiptPrinted) {
      alert("Please print receipt before completing payment")
      return
    }
    
    try {
      // Create customer if name or phone provided
      let customerId = null
      if (clientName || clientPhone) {
        const customerResponse = await fetch("http://localhost:5000/api/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: clientName || "Walk-in Customer",
            phone: clientPhone || null
          })
        })
        if (customerResponse.ok) {
          const customer = await customerResponse.json()
          customerId = customer.id
        }
      }

      // Create appointment with staff_id
      const appointmentResponse = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: customerId || 1,
          staff_id: staff?.id,
          appointment_date: new Date().toISOString(),
          status: "completed",
          service_ids: currentSale.map(item => item.id)
        })
      })

      if (appointmentResponse.ok) {
        const appointment = await appointmentResponse.json()
        
        // Create payment with staff_id
        await fetch("http://localhost:5000/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            appointment_id: appointment.id,
            amount: total,
            payment_method: method.toLowerCase().replace("-", "_"),
            status: "completed",
            receipt_number: receiptNumber // Pass receipt number to backend
          })
        })

        // Clear sale first
        clearSale()
        
        // Small delay to ensure backend has committed transaction
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Refresh staff stats after payment
        await fetchStaffStats()
        await fetchRecentTransactions()
        
        alert(`Payment via ${method} successful!\nAmount: ${formatKES(total)}\nYour Commission: ${formatKES(totalCommission)}`)
      } else {
        throw new Error("Failed to create appointment")
      }
    } catch (err) {
      console.error("Payment error:", err)
      alert(`Payment via ${method} successful!\nAmount: ${formatKES(total)}\nYour Commission: ${formatKES(totalCommission)}`)
      await fetchStaffStats()
      await fetchRecentTransactions()
      clearSale()
    }
  }

  const handleLogout = () => {
    staffLogout()
    navigate("/staff-login")
  }

  const now = new Date()
  const receiptDate = now.toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' })
  const receiptTime = now.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="min-h-screen bg-background">
      {/* Receipt for Printing */}
      {showReceipt && currentSale.length > 0 && (
        <ReceiptTemplate
          receiptNumber={receiptNumber}
          date={receiptDate}
          time={receiptTime}
          staffName={staff?.name || "Staff"}
          clientName={clientName}
          clientPhone={clientPhone}
          services={currentSale.map(item => ({ 
            name: item.name, 
            price: item.price, 
            quantity: item.quantity 
          }))}
          subtotal={subtotal}
          tax={tax}
          total={total}
          paymentMethod={paymentMethod || "To be selected"}
        />
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
              </div>
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-600">
                  {loadingStats ? "..." : formatKES(Math.round(staffStats.commission_today))}
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
        {/* Left Panel - Services List (60%) */}
        <div className="w-[60%] border-r bg-white flex flex-col overflow-hidden">
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
                  className="h-10 px-4 text-sm font-medium"
                >
                  {category.name}
                </Button>
              ))}
            </div>
            
            {/* Services Dropdown */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Select Service to Add</Label>
              <Select value={selectedService} onValueChange={handleServiceSelect}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Choose a service..." />
                </SelectTrigger>
                <SelectContent className="max-h-[500px] w-full p-2">
                  {Object.entries(servicesByCategory).map(([category, categoryServices], groupIndex) => (
                    <SelectGroup key={category}>
                      <SelectLabel className="font-bold text-xs uppercase text-blue-700 px-3 py-2.5 bg-blue-50 sticky top-0 z-10 border-b border-blue-200 mb-1">
                        {category}
                      </SelectLabel>
                      {categoryServices.map((service, index) => {
                        const serviceCommission = service.price * (service.commissionRate || defaultCommissionRate)
                        const isLastInGroup = index === categoryServices.length - 1
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
                                  <span className="text-gray-300">|</span>
                                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-[10px] font-medium uppercase">
                                    {category}
                                  </span>
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
              {filteredServices.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {filteredServices.length} services available in {selectedCategory === "all" ? "all categories" : selectedCategory}
                </p>
              )}
            </div>
          </div>

          {/* Quick Add Section */}
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
                    onClick={() => addToSale(service)}
                    className="h-10 text-xs font-medium"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {service.name} - {formatKES(service.price)}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Panel - Cart & Payment (40%) */}
        <div className="w-[40%] bg-gray-50 flex flex-col overflow-hidden">
          <div className="p-4 border-b bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Current Sale</h2>
              <Button variant="ghost" size="sm" onClick={clearSale} className="text-red-600 hover:text-red-700 hover:bg-red-50">
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
                    className="pl-10 h-11 text-base border"
                  />
                </div>
              </div>
            </div>

            {/* Sale Items */}
            {currentSale.length === 0 ? (
              <div className="text-center py-12 bg-white rounded border">
                <p className="text-sm text-muted-foreground">No items in sale</p>
                <p className="text-xs text-muted-foreground mt-1">Tap services to add them</p>
              </div>
            ) : (
              <div className="space-y-2">
                {currentSale.map((item) => {
                  const itemCommission = item.commission || (item.price * item.quantity * (item.commissionRate || defaultCommissionRate))
                  return (
                    <Card key={item.id} className="border">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm mb-1">{item.name}</h4>
                            <p className="text-xs text-muted-foreground">{formatKES(item.price)} × {item.quantity}</p>
                            <div className="mt-1 flex items-center gap-1 bg-green-50 px-2 py-1 rounded text-xs">
                              <Coins className="h-3 w-3 text-green-600" />
                              <span className="font-semibold text-green-700">Commission: {formatKES(itemCommission)}</span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeFromSale(item.id)}
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
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              -
                            </Button>
                            <span className="text-sm font-semibold w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              +
                            </Button>
                          </div>
                          <p className="font-bold text-primary">{formatKES(item.price * item.quantity)}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}

            {/* Summary */}
            {currentSale.length > 0 && (
              <div className="bg-white p-4 rounded border space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">{formatKES(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">VAT (8%)</span>
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
                  {recentTransactions.slice(0, 5).map((txn) => (
                    <div key={txn.id} className="text-xs border-b pb-2 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{txn.client_name}</div>
                          <div className="text-muted-foreground">{txn.time} • {txn.payment_method?.toUpperCase()}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatKES(txn.grand_total)}</div>
                          <div className="text-green-600 text-xs">{formatKES(txn.commission)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Payment Buttons - Fixed at Bottom */}
          <div className="p-4 border-t bg-white space-y-2">
            {/* Print Receipt Button */}
            {currentSale.length > 0 && (
              <Button 
                className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handlePrintReceipt}
                disabled={receiptPrinted}
              >
                <Printer className="h-5 w-5 mr-2" />
                {receiptPrinted ? "Receipt Printed ✓" : "Print Receipt"}
              </Button>
            )}

            {/* Payment Buttons */}
            {currentSale.length > 0 && (
              <>
                {!receiptPrinted && (
                  <p className="text-xs text-red-600 text-center mb-2">Please print receipt before payment</p>
                )}
                <Button 
                  className="w-full h-14 text-base font-semibold bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handlePayment("M-Pesa")}
                  disabled={!receiptPrinted}
                >
                  <Phone className="h-5 w-5 mr-2" />
                  M-Pesa Payment
                </Button>
                <Button 
                  className="w-full h-14 text-base font-semibold bg-gray-800 hover:bg-gray-900 text-white" 
                  onClick={() => handlePayment("Cash")}
                  disabled={!receiptPrinted}
                >
                  <Wallet className="h-5 w-5 mr-2" />
                  Cash Payment
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
