import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/AuthContext"
import { 
  Plus,
  Trash2,
  Wallet,
  CreditCard,
  User,
  Phone,
  Coins,
  LogOut,
  Users
} from "lucide-react"

const categories = [
  { id: "all", name: "All Services" },
  { id: "hair", name: "Hair" },
  { id: "nails", name: "Nails" },
  { id: "facial", name: "Facial & Skin" },
  { id: "bridal", name: "Bridal" },
  { id: "threading", name: "Threading" },
]

// Kenyan salon-specific services with commission rates (default 18%)
const services = [
  // Hair Services
  { id: 1, name: "Haircut & Style", price: 2000, duration: 45, category: "hair", commissionRate: 0.18 },
  { id: 2, name: "Blowout", price: 1500, duration: 30, category: "hair", commissionRate: 0.18 },
  { id: 3, name: "Color - Full Head", price: 5000, duration: 120, category: "hair", commissionRate: 0.18 },
  { id: 4, name: "Highlights", price: 6000, duration: 150, category: "hair", commissionRate: 0.18 },
  { id: 5, name: "Balayage", price: 7000, duration: 180, category: "hair", commissionRate: 0.20 },
  { id: 6, name: "Deep Conditioning Treatment", price: 1200, duration: 20, category: "hair", commissionRate: 0.15 },
  { id: 7, name: "Finger Wave (Kenyan Style)", price: 2500, duration: 60, category: "hair", commissionRate: 0.18 },
  { id: 8, name: "Cornrows", price: 3000, duration: 90, category: "hair", commissionRate: 0.18 },
  { id: 9, name: "Twists", price: 3500, duration: 120, category: "hair", commissionRate: 0.18 },
  { id: 10, name: "Hair Wash & Conditioning", price: 800, duration: 25, category: "hair", commissionRate: 0.15 },
  
  // Nail Services
  { id: 11, name: "Classic Manicure", price: 1200, duration: 30, category: "nails", commissionRate: 0.18 },
  { id: 12, name: "Gel Manicure", price: 1800, duration: 45, category: "nails", commissionRate: 0.18 },
  { id: 13, name: "Classic Pedicure", price: 1500, duration: 45, category: "nails", commissionRate: 0.18 },
  { id: 14, name: "Spa Pedicure", price: 2200, duration: 60, category: "nails", commissionRate: 0.18 },
  { id: 15, name: "Nail Art (per nail)", price: 200, duration: 5, category: "nails", commissionRate: 0.20 },
  { id: 16, name: "Gel Polish Removal", price: 500, duration: 15, category: "nails", commissionRate: 0.15 },
  
  // Facial & Skin Services
  { id: 17, name: "Classic Facial", price: 2800, duration: 60, category: "facial", commissionRate: 0.18 },
  { id: 18, name: "Hydrafacial", price: 4500, duration: 75, category: "facial", commissionRate: 0.20 },
  { id: 19, name: "Microdermabrasion", price: 3200, duration: 60, category: "facial", commissionRate: 0.18 },
  { id: 20, name: "LED Light Therapy", price: 2000, duration: 30, category: "facial", commissionRate: 0.18 },
  { id: 21, name: "Chemical Peel", price: 4000, duration: 45, category: "facial", commissionRate: 0.20 },
  
  // Bridal Packages (Kenyan specialty)
  { id: 22, name: "Bridal Package - Full", price: 25000, duration: 300, category: "bridal", commissionRate: 0.20 },
  { id: 23, name: "Bridal Package - Hair & Makeup", price: 15000, duration: 180, category: "bridal", commissionRate: 0.20 },
  { id: 24, name: "Bridal Package - Makeup Only", price: 8000, duration: 120, category: "bridal", commissionRate: 0.18 },
  { id: 25, name: "Bridal Trial", price: 5000, duration: 90, category: "bridal", commissionRate: 0.18 },
  
  // Threading (Very popular in Kenya)
  { id: 26, name: "Eyebrow Threading", price: 500, duration: 15, category: "threading", commissionRate: 0.18 },
  { id: 27, name: "Upper Lip Threading", price: 300, duration: 10, category: "threading", commissionRate: 0.18 },
  { id: 28, name: "Chin Threading", price: 400, duration: 10, category: "threading", commissionRate: 0.18 },
  { id: 29, name: "Full Face Threading", price: 1500, duration: 30, category: "threading", commissionRate: 0.18 },
  { id: 30, name: "Sideburns Threading", price: 500, duration: 10, category: "threading", commissionRate: 0.18 },
]

const formatKES = (amount) => {
  return `KES ${amount.toLocaleString('en-KE')}`
}

