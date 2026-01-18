import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Coins, 
  Filter,
  Download,
  Calendar,
  ArrowLeft
} from "lucide-react"
import { useNavigate } from "react-router-dom"

const formatKES = (amount) => {
  return `KES ${amount.toLocaleString('en-KE')}`
}

const formatDate = (dateStr) => {
  if (!dateStr) return ""
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function StaffCommissionHistory() {
  const { staff } = useAuth()
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Filter states
  const [dateFilter, setDateFilter] = useState("today") // today, week, month, custom
  const [paymentMethod, setPaymentMethod] = useState("all")
  const [customStartDate, setCustomStartDate] = useState("")
  const [customEndDate, setCustomEndDate] = useState("")
  const [sortBy, setSortBy] = useState("newest") // newest, oldest, commission_high, commission_low

  useEffect(() => {
    if (staff?.id) {
      fetchCommissionHistory()
    }
  }, [staff])

  const fetchCommissionHistory = async () => {
    if (!staff?.id) return
    
    setLoading(true)
    try {
      let startDate = null
      let endDate = null
      
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (dateFilter === "today") {
        startDate = today.toISOString()
        endDate = new Date().toISOString()
      } else if (dateFilter === "week") {
        const weekStart = new Date(today)
        weekStart.setDate(today.getDate() - 7)
        startDate = weekStart.toISOString()
        endDate = new Date().toISOString()
      } else if (dateFilter === "month") {
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
        startDate = monthStart.toISOString()
        endDate = new Date().toISOString()
      } else if (dateFilter === "custom") {
        if (customStartDate) startDate = new Date(customStartDate).toISOString()
        if (customEndDate) endDate = new Date(customEndDate).toISOString()
      }
      
      let url = `http://localhost:5000/api/staff/${staff.id}/commission-history`
      const params = new URLSearchParams()
      if (startDate) params.append('start_date', startDate)
      if (endDate) params.append('end_date', endDate)
      if (paymentMethod !== "all") params.append('payment_method', paymentMethod)
      
      if (params.toString()) url += `?${params.toString()}`
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setTransactions(data.transactions || [])
      }
    } catch (err) {
      console.error("Failed to fetch commission history:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCommissionHistory()
  }, [dateFilter, paymentMethod, customStartDate, customEndDate])

  useEffect(() => {
    let sorted = [...transactions]
    
    if (sortBy === "newest") {
      sorted.sort((a, b) => new Date(b.datetime) - new Date(a.datetime))
    } else if (sortBy === "oldest") {
      sorted.sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
    } else if (sortBy === "commission_high") {
      sorted.sort((a, b) => b.commission - a.commission)
    } else if (sortBy === "commission_low") {
      sorted.sort((a, b) => a.commission - b.commission)
    }
    
    setFilteredTransactions(sorted)
  }, [transactions, sortBy])

  const totalCommission = filteredTransactions.reduce((sum, t) => sum + t.commission, 0)
  const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.grand_total, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/pos")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to POS
            </Button>
            <h1 className="text-2xl font-bold">Commission History</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{staff?.name || "Staff"}</span>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredTransactions.length}</div>
            </CardContent>
          </Card>
          
          <Card className="border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Commission</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatKES(Math.round(totalCommission))}</div>
            </CardContent>
          </Card>
          
          <Card className="border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatKES(Math.round(totalRevenue))}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 border">
          <CardHeader>
            <CardTitle className="text-base">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {/* Date Filter */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Date Range</Label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full h-10 px-3 border rounded-md text-sm"
                >
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="custom">Custom Range</option>
                </select>
                
                {dateFilter === "custom" && (
                  <div className="mt-2 space-y-2">
                    <Input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="h-9 text-sm"
                    />
                    <Input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                )}
              </div>

              {/* Payment Method Filter */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Payment Method</Label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full h-10 px-3 border rounded-md text-sm"
                >
                  <option value="all">All Methods</option>
                  <option value="m_pesa">M-Pesa</option>
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Sort By</Label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full h-10 px-3 border rounded-md text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="commission_high">Commission (High to Low)</option>
                  <option value="commission_low">Commission (Low to High)</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex items-end">
                <Button onClick={fetchCommissionHistory} className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card className="border">
          <CardHeader>
            <CardTitle className="text-base">Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading...</p>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No transactions found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Date & Time</th>
                      <th className="text-left py-3 px-4 font-semibold">Client</th>
                      <th className="text-left py-3 px-4 font-semibold">Services</th>
                      <th className="text-right py-3 px-4 font-semibold">Amount</th>
                      <th className="text-right py-3 px-4 font-semibold">Commission</th>
                      <th className="text-left py-3 px-4 font-semibold">Payment</th>
                      <th className="text-left py-3 px-4 font-semibold">Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>{formatDate(transaction.date)}</div>
                          <div className="text-xs text-muted-foreground">{transaction.time}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium">{transaction.client_name}</div>
                          {transaction.client_phone && (
                            <div className="text-xs text-muted-foreground">{transaction.client_phone}</div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="max-w-xs">
                            {transaction.services.slice(0, 2).map((service, idx) => (
                              <div key={idx} className="text-xs">
                                {service.name} - {formatKES(service.price)}
                              </div>
                            ))}
                            {transaction.services.length > 2 && (
                              <div className="text-xs text-muted-foreground">
                                +{transaction.services.length - 2} more
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-medium">
                          {formatKES(transaction.grand_total)}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-green-600">
                          {formatKES(transaction.commission)}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                            {transaction.payment_method?.toUpperCase() || "N/A"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-muted-foreground">
                          {transaction.receipt_number}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

