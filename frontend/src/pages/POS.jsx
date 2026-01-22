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

// Kenyan salon-specific services with 50% commission rate
const services = [
  // Hair Services (1-20)
  { id: 1, name: "Haircut & Style", price: 1000, duration: 45, category: "hair", commissionRate: 0.50 },
  { id: 2, name: "Blowout", price: 750, duration: 30, category: "hair", commissionRate: 0.50 },
  { id: 3, name: "Color - Full Head", price: 2500, duration: 120, category: "hair", commissionRate: 0.50 },
  { id: 4, name: "Highlights", price: 3000, duration: 150, category: "hair", commissionRate: 0.50 },
  { id: 5, name: "Balayage", price: 3500, duration: 180, category: "hair", commissionRate: 0.50 },
  { id: 6, name: "Deep Conditioning Treatment", price: 600, duration: 20, category: "hair", commissionRate: 0.50 },
  { id: 7, name: "Finger Wave (Kenyan Style)", price: 1250, duration: 60, category: "hair", commissionRate: 0.50 },
  { id: 8, name: "Cornrows", price: 1500, duration: 90, category: "hair", commissionRate: 0.50 },
  { id: 9, name: "Twists", price: 1750, duration: 120, category: "hair", commissionRate: 0.50 },
  { id: 10, name: "Hair Wash & Conditioning", price: 400, duration: 25, category: "hair", commissionRate: 0.50 },
  { id: 31, name: "Kenyan Braids", price: 2000, duration: 180, category: "hair", commissionRate: 0.50 },
  { id: 32, name: "Box Braids", price: 2500, duration: 240, category: "hair", commissionRate: 0.50 },
  { id: 33, name: "Senegalese Twists", price: 2250, duration: 200, category: "hair", commissionRate: 0.50 },
  { id: 34, name: "Ghana Weaving", price: 3000, duration: 300, category: "hair", commissionRate: 0.50 },
  { id: 35, name: "Crochet Braids", price: 2750, duration: 180, category: "hair", commissionRate: 0.50 },
  { id: 36, name: "Hair Weaving", price: 4000, duration: 240, category: "hair", commissionRate: 0.50 },
  { id: 37, name: "Hair Relaxing", price: 1750, duration: 120, category: "hair", commissionRate: 0.50 },
  { id: 38, name: "Hair Rebonding", price: 5000, duration: 300, category: "hair", commissionRate: 0.50 },
  { id: 39, name: "Keratin Treatment", price: 4500, duration: 240, category: "hair", commissionRate: 0.50 },
  { id: 40, name: "Hair Extensions", price: 6000, duration: 360, category: "hair", commissionRate: 0.50 },
  
  // Nail Services (11-25)
  { id: 11, name: "Classic Manicure", price: 600, duration: 30, category: "nails", commissionRate: 0.50 },
  { id: 12, name: "Gel Manicure", price: 900, duration: 45, category: "nails", commissionRate: 0.50 },
  { id: 13, name: "Classic Pedicure", price: 750, duration: 45, category: "nails", commissionRate: 0.50 },
  { id: 14, name: "Spa Pedicure", price: 1100, duration: 60, category: "nails", commissionRate: 0.50 },
  { id: 15, name: "Nail Art (per nail)", price: 100, duration: 5, category: "nails", commissionRate: 0.50 },
  { id: 16, name: "Gel Polish Removal", price: 250, duration: 15, category: "nails", commissionRate: 0.50 },
  { id: 41, name: "Acrylic Nails - Full Set", price: 1750, duration: 90, category: "nails", commissionRate: 0.50 },
  { id: 42, name: "Acrylic Nails - Fill", price: 1250, duration: 60, category: "nails", commissionRate: 0.50 },
  { id: 43, name: "Dip Powder Manicure", price: 1400, duration: 75, category: "nails", commissionRate: 0.50 },
  { id: 44, name: "French Manicure", price: 1000, duration: 50, category: "nails", commissionRate: 0.50 },
  { id: 45, name: "French Pedicure", price: 1150, duration: 60, category: "nails", commissionRate: 0.50 },
  { id: 46, name: "Paraffin Wax Treatment", price: 900, duration: 45, category: "nails", commissionRate: 0.50 },
  { id: 47, name: "Nail Repair", price: 400, duration: 30, category: "nails", commissionRate: 0.50 },
  { id: 48, name: "Cuticle Treatment", price: 300, duration: 20, category: "nails", commissionRate: 0.50 },
  { id: 49, name: "Hand Massage", price: 500, duration: 30, category: "nails", commissionRate: 0.50 },
  
  // Facial & Skin Services (17-27)
  { id: 17, name: "Classic Facial", price: 1400, duration: 60, category: "facial", commissionRate: 0.50 },
  { id: 18, name: "Hydrafacial", price: 2250, duration: 75, category: "facial", commissionRate: 0.50 },
  { id: 19, name: "Microdermabrasion", price: 1600, duration: 60, category: "facial", commissionRate: 0.50 },
  { id: 20, name: "LED Light Therapy", price: 1000, duration: 30, category: "facial", commissionRate: 0.50 },
  { id: 21, name: "Chemical Peel", price: 2000, duration: 45, category: "facial", commissionRate: 0.50 },
  { id: 50, name: "Acne Treatment Facial", price: 1750, duration: 75, category: "facial", commissionRate: 0.50 },
  { id: 51, name: "Anti-Aging Facial", price: 2250, duration: 90, category: "facial", commissionRate: 0.50 },
  { id: 52, name: "Deep Cleansing Facial", price: 1500, duration: 60, category: "facial", commissionRate: 0.50 },
  { id: 53, name: "Whitening Facial", price: 2000, duration: 75, category: "facial", commissionRate: 0.50 },
  { id: 54, name: "Gold Facial", price: 2500, duration: 90, category: "facial", commissionRate: 0.50 },
  { id: 55, name: "Diamond Facial", price: 2750, duration: 90, category: "facial", commissionRate: 0.50 },
  { id: 56, name: "Oxygen Facial", price: 2100, duration: 75, category: "facial", commissionRate: 0.50 },
  
  // Bridal Packages (22-30)
  { id: 22, name: "Bridal Package - Full", price: 12500, duration: 300, category: "bridal", commissionRate: 0.50 },
  { id: 23, name: "Bridal Package - Hair & Makeup", price: 7500, duration: 180, category: "bridal", commissionRate: 0.50 },
  { id: 24, name: "Bridal Package - Makeup Only", price: 4000, duration: 120, category: "bridal", commissionRate: 0.50 },
  { id: 25, name: "Bridal Trial", price: 2500, duration: 90, category: "bridal", commissionRate: 0.50 },
  { id: 57, name: "Bridal Hair Only", price: 5000, duration: 150, category: "bridal", commissionRate: 0.50 },
  { id: 58, name: "Bridal Makeup - Basic", price: 3000, duration: 90, category: "bridal", commissionRate: 0.50 },
  { id: 59, name: "Bridal Makeup - Premium", price: 6000, duration: 120, category: "bridal", commissionRate: 0.50 },
  { id: 60, name: "Bridal Package - Plus", price: 17500, duration: 420, category: "bridal", commissionRate: 0.50 },
  { id: 61, name: "Pre-Wedding Package", price: 10000, duration: 240, category: "bridal", commissionRate: 0.50 },
  
  // Threading (26-35)
  { id: 26, name: "Eyebrow Threading", price: 250, duration: 15, category: "threading", commissionRate: 0.50 },
  { id: 27, name: "Upper Lip Threading", price: 150, duration: 10, category: "threading", commissionRate: 0.50 },
  { id: 28, name: "Chin Threading", price: 200, duration: 10, category: "threading", commissionRate: 0.50 },
  { id: 29, name: "Full Face Threading", price: 750, duration: 30, category: "threading", commissionRate: 0.50 },
  { id: 30, name: "Sideburns Threading", price: 250, duration: 10, category: "threading", commissionRate: 0.50 },
  { id: 62, name: "Forehead Threading", price: 200, duration: 10, category: "threading", commissionRate: 0.50 },
  { id: 63, name: "Cheek Threading", price: 250, duration: 10, category: "threading", commissionRate: 0.50 },
  { id: 64, name: "Neck Threading", price: 300, duration: 15, category: "threading", commissionRate: 0.50 },
  { id: 65, name: "Arm Threading", price: 600, duration: 30, category: "threading", commissionRate: 0.50 },
  { id: 66, name: "Leg Threading", price: 1000, duration: 45, category: "threading", commissionRate: 0.50 },
  { id: 67, name: "Underarm Threading", price: 400, duration: 20, category: "threading", commissionRate: 0.50 },
  { id: 68, name: "Bikini Threading", price: 750, duration: 30, category: "threading", commissionRate: 0.50 },
  { id: 69, name: "Full Body Threading", price: 4000, duration: 180, category: "threading", commissionRate: 0.50 },
  { id: 70, name: "Eyebrow Shaping", price: 300, duration: 20, category: "threading", commissionRate: 0.50 },
]