export default function POS() {
  const { staff, staffLogout } = useAuth()
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [currentSale, setCurrentSale] = useState([])
  const [clientName, setClientName] = useState("")
  const [clientPhone, setClientPhone] = useState("")
  const [staffStats, setStaffStats] = useState({
    clients_served_today: 0,
    commission_today: 0
  })
  const [loadingStats, setLoadingStats] = useState(true)

  // Fetch staff stats
  useEffect(() => {
    if (staff?.id) {
      fetchStaffStats()
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

  const filteredServices = selectedCategory === "all" 
    ? services 
    : services.filter(s => s.category === selectedCategory)

  // Default commission rate (18% - common in Kenyan salons)
  const defaultCommissionRate = 0.18

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
  }

  const removeFromSale = (id) => {
    setCurrentSale(currentSale.filter(item => item.id !== id))
  }

  const clearSale = () => {
    setCurrentSale([])
    setClientName("")
    setClientPhone("")
  }

  const subtotal = currentSale.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.08 // 8% VAT in Kenya
  const total = subtotal + tax
  const totalCommission = currentSale.reduce((sum, item) => {
    const commissionRate = item.commissionRate || defaultCommissionRate
    return sum + (item.price * item.quantity * commissionRate)
  }, 0)

  const handlePayment = async (method) => {
    if (currentSale.length === 0) {
      alert("Please add items to the sale first")
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
          customer_id: customerId || 1, // Use default customer if none
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
            status: "completed"
          })
        })

        alert(`Payment via ${method} successful!\nAmount: ${formatKES(total)}\nYour Commission: ${formatKES(totalCommission)}`)
        
        // Refresh staff stats
        await fetchStaffStats()
        clearSale()
      }
    } catch (err) {
      console.error("Payment error:", err)
      alert(`Payment via ${method} successful!\nAmount: ${formatKES(total)}\nYour Commission: ${formatKES(totalCommission)}`)
      clearSale()
    }
  }

  const handleLogout = () => {
    staffLogout()
    navigate("/staff-login")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Simplified Header */}
      <header className="border-b bg-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">POS System</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}</span>
          <span className="text-sm font-medium">{staff?.name || "Staff"}</span>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {/* Individual Staff Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Your Clients Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div className="text-3xl font-bold">{loadingStats ? "..." : staffStats.clients_served_today}</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Your Commission Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-green-600" />
                  <div className="text-3xl font-bold text-green-600">
                    {loadingStats ? "..." : formatKES(Math.round(staffStats.commission_today))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="h-12 px-6 text-base font-medium"
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Service Catalog Grid */}
          <div className="grid grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredServices.map((service) => (
              <Card 
                key={service.id} 
                className="cursor-pointer hover:shadow-md transition-shadow border"
                onClick={() => addToSale(service)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between mb-1">
                    <CardTitle className="text-base font-semibold leading-tight pr-2">{service.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {service.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-green-600">{formatKES(service.price)}</p>
                    <Button
                      size="icon"
                      className="h-10 w-10"
                      onClick={(e) => {
                        e.stopPropagation()
                        addToSale(service)
                      }}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{service.duration} min</span>
                    <span className="text-green-600 font-medium">
                      {formatKES(service.price * (service.commissionRate || defaultCommissionRate))}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Current Sale Sidebar */}
        <div className="w-[420px] border-l bg-white p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <h2 className="text-2xl font-bold">Current Sale</h2>
            <Button variant="ghost" size="sm" onClick={clearSale} className="text-red-600 hover:text-red-700 hover:bg-red-50">
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>

          {/* Client Information */}
          <div className="mb-6 space-y-3">
            <div>
              <Label htmlFor="clientName" className="text-sm font-semibold mb-2 block">Client Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="clientName"
                  placeholder="Enter client name (Optional)"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="pl-10 h-12 text-base border"
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
                  className="pl-10 h-12 text-base border"
                />
              </div>
            </div>
          </div>

          {/* Sale Items */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-6 min-h-0">
            {currentSale.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-muted-foreground">No items in sale</p>
                <p className="text-xs text-muted-foreground mt-1">Tap services to add them</p>
              </div>
            ) : (
              currentSale.map((item) => {
                const itemCommission = item.commission || (item.price * item.quantity * (item.commissionRate || defaultCommissionRate))
                return (
                  <Card key={item.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-base mb-1">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">{formatKES(item.price)} × {item.quantity}</p>
                          <div className="mt-2 flex items-center gap-2 bg-green-50 px-2 py-1 rounded">
                            <Coins className="h-3 w-3 text-green-600" />
                            <span className="text-xs font-semibold text-green-700">
                              Commission: {formatKES(itemCommission)}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeFromSale(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            -
                          </Button>
                          <span className="text-base font-semibold w-10 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            +
                          </Button>
                        </div>
                        <p className="font-bold text-lg text-primary">{formatKES(item.price * item.quantity)}</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>

          {/* Summary */}
          <div className="space-y-3 mb-6 pt-4 border-t">
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
            <div className="flex justify-between text-xl font-bold pt-2 border-t">
              <span>Total</span>
              <span className="text-primary text-2xl">{formatKES(total)}</span>
            </div>
          </div>

          {/* Payment Buttons */}
          <div className="space-y-3">
            <Button 
              className="w-full h-14 text-base font-semibold bg-green-600 hover:bg-green-700 text-white"
              onClick={() => handlePayment("M-Pesa")}
            >
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                M-Pesa Payment
              </div>
            </Button>
            <Button 
              className="w-full h-12 text-base font-semibold" 
              variant="outline"
              onClick={() => handlePayment("Cash")}
            >
              <Wallet className="h-5 w-5 mr-2" />
              Cash Payment
            </Button>
            <Button 
              className="w-full h-12 text-base font-semibold" 
              variant="outline"
              onClick={() => handlePayment("Card")}
            >
              <CreditCard className="h-5 w-5 mr-2" />
              Card Payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
