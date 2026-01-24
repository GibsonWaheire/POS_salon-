import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  ArrowRight,
  Calendar,
  Star,
  ChevronDown,
  Menu,
  ClipboardList,
  LineChart,
  Users,
  Calculator,
  X,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Plus,
  Trash2,
  Grid3x3,
  Scissors,
  Clock,
  DollarSign,
  CreditCard,
  ShoppingCart,
  Package,
  TrendingDown,
  FileText,
  UserCircle as UserCircleIcon,
  Zap,
  MapPin,
  Printer,
  Settings,
  Eye,
  TrendingUp,
  Calendar as CalendarIcon,
  CheckCircle2
} from "lucide-react"
import { toast } from "sonner"
import WhatsAppChat from "@/components/WhatsAppChat"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { formatCurrency } from "@/lib/currency"

export default function Landing() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [counters, setCounters] = useState({ salons: 0, transactions: 0, customers: 0, satisfaction: 0 })
  
  // Demo state
  const [demoViewMode, setDemoViewMode] = useState("manager") // "manager" | "staff"
  const [demoSelectedSidebar, setDemoSelectedSidebar] = useState("dashboard")
  const [demoSelectedServices, setDemoSelectedServices] = useState([])
  const [demoClientName, setDemoClientName] = useState("")
  const [demoClientPhone, setDemoClientPhone] = useState("")
  const [demoServiceLocation, setDemoServiceLocation] = useState("salon")
  const [demoActiveTab, setDemoActiveTab] = useState("services")
  const [demoSelectedCategory, setDemoSelectedCategory] = useState("all")
  
  // Appointment form state
  const [appointmentForm, setAppointmentForm] = useState({
    customerName: "",
    phone: "",
    date: "",
    time: "",
    service: "",
    location: "salon",
    homeAddress: "",
    staff: ""
  })
  const [appointmentSubmitted, setAppointmentSubmitted] = useState(false)

  // Animate counters on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const targets = { salons: 500, transactions: 50000, customers: 10000, satisfaction: 98 }
            const duration = 2000
            const steps = 60
            const increment = duration / steps
            
            Object.keys(targets).forEach((key) => {
              let current = 0
              const target = targets[key]
              const stepValue = target / steps
              
              const timer = setInterval(() => {
                current += stepValue
                if (current >= target) {
                  current = target
                  clearInterval(timer)
                }
                setCounters((prev) => ({ ...prev, [key]: Math.floor(current) }))
              }, increment)
            })
          }
        })
      },
      { threshold: 0.5 }
    )
    
    const statsSection = document.getElementById('stats')
    if (statsSection) observer.observe(statsSection)
    
    return () => observer.disconnect()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!formData.name || !formData.email) {
      toast.error("Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    setTimeout(() => {
      toast.success("Thank you! We'll contact you soon with a quote.")
      setFormData({
        name: "",
        email: "",
        phone: "",
        businessName: "",
        message: ""
      })
      setIsSubmitting(false)
    }, 1000)
  }

  // Demo data constants
  // Helper function to convert KES to USD (demo data is in KES)
  const convertKESToUSD = (kesAmount) => {
    return kesAmount / 130 // 1 USD = 130 KES
  }

  const demoServices = [
    { id: 1, name: "Haircut & Style", price: 1000, duration: 45, category: "hair", description: "Professional haircut and styling" },
    { id: 2, name: "Blowout", price: 750, duration: 30, category: "hair", description: "Professional blow dry styling" },
    { id: 3, name: "Color - Full Head", price: 2500, duration: 120, category: "hair", description: "Full head hair coloring service" },
    { id: 4, name: "Highlights", price: 3000, duration: 150, category: "hair", description: "Hair highlighting service" },
    { id: 5, name: "Balayage", price: 3500, duration: 180, category: "hair", description: "Balayage hair coloring technique" },
    { id: 6, name: "Cornrows", price: 1500, duration: 90, category: "hair", description: "Traditional cornrow braiding" },
    { id: 7, name: "Manicure", price: 800, duration: 45, category: "nails", description: "Professional nail care and polish" },
    { id: 8, name: "Pedicure", price: 1000, duration: 60, category: "nails", description: "Professional foot care and polish" },
    { id: 9, name: "Facial Treatment", price: 2000, duration: 60, category: "facial", description: "Deep cleansing facial treatment" },
    { id: 10, name: "Bridal Package", price: 15000, duration: 240, category: "bridal", description: "Complete bridal makeover package" },
  ]

  const demoRecentTransactions = [
    { id: 1, client: "Walk-in", time: "05:41", method: "CASH", amount: 750, commission: 323.27 },
    { id: 2, client: "Walk-in", time: "16:31", method: "CASH", amount: 5000, commission: 2155.17 },
    { id: 3, client: "Walk-in", time: "13:09", method: "M_PESA", amount: 6750, commission: 2909.48 },
    { id: 4, client: "Sarah M.", time: "10:15", method: "M_PESA", amount: 2500, commission: 1077.59 },
    { id: 5, client: "John D.", time: "14:22", method: "CASH", amount: 1500, commission: 646.55 },
  ]

  const demoDashboardStats = {
    today_revenue: 45000,
    total_commission: 18500,
    active_staff_count: 3,
    total_staff_count: 8,
    currently_logged_in: [
      { id: 1, name: "Jane Doe", role: "stylist", login_time: "08:30" },
      { id: 2, name: "Mary Smith", role: "stylist", login_time: "09:15" },
      { id: 3, name: "Peter Kimani", role: "barber", login_time: "10:00" },
    ],
    recent_transactions: demoRecentTransactions.slice(0, 5),
    staff_performance: [
      { id: 1, name: "Jane Doe", sales: 12500, commission: 5387.93, clients: 8 },
      { id: 2, name: "Mary Smith", sales: 9800, commission: 4224.14, clients: 6 },
      { id: 3, name: "Peter Kimani", sales: 15200, commission: 6551.72, clients: 10 },
    ]
  }

  const demoStaffList = [
    { id: 1, name: "Jane Doe", phone: "0712345678", email: "jane@example.com", role: "stylist", is_active: true },
    { id: 2, name: "Mary Smith", phone: "0723456789", email: "mary@example.com", role: "stylist", is_active: true },
    { id: 3, name: "Peter Kimani", phone: "0734567890", email: "peter@example.com", role: "barber", is_active: true },
    { id: 4, name: "Grace Wanjiru", phone: "0745678901", email: "grace@example.com", role: "nail_technician", is_active: true },
    { id: 5, name: "David Ochieng", phone: "0756789012", email: "david@example.com", role: "barber", is_active: false },
    { id: 6, name: "Lucy Muthoni", phone: "0767890123", email: "lucy@example.com", role: "stylist", is_active: true },
  ]

  const demoShifts = [
    { id: 1, staff_name: "Jane Doe", date: "2026-01-24", start_time: "08:00", end_time: "17:00", status: "completed" },
    { id: 2, staff_name: "Mary Smith", date: "2026-01-24", start_time: "09:00", end_time: "18:00", status: "active" },
    { id: 3, staff_name: "Peter Kimani", date: "2026-01-24", start_time: "10:00", end_time: "19:00", status: "active" },
    { id: 4, staff_name: "Grace Wanjiru", date: "2026-01-25", start_time: "08:00", end_time: "17:00", status: "scheduled" },
  ]

  const demoCommissionPayments = [
    { id: 1, staff_name: "Jane Doe", period: "2026-01-17 to 2026-01-23", amount: 12500, status: "pending" },
    { id: 2, staff_name: "Mary Smith", period: "2026-01-17 to 2026-01-23", amount: 9800, status: "pending" },
    { id: 3, staff_name: "Peter Kimani", period: "2026-01-17 to 2026-01-23", amount: 15200, status: "paid", paid_date: "2026-01-20" },
  ]

  const demoPayments = [
    { id: 1, date: "2026-01-24", time: "10:15", customer: "Sarah M.", amount: 2500, method: "M_PESA", status: "completed" },
    { id: 2, date: "2026-01-24", time: "14:22", customer: "John D.", amount: 1500, method: "CASH", status: "completed" },
    { id: 3, date: "2026-01-24", time: "16:31", customer: "Walk-in", amount: 5000, method: "CASH", status: "completed" },
  ]

  const demoSales = [
    { id: 1, date: "2026-01-24", customer: "Sarah M.", items: "Haircut & Style, Blowout", total: 2500, staff: "Jane Doe", status: "completed" },
    { id: 2, date: "2026-01-24", customer: "John D.", items: "Color - Full Head", total: 1500, staff: "Mary Smith", status: "completed" },
    { id: 3, date: "2026-01-24", customer: "Walk-in", items: "Balayage, Manicure", total: 5000, staff: "Peter Kimani", status: "completed" },
  ]

  const demoAppointments = [
    { id: 1, customer: "Sarah M.", service: "Haircut & Style", date: "2026-01-25", time: "10:00", staff: "Jane Doe", status: "scheduled" },
    { id: 2, customer: "John D.", service: "Color - Full Head", date: "2026-01-25", time: "14:00", staff: "Mary Smith", status: "scheduled" },
    { id: 3, customer: "Grace K.", service: "Bridal Package", date: "2026-01-26", time: "09:00", staff: "Jane Doe", status: "scheduled" },
  ]

  const demoInventory = [
    { id: 1, name: "Hair Shampoo", category: "Hair Care", quantity: 45, unit: "bottles", low_stock_threshold: 10 },
    { id: 2, name: "Nail Polish - Red", category: "Nail Care", quantity: 32, unit: "bottles", low_stock_threshold: 15 },
    { id: 3, name: "Hair Color - Blonde", category: "Hair Care", quantity: 8, unit: "boxes", low_stock_threshold: 10 },
    { id: 4, name: "Conditioner", category: "Hair Care", quantity: 28, unit: "bottles", low_stock_threshold: 10 },
  ]

  const demoExpenses = [
    { id: 1, date: "2026-01-20", category: "Supplies", description: "Hair products purchase", amount: 15000, paid_by: "Manager" },
    { id: 2, date: "2026-01-22", category: "Utilities", description: "Electricity bill", amount: 5000, paid_by: "Manager" },
    { id: 3, date: "2026-01-23", category: "Rent", description: "Monthly salon rent", amount: 50000, paid_by: "Manager" },
  ]

  const demoUsers = [
    { id: 1, name: "Admin User", email: "admin@salonyst.com", role: "admin", is_active: true },
    { id: 2, name: "Manager One", email: "manager1@salonyst.com", role: "manager", is_active: true },
    { id: 3, name: "Manager Two", email: "manager2@salonyst.com", role: "manager", is_active: false },
  ]

  const demoStaffPOSData = {
    staff_name: "Demo Staff",
    today_commission: 2450,
    clients_served: 5,
    recent_transactions: demoRecentTransactions.slice(0, 3)
  }

  const handleDemoAddService = (service) => {
    setDemoSelectedServices([...demoSelectedServices, { ...service, quantity: 1 }])
  }

  const handleDemoRemoveService = (serviceId) => {
    setDemoSelectedServices(demoSelectedServices.filter(s => s.id !== serviceId))
  }

  const demoTotal = demoSelectedServices.reduce((sum, s) => sum + (s.price * s.quantity), 0)
  const demoSubtotal = Math.round((demoTotal / 1.16) * 100) / 100
  const demoTax = Math.round((demoTotal - demoSubtotal) * 100) / 100
  const demoCommission = demoSelectedServices.reduce((sum, s) => {
    const itemSubtotal = (s.price * s.quantity) / 1.16
    return sum + (itemSubtotal * 0.50)
  }, 0)

  const features = [
    {
      title: "Appointment",
      icon: Calendar,
      subFeatures: ["Online Booking", "Slot Blockers", "Off Hours Booking", "Package Booking", "Membership Booking"]
    },
    {
      title: "Inventory",
      icon: ClipboardList,
      subFeatures: ["Centralized Inventory", "Audits Reports", "Inhouse Inventory", "Transparency", "Transfer Inventory"]
    },
    {
      title: "Marketing",
      icon: LineChart,
      subFeatures: ["Email Marketing", "Get More Reviews", "Coupons Management", "Gift Cards", "Loyalty System"]
    },
    {
      title: "Staff Payroll",
      icon: Users,
      subFeatures: ["Staff Commissions", "Payroll", "Staff Schedule", "KPI Reporting", "Notification"]
    },
    {
      title: "Point Of Sale",
      icon: Calculator,
      subFeatures: ["Manage Transactions", "Payment Gateway Integration", "Bulk Checkout", "Stripe Terminals", "Payment Reports"]
    }
  ]

  const salonTypes = [
    "Massage",
    "Hair",
    "Spa",
    "Make Up Artists",
    "Beauty",
    "Barber Shop",
    "Bridal",
    "Tattoo",
    "Pet Grooming",
    "Nail Salon",
    "Aesthetic Skin Care",
    "Salon Booth Rental",
  ]

  const trustedBrands = [
    "Glamour Hair Salon",
    "Elite Barbershop",
    "Beauty & Beyond Spa",
    "Nairobi Nails",
    "Royal Massage Center",
    "Bridal Beauty Studio",
    "Aesthetic Skin Clinic",
    "Pet Grooming Pro"
  ]

  const stats = [
    { value: counters.salons, label: "Salons Using Salonyst", suffix: "+" },
    { value: counters.transactions, label: "Transactions Processed", suffix: "+" },
    { value: counters.customers, label: "Happy Customers", suffix: "+" },
    { value: counters.satisfaction, label: "Customer Satisfaction", suffix: "%" }
  ]

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: Grid3x3 },
    { id: "staff", label: "Staff", icon: Users },
    { id: "services", label: "Services", icon: Scissors },
    { id: "shifts", label: "Shifts", icon: Clock },
    { id: "commission", label: "Commission Payments", icon: DollarSign },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "sales", label: "Sales", icon: ShoppingCart },
    { id: "pos", label: "POS", icon: Calculator },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "expenses", label: "Expenses", icon: TrendingDown },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "users", label: "Users", icon: UserCircleIcon },
  ]

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif" }}>
      {/* WhatsApp Chat Widget */}
      <WhatsAppChat />

      {/* Header/Navigation */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-center">
            {/* Logo */}
            <div className="absolute left-4 sm:left-8 flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-400 via-green-400 to-yellow-400 rounded-sm"></div>
              <span className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>
                Salonyst
              </span>
            </div>

            {/* Centered Navigation - Bigger and More Spaced */}
            <nav className="hidden md:flex items-center gap-10">
              <DropdownMenu>
                <DropdownMenuTrigger className="text-base font-semibold text-gray-800 hover:text-gray-900 transition-colors flex items-center gap-2 py-2" style={{ fontSize: '18px', fontWeight: 600 }}>
                  Why Salonist
                  <ChevronDown className="h-5 w-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => navigate("/about-us")}>About Us</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/why-choose-us")}>Why Choose Us</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/success-stories")}>Success Stories</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger className="text-base font-semibold text-gray-800 hover:text-gray-900 transition-colors flex items-center gap-2 py-2" style={{ fontSize: '18px', fontWeight: 600 }}>
                  Features
                  <ChevronDown className="h-5 w-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })}>All Features</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })}>Appointment Management</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })}>POS System</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })}>Inventory</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <a href="/solutions" onClick={(e) => { e.preventDefault(); navigate("/solutions"); }} className="text-base font-semibold text-gray-800 hover:text-gray-900 transition-colors py-2" style={{ fontSize: '18px', fontWeight: 600 }}>
                Solutions
              </a>
              <a href="/pricing" onClick={(e) => { e.preventDefault(); navigate("/pricing"); }} className="text-base font-semibold text-gray-800 hover:text-gray-900 transition-colors py-2" style={{ fontSize: '18px', fontWeight: 600 }}>
                Pricing
              </a>
            </nav>

            {/* Right Side Actions */}
            <div className="absolute right-4 sm:right-8 flex items-center gap-4">
              <Button 
                onClick={() => navigate("/signup")}
                className="rounded-lg bg-[#ef4444] hover:bg-[#dc2626] text-white px-8 py-3 hidden md:inline-flex text-base font-semibold"
                style={{ fontSize: '16px', fontWeight: 600 }}
              >
                Signup
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-white border-gray-300 px-4 py-2">
                    <Menu className="h-5 w-5 mr-2" />
                    <span className="text-base font-semibold">Menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/login")}>Logins</DropdownMenuItem>
                  <DropdownMenuItem>Download</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/blog")}>Blog</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/help-center")}>Help and Support</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Gray Background, Centered */}
      <section className="relative py-20 md:py-32 bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>
              #1 Salon Software To Grow Your Business
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-normal">
              Salonyst is an all-in-one salon management software designed to promote growth in the beauty and wellness industry. Helps to manage day-to-day operations and elevate your client experience.
            </p>
            <div className="pt-8 flex flex-col items-center gap-4">
              <div 
                onClick={() => document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="animate-bounce cursor-pointer"
              >
                <ChevronDown className="h-8 w-8 text-gray-600 hover:text-[#ef4444] transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Demo Section - POS Dashboard Style */}
      <section id="demo-section" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">Try Our Interactive Demo</h2>
              <p className="text-lg text-gray-600">Experience the full POS system right here</p>
            </div>
            
            {/* POS Dashboard Demo */}
            <div className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-2xl">
              {/* Top Header Bar */}
              <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-bold text-gray-900">POS System</h3>
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                    <Button
                      variant={demoViewMode === "manager" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => {
                        setDemoViewMode("manager")
                        setDemoSelectedSidebar("dashboard")
                      }}
                      className={`h-8 px-4 ${demoViewMode === "manager" ? "bg-[#ef4444] hover:bg-[#dc2626] text-white" : ""}`}
                    >
                      Manager View
                    </Button>
                    <Button
                      variant={demoViewMode === "staff" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setDemoViewMode("staff")}
                      className={`h-8 px-4 ${demoViewMode === "staff" ? "bg-[#ef4444] hover:bg-[#dc2626] text-white" : ""}`}
                    >
                      Staff POS View
                    </Button>
                  </div>
                </div>
                {demoViewMode === "manager" && (
                  <div className="flex items-center gap-6 text-sm">
                    <span className="font-medium">Today: 1 Clients</span>
                    <span className="font-medium">Weekly Commission: <span className="text-green-600">{formatCurrency(convertKESToUSD(16039), 'USD')}</span></span>
                    <span className="font-medium text-green-600">{formatCurrency(convertKESToUSD(323), 'USD')}</span>
                  </div>
                )}
                {demoViewMode === "staff" && (
                  <div className="flex items-center gap-6 text-sm">
                    <span className="font-medium">Staff: {demoStaffPOSData.staff_name}</span>
                    <span className="font-medium">Today's Commission: <span className="text-green-600">{formatCurrency(convertKESToUSD(demoStaffPOSData.today_commission), 'USD')}</span></span>
                    <span className="font-medium">Clients Served: <span className="text-blue-600">{demoStaffPOSData.clients_served}</span></span>
                  </div>
                )}
              </div>

              <div className="flex bg-white">
                {/* Manager View - Show Sidebar */}
                {demoViewMode === "manager" && (
                  <>
                    {/* Left Sidebar */}
                    <div className="w-64 bg-[#1A202C] text-white flex flex-col min-h-[600px]">
                      <div className="p-4 border-b border-gray-700">
                        <h2 className="text-xl font-bold">Salonyst</h2>
                      </div>
                      <nav className="flex-1 p-4 space-y-1">
                        {sidebarItems.map((item) => {
                          const Icon = item.icon
                          const isActive = demoSelectedSidebar === item.id
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                setDemoSelectedSidebar(item.id)
                                toast.info(`Viewing ${item.label} demo`)
                              }}
                              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                                isActive
                                  ? "bg-gray-800 text-white border-l-4 border-[#ef4444]"
                                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                              <span className="font-medium">{item.label}</span>
                            </button>
                          )
                        })}
                      </nav>
                      <div className="p-4 border-t border-gray-700">
                        <div className="flex items-center gap-2 mb-3">
                          <UserCircleIcon className="h-5 w-5" />
                          <span className="text-sm">Manager</span>
                          <span className="text-xs bg-gray-700 px-2 py-1 rounded">admin</span>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm">Demo Mode</span>
                          <span className="text-xs bg-[#ef4444] px-2 py-1 rounded">LIVE</span>
                        </div>
                      </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col">
                      {/* Dashboard View */}
                      {demoSelectedSidebar === "dashboard" && (
                        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                          <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-2">Dashboard Overview</h2>
                            <p className="text-gray-600">Key metrics and performance indicators</p>
                          </div>

                          {/* Stats Cards */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                              <div className="text-sm text-gray-600 mb-1">Today's Sales Revenue</div>
                              <div className="text-2xl font-bold text-gray-900">{formatCurrency(convertKESToUSD(demoDashboardStats.today_revenue), 'USD')}</div>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                              <div className="text-sm text-gray-600 mb-1">Total Commission Pending</div>
                              <div className="text-2xl font-bold text-green-600">{formatCurrency(convertKESToUSD(demoDashboardStats.total_commission), 'USD')}</div>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                              <div className="text-sm text-gray-600 mb-1">Active Staff</div>
                              <div className="text-2xl font-bold text-blue-600">{demoDashboardStats.active_staff_count}</div>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                              <div className="text-sm text-gray-600 mb-1">Total Staff Members</div>
                              <div className="text-2xl font-bold text-gray-900">{demoDashboardStats.total_staff_count}</div>
                            </div>
                          </div>

                          {/* Currently Logged In Staff */}
                          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm mb-6">
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                              <Users className="h-5 w-5" />
                              Currently Logged In Staff
                            </h3>
                            <div className="space-y-2">
                              {demoDashboardStats.currently_logged_in.map((staff) => (
                                <div key={staff.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <div>
                                    <span className="font-medium">{staff.name}</span>
                                    <span className="text-sm text-gray-600 ml-2">({staff.role})</span>
                                  </div>
                                  <span className="text-sm text-gray-600">Logged in at {staff.login_time}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Recent Transactions */}
                          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm mb-6">
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                              <ShoppingCart className="h-5 w-5" />
                              Recent Transactions
                            </h3>
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead>
                                  <tr className="border-b">
                                    <th className="text-left p-2 text-sm font-semibold">Client</th>
                                    <th className="text-left p-2 text-sm font-semibold">Time</th>
                                    <th className="text-left p-2 text-sm font-semibold">Method</th>
                                    <th className="text-right p-2 text-sm font-semibold">Amount</th>
                                    <th className="text-right p-2 text-sm font-semibold">Commission</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {demoDashboardStats.recent_transactions.map((tx) => (
                                    <tr key={tx.id} className="border-b hover:bg-gray-50">
                                      <td className="p-2 text-sm">{tx.client}</td>
                                      <td className="p-2 text-sm text-gray-600">{tx.time}</td>
                                      <td className="p-2 text-sm">
                                        <span className={`px-2 py-1 rounded text-xs ${tx.method === "CASH" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                                          {tx.method}
                                        </span>
                                      </td>
                                      <td className="p-2 text-sm text-right font-medium">{formatCurrency(convertKESToUSD(tx.amount), 'USD')}</td>
                                      <td className="p-2 text-sm text-right text-green-600">{formatCurrency(convertKESToUSD(tx.commission), 'USD')}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* Staff Performance */}
                          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                              <TrendingUp className="h-5 w-5" />
                              Staff Performance (Today)
                            </h3>
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead>
                                  <tr className="border-b">
                                    <th className="text-left p-2 text-sm font-semibold">Staff Name</th>
                                    <th className="text-right p-2 text-sm font-semibold">Sales</th>
                                    <th className="text-right p-2 text-sm font-semibold">Commission</th>
                                    <th className="text-right p-2 text-sm font-semibold">Clients</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {demoDashboardStats.staff_performance.map((perf) => (
                                    <tr key={perf.id} className="border-b hover:bg-gray-50">
                                      <td className="p-2 text-sm font-medium">{perf.name}</td>
                                      <td className="p-2 text-sm text-right">{formatCurrency(convertKESToUSD(perf.sales), 'USD')}</td>
                                      <td className="p-2 text-sm text-right text-green-600">{formatCurrency(convertKESToUSD(perf.commission), 'USD')}</td>
                                      <td className="p-2 text-sm text-right">{perf.clients}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Staff View */}
                      {demoSelectedSidebar === "staff" && (
                        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                          <div className="mb-6 flex items-center justify-between">
                            <div>
                              <h2 className="text-2xl font-bold mb-2">Staff Management</h2>
                              <p className="text-gray-600">Manage your salon staff members</p>
                            </div>
                            <Button onClick={() => toast.info("Add Staff feature - Demo only")} className="bg-[#ef4444] hover:bg-[#dc2626]">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Staff
                            </Button>
                          </div>

                          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="text-left p-4 text-sm font-semibold">Name</th>
                                    <th className="text-left p-4 text-sm font-semibold">Phone</th>
                                    <th className="text-left p-4 text-sm font-semibold">Email</th>
                                    <th className="text-left p-4 text-sm font-semibold">Role</th>
                                    <th className="text-left p-4 text-sm font-semibold">Status</th>
                                    <th className="text-right p-4 text-sm font-semibold">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {demoStaffList.map((staff) => (
                                    <tr key={staff.id} className="border-b hover:bg-gray-50">
                                      <td className="p-4 text-sm font-medium">{staff.name}</td>
                                      <td className="p-4 text-sm text-gray-600">{staff.phone}</td>
                                      <td className="p-4 text-sm text-gray-600">{staff.email}</td>
                                      <td className="p-4 text-sm">
                                        <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700 capitalize">
                                          {staff.role.replace("_", " ")}
                                        </span>
                                      </td>
                                      <td className="p-4 text-sm">
                                        <span className={`px-2 py-1 rounded text-xs ${staff.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                                          {staff.is_active ? "Active" : "Inactive"}
                                        </span>
                                      </td>
                                      <td className="p-4 text-sm text-right">
                                        <div className="flex items-center justify-end gap-2">
                                          <Button variant="ghost" size="sm" onClick={() => toast.info(`View details for ${staff.name} - Demo only`)}>
                                            <Eye className="h-4 w-4" />
                                          </Button>
                                          <Button variant="ghost" size="sm" onClick={() => toast.info(`Edit ${staff.name} - Demo only`)}>
                                            <Settings className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Services View */}
                      {demoSelectedSidebar === "services" && (
                        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                          <div className="mb-6 flex items-center justify-between">
                            <div>
                              <h2 className="text-2xl font-bold mb-2">Services Management</h2>
                              <p className="text-gray-600">Manage salon services and pricing</p>
                            </div>
                            <Button onClick={() => toast.info("Add Service feature - Demo only")} className="bg-[#ef4444] hover:bg-[#dc2626]">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Service
                            </Button>
                          </div>

                          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="text-left p-4 text-sm font-semibold">Name</th>
                                    <th className="text-left p-4 text-sm font-semibold">Description</th>
                                    <th className="text-left p-4 text-sm font-semibold">Category</th>
                                    <th className="text-right p-4 text-sm font-semibold">Price</th>
                                    <th className="text-right p-4 text-sm font-semibold">Duration</th>
                                    <th className="text-right p-4 text-sm font-semibold">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {demoServices.map((service) => (
                                    <tr key={service.id} className="border-b hover:bg-gray-50">
                                      <td className="p-4 text-sm font-medium">{service.name}</td>
                                      <td className="p-4 text-sm text-gray-600">{service.description}</td>
                                      <td className="p-4 text-sm">
                                        <span className="px-2 py-1 rounded text-xs bg-purple-100 text-purple-700 capitalize">
                                          {service.category}
                                        </span>
                                      </td>
                                      <td className="p-4 text-sm text-right font-medium">{formatCurrency(convertKESToUSD(service.price), 'USD')}</td>
                                      <td className="p-4 text-sm text-right text-gray-600">{service.duration} min</td>
                                      <td className="p-4 text-sm text-right">
                                        <div className="flex items-center justify-end gap-2">
                                          <Button variant="ghost" size="sm" onClick={() => toast.info(`Edit ${service.name} - Demo only`)}>
                                            <Settings className="h-4 w-4" />
                                          </Button>
                                          <Button variant="ghost" size="sm" onClick={() => toast.info(`Delete ${service.name} - Demo only`)} className="text-red-600">
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Shifts View */}
                      {demoSelectedSidebar === "shifts" && (
                        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                          <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-2">Shift Schedule</h2>
                            <p className="text-gray-600">View and manage staff shifts</p>
                          </div>
                          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="text-left p-4 text-sm font-semibold">Staff Name</th>
                                    <th className="text-left p-4 text-sm font-semibold">Date</th>
                                    <th className="text-left p-4 text-sm font-semibold">Start Time</th>
                                    <th className="text-left p-4 text-sm font-semibold">End Time</th>
                                    <th className="text-left p-4 text-sm font-semibold">Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {demoShifts.map((shift) => (
                                    <tr key={shift.id} className="border-b hover:bg-gray-50">
                                      <td className="p-4 text-sm font-medium">{shift.staff_name}</td>
                                      <td className="p-4 text-sm text-gray-600">{shift.date}</td>
                                      <td className="p-4 text-sm">{shift.start_time}</td>
                                      <td className="p-4 text-sm">{shift.end_time}</td>
                                      <td className="p-4 text-sm">
                                        <span className={`px-2 py-1 rounded text-xs ${
                                          shift.status === "active" ? "bg-green-100 text-green-700" :
                                          shift.status === "completed" ? "bg-gray-100 text-gray-700" :
                                          "bg-blue-100 text-blue-700"
                                        }`}>
                                          {shift.status.charAt(0).toUpperCase() + shift.status.slice(1)}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Commission Payments View */}
                      {demoSelectedSidebar === "commission" && (
                        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                          <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-2">Commission Payments</h2>
                            <p className="text-gray-600">Manage staff commission payments</p>
                          </div>
                          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="text-left p-4 text-sm font-semibold">Staff Name</th>
                                    <th className="text-left p-4 text-sm font-semibold">Period</th>
                                    <th className="text-right p-4 text-sm font-semibold">Amount</th>
                                    <th className="text-left p-4 text-sm font-semibold">Status</th>
                                    <th className="text-right p-4 text-sm font-semibold">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {demoCommissionPayments.map((payment) => (
                                    <tr key={payment.id} className="border-b hover:bg-gray-50">
                                      <td className="p-4 text-sm font-medium">{payment.staff_name}</td>
                                      <td className="p-4 text-sm text-gray-600">{payment.period}</td>
                                      <td className="p-4 text-sm text-right font-medium">{formatCurrency(convertKESToUSD(payment.amount), 'USD')}</td>
                                      <td className="p-4 text-sm">
                                        <span className={`px-2 py-1 rounded text-xs ${
                                          payment.status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                        }`}>
                                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                        </span>
                                      </td>
                                      <td className="p-4 text-sm text-right">
                                        {payment.status === "pending" && (
                                          <Button size="sm" onClick={() => toast.info(`Process payment for ${payment.staff_name} - Demo only`)} className="bg-green-600 hover:bg-green-700">
                                            Process Payment
                                          </Button>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Payments View */}
                      {demoSelectedSidebar === "payments" && (
                        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                          <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-2">Payment History</h2>
                            <p className="text-gray-600">View all payment transactions</p>
                          </div>
                          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="text-left p-4 text-sm font-semibold">Date</th>
                                    <th className="text-left p-4 text-sm font-semibold">Time</th>
                                    <th className="text-left p-4 text-sm font-semibold">Customer</th>
                                    <th className="text-right p-4 text-sm font-semibold">Amount</th>
                                    <th className="text-left p-4 text-sm font-semibold">Method</th>
                                    <th className="text-left p-4 text-sm font-semibold">Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {demoPayments.map((payment) => (
                                    <tr key={payment.id} className="border-b hover:bg-gray-50">
                                      <td className="p-4 text-sm">{payment.date}</td>
                                      <td className="p-4 text-sm text-gray-600">{payment.time}</td>
                                      <td className="p-4 text-sm font-medium">{payment.customer}</td>
                                      <td className="p-4 text-sm text-right font-medium">{formatCurrency(convertKESToUSD(payment.amount), 'USD')}</td>
                                      <td className="p-4 text-sm">
                                        <span className={`px-2 py-1 rounded text-xs ${payment.method === "CASH" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                                          {payment.method}
                                        </span>
                                      </td>
                                      <td className="p-4 text-sm">
                                        <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700">
                                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Sales View */}
                      {demoSelectedSidebar === "sales" && (
                        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                          <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-2">Sales Transactions</h2>
                            <p className="text-gray-600">View all sales records</p>
                          </div>
                          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="text-left p-4 text-sm font-semibold">Date</th>
                                    <th className="text-left p-4 text-sm font-semibold">Customer</th>
                                    <th className="text-left p-4 text-sm font-semibold">Items</th>
                                    <th className="text-right p-4 text-sm font-semibold">Total</th>
                                    <th className="text-left p-4 text-sm font-semibold">Staff</th>
                                    <th className="text-left p-4 text-sm font-semibold">Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {demoSales.map((sale) => (
                                    <tr key={sale.id} className="border-b hover:bg-gray-50">
                                      <td className="p-4 text-sm">{sale.date}</td>
                                      <td className="p-4 text-sm font-medium">{sale.customer}</td>
                                      <td className="p-4 text-sm text-gray-600">{sale.items}</td>
                                      <td className="p-4 text-sm text-right font-medium">{formatCurrency(convertKESToUSD(sale.total), 'USD')}</td>
                                      <td className="p-4 text-sm">{sale.staff}</td>
                                      <td className="p-4 text-sm">
                                        <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-700">
                                          {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Appointments View */}
                      {demoSelectedSidebar === "appointments" && (
                        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                          <div className="mb-6 flex items-center justify-between">
                            <div>
                              <h2 className="text-2xl font-bold mb-2">Appointments</h2>
                              <p className="text-gray-600">Manage customer appointments</p>
                            </div>
                            <Button onClick={() => toast.info("Create Appointment - Demo only")} className="bg-[#ef4444] hover:bg-[#dc2626]">
                              <Plus className="h-4 w-4 mr-2" />
                              New Appointment
                            </Button>
                          </div>
                          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="text-left p-4 text-sm font-semibold">Customer</th>
                                    <th className="text-left p-4 text-sm font-semibold">Service</th>
                                    <th className="text-left p-4 text-sm font-semibold">Date</th>
                                    <th className="text-left p-4 text-sm font-semibold">Time</th>
                                    <th className="text-left p-4 text-sm font-semibold">Staff</th>
                                    <th className="text-left p-4 text-sm font-semibold">Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {demoAppointments.map((apt) => (
                                    <tr key={apt.id} className="border-b hover:bg-gray-50">
                                      <td className="p-4 text-sm font-medium">{apt.customer}</td>
                                      <td className="p-4 text-sm text-gray-600">{apt.service}</td>
                                      <td className="p-4 text-sm">{apt.date}</td>
                                      <td className="p-4 text-sm">{apt.time}</td>
                                      <td className="p-4 text-sm">{apt.staff}</td>
                                      <td className="p-4 text-sm">
                                        <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">
                                          {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Inventory View */}
                      {demoSelectedSidebar === "inventory" && (
                        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                          <div className="mb-6 flex items-center justify-between">
                            <div>
                              <h2 className="text-2xl font-bold mb-2">Inventory</h2>
                              <p className="text-gray-600">Manage salon products and supplies</p>
                            </div>
                            <Button onClick={() => toast.info("Add Product - Demo only")} className="bg-[#ef4444] hover:bg-[#dc2626]">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Product
                            </Button>
                          </div>
                          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="text-left p-4 text-sm font-semibold">Product Name</th>
                                    <th className="text-left p-4 text-sm font-semibold">Category</th>
                                    <th className="text-right p-4 text-sm font-semibold">Quantity</th>
                                    <th className="text-left p-4 text-sm font-semibold">Unit</th>
                                    <th className="text-left p-4 text-sm font-semibold">Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {demoInventory.map((item) => {
                                    const isLowStock = item.quantity <= item.low_stock_threshold
                                    return (
                                      <tr key={item.id} className="border-b hover:bg-gray-50">
                                        <td className="p-4 text-sm font-medium">{item.name}</td>
                                        <td className="p-4 text-sm text-gray-600">{item.category}</td>
                                        <td className="p-4 text-sm text-right font-medium">{item.quantity}</td>
                                        <td className="p-4 text-sm text-gray-600">{item.unit}</td>
                                        <td className="p-4 text-sm">
                                          <span className={`px-2 py-1 rounded text-xs ${isLowStock ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                                            {isLowStock ? "Low Stock" : "In Stock"}
                                          </span>
                                        </td>
                                      </tr>
                                    )
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Expenses View */}
                      {demoSelectedSidebar === "expenses" && (
                        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                          <div className="mb-6 flex items-center justify-between">
                            <div>
                              <h2 className="text-2xl font-bold mb-2">Expenses</h2>
                              <p className="text-gray-600">Track salon expenses and costs</p>
                            </div>
                            <Button onClick={() => toast.info("Add Expense - Demo only")} className="bg-[#ef4444] hover:bg-[#dc2626]">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Expense
                            </Button>
                          </div>
                          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="text-left p-4 text-sm font-semibold">Date</th>
                                    <th className="text-left p-4 text-sm font-semibold">Category</th>
                                    <th className="text-left p-4 text-sm font-semibold">Description</th>
                                    <th className="text-right p-4 text-sm font-semibold">Amount</th>
                                    <th className="text-left p-4 text-sm font-semibold">Paid By</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {demoExpenses.map((expense) => (
                                    <tr key={expense.id} className="border-b hover:bg-gray-50">
                                      <td className="p-4 text-sm">{expense.date}</td>
                                      <td className="p-4 text-sm">
                                        <span className="px-2 py-1 rounded text-xs bg-orange-100 text-orange-700">
                                          {expense.category}
                                        </span>
                                      </td>
                                      <td className="p-4 text-sm text-gray-600">{expense.description}</td>
                                      <td className="p-4 text-sm text-right font-medium">{formatCurrency(convertKESToUSD(expense.amount), 'USD')}</td>
                                      <td className="p-4 text-sm">{expense.paid_by}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Reports View */}
                      {demoSelectedSidebar === "reports" && (
                        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                          <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-2">Reports</h2>
                            <p className="text-gray-600">Generate and view business reports</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => toast.info("Sales Report - Demo only")}>
                              <div className="flex items-center gap-3 mb-3">
                                <ShoppingCart className="h-6 w-6 text-blue-600" />
                                <h3 className="text-lg font-semibold">Sales Report</h3>
                              </div>
                              <p className="text-sm text-gray-600">View detailed sales analytics and trends</p>
                            </div>
                            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => toast.info("Commission Report - Demo only")}>
                              <div className="flex items-center gap-3 mb-3">
                                <DollarSign className="h-6 w-6 text-green-600" />
                                <h3 className="text-lg font-semibold">Commission Report</h3>
                              </div>
                              <p className="text-sm text-gray-600">Track staff commissions and payments</p>
                            </div>
                            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => toast.info("Expense Report - Demo only")}>
                              <div className="flex items-center gap-3 mb-3">
                                <TrendingDown className="h-6 w-6 text-red-600" />
                                <h3 className="text-lg font-semibold">Expense Report</h3>
                              </div>
                              <p className="text-sm text-gray-600">Analyze expenses and cost breakdowns</p>
                            </div>
                            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => toast.info("Staff Performance Report - Demo only")}>
                              <div className="flex items-center gap-3 mb-3">
                                <Users className="h-6 w-6 text-purple-600" />
                                <h3 className="text-lg font-semibold">Staff Performance</h3>
                              </div>
                              <p className="text-sm text-gray-600">View staff productivity and metrics</p>
                            </div>
                            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => toast.info("Inventory Report - Demo only")}>
                              <div className="flex items-center gap-3 mb-3">
                                <Package className="h-6 w-6 text-orange-600" />
                                <h3 className="text-lg font-semibold">Inventory Report</h3>
                              </div>
                              <p className="text-sm text-gray-600">Track inventory levels and stock movements</p>
                            </div>
                            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => toast.info("Customer Report - Demo only")}>
                              <div className="flex items-center gap-3 mb-3">
                                <UserCircleIcon className="h-6 w-6 text-indigo-600" />
                                <h3 className="text-lg font-semibold">Customer Report</h3>
                              </div>
                              <p className="text-sm text-gray-600">Analyze customer data and loyalty</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Users View */}
                      {demoSelectedSidebar === "users" && (
                        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                          <div className="mb-6 flex items-center justify-between">
                            <div>
                              <h2 className="text-2xl font-bold mb-2">User Management</h2>
                              <p className="text-gray-600">Manage admin and manager accounts</p>
                            </div>
                            <Button onClick={() => toast.info("Add User - Demo only")} className="bg-[#ef4444] hover:bg-[#dc2626]">
                              <Plus className="h-4 w-4 mr-2" />
                              Add User
                            </Button>
                          </div>
                          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="text-left p-4 text-sm font-semibold">Name</th>
                                    <th className="text-left p-4 text-sm font-semibold">Email</th>
                                    <th className="text-left p-4 text-sm font-semibold">Role</th>
                                    <th className="text-left p-4 text-sm font-semibold">Status</th>
                                    <th className="text-right p-4 text-sm font-semibold">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {demoUsers.map((user) => (
                                    <tr key={user.id} className="border-b hover:bg-gray-50">
                                      <td className="p-4 text-sm font-medium">{user.name}</td>
                                      <td className="p-4 text-sm text-gray-600">{user.email}</td>
                                      <td className="p-4 text-sm">
                                        <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700 capitalize">
                                          {user.role}
                                        </span>
                                      </td>
                                      <td className="p-4 text-sm">
                                        <span className={`px-2 py-1 rounded text-xs ${user.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                                          {user.is_active ? "Active" : "Inactive"}
                                        </span>
                                      </td>
                                      <td className="p-4 text-sm text-right">
                                        <div className="flex items-center justify-end gap-2">
                                          <Button variant="ghost" size="sm" onClick={() => toast.info(`Edit ${user.name} - Demo only`)}>
                                            <Settings className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* POS View (for manager) */}
                      {demoSelectedSidebar === "pos" && (
                    <>
                      {/* Pending Appointments */}
                      <div className="p-4 border-b bg-blue-50">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Pending Appointments (0)
                          </h3>
                        </div>
                        <div className="text-center py-4 text-xs text-gray-600">
                          <p>No pending appointments found.</p>
                          <p className="mt-1">Appointments will appear here when scheduled.</p>
                        </div>
                      </div>

                      <div className="flex-1 flex overflow-hidden">
                        {/* Left Panel - Services */}
                        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                          <Tabs value={demoActiveTab} onValueChange={setDemoActiveTab} className="w-full">
                            <TabsList className="mb-4">
                              <TabsTrigger value="services">Services</TabsTrigger>
                              <TabsTrigger value="products">Products</TabsTrigger>
                            </TabsList>

                            <TabsContent value="services" className="space-y-4">
                              {/* Category Filters */}
                              <div className="flex gap-2 flex-wrap mb-4">
                                {["all", "hair", "nails", "facial", "bridal", "threading"].map((cat) => (
                                  <Button
                                    key={cat}
                                    variant={demoSelectedCategory === cat ? "default" : "outline"}
                                    onClick={() => setDemoSelectedCategory(cat)}
                                    className="h-10 text-sm"
                                  >
                                    {cat === "all" ? "All Services" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                                  </Button>
                                ))}
                              </div>

                              {/* Service Selection */}
                              <div className="mb-4">
                                <Label className="text-sm font-semibold mb-2 block">Select Service to Add</Label>
                                <Select>
                                  <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Choose a service..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {demoServices.map((service) => (
                                      <SelectItem key={service.id} value={service.id.toString()}>
                                        {service.name} - {formatCurrency(convertKESToUSD(service.price), 'USD')}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <p className="text-xs text-gray-600 mt-2">6 services available in all categories</p>
                              </div>

                              {/* Quick Add Services */}
                              <div>
                                <h4 className="text-sm font-semibold mb-3">Quick Add (Most Popular)</h4>
                                <div className="grid grid-cols-2 gap-3">
                                  {demoServices.map((service) => (
                                    <button
                                      key={service.id}
                                      onClick={() => handleDemoAddService(service)}
                                      className="bg-white rounded-lg p-3 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-left flex items-center justify-between"
                                    >
                                      <div>
                                        <div className="font-medium text-sm text-gray-900">{service.name}</div>
                                        <div className="text-xs text-gray-600 mt-1">{formatCurrency(convertKESToUSD(service.price), 'USD')}</div>
                                      </div>
                                      <Button size="sm" className="h-8 w-8 p-0 rounded-full bg-[#ef4444] hover:bg-[#dc2626]">
                                        <Plus className="h-4 w-4" />
                                      </Button>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </TabsContent>

                            <TabsContent value="products">
                              <p className="text-gray-600">Products tab - demo content</p>
                            </TabsContent>
                          </Tabs>
                        </div>

                        {/* Right Panel - Current Sale */}
                        <div className="w-80 border-l bg-white p-6 overflow-y-auto">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg">Current Sale</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setDemoSelectedServices([])
                                setDemoClientName("")
                                setDemoClientPhone("")
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Clear
                            </Button>
                          </div>

                          {/* Client Info */}
                          <div className="space-y-4 mb-6">
                            <div>
                              <Label className="text-sm mb-1 block">Client Name</Label>
                              <Input
                                placeholder="Enter client name (Optional)"
                                value={demoClientName}
                                onChange={(e) => setDemoClientName(e.target.value)}
                                className="bg-white"
                              />
                            </div>
                            <div>
                              <Label className="text-sm mb-1 block">Phone Number</Label>
                              <Input
                                placeholder="07XX XXX XXX (Optional)"
                                value={demoClientPhone}
                                onChange={(e) => setDemoClientPhone(e.target.value)}
                                className="bg-white"
                              />
                            </div>
                            <div>
                              <Label className="text-sm mb-1 block">Service Location</Label>
                              <Select value={demoServiceLocation} onValueChange={setDemoServiceLocation}>
                                <SelectTrigger className="bg-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="salon">Salon</SelectItem>
                                  <SelectItem value="home">Home Service</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* Services in Sale */}
                          <div className="mb-6">
                            <h4 className="font-semibold mb-3">Services</h4>
                            {demoSelectedServices.length === 0 ? (
                              <div className="text-center py-8 text-sm text-gray-500">
                                No items in sale. Add services or products to get started.
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {demoSelectedServices.map((service) => (
                                  <div key={service.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="font-medium text-sm">{service.name}</span>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDemoRemoveService(service.id)}
                                        className="h-6 w-6 p-0 text-red-600"
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-600">
                                      <span>{formatCurrency(convertKESToUSD(service.price * service.quantity), 'USD')} x {service.quantity}</span>
                                      <span className="font-medium text-green-600">Commission: {formatCurrency(convertKESToUSD((service.price * service.quantity / 1.16) * 0.50), 'USD')}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Summary */}
                          {demoSelectedServices.length > 0 && (
                            <div className="pt-4 border-t space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">{formatCurrency(convertKESToUSD(demoSubtotal), 'USD')}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">VAT (16% inclusive)</span>
                                <span className="font-medium">{formatCurrency(convertKESToUSD(demoTax), 'USD')}</span>
                              </div>
                              <div className="flex justify-between text-sm font-semibold text-green-600">
                                <span>Your Commission</span>
                                <span>{formatCurrency(convertKESToUSD(demoCommission), 'USD')}</span>
                              </div>
                              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                                <span>Total</span>
                                <span>{formatCurrency(convertKESToUSD(demoTotal), 'USD')}</span>
                              </div>
                              <div className="pt-4 space-y-2">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                  <Printer className="h-4 w-4 mr-2" />
                                  Print Receipt
                                </Button>
                                <p className="text-xs text-gray-500 text-center">Select payment method, then print receipt</p>
                                <div className="flex gap-2">
                                  <Button variant="outline" className="flex-1 bg-green-50 border-green-300 text-green-700 hover:bg-green-100">
                                    Select M-Pesa
                                  </Button>
                                  <Button variant="outline" className="flex-1 bg-gray-100 border-gray-300 hover:bg-gray-200">
                                    Select Cash
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Recent Transactions */}
                          <div className="mt-8 pt-6 border-t">
                            <h4 className="font-semibold mb-3">Recent Transactions</h4>
                            <div className="space-y-2">
                              {demoRecentTransactions.map((tx, idx) => (
                                <div key={idx} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                                  <div>
                                    <div className="font-medium">{tx.client}</div>
                                    <div className="text-xs text-gray-600">{tx.time} {tx.method}</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-medium">{formatCurrency(convertKESToUSD(tx.amount), 'USD')}</div>
                                    <div className="text-xs text-green-600">{formatCurrency(convertKESToUSD(tx.commission), 'USD')}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                      )}
                    </div>
                  </>
                )}

                {/* Staff POS View - No Sidebar */}
                {demoViewMode === "staff" && (
                  <div className="flex-1 flex flex-col min-h-[600px]">
                    {/* Pending Appointments */}
                    <div className="p-4 border-b bg-blue-50">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Pending Appointments (0)
                        </h3>
                      </div>
                      <div className="text-center py-4 text-xs text-gray-600">
                        <p>No pending appointments found.</p>
                        <p className="mt-1">Appointments will appear here when scheduled.</p>
                      </div>
                    </div>

                    <div className="flex-1 flex overflow-hidden">
                      {/* Left Panel - Services */}
                      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                        <Tabs value={demoActiveTab} onValueChange={setDemoActiveTab} className="w-full">
                          <TabsList className="mb-4">
                            <TabsTrigger value="services">Services</TabsTrigger>
                            <TabsTrigger value="products">Products</TabsTrigger>
                          </TabsList>

                          <TabsContent value="services" className="space-y-4">
                            {/* Category Filters */}
                            <div className="flex gap-2 flex-wrap mb-4">
                              {["all", "hair", "nails", "facial", "bridal", "threading"].map((cat) => (
                                <Button
                                  key={cat}
                                  variant={demoSelectedCategory === cat ? "default" : "outline"}
                                  onClick={() => setDemoSelectedCategory(cat)}
                                  className="h-10 text-sm"
                                >
                                  {cat === "all" ? "All Services" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </Button>
                              ))}
                            </div>

                            {/* Quick Add Services */}
                            <div>
                              <h4 className="text-sm font-semibold mb-3">Quick Add (Most Popular)</h4>
                              <div className="grid grid-cols-2 gap-3">
                                {demoServices.map((service) => (
                                  <button
                                    key={service.id}
                                    onClick={() => handleDemoAddService(service)}
                                    className="bg-white rounded-lg p-3 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-left flex items-center justify-between"
                                  >
                                    <div>
                                      <div className="font-medium text-sm text-gray-900">{service.name}</div>
                                      <div className="text-xs text-gray-600 mt-1">{formatCurrency(convertKESToUSD(service.price), 'USD')}</div>
                                    </div>
                                    <Button size="sm" className="h-8 w-8 p-0 rounded-full bg-[#ef4444] hover:bg-[#dc2626]">
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="products">
                            <p className="text-gray-600">Products tab - demo content</p>
                          </TabsContent>
                        </Tabs>
                      </div>

                      {/* Right Panel - Current Sale */}
                      <div className="w-80 border-l bg-white p-6 overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-lg">Current Sale</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setDemoSelectedServices([])
                              setDemoClientName("")
                              setDemoClientPhone("")
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Clear
                          </Button>
                        </div>

                        {/* Client Info */}
                        <div className="space-y-4 mb-6">
                          <div>
                            <Label className="text-sm mb-1 block">Client Name</Label>
                            <Input
                              placeholder="Enter client name (Optional)"
                              value={demoClientName}
                              onChange={(e) => setDemoClientName(e.target.value)}
                              className="bg-white"
                            />
                          </div>
                          <div>
                            <Label className="text-sm mb-1 block">Phone Number</Label>
                            <Input
                              placeholder="07XX XXX XXX (Optional)"
                              value={demoClientPhone}
                              onChange={(e) => setDemoClientPhone(e.target.value)}
                              className="bg-white"
                            />
                          </div>
                          <div>
                            <Label className="text-sm mb-1 block">Service Location</Label>
                            <Select value={demoServiceLocation} onValueChange={setDemoServiceLocation}>
                              <SelectTrigger className="bg-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="salon">Salon</SelectItem>
                                <SelectItem value="home">Home Service</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Services in Sale */}
                        <div className="mb-6">
                          <h4 className="font-semibold mb-3">Services</h4>
                          {demoSelectedServices.length === 0 ? (
                            <div className="text-center py-8 text-sm text-gray-500">
                              No items in sale. Add services or products to get started.
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {demoSelectedServices.map((service) => (
                                <div key={service.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-sm">{service.name}</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDemoRemoveService(service.id)}
                                      className="h-6 w-6 p-0 text-red-600"
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  <div className="flex items-center justify-between text-xs text-gray-600">
                                    <span>{formatCurrency(convertKESToUSD(service.price * service.quantity), 'USD')} x {service.quantity}</span>
                                    <span className="font-medium text-green-600">Commission: {formatCurrency(convertKESToUSD((service.price * service.quantity / 1.16) * 0.50), 'USD')}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Summary */}
                        {demoSelectedServices.length > 0 && (
                          <div className="pt-4 border-t space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Subtotal</span>
                              <span className="font-medium">{formatCurrency(convertKESToUSD(demoSubtotal), 'USD')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">VAT (16% inclusive)</span>
                              <span className="font-medium">{formatCurrency(convertKESToUSD(demoTax), 'USD')}</span>
                            </div>
                            <div className="flex justify-between text-sm font-semibold text-green-600">
                              <span>Your Commission</span>
                              <span>{formatCurrency(convertKESToUSD(demoCommission), 'USD')}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold pt-2 border-t">
                              <span>Total</span>
                              <span>{formatCurrency(convertKESToUSD(demoTotal), 'USD')}</span>
                            </div>
                            <div className="pt-4 space-y-2">
                              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => toast.info("Print Receipt - Demo only")}>
                                <Printer className="h-4 w-4 mr-2" />
                                Print Receipt
                              </Button>
                              <p className="text-xs text-gray-500 text-center">Select payment method, then print receipt</p>
                              <div className="flex gap-2">
                                <Button variant="outline" className="flex-1 bg-green-50 border-green-300 text-green-700 hover:bg-green-100" onClick={() => toast.info("M-Pesa payment - Demo only")}>
                                  Select M-Pesa
                                </Button>
                                <Button variant="outline" className="flex-1 bg-gray-100 border-gray-300 hover:bg-gray-200" onClick={() => toast.info("Cash payment - Demo only")}>
                                  Select Cash
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Recent Transactions */}
                        <div className="mt-8 pt-6 border-t">
                          <h4 className="font-semibold mb-3">Recent Transactions</h4>
                          <div className="space-y-2">
                            {demoStaffPOSData.recent_transactions.map((tx, idx) => (
                              <div key={idx} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                                <div>
                                  <div className="font-medium">{tx.client}</div>
                                  <div className="text-xs text-gray-600">{tx.time} {tx.method}</div>
                                </div>
                                <div className="text-right">
                                  <div className="font-medium">{formatCurrency(convertKESToUSD(tx.amount), 'USD')}</div>
                                  <div className="text-xs text-green-600">{formatCurrency(convertKESToUSD(tx.commission), 'USD')}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Brands - Animated */}
      <section className="py-8 bg-white border-y border-gray-200 overflow-hidden relative">
        <div className="flex animate-scroll whitespace-nowrap">
          {[...trustedBrands, ...trustedBrands, ...trustedBrands].map((brand, index) => (
            <div key={index} className="text-gray-600 font-bold text-xl px-16 flex-shrink-0" style={{ fontSize: '20px', fontWeight: 700 }}>
              {brand}
            </div>
          ))}
        </div>
      </section>

      {/* Trusted Salon Software For... - No Icons */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Trusted Salon Software For
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {salonTypes.map((type, index) => (
              <div key={index} className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200">
                <span className="text-base font-semibold text-gray-900 text-center">{type}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Section - Modern Redesign */}
      <section id="features-section" className="py-24 bg-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#ef4444]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-6 mb-20">
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
              Whatever Your Focus,<br />
              <span className="text-[#ef4444]">You're in the Right Place</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Streamline your daily tasks by automating operations, from scheduling appointments and managing clients to handling retail sales, overseeing staff, and processing payments.
            </p>
          </div>

          {/* Feature Cards - Modern Card Layout */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div 
                  key={index} 
                  className="group bg-white rounded-3xl p-8 border border-gray-200 hover:border-[#ef4444]/30 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ef4444] to-red-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#ef4444] transition-colors">
                    {feature.title}
                  </h3>
                  <ul className="space-y-3">
                    {feature.subFeatures.map((subFeature, subIndex) => (
                      <li key={subIndex} className="text-gray-700 flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444] mt-2 flex-shrink-0"></div>
                        <span className="text-base">{subFeature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Appointment Booking Form Simulation */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ef4444]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 mb-4">
                Try Our Appointment Booking
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Experience how easy it is for your customers to book appointments. This form demonstrates the booking flow that integrates seamlessly with your POS system.
              </p>
            </div>

            {!appointmentSubmitted ? (
              <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-gray-200">
                <form onSubmit={(e) => {
                  e.preventDefault()
                  // Validation
                  if (!appointmentForm.customerName || !appointmentForm.phone || !appointmentForm.date || !appointmentForm.time || !appointmentForm.service) {
                    toast.error("Please fill in all required fields")
                    return
                  }
                  if (appointmentForm.location === "home" && !appointmentForm.homeAddress) {
                    toast.error("Please provide home address for home service")
                    return
                  }
                  // Simulate submission
                  setAppointmentSubmitted(true)
                  toast.success("Appointment booked successfully! Your appointment will appear in the POS system for staff to process.")
                }} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="appt-name" className="text-base font-semibold text-gray-900">
                        Customer Name <span className="text-[#ef4444]">*</span>
                      </Label>
                      <Input
                        id="appt-name"
                        placeholder="Enter customer name"
                        value={appointmentForm.customerName}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, customerName: e.target.value })}
                        className="h-12 text-base"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="appt-phone" className="text-base font-semibold text-gray-900">
                        Phone Number <span className="text-[#ef4444]">*</span>
                      </Label>
                      <Input
                        id="appt-phone"
                        type="tel"
                        placeholder="+254 700 000 000"
                        value={appointmentForm.phone}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, phone: e.target.value })}
                        className="h-12 text-base"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="appt-date" className="text-base font-semibold text-gray-900">
                        Appointment Date <span className="text-[#ef4444]">*</span>
                      </Label>
                      <Input
                        id="appt-date"
                        type="date"
                        value={appointmentForm.date}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        className="h-12 text-base"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="appt-time" className="text-base font-semibold text-gray-900">
                        Appointment Time <span className="text-[#ef4444]">*</span>
                      </Label>
                      <Select
                        value={appointmentForm.time}
                        onValueChange={(value) => setAppointmentForm({ ...appointmentForm, time: value })}
                        required
                      >
                        <SelectTrigger className="h-12 text-base">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="09:00">9:00 AM</SelectItem>
                          <SelectItem value="10:00">10:00 AM</SelectItem>
                          <SelectItem value="11:00">11:00 AM</SelectItem>
                          <SelectItem value="12:00">12:00 PM</SelectItem>
                          <SelectItem value="13:00">1:00 PM</SelectItem>
                          <SelectItem value="14:00">2:00 PM</SelectItem>
                          <SelectItem value="15:00">3:00 PM</SelectItem>
                          <SelectItem value="16:00">4:00 PM</SelectItem>
                          <SelectItem value="17:00">5:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="appt-service" className="text-base font-semibold text-gray-900">
                      Service <span className="text-[#ef4444]">*</span>
                    </Label>
                    <Select
                      value={appointmentForm.service}
                      onValueChange={(value) => setAppointmentForm({ ...appointmentForm, service: value })}
                      required
                    >
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="haircut">Haircut & Style</SelectItem>
                        <SelectItem value="blowout">Blowout</SelectItem>
                        <SelectItem value="color">Color - Full Head</SelectItem>
                        <SelectItem value="highlights">Highlights</SelectItem>
                        <SelectItem value="manicure">Manicure</SelectItem>
                        <SelectItem value="pedicure">Pedicure</SelectItem>
                        <SelectItem value="facial">Facial Treatment</SelectItem>
                        <SelectItem value="massage">Massage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-semibold text-gray-900">
                      Service Location <span className="text-[#ef4444]">*</span>
                    </Label>
                    <RadioGroup
                      value={appointmentForm.location}
                      onValueChange={(value) => setAppointmentForm({ ...appointmentForm, location: value, homeAddress: value === "salon" ? "" : appointmentForm.homeAddress })}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="salon" id="salon" />
                        <Label htmlFor="salon" className="text-base cursor-pointer">Salon</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="home" id="home" />
                        <Label htmlFor="home" className="text-base cursor-pointer">Home Service</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {appointmentForm.location === "home" && (
                    <div className="space-y-2">
                      <Label htmlFor="appt-address" className="text-base font-semibold text-gray-900">
                        Home Address <span className="text-[#ef4444]">*</span>
                      </Label>
                      <Input
                        id="appt-address"
                        placeholder="Enter home address"
                        value={appointmentForm.homeAddress}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, homeAddress: e.target.value })}
                        className="h-12 text-base"
                        required={appointmentForm.location === "home"}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="appt-staff" className="text-base font-semibold text-gray-900">
                      Preferred Staff (Optional)
                    </Label>
                    <Select
                      value={appointmentForm.staff}
                      onValueChange={(value) => setAppointmentForm({ ...appointmentForm, staff: value })}
                    >
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Any available staff" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Available</SelectItem>
                        <SelectItem value="john">John Doe</SelectItem>
                        <SelectItem value="jane">Jane Smith</SelectItem>
                        <SelectItem value="mike">Mike Johnson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#ef4444] hover:bg-[#dc2626] text-white text-lg py-6 h-auto font-semibold shadow-lg"
                  >
                    Book Appointment
                  </Button>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-10 shadow-2xl border border-gray-200 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Appointment Booked Successfully!</h3>
                <p className="text-lg text-gray-600 mb-6">
                  Your appointment has been confirmed. The details will appear in the POS system for staff to process.
                </p>
                <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left space-y-2">
                  <p className="text-sm text-gray-600"><strong className="text-gray-900">Customer:</strong> {appointmentForm.customerName}</p>
                  <p className="text-sm text-gray-600"><strong className="text-gray-900">Phone:</strong> {appointmentForm.phone}</p>
                  <p className="text-sm text-gray-600"><strong className="text-gray-900">Date:</strong> {new Date(appointmentForm.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600"><strong className="text-gray-900">Time:</strong> {appointmentForm.time}</p>
                  <p className="text-sm text-gray-600"><strong className="text-gray-900">Service:</strong> {appointmentForm.service}</p>
                  <p className="text-sm text-gray-600"><strong className="text-gray-900">Location:</strong> {appointmentForm.location === "salon" ? "Salon" : "Home Service"}</p>
                  {appointmentForm.location === "home" && (
                    <p className="text-sm text-gray-600"><strong className="text-gray-900">Address:</strong> {appointmentForm.homeAddress}</p>
                  )}
                </div>
                <Button
                  onClick={() => {
                    setAppointmentSubmitted(false)
                    setAppointmentForm({
                      customerName: "",
                      phone: "",
                      date: "",
                      time: "",
                      service: "",
                      location: "salon",
                      homeAddress: "",
                      staff: ""
                    })
                  }}
                  variant="outline"
                  className="text-base"
                >
                  Book Another Appointment
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="stats" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-gray-900">
                  {stat.value.toLocaleString()}{stat.suffix}
                </div>
                <div className="text-gray-600 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Request Quote/Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Request a Quote</h2>
              <p className="text-xl text-gray-600">
                Get in touch with us to learn more about our POS system and receive a customized quote
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Contact Information */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-gray-900">Phone</p>
                    <a href="tel:+254726899113" className="text-gray-600 hover:text-gray-900 transition-colors">
                      +254 726 899 113
                    </a>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Location</p>
                    <p className="text-gray-600">
                      Kasarani-Mwiki Nairobi<br />
                      Team Plaza, Room 06
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <a href="mailto:info@Mcgibsdigitalsolutions.com" className="text-gray-600 hover:text-gray-900 transition-colors">
                      info@Mcgibsdigitalsolutions.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Contact Us</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-900">Name *</Label>
                      <Input
                        id="name"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        disabled={isSubmitting}
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-900">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        disabled={isSubmitting}
                        className="bg-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-900">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+254 700 000 000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={isSubmitting}
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessName" className="text-gray-900">Business Name</Label>
                      <Input
                        id="businessName"
                        placeholder="Your salon name"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        disabled={isSubmitting}
                        className="bg-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-gray-900">Message / Requirements</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your salon and any specific requirements..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      disabled={isSubmitting}
                      className="bg-white"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-[#5E278E] hover:bg-[#4a1f6e] text-white"
                    disabled={isSubmitting}
                    size="lg"
                  >
                    {isSubmitting ? "Sending..." : "Request Quote"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Darker Background */}
      <footer className="border-t bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
            {/* Company */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/about-us" onClick={(e) => { e.preventDefault(); navigate("/about-us"); }} className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Leadership</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Refund policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Write for us</a></li>
                <li><a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="/blog" onClick={(e) => { e.preventDefault(); navigate("/blog"); }} className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sitemap</a></li>
              </ul>
            </div>

            {/* Follow Us */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Follow Us</h3>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Other Links */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Other Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Salon Scheduling Software</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Hair Salon Scheduling Software</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Barber Shop Scheduling Software</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Massage Scheduling Software</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Beauty Salon Booking Software</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Makeup Artist Booking Software</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Spa Scheduling Software</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mobile Salon Scheduling Software</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Nail Salon Scheduling Software</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Bridal Salon Scheduling Software</a></li>
              </ul>
            </div>

            {/* Who Can Use It? */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Who Can Use It?</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/solutions" onClick={(e) => { e.preventDefault(); navigate("/solutions"); }} className="hover:text-white transition-colors">Barber Shops</a></li>
                <li><a href="/solutions" onClick={(e) => { e.preventDefault(); navigate("/solutions"); }} className="hover:text-white transition-colors">Hair Salons</a></li>
                <li><a href="/solutions" onClick={(e) => { e.preventDefault(); navigate("/solutions"); }} className="hover:text-white transition-colors">Massage Therapy</a></li>
                <li><a href="/solutions" onClick={(e) => { e.preventDefault(); navigate("/solutions"); }} className="hover:text-white transition-colors">Nail Salon</a></li>
                <li><a href="/solutions" onClick={(e) => { e.preventDefault(); navigate("/solutions"); }} className="hover:text-white transition-colors">Spas</a></li>
                <li><a href="/solutions" onClick={(e) => { e.preventDefault(); navigate("/solutions"); }} className="hover:text-white transition-colors">Bridal Salon</a></li>
                <li><a href="/solutions" onClick={(e) => { e.preventDefault(); navigate("/solutions"); }} className="hover:text-white transition-colors">Medical Spa Software</a></li>
                <li><a href="/solutions" onClick={(e) => { e.preventDefault(); navigate("/solutions"); }} className="hover:text-white transition-colors">Aesthetic Skin Clinic</a></li>
                <li><a href="/solutions" onClick={(e) => { e.preventDefault(); navigate("/solutions"); }} className="hover:text-white transition-colors">Tattoo Artist Software</a></li>
                <li><a href="/solutions" onClick={(e) => { e.preventDefault(); navigate("/solutions"); }} className="hover:text-white transition-colors">Salon Booth For Renter</a></li>
                <li><a href="/solutions" onClick={(e) => { e.preventDefault(); navigate("/solutions"); }} className="hover:text-white transition-colors">Tanning Salon Software</a></li>
                <li><a href="/solutions" onClick={(e) => { e.preventDefault(); navigate("/solutions"); }} className="hover:text-white transition-colors">Pet Grooming</a></li>
              </ul>
            </div>

            {/* Our Resources */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Our Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Videos</a></li>
                <li><a href="/help-center" onClick={(e) => { e.preventDefault(); navigate("/help-center"); }} className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="/help-center" onClick={(e) => { e.preventDefault(); navigate("/help-center"); }} className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Updates</a></li>
                <li><a href="/success-stories" onClick={(e) => { e.preventDefault(); navigate("/success-stories"); }} className="hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="/success-stories" onClick={(e) => { e.preventDefault(); navigate("/success-stories"); }} className="hover:text-white transition-colors">Client Testimonials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Reseller Partner Program</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Affiliate Partnership</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Compare Us</a></li>
              </ul>
            </div>
          </div>

          {/* Discount Coupons Section */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-center text-white">
              <h3 className="text-2xl font-bold mb-2">Special Offer</h3>
              <p className="mb-4">Get 20% off on your first subscription</p>
              <Button className="bg-white text-blue-600 hover:bg-gray-100">
                Get Discount Coupon
              </Button>
            </div>
          </div>

          <Separator className="my-8 bg-gray-700" />
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Salonyst. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