const formatKES = (amount) => {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/89a825d3-7bb4-45cb-8c0c-0aecf18f6961',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'POS.jsx:125',message:'formatKES called',data:{amount,amountType:typeof amount,isUndefined:amount===undefined,isNull:amount===null,isNaN:Number.isNaN(amount)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B'})}).catch(()=>{});
  // #endregion
  // Handle undefined, null, NaN, or non-numeric values
  if (amount === undefined || amount === null || Number.isNaN(amount) || amount === '') {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/89a825d3-7bb4-45cb-8c0c-0aecf18f6961',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'POS.jsx:130',message:'formatKES received invalid value',data:{amount,amountType:typeof amount},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
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
  const [currentSale, setCurrentSale] = useState([])
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
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/89a825d3-7bb4-45cb-8c0c-0aecf18f6961',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'POS.jsx:188',message:'fetchStaffStats entry',data:{staffId:staff?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    setLoadingStats(true)
    try {
      const response = await fetch(`http://localhost:5001/api/staff/${staff.id}/stats`)
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/89a825d3-7bb4-45cb-8c0c-0aecf18f6961',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'POS.jsx:193',message:'Staff stats API response',data:{ok:response.ok,status:response.status},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      if (response.ok) {
        const data = await response.json()
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/89a825d3-7bb4-45cb-8c0c-0aecf18f6961',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'POS.jsx:196',message:'Raw staff stats data',data:{commission_weekly:data.commission_weekly,commission_today:data.commission_today,clients_served_today:data.clients_served_today,allKeys:Object.keys(data)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        const stats = {
          clients_served_today: data.clients_served_today || 0,
          commission_today: data.commission_today || 0,
          commission_weekly: data.commission_weekly || 0
        }
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/89a825d3-7bb4-45cb-8c0c-0aecf18f6961',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'POS.jsx:201',message:'Setting staffStats state',data:stats,timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        setStaffStats(stats)
      }
    } catch (err) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/89a825d3-7bb4-45cb-8c0c-0aecf18f6961',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'POS.jsx:207',message:'fetchStaffStats error',data:{error:err.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      console.error("Failed to fetch staff stats:", err)
    } finally {
      setLoadingStats(false)
    }
  }

  const fetchRecentTransactions = async () => {
    if (!staff?.id) return
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/89a825d3-7bb4-45cb-8c0c-0aecf18f6961',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'POS.jsx:208',message:'fetchRecentTransactions entry',data:{staffId:staff?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,D,E'})}).catch(()=>{});
    // #endregion
    try {
      // Fetch recent completed sales for this staff
      // Add demo_mode parameter: true for demo users, use demoMode for others
      const demoModeParam = isDemoUser ? 'true' : (demoMode ? 'true' : 'false')
      const response = await fetch(`http://localhost:5001/api/sales?staff_id=${staff.id}&status=completed&limit=10&demo_mode=${demoModeParam}`)
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/89a825d3-7bb4-45cb-8c0c-0aecf18f6961',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'POS.jsx:212',message:'API response received',data:{ok:response.ok,status:response.status},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,D,E'})}).catch(()=>{});
      // #endregion
      if (response.ok) {
        const data = await response.json()
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/89a825d3-7bb4-45cb-8c0c-0aecf18f6961',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'POS.jsx:215',message:'Raw API data before transform',data:{dataLength:data.length,firstSale:data[0]?{id:data[0].id,grand_total:data[0].grand_total,total_amount:data[0].total_amount,commission:data[0].commission,commission_amount:data[0].commission_amount,keys:Object.keys(data[0]||{})}:null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,D,E'})}).catch(()=>{});
        // #endregion
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
          // #region agent log
          fetch('http://127.0.0.1:7243/ingest/89a825d3-7bb4-45cb-8c0c-0aecf18f6961',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'POS.jsx:223',message:'After transformation',data:{saleId:sale.id,originalGrandTotal:sale.grand_total,originalTotalAmount:sale.total_amount,transformedGrandTotal:transformed.grand_total,originalCommission:sale.commission,originalCommissionAmount:sale.commission_amount,transformedCommission:transformed.commission},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,D,E'})}).catch(()=>{});
          // #endregion
          return transformed
        })
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/89a825d3-7bb4-45cb-8c0c-0aecf18f6961',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'POS.jsx:230',message:'Setting recentTransactions state',data:{transformedLength:transformedData.length,firstTransformed:transformedData[0]?{id:transformedData[0].id,grand_total:transformedData[0].grand_total,commission:transformedData[0].commission}:null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,D,E'})}).catch(()=>{});
        // #endregion
        setRecentTransactions(transformedData.slice(0, 10) || [])
      }
    } catch (err) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/89a825d3-7bb4-45cb-8c0c-0aecf18f6961',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'POS.jsx:234',message:'fetchRecentTransactions error',data:{error:err.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,D,E'})}).catch(()=>{});
      // #endregion
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
    if (sessionLocked) {
      alert("Session ended. Please log in again.")
      return
    }
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
    if (sessionLocked) {
      alert("Session ended. Please log in again.")
      return
    }
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
    if (sessionLocked) {
      alert("Session ended. Please log in again.")
      return
    }
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
    setPaymentMethod("")
    setTransactionSaved(false)
    setSessionLocked(false)
  }

  const subtotal = currentSale.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0)
  const tax = subtotal * 0.16 // 16% VAT in Kenya (KRA standard)
  const total = subtotal + tax
  const totalCommission = currentSale.reduce((sum, item) => {
    const commissionRate = item.commissionRate || defaultCommissionRate
    return sum + ((item.price || 0) * (item.quantity || 0) * commissionRate)
  }, 0)

  const handlePrintReceipt = async () => {
    if (currentSale.length === 0) {
      alert("Please add items to the sale first")
      return
    }

    if (!paymentMethod) {
      alert("Please select a payment method first")
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
          services: currentSale.map(item => ({
            service_id: item.id,
            name: item.name,
            price: item.price,
            duration: item.duration || 30,
            quantity: item.quantity,
            commission_rate: item.commissionRate || defaultCommissionRate
          })),
          products: [] // Products can be added later if needed
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
      alert(`Error saving transaction: ${err.message}\nPlease try again.`)
      setSessionLocked(false) // Unlock session on error
      setTransactionSaved(false) // Reset transaction saved state
    }
  }

  const handlePayment = (method) => {
    // Just set the payment method - transaction will be saved when receipt is printed
    if (sessionLocked) {
      alert("Session ended. Please log in again.")
      return
    }
    
    if (currentSale.length === 0) {
      alert("Please add items to the sale first")
      return
    }
    
    // Set payment method for receipt display
    setPaymentMethod(method)
    
    // If M-Pesa, show transaction code input dialog
    if (method === "M-Pesa") {
      const code = prompt("Enter M-Pesa transaction code:")
      if (code) {
        setTransactionCode(code)
      } else {
        setPaymentMethod("") // Cancel if no code provided
        return
      }
    } else {
      setTransactionCode("") // Clear transaction code for non-M-Pesa payments
    }
    
    // Payment method is now set - transaction will be saved when receipt is printed
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
      {showReceipt && currentSale.length > 0 && (
        <>
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
                <span className="text-xs text-muted-foreground ml-2">| Weekly Commission: {loadingStats ? "..." : (() => {
                  // #region agent log
                  fetch('http://127.0.0.1:7243/ingest/89a825d3-7bb4-45cb-8c0c-0aecf18f6961',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'POS.jsx:573',message:'Rendering weekly commission',data:{commission_weekly:staffStats.commission_weekly,staffStats},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
                  // #endregion
                  return formatKES(Math.round(staffStats.commission_weekly || 0));
                })()}</span>
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
            {currentSale.length === 0 ? (
              <div className="text-center py-12 bg-white rounded border">
                <p className="text-sm text-muted-foreground">No items in sale</p>
                <p className="text-xs text-muted-foreground mt-1">Tap services to add them</p>
              </div>
            ) : (
              <div className="space-y-2">
                {currentSale.map((item) => {
                  const itemCommission = item.commission ?? ((item.price || 0) * (item.quantity || 0) * (item.commissionRate || defaultCommissionRate))
                  return (
                    <Card key={item.id} className="border">
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
                            onClick={() => removeFromSale(item.id)}
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
                              onClick={() => updateQuantity(item.id, -1)}
                            disabled={sessionLocked}
                            >
                              -
                            </Button>
                            <span className="text-sm font-semibold w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, 1)}
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
            )}

            {/* Summary */}
            {currentSale.length > 0 && (
              <div className="bg-white p-4 rounded border space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">{formatKES(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">VAT (16%)</span>
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
                    // #region agent log
                    fetch('http://127.0.0.1:7243/ingest/89a825d3-7bb4-45cb-8c0c-0aecf18f6961',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'POS.jsx:770',message:'Rendering transaction',data:{txnId:txn.id,grandTotal:txn.grand_total,commission:txn.commission,hasGrandTotal:txn.hasOwnProperty('grand_total'),hasCommission:txn.hasOwnProperty('commission'),txnKeys:Object.keys(txn)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
                    // #endregion
                    return (
                    <div key={txn.id} className="text-xs border-b pb-2 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{txn.client_name || txn.customer_name}</div>
                          <div className="text-muted-foreground">{txn.time || (txn.created_at ? new Date(txn.created_at).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }) : '')} • {txn.payment_method?.toUpperCase()}</div>
                        </div>
                        <div className="text-right">
                          {/* #region agent log */}
                          {(() => {
                            const grandTotal = txn.grand_total ?? txn.total_amount ?? 0;
                            const commission = txn.commission ?? txn.commission_amount ?? 0;
                            fetch('http://127.0.0.1:7243/ingest/89a825d3-7bb4-45cb-8c0c-0aecf18f6961',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'POS.jsx:863',message:'Rendering transaction amounts',data:{txnId:txn.id,grandTotal,totalAmount:txn.total_amount,commission,commissionAmount:txn.commission_amount,hasGrandTotal:txn.hasOwnProperty('grand_total'),hasTotalAmount:txn.hasOwnProperty('total_amount'),hasCommission:txn.hasOwnProperty('commission'),hasCommissionAmount:txn.hasOwnProperty('commission_amount'),allKeys:Object.keys(txn)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
                            return null;
                          })()}
                          {/* #endregion */}
                          <div className="font-semibold">{formatKES(txn.grand_total ?? txn.total_amount ?? 0)}</div>
                          <div className="text-green-600 text-xs">{formatKES(txn.commission ?? txn.commission_amount ?? 0)}</div>
                        </div>
                      </div>
                    </div>
                  )})}
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
                disabled={receiptPrinted || sessionLocked}
              >
                <Printer className="h-5 w-5 mr-2" />
                {receiptPrinted ? "Receipt Printed ✓" : "Print Receipt"}
              </Button>
            )}

            {/* Payment Method Selection - Must be selected before printing */}
            {currentSale.length > 0 && !receiptPrinted && (
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
              Please enter the M-Pesa transaction code from the customer's phone
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="transaction-code">Transaction Code</Label>
              <Input
                id="transaction-code"
                placeholder="e.g., QGH7X2K9L8"
                value={transactionCode}
                onChange={(e) => setTransactionCode(e.target.value.toUpperCase())}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && transactionCode) {
                    setShowTransactionInput(false)
                    processPayment("M-Pesa")
                  }
                }}
              />
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
            <Button onClick={() => {
              if (transactionCode) {
                setShowTransactionInput(false)
                processPayment("M-Pesa")
              }
            }} disabled={!transactionCode}>
              Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
