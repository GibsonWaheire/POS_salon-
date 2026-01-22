import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { ChevronDown, ChevronUp } from "lucide-react"

const formatKES = (amount) => {
  return `KES ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default function Payments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedRows, setExpandedRows] = useState(new Set())
  const { demoMode, isDemoUser } = useAuth()

  const toggleRow = (paymentId) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(paymentId)) {
      newExpanded.delete(paymentId)
    } else {
      newExpanded.add(paymentId)
    }
    setExpandedRows(newExpanded)
  }

  useEffect(() => {
    fetchPayments()
  }, [demoMode, isDemoUser])

  const fetchPayments = async () => {
    setLoading(true)
    try {
      // Add demo_mode parameter
      const demoModeParam = isDemoUser ? 'true' : (demoMode ? 'true' : 'false')
      const response = await fetch(`http://localhost:5001/api/payments?demo_mode=${demoModeParam}`)
      if (response.ok) {
        const data = await response.json()
        setPayments(data)
      }
    } catch (err) {
      console.error("Failed to fetch payments:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payments</h1>
        <p className="text-muted-foreground">View payment history and transactions</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>All payment transactions from sales</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading payments...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Sale #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      No payments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment) => {
                    const isExpanded = expandedRows.has(payment.id)
                    const sale = payment.sale || {}
                    const services = sale.sale_services || []
                    const products = sale.sale_products || []
                    const hasDetails = services.length > 0 || products.length > 0
                    
                    return (
                      <>
                        <TableRow key={payment.id}>
                          <TableCell>
                            {hasDetails && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => toggleRow(payment.id)}
                              >
                                {isExpanded ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {sale.sale_number || `#${payment.sale_id || 'N/A'}`}
                          </TableCell>
                          <TableCell>{sale.customer_name || 'Walk-in'}</TableCell>
                          <TableCell>{sale.staff_name || 'N/A'}</TableCell>
                          <TableCell className="font-medium">{formatKES(payment.amount)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {payment.payment_method?.replace('_', ' ') || "-"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={payment.status === "completed" ? "default" : "secondary"}>
                              {payment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {payment.created_at ? new Date(payment.created_at).toLocaleDateString() : 'N/A'}
                          </TableCell>
                        </TableRow>
                        {isExpanded && hasDetails && (
                          <TableRow>
                            <TableCell colSpan={8} className="bg-gray-50 p-4">
                              <div className="space-y-4">
                                {services.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold text-sm mb-2 text-green-700">Services</h4>
                                    <div className="space-y-1 ml-4">
                                      {services.map((service, idx) => (
                                        <div key={idx} className="text-sm flex justify-between">
                                          <span>
                                            {service.service?.name || 'Service'} × {service.quantity}
                                            {service.commission_amount > 0 && (
                                              <span className="text-green-600 ml-2">
                                                (Comm: {formatKES(service.commission_amount)})
                                              </span>
                                            )}
                                          </span>
                                          <span className="font-medium">{formatKES(service.total_price)}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {products.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold text-sm mb-2 text-blue-700">Products</h4>
                                    <div className="space-y-1 ml-4">
                                      {products.map((product, idx) => (
                                        <div key={idx} className="text-sm flex justify-between">
                                          <span>
                                            {product.product?.name || 'Product'} × {product.quantity}
                                          </span>
                                          <span className="font-medium">{formatKES(product.total_price)}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    )
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

