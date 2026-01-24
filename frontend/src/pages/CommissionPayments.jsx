import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, Download, Calendar, AlertCircle, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { apiRequest } from "@/lib/api"

const formatKES = (amount) => {
  return `KES ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default function CommissionPayments() {
  const { user, demoMode } = useAuth()
  const [pendingCommissions, setPendingCommissions] = useState([])
  const [paymentHistory, setPaymentHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [processingPayment, setProcessingPayment] = useState(false)
  
  // Dialog states
  const [payDialogOpen, setPayDialogOpen] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState(null)
  
  // Form states
  const [formData, setFormData] = useState({
    amount_paid: "",
    period_start: "",
    period_end: "",
    payment_method: "",
    transaction_reference: "",
    notes: ""
  })

  useEffect(() => {
    fetchPendingCommissions()
    fetchPaymentHistory()
  }, [demoMode])

  const fetchPendingCommissions = async () => {
    setLoading(true)
    setError("")
    try {
      const demoModeParam = demoMode ? 'true' : 'false'
      const response = await fetch(`http://localhost:5001/api/commissions/pending?demo_mode=${demoModeParam}`)
      if (response.ok) {
        const data = await response.json()
        setPendingCommissions(data.pending_commissions || [])
      } else {
        setError("Failed to fetch pending commissions")
      }
    } catch (err) {
      setError("Unable to connect. Please check your internet connection and try again.")
      console.error("Failed to fetch pending commissions:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchPaymentHistory = async () => {
    try {
      const demoModeParam = demoMode ? 'true' : 'false'
      const response = await fetch(`http://localhost:5001/api/commissions/payments?demo_mode=${demoModeParam}`)
      if (response.ok) {
        const data = await response.json()
        setPaymentHistory(data || [])
      }
    } catch (err) {
      console.error("Failed to fetch payment history:", err)
    }
  }

  const handlePayCommission = (staff) => {
    setSelectedStaff(staff)
    // Set default period (last 30 days)
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30)
    
    setFormData({
      amount_paid: staff.pending_amount.toFixed(2),
      period_start: startDate.toISOString().split('T')[0],
      period_end: endDate.toISOString().split('T')[0],
      payment_method: "",
      transaction_reference: "",
      notes: ""
    })
    setPayDialogOpen(true)
  }

  const handleSubmitPayment = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setProcessingPayment(true)
    
    if (!formData.amount_paid || parseFloat(formData.amount_paid) <= 0) {
      setError("Valid amount is required")
      setProcessingPayment(false)
      return
    }
    
    if (!formData.period_start || !formData.period_end) {
      setError("Period start and end dates are required")
      setProcessingPayment(false)
      return
    }
    
    if (!formData.payment_method) {
      setError("Payment method is required")
      setProcessingPayment(false)
      return
    }

    try {
      const paymentData = await apiRequest("/commissions/pay", {
        method: "POST",
        body: JSON.stringify({
          staff_id: selectedStaff.staff_id,
          amount_paid: parseFloat(formData.amount_paid),
          period_start: formData.period_start,
          period_end: formData.period_end,
          payment_method: formData.payment_method,
          transaction_reference: formData.transaction_reference || null,
          notes: formData.notes || null,
          paid_by: user?.id || null
        })
      })

      setSuccess(`Commission payment of ${formatKES(paymentData.amount_paid)} recorded successfully!`)
      setPayDialogOpen(false)
      resetForm()
      // Refresh data immediately
      await Promise.all([fetchPendingCommissions(), fetchPaymentHistory()])
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(""), 5000)
    } catch (err) {
      setError(err.message || "Failed to record payment. Please try again.")
      console.error("Error recording payment:", err)
    } finally {
      setProcessingPayment(false)
    }
  }

  const handleDownloadReceipt = async (paymentId, receiptNumber) => {
    try {
      const response = await fetch(`http://localhost:5001/api/commissions/payments/${paymentId}/receipt`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `commission_receipt_${receiptNumber}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        setError("Failed to download receipt")
      }
    } catch (err) {
      setError("Failed to download receipt. Please try again.")
      console.error("Error downloading receipt:", err)
    }
  }

  const resetForm = () => {
    setFormData({
      amount_paid: "",
      period_start: "",
      period_end: "",
      payment_method: "",
      transaction_reference: "",
      notes: ""
    })
    setSelectedStaff(null)
    setError("")
  }

  const totalPending = pendingCommissions.reduce((sum, comm) => sum + (comm.pending_amount || 0), 0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Commission Payments</h1>
          <p className="text-muted-foreground">Manage and track commission payments to staff</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">Pending Commissions</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
        </TabsList>

        {/* Pending Commissions Tab */}
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pending Commissions</CardTitle>
                  <CardDescription>Staff members with unpaid commissions</CardDescription>
                </div>
                {totalPending > 0 && (
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    Total Pending: {formatKES(totalPending)}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading pending commissions...</div>
              ) : pendingCommissions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No pending commissions. All staff have been paid.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Name</TableHead>
                      <TableHead>Total Sales</TableHead>
                      <TableHead>Total Commission</TableHead>
                      <TableHead>Paid Amount</TableHead>
                      <TableHead className="text-right font-bold">Pending Amount</TableHead>
                      <TableHead>Transactions</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingCommissions.map((comm) => (
                      <TableRow key={comm.staff_id}>
                        <TableCell className="font-medium">{comm.staff_name}</TableCell>
                        <TableCell>{formatKES(comm.total_sales)}</TableCell>
                        <TableCell>{formatKES(comm.total_commission)}</TableCell>
                        <TableCell>{formatKES(comm.paid_amount)}</TableCell>
                        <TableCell className="text-right font-bold text-green-600">
                          {formatKES(comm.pending_amount)}
                        </TableCell>
                        <TableCell>{comm.transaction_count}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={() => handlePayCommission(comm)}
                          >
                            <DollarSign className="h-4 w-4 mr-2" />
                            Pay Commission
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>All commission payments made to staff</CardDescription>
            </CardHeader>
            <CardContent>
              {paymentHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No payment history found.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Staff</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Receipt #</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentHistory.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell className="font-medium">{payment.staff_name}</TableCell>
                        <TableCell>
                          {payment.period_start && payment.period_end ? (
                            <span className="text-sm">
                              {new Date(payment.period_start).toLocaleDateString()} - {new Date(payment.period_end).toLocaleDateString()}
                            </span>
                          ) : 'N/A'}
                        </TableCell>
                        <TableCell className="font-semibold">{formatKES(payment.amount_paid)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {(payment.payment_method || 'N/A').toUpperCase().replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{payment.receipt_number}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadReceipt(payment.id, payment.receipt_number)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Pay Commission Dialog */}
      <Dialog open={payDialogOpen} onOpenChange={setPayDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmitPayment}>
            <DialogHeader>
              <DialogTitle>Pay Commission</DialogTitle>
              <DialogDescription>
                Record commission payment for {selectedStaff?.staff_name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="period-start">Period Start Date *</Label>
                  <Input
                    id="period-start"
                    type="date"
                    value={formData.period_start}
                    onChange={(e) => setFormData({ ...formData, period_start: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="period-end">Period End Date *</Label>
                  <Input
                    id="period-end"
                    type="date"
                    value={formData.period_end}
                    onChange={(e) => setFormData({ ...formData, period_end: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="amount">Amount Paid (KES) *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.amount_paid}
                  onChange={(e) => setFormData({ ...formData, amount_paid: e.target.value })}
                  required
                />
                {selectedStaff && (
                  <p className="text-xs text-muted-foreground">
                    Pending amount: {formatKES(selectedStaff.pending_amount)}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="payment-method">Payment Method *</Label>
                <Select
                  value={formData.payment_method}
                  onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
                  required
                >
                  <SelectTrigger id="payment-method">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="m_pesa">M-Pesa</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="transaction-ref">Transaction Reference</Label>
                <Input
                  id="transaction-ref"
                  placeholder="M-Pesa code (e.g., QGH7X2K9L8), bank reference, etc. (optional)"
                  value={formData.transaction_reference}
                  maxLength={formData.payment_method === "m_pesa" ? 10 : undefined}
                  onChange={(e) => {
                    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
                    if (formData.payment_method === "m_pesa" && value.length > 10) {
                      value = value.slice(0, 10)
                    }
                    setFormData({ ...formData, transaction_reference: value })
                  }}
                />
                {formData.payment_method === "m_pesa" && formData.transaction_reference && formData.transaction_reference.length !== 10 && (
                  <p className="text-xs text-red-600">M-Pesa code must be exactly 10 characters</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes about this payment"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => {
                setPayDialogOpen(false)
                resetForm()
              }}>
                Cancel
              </Button>
              <Button type="submit" disabled={processingPayment}>
                <DollarSign className="h-4 w-4 mr-2" />
                {processingPayment ? "Processing..." : "Record Payment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
