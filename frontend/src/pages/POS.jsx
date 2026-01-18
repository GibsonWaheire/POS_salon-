import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  DollarSign, 
  Users, 
  ShoppingBag, 
  TrendingUp,
  Scissors,
  Sparkles,
  Droplets,
  Heart,
  Star,
  Plus,
  Trash2,
  Wallet,
  CreditCard,
  Settings,
  User
} from "lucide-react"

const categories = [
  { id: "all", name: "All", icon: Star },
  { id: "hair", name: "Hair", icon: Scissors },
  { id: "nails", name: "Nails", icon: Sparkles },
  { id: "skin", name: "Skin", icon: Droplets },
  { id: "waxing", name: "Waxing", icon: Heart },
  { id: "makeup", name: "Makeup", icon: Star },
]

const services = [
  { id: 1, name: "Haircut & Style", price: 2000, duration: 45, category: "hair" },
  { id: 2, name: "Blowout", price: 1500, duration: 30, category: "hair" },
  { id: 3, name: "Color - Full", price: 5000, duration: 120, category: "hair" },
  { id: 4, name: "Highlights", price: 6000, duration: 150, category: "hair" },
  { id: 5, name: "Balayage", price: 7000, duration: 180, category: "hair" },
  { id: 6, name: "Deep Conditioning", price: 1200, duration: 20, category: "hair" },
  { id: 7, name: "Classic Manicure", price: 1200, duration: 30, category: "nails" },
  { id: 8, name: "Gel Manicure", price: 1800, duration: 45, category: "nails" },
  { id: 9, name: "Classic Pedicure", price: 1500, duration: 45, category: "nails" },
  { id: 10, name: "Spa Pedicure", price: 2200, duration: 60, category: "nails" },
  { id: 11, name: "Nail Art (per nail)", price: 200, duration: 5, category: "nails" },
  { id: 12, name: "Classic Facial", price: 2800, duration: 60, category: "skin" },
  { id: 13, name: "Hydrafacial", price: 1500, duration: 75, category: "skin" },
  { id: 14, name: "Microdermabrasion", price: 2200, duration: 60, category: "skin" },
  { id: 15, name: "LED Light Therapy", price: 1000, duration: 30, category: "skin" },
  { id: 16, name: "Eyebrow Wax", price: 500, duration: 15, category: "waxing" },
]

const formatKES = (amount) => {
  return `KES ${amount.toLocaleString('en-KE')}`
}

export default function POS() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [currentSale, setCurrentSale] = useState([])
  const [clientName, setClientName] = useState("")
  const [selectedStaff, setSelectedStaff] = useState("")

  const filteredServices = selectedCategory === "all" 
    ? services 
    : services.filter(s => s.category === selectedCategory)

  const addToSale = (service) => {
    const existingItem = currentSale.find(item => item.id === service.id)
    if (existingItem) {
      setCurrentSale(currentSale.map(item =>
        item.id === service.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCurrentSale([...currentSale, { ...service, quantity: 1 }])
    }
  }

  const updateQuantity = (id, change) => {
    setCurrentSale(currentSale.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change
        return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 }
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
  }

  const subtotal = currentSale.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.08 // 8% tax (VAT in Kenya)
  const total = subtotal + tax

  // Calculate KPIs (mock data - will be replaced with real data)
  const todaySales = 124800
  const clientsServed = 18
  const transactions = 24
  const avgTicket = todaySales / transactions

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Salon POS</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}</span>
          <span className="text-sm text-muted-foreground">{new Date().toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">
              <select 
                value={selectedStaff} 
                onChange={(e) => setSelectedStaff(e.target.value)}
                className="bg-transparent border-none outline-none"
              >
                <option value="">Select Staff</option>
                <option value="staff1">Staff 1</option>
                <option value="staff2">Staff 2</option>
                <option value="staff3">Staff 3</option>
              </select>
            </span>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* KPIs */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">TODAY'S SALES</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatKES(todaySales)}</div>
                <p className="text-xs text-green-600 mt-1">+12%</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CLIENTS SERVED</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clientsServed}</div>
                <p className="text-xs text-green-600 mt-1">+3</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">TRANSACTIONS</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{transactions}</div>
                <p className="text-xs text-green-600 mt-1">+5</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AVG. TICKET</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatKES(Math.round(avgTicket))}</div>
                <p className="text-xs text-green-600 mt-1">+8%</p>
              </CardContent>
            </Card>
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 mb-6">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {category.name}
                </Button>
              )
            })}
          </div>

          {/* Service Catalog Grid */}
          <div className="grid grid-cols-4 gap-4">
            {filteredServices.map((service) => (
              <Card key={service.id} className="relative cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{service.name}</CardTitle>
                    <div className="flex gap-2 items-center">
                      <Badge variant="secondary" className="text-xs">
                        {service.category.toUpperCase()}
                      </Badge>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => addToSale(service)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-primary">{formatKES(service.price)}</p>
                    <p className="text-xs text-muted-foreground">{service.duration} min</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Current Sale Sidebar */}
        <div className="w-96 border-l bg-card p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Current Sale</h2>
            <Button variant="ghost" size="sm" onClick={clearSale}>
              Clear All
            </Button>
          </div>

          {/* Client Input */}
          <div className="mb-6">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Add Client (Optional)"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Sale Items */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-6">
            {currentSale.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No items in sale</p>
            ) : (
              currentSale.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{formatKES(item.price)} × {item.quantity}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeFromSale(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          -
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          +
                        </Button>
                      </div>
                      <p className="font-semibold">{formatKES(item.price * item.quantity)}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Summary */}
          <div className="space-y-2 mb-6 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatKES(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (8%)</span>
              <span>{formatKES(tax)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold pt-2 border-t">
              <span>Total</span>
              <span className="text-primary">{formatKES(total)}</span>
            </div>
          </div>

          {/* Payment Buttons */}
          <div className="space-y-3">
            <Button className="w-full h-12 text-base" variant="outline">
              <Wallet className="h-5 w-5 mr-2" />
              Cash
            </Button>
            <Button className="w-full h-12 text-base bg-primary">
              <CreditCard className="h-5 w-5 mr-2" />
              Card
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

