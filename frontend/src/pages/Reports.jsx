import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { FileText, Download, Calendar, TrendingUp, DollarSign, Receipt, ChevronDown, ChevronRight, BarChart3, PieChart, LineChart } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const formatKES = (amount) => {
  return `KES ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default function Reports() {
  const { demoMode, isDemoUser } = useAuth()
  const [dailyReport, setDailyReport] = useState(null)
  const [commissionReport, setCommissionReport] = useState(null)
  const [useDetailedCommission, setUseDetailedCommission] = useState(true)
  const [expandedStaffRows, setExpandedStaffRows] = useState(new Set())
  const [financialSummary, setFinancialSummary] = useState(null)
  const [compareWithPrevious, setCompareWithPrevious] = useState(false)
  const [taxReport, setTaxReport] = useState(null)
  const [loading, setLoading] = useState(false)
  
  // Date filters
  const [dailyDate, setDailyDate] = useState(new Date().toISOString().split('T')[0])
  const [commissionStartDate, setCommissionStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
  const [commissionEndDate, setCommissionEndDate] = useState(new Date().toISOString().split('T')[0])
  const [financialStartDate, setFinancialStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
  const [financialEndDate, setFinancialEndDate] = useState(new Date().toISOString().split('T')[0])
  const [taxMonth, setTaxMonth] = useState(new Date().toISOString().slice(0, 7))

  const fetchDailyReport = async () => {
    setLoading(true)
    try {
      const demoModeParam = isDemoUser ? 'true' : (demoMode ? 'true' : 'false')
      const response = await fetch(`http://localhost:5001/api/reports/daily-sales?date=${dailyDate}&demo_mode=${demoModeParam}`)
      if (response.ok) {
        const data = await response.json()
        setDailyReport(data)
      }
    } catch (err) {
      console.error("Failed to fetch daily report:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCommissionReport = async () => {
    setLoading(true)
    try {
      const demoModeParam = isDemoUser ? 'true' : (demoMode ? 'true' : 'false')
      const detailedParam = useDetailedCommission ? '&detailed=true' : ''
      const response = await fetch(`http://localhost:5001/api/reports/commission-payout?start_date=${commissionStartDate}&end_date=${commissionEndDate}&demo_mode=${demoModeParam}${detailedParam}`)
      if (response.ok) {
        const data = await response.json()
        setCommissionReport(data)
      }
    } catch (err) {
      console.error("Failed to fetch commission report:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchFinancialSummary = async () => {
    setLoading(true)
    try {
      const demoModeParam = isDemoUser ? 'true' : (demoMode ? 'true' : 'false')
      const compareParam = compareWithPrevious ? '&compare_with_previous=true' : ''
      const response = await fetch(`http://localhost:5001/api/reports/financial-summary?start_date=${financialStartDate}&end_date=${financialEndDate}&demo_mode=${demoModeParam}${compareParam}`)
      if (response.ok) {
        const data = await response.json()
        setFinancialSummary(data)
      }
    } catch (err) {
      console.error("Failed to fetch financial summary:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchTaxReport = async () => {
    setLoading(true)
    try {
      const demoModeParam = isDemoUser ? 'true' : (demoMode ? 'true' : 'false')
      const response = await fetch(`http://localhost:5001/api/reports/tax-report?month=${taxMonth}&demo_mode=${demoModeParam}`)
      if (response.ok) {
        const data = await response.json()
        setTaxReport(data)
      }
    } catch (err) {
      console.error("Failed to fetch tax report:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDailyReport()
  }, [dailyDate])

  useEffect(() => {
    fetchCommissionReport()
  }, [commissionStartDate, commissionEndDate, useDetailedCommission])

  useEffect(() => {
    fetchFinancialSummary()
  }, [financialStartDate, financialEndDate, compareWithPrevious])

  useEffect(() => {
    fetchTaxReport()
  }, [taxMonth])

  const handleExport = (data, filename, format = 'json') => {
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    } else if (format === 'csv') {
      const csv = convertToCSV(data, filename)
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename.replace('.json', '.csv')
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const convertToCSV = (data, filename) => {
    if (filename.includes('commission-report')) {
      if (data.summary) {
        // Detailed commission report
        let csv = 'Staff Name,Period Start,Period End,Gross Pay,Deductions,Net Pay,Base Pay,Commissions,Bonuses,Tips\n'
        data.staff_commissions.forEach(staff => {
          staff.payments.forEach(payment => {
            const commissions = payment.earnings_breakdown.commissions.reduce((sum, c) => sum + c.amount, 0)
            csv += `"${staff.staff_name}","${payment.period_start}","${payment.period_end}",${payment.gross_pay},${payment.total_deductions},${payment.net_pay},${payment.base_pay},${commissions},${payment.earnings_breakdown.bonuses},${payment.earnings_breakdown.tips}\n`
          })
        })
        return csv
      } else {
        // Simple commission report
        let csv = 'Staff Name,Total Sales,Total Commission,Paid,Pending,Transactions\n'
        data.staff_commissions.forEach(staff => {
          csv += `"${staff.staff_name}",${staff.total_sales},${staff.total_commission},${staff.paid_amount || 0},${staff.pending_amount || staff.total_commission},${staff.transaction_count}\n`
        })
        return csv
      }
    } else if (filename.includes('financial-summary')) {
      let csv = 'Metric,Amount\n'
      csv += `Total Revenue,${data.revenue.total_revenue}\n`
      csv += `Services Revenue,${data.revenue.services_revenue}\n`
      csv += `Products Revenue,${data.revenue.products_revenue}\n`
      csv += `VAT Amount,${data.revenue.vat_amount}\n`
      csv += `Total Expenses,${data.costs.total_expenses}\n`
      if (data.costs.commission_costs) {
        csv += `Base Pay,${data.costs.commission_costs.total_base_pay}\n`
        csv += `Commissions,${data.costs.commission_costs.total_commissions}\n`
        csv += `Bonuses,${data.costs.commission_costs.total_bonuses}\n`
        csv += `Tips,${data.costs.commission_costs.total_tips}\n`
        csv += `Gross Pay,${data.costs.commission_costs.total_gross_pay}\n`
        csv += `Deductions,${data.costs.commission_costs.total_deductions}\n`
        csv += `Net Paid,${data.costs.commission_costs.total_net_paid}\n`
      } else {
        csv += `Commission Earned,${data.costs.total_commission_earned}\n`
        csv += `Commission Paid,${data.costs.total_commission_paid || 0}\n`
        csv += `Commission Pending,${data.costs.total_commission_pending || 0}\n`
      }
      csv += `Net Profit,${data.profit.net_profit}\n`
      csv += `Profit Margin,${data.profit.profit_margin}%\n`
      if (data.cash_flow) {
        csv += `Cash In,${data.cash_flow.cash_in}\n`
        csv += `Cash Out,${data.cash_flow.cash_out}\n`
        csv += `Net Cash Flow,${data.cash_flow.net_cash_flow}\n`
      }
      return csv
    } else if (filename.includes('daily-report')) {
      let csv = 'Metric,Value\n'
      csv += `Date,${data.date}\n`
      csv += `Total Revenue,${data.total_revenue}\n`
      csv += `Services Revenue,${data.services_revenue}\n`
      csv += `Products Revenue,${data.products_revenue}\n`
      csv += `VAT Amount,${data.vat_amount}\n`
      csv += `Total Commission,${data.total_commission}\n`
      csv += `Transaction Count,${data.transaction_count}\n`
      return csv
    }
    return JSON.stringify(data, null, 2)
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Financial Reports</h1>
        <p className="text-muted-foreground">View sales, commission, and tax reports</p>
      </div>

      <Tabs defaultValue="daily" className="w-full">
        <TabsList>
          <TabsTrigger value="daily">Daily Sales (Z-Report)</TabsTrigger>
          <TabsTrigger value="commission">Commission Payout</TabsTrigger>
          <TabsTrigger value="financial">Financial Summary</TabsTrigger>
          <TabsTrigger value="tax">Tax Report</TabsTrigger>
        </TabsList>

        {/* Daily Sales Report */}
        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Daily Sales Report (Z-Report)</CardTitle>
                  <CardDescription>Daily sales summary and transaction details</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="daily-date">Date:</Label>
                    <Input
                      id="daily-date"
                      type="date"
                      value={dailyDate}
                      onChange={(e) => setDailyDate(e.target.value)}
                      className="w-40"
                    />
                  </div>
                  {dailyReport && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleExport(dailyReport, `daily-report-${dailyDate}.json`, 'json')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        JSON
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleExport(dailyReport, `daily-report-${dailyDate}.json`, 'csv')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        CSV
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading report...</div>
              ) : dailyReport ? (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Total Revenue</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatKES(dailyReport.total_revenue)}</div>
                        {dailyReport.services_revenue !== undefined && dailyReport.products_revenue !== undefined && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Services: {formatKES(dailyReport.services_revenue)} | Products: {formatKES(dailyReport.products_revenue)}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">VAT (16%)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatKES(dailyReport.vat_amount)}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Total Commission</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">{formatKES(dailyReport.total_commission)}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Transactions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{dailyReport.transaction_count}</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Payment Methods Breakdown</h3>
                    <div className="space-y-2">
                      {Object.entries(dailyReport.payment_methods).map(([method, amount]) => (
                        <div key={method} className="flex items-center justify-between p-2 border rounded-lg">
                          <span className="capitalize font-medium">{method.replace('_', ' ')}</span>
                          <span className="font-bold">{formatKES(amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Transaction Details</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Receipt #</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Payment Method</TableHead>
                          <TableHead>Transaction Code</TableHead>
                          <TableHead>Time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dailyReport.payments.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground">
                              No transactions found
                            </TableCell>
                          </TableRow>
                        ) : (
                          dailyReport.payments.map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell>{payment.receipt_number || payment.id}</TableCell>
                              <TableCell>{formatKES(payment.amount)}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="capitalize">
                                  {payment.payment_method?.replace('_', ' ') || 'N/A'}
                                </Badge>
                              </TableCell>
                              <TableCell>{payment.transaction_code || "-"}</TableCell>
                              <TableCell>
                                {payment.created_at ? new Date(payment.created_at).toLocaleTimeString() : 'N/A'}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No data available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Commission Payout Report */}
        <TabsContent value="commission" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Commission Payout Report</CardTitle>
                  <CardDescription>Staff commission summary for payout</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="comm-start">From:</Label>
                    <Input
                      id="comm-start"
                      type="date"
                      value={commissionStartDate}
                      onChange={(e) => setCommissionStartDate(e.target.value)}
                      className="w-40"
                    />
                    <Label htmlFor="comm-end">To:</Label>
                    <Input
                      id="comm-end"
                      type="date"
                      value={commissionEndDate}
                      onChange={(e) => setCommissionEndDate(e.target.value)}
                      className="w-40"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="detailed-comm">Detailed:</Label>
                    <Switch
                      id="detailed-comm"
                      checked={useDetailedCommission}
                      onCheckedChange={setUseDetailedCommission}
                    />
                  </div>
                  {commissionReport && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleExport(commissionReport, `commission-report-${commissionStartDate}-${commissionEndDate}.json`, 'json')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        JSON
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleExport(commissionReport, `commission-report-${commissionStartDate}-${commissionEndDate}.json`, 'csv')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        CSV
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading report...</div>
              ) : commissionReport ? (
                <div className="space-y-6">
                  {/* Summary Cards */}
                  {commissionReport.summary ? (
                    // Detailed report structure
                    <>
                      <div className="grid gap-4 md:grid-cols-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">Total Gross Pay</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                              {formatKES(commissionReport.summary.total_gross_pay)}
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">Total Deductions</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                              {formatKES(commissionReport.summary.total_deductions)}
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">Total Net Pay</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-blue-600">
                              {formatKES(commissionReport.summary.total_net_pay)}
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">Staff Members</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{commissionReport.summary.total_staff}</div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Detailed Staff Breakdown */}
                      <div>
                        <h3 className="font-semibold mb-2">Commission Payments by Staff</h3>
                        {commissionReport.staff_commissions.map((staff) => {
                          const isExpanded = expandedStaffRows.has(staff.staff_id)
                          return (
                            <Card key={staff.staff_id} className="mb-4">
                              <CardHeader>
                                <Collapsible open={isExpanded} onOpenChange={(open) => {
                                  const newSet = new Set(expandedStaffRows)
                                  if (open) {
                                    newSet.add(staff.staff_id)
                                  } else {
                                    newSet.delete(staff.staff_id)
                                  }
                                  setExpandedStaffRows(newSet)
                                }}>
                                  <CollapsibleTrigger className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-2">
                                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                      <span className="font-semibold">{staff.staff_name}</span>
                                    </div>
                                    <div className="flex gap-4 text-sm">
                                      <span>Gross: <strong>{formatKES(staff.totals.total_gross_pay)}</strong></span>
                                      <span>Net: <strong className="text-blue-600">{formatKES(staff.totals.total_net_pay)}</strong></span>
                                    </div>
                                  </CollapsibleTrigger>
                                  <CollapsibleContent className="mt-4">
                                    <div className="space-y-4 pl-6">
                                      {staff.payments.map((payment) => (
                                        <div key={payment.payment_id} className="border-l-2 pl-4 space-y-2">
                                          <div className="flex justify-between items-center">
                                            <div>
                                              <p className="font-medium">Period: {payment.period_start} to {payment.period_end}</p>
                                              <p className="text-xs text-muted-foreground">Receipt: {payment.receipt_number}</p>
                                            </div>
                                            <Badge variant="outline">Net: {formatKES(payment.net_pay)}</Badge>
                                          </div>
                                          
                                          {/* Earnings Breakdown */}
                                          <div className="grid md:grid-cols-2 gap-4 mt-2">
                                            <div>
                                              <h4 className="font-semibold text-sm text-green-600 mb-1">Earnings</h4>
                                              <div className="space-y-1 text-sm">
                                                {payment.base_pay > 0 && (
                                                  <div className="flex justify-between">
                                                    <span>Base Pay:</span>
                                                    <span>{formatKES(payment.base_pay)}</span>
                                                  </div>
                                                )}
                                                {payment.earnings_breakdown.commissions.length > 0 && (
                                                  <div>
                                                    <div className="font-medium">Commissions:</div>
                                                    {payment.earnings_breakdown.commissions.map((comm, idx) => (
                                                      <div key={idx} className="flex justify-between pl-2 text-xs">
                                                        <span>{comm.service} ({comm.sale_number}):</span>
                                                        <span>{formatKES(comm.amount)}</span>
                                                      </div>
                                                    ))}
                                                  </div>
                                                )}
                                                {payment.earnings_breakdown.bonuses > 0 && (
                                                  <div className="flex justify-between">
                                                    <span>Bonuses:</span>
                                                    <span>{formatKES(payment.earnings_breakdown.bonuses)}</span>
                                                  </div>
                                                )}
                                                {payment.earnings_breakdown.tips > 0 && (
                                                  <div className="flex justify-between">
                                                    <span>Tips:</span>
                                                    <span>{formatKES(payment.earnings_breakdown.tips)}</span>
                                                  </div>
                                                )}
                                                <div className="flex justify-between font-semibold pt-1 border-t">
                                                  <span>Gross Pay:</span>
                                                  <span>{formatKES(payment.gross_pay)}</span>
                                                </div>
                                              </div>
                                            </div>
                                            
                                            {/* Deductions Breakdown */}
                                            <div>
                                              <h4 className="font-semibold text-sm text-red-600 mb-1">Deductions</h4>
                                              <div className="space-y-1 text-sm">
                                                {Object.entries(payment.deductions_breakdown).map(([key, value]) => (
                                                  <div key={key} className="flex justify-between">
                                                    <span className="capitalize">{key.replace('_', ' ')}:</span>
                                                    <span>{formatKES(value)}</span>
                                                  </div>
                                                ))}
                                                <div className="flex justify-between font-semibold pt-1 border-t">
                                                  <span>Total Deductions:</span>
                                                  <span>{formatKES(payment.total_deductions)}</span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                      
                                      {/* Staff Totals */}
                                      <div className="border-t pt-2 mt-2">
                                        <h4 className="font-semibold mb-1">Staff Totals</h4>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                          <div>Base Pay: {formatKES(staff.totals.total_base_pay)}</div>
                                          <div>Commissions: {formatKES(staff.totals.total_commissions)}</div>
                                          <div>Bonuses: {formatKES(staff.totals.total_bonuses)}</div>
                                          <div>Tips: {formatKES(staff.totals.total_tips)}</div>
                                        </div>
                                      </div>
                                    </div>
                                  </CollapsibleContent>
                                </Collapsible>
                              </CardHeader>
                            </Card>
                          )
                        })}
                      </div>
                    </>
                  ) : (
                    // Simple report structure (backward compatible)
                    <>
                      <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">Total Commission</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                              {formatKES(commissionReport.total_commission_payout)}
                            </div>
                            {commissionReport.total_commission_paid !== undefined && (
                              <div className="text-xs text-muted-foreground mt-1">
                                Paid: {formatKES(commissionReport.total_commission_paid)} | Pending: {formatKES(commissionReport.total_commission_pending)}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm">Staff Members</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{commissionReport.total_staff}</div>
                          </CardContent>
                        </Card>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">Commission by Staff</h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Staff Name</TableHead>
                              <TableHead>Total Sales</TableHead>
                              <TableHead>Total Commission</TableHead>
                              <TableHead>Paid</TableHead>
                              <TableHead>Pending</TableHead>
                              <TableHead>Transactions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {commissionReport.staff_commissions.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground">
                                  No commission data found
                                </TableCell>
                              </TableRow>
                            ) : (
                              commissionReport.staff_commissions.map((staff) => (
                                <TableRow key={staff.staff_id}>
                                  <TableCell className="font-medium">{staff.staff_name}</TableCell>
                                  <TableCell>{formatKES(staff.total_sales)}</TableCell>
                                  <TableCell className="text-green-600 font-bold">
                                    {formatKES(staff.total_commission)}
                                  </TableCell>
                                  <TableCell className="text-blue-600">
                                    {formatKES(staff.paid_amount || 0)}
                                  </TableCell>
                                  <TableCell className="text-orange-600 font-semibold">
                                    {formatKES(staff.pending_amount || staff.total_commission)}
                                  </TableCell>
                                  <TableCell>{staff.transaction_count}</TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No data available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Summary */}
        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Financial Summary (P&L)</CardTitle>
                  <CardDescription>Profit & Loss statement</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="fin-start">From:</Label>
                    <Input
                      id="fin-start"
                      type="date"
                      value={financialStartDate}
                      onChange={(e) => setFinancialStartDate(e.target.value)}
                      className="w-40"
                    />
                    <Label htmlFor="fin-end">To:</Label>
                    <Input
                      id="fin-end"
                      type="date"
                      value={financialEndDate}
                      onChange={(e) => setFinancialEndDate(e.target.value)}
                      className="w-40"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="compare-prev">Compare:</Label>
                    <Switch
                      id="compare-prev"
                      checked={compareWithPrevious}
                      onCheckedChange={setCompareWithPrevious}
                    />
                  </div>
                  {financialSummary && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleExport(financialSummary, `financial-summary-${financialStartDate}-${financialEndDate}.json`, 'json')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        JSON
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleExport(financialSummary, `financial-summary-${financialStartDate}-${financialEndDate}.json`, 'csv')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        CSV
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading report...</div>
              ) : financialSummary ? (
                <div className="space-y-6">
                  {/* Revenue Cards */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Total Revenue</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatKES(financialSummary.revenue.total_revenue)}</div>
                        {financialSummary.revenue.services_revenue !== undefined && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Services: {formatKES(financialSummary.revenue.services_revenue)}<br />
                            Products: {formatKES(financialSummary.revenue.products_revenue)}
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          VAT (16%): {formatKES(financialSummary.revenue.vat_amount)}
                        </p>
                        {financialSummary.comparison && (
                          <div className={`text-xs mt-1 ${financialSummary.comparison.variance.revenue.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {financialSummary.comparison.variance.revenue.amount >= 0 ? '↑' : '↓'} 
                            {Math.abs(financialSummary.comparison.variance.revenue.percentage).toFixed(1)}%
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Total Costs</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                          {formatKES(
                            (financialSummary.costs.commission_costs?.total_gross_pay || financialSummary.costs.total_commission_earned) + 
                            financialSummary.costs.total_expenses
                          )}
                        </div>
                        {financialSummary.costs.commission_costs ? (
                          <>
                            <p className="text-xs text-muted-foreground mt-1">
                              Labor Costs: {formatKES(financialSummary.costs.commission_costs.total_gross_pay)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Expenses: {formatKES(financialSummary.costs.total_expenses)}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-xs text-muted-foreground mt-1">
                              Commission Earned: {formatKES(financialSummary.costs.total_commission_earned)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Expenses: {formatKES(financialSummary.costs.total_expenses)}
                            </p>
                          </>
                        )}
                        {financialSummary.comparison && (
                          <div className={`text-xs mt-1 ${financialSummary.comparison.variance.commission_costs.amount <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {financialSummary.comparison.variance.commission_costs.amount <= 0 ? '↓' : '↑'} 
                            {Math.abs(financialSummary.comparison.variance.commission_costs.percentage).toFixed(1)}%
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Net Profit</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className={`text-2xl font-bold ${financialSummary.profit.net_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatKES(financialSummary.profit.net_profit)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Margin: {financialSummary.profit.profit_margin}%
                        </p>
                        {financialSummary.comparison && (
                          <div className={`text-xs mt-1 ${financialSummary.comparison.variance.net_profit.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {financialSummary.comparison.variance.net_profit.amount >= 0 ? '↑' : '↓'} 
                            {Math.abs(financialSummary.comparison.variance.net_profit.percentage).toFixed(1)}%
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Cash Flow Section */}
                  {financialSummary.cash_flow && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Cash Flow Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Cash In</p>
                            <p className="text-2xl font-bold text-green-600">{formatKES(financialSummary.cash_flow.cash_in)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Cash Out</p>
                            <p className="text-2xl font-bold text-red-600">{formatKES(financialSummary.cash_flow.cash_out)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Net Cash Flow</p>
                            <p className={`text-2xl font-bold ${financialSummary.cash_flow.net_cash_flow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatKES(financialSummary.cash_flow.net_cash_flow)}
                            </p>
                          </div>
                        </div>
                        
                        {/* Payment Methods */}
                        {financialSummary.cash_flow.payment_methods && Object.keys(financialSummary.cash_flow.payment_methods).length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-semibold mb-2">Payment Methods</h4>
                            <div className="flex gap-4 flex-wrap">
                              {Object.entries(financialSummary.cash_flow.payment_methods).map(([method, amount]) => (
                                <Badge key={method} variant="outline">
                                  {method}: {formatKES(amount)}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Daily Cash Flow Chart */}
                        {financialSummary.cash_flow.daily_breakdown && financialSummary.cash_flow.daily_breakdown.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">Daily Cash Flow</h4>
                            <ResponsiveContainer width="100%" height={300}>
                              <BarChart data={financialSummary.cash_flow.daily_breakdown}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip formatter={(value) => formatKES(value)} />
                                <Legend />
                                <Bar dataKey="cash_in" fill="#22c55e" name="Cash In" />
                                <Bar dataKey="cash_out" fill="#ef4444" name="Cash Out" />
                                <Bar dataKey="net_flow" fill="#3b82f6" name="Net Flow" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Commission Costs Breakdown */}
                  {financialSummary.costs.commission_costs && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Commission Costs Breakdown</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Earnings</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>Base Pay:</span>
                                <span>{formatKES(financialSummary.costs.commission_costs.total_base_pay)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Commissions:</span>
                                <span>{formatKES(financialSummary.costs.commission_costs.total_commissions)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Bonuses:</span>
                                <span>{formatKES(financialSummary.costs.commission_costs.total_bonuses)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Tips:</span>
                                <span>{formatKES(financialSummary.costs.commission_costs.total_tips)}</span>
                              </div>
                              <div className="flex justify-between font-semibold pt-1 border-t">
                                <span>Gross Pay:</span>
                                <span>{formatKES(financialSummary.costs.commission_costs.total_gross_pay)}</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Deductions & Net</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>Total Deductions:</span>
                                <span className="text-red-600">{formatKES(financialSummary.costs.commission_costs.total_deductions)}</span>
                              </div>
                              <div className="flex justify-between font-semibold pt-1 border-t">
                                <span>Net Paid:</span>
                                <span className="text-blue-600">{formatKES(financialSummary.costs.commission_costs.total_net_paid)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Period Comparison */}
                  {financialSummary.comparison && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Period Comparison</CardTitle>
                        <CardDescription>
                          Comparing with {financialSummary.comparison.previous_period.start_date} to {financialSummary.comparison.previous_period.end_date}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Metric</TableHead>
                              <TableHead>Previous Period</TableHead>
                              <TableHead>Current Period</TableHead>
                              <TableHead>Variance</TableHead>
                              <TableHead>% Change</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>Revenue</TableCell>
                              <TableCell>{formatKES(financialSummary.comparison.previous_period.revenue)}</TableCell>
                              <TableCell>{formatKES(financialSummary.revenue.total_revenue)}</TableCell>
                              <TableCell className={financialSummary.comparison.variance.revenue.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {formatKES(financialSummary.comparison.variance.revenue.amount)}
                              </TableCell>
                              <TableCell className={financialSummary.comparison.variance.revenue.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {financialSummary.comparison.variance.revenue.percentage >= 0 ? '+' : ''}{financialSummary.comparison.variance.revenue.percentage.toFixed(1)}%
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Expenses</TableCell>
                              <TableCell>{formatKES(financialSummary.comparison.previous_period.expenses)}</TableCell>
                              <TableCell>{formatKES(financialSummary.costs.total_expenses)}</TableCell>
                              <TableCell className={financialSummary.comparison.variance.expenses.amount <= 0 ? 'text-green-600' : 'text-red-600'}>
                                {formatKES(financialSummary.comparison.variance.expenses.amount)}
                              </TableCell>
                              <TableCell className={financialSummary.comparison.variance.expenses.amount <= 0 ? 'text-green-600' : 'text-red-600'}>
                                {financialSummary.comparison.variance.expenses.percentage >= 0 ? '+' : ''}{financialSummary.comparison.variance.expenses.percentage.toFixed(1)}%
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Commission Costs</TableCell>
                              <TableCell>{formatKES(financialSummary.comparison.previous_period.commission_costs)}</TableCell>
                              <TableCell>{formatKES(financialSummary.costs.commission_costs?.total_gross_pay || financialSummary.costs.total_commission_earned)}</TableCell>
                              <TableCell className={financialSummary.comparison.variance.commission_costs.amount <= 0 ? 'text-green-600' : 'text-red-600'}>
                                {formatKES(financialSummary.comparison.variance.commission_costs.amount)}
                              </TableCell>
                              <TableCell className={financialSummary.comparison.variance.commission_costs.amount <= 0 ? 'text-green-600' : 'text-red-600'}>
                                {financialSummary.comparison.variance.commission_costs.percentage >= 0 ? '+' : ''}{financialSummary.comparison.variance.commission_costs.percentage.toFixed(1)}%
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Net Profit</TableCell>
                              <TableCell>{formatKES(financialSummary.comparison.previous_period.net_profit)}</TableCell>
                              <TableCell>{formatKES(financialSummary.profit.net_profit)}</TableCell>
                              <TableCell className={financialSummary.comparison.variance.net_profit.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {formatKES(financialSummary.comparison.variance.net_profit.amount)}
                              </TableCell>
                              <TableCell className={financialSummary.comparison.variance.net_profit.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {financialSummary.comparison.variance.net_profit.percentage >= 0 ? '+' : ''}{financialSummary.comparison.variance.net_profit.percentage.toFixed(1)}%
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  )}

                  {/* Revenue Breakdown Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsPieChart>
                          <Pie
                            data={[
                              { name: 'Services', value: financialSummary.revenue.services_revenue },
                              { name: 'Products', value: financialSummary.revenue.products_revenue }
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            <Cell fill="#22c55e" />
                            <Cell fill="#3b82f6" />
                          </Pie>
                          <Tooltip formatter={(value) => formatKES(value)} />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Additional Metrics */}
                  {financialSummary.metrics && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Additional Metrics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Avg Transaction Value</p>
                            <p className="text-xl font-bold">{formatKES(financialSummary.metrics.avg_transaction_value)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Revenue per Staff</p>
                            <p className="text-xl font-bold">{formatKES(financialSummary.metrics.revenue_per_staff)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Commission Rate</p>
                            <p className="text-xl font-bold">{financialSummary.metrics.commission_rate}%</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Expenses by Category */}
                  {financialSummary.costs.expenses_by_category && Object.keys(financialSummary.costs.expenses_by_category).length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Expenses by Category</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Category</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>% of Revenue</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {Object.entries(financialSummary.costs.expenses_by_category).map(([category, amount]) => (
                              <TableRow key={category}>
                                <TableCell className="capitalize">{category}</TableCell>
                                <TableCell>{formatKES(amount)}</TableCell>
                                <TableCell>
                                  {((amount / financialSummary.revenue.total_revenue) * 100).toFixed(2)}%
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No data available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax Report */}
        <TabsContent value="tax" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tax Report (KRA)</CardTitle>
                  <CardDescription>Monthly tax summary for KRA filing</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="tax-month">Month:</Label>
                    <Input
                      id="tax-month"
                      type="month"
                      value={taxMonth}
                      onChange={(e) => setTaxMonth(e.target.value)}
                      className="w-40"
                    />
                  </div>
                  {taxReport && (
                    <Button
                      variant="outline"
                      onClick={() => handleExport(taxReport, `tax-report-${taxMonth}.json`)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading report...</div>
              ) : taxReport ? (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Total Sales</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatKES(taxReport.sales.total_sales)}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">VAT Collected (16%)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatKES(taxReport.sales.vat_collected)}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Transactions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{taxReport.transaction_count}</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="p-4 border rounded-lg bg-muted">
                    <h3 className="font-semibold mb-2">KRA Information</h3>
                    <p className="text-sm"><strong>KRA PIN:</strong> {taxReport.kra_pin}</p>
                    <p className="text-sm"><strong>Period:</strong> {taxReport.period.month}</p>
                    <p className="text-sm"><strong>Sales (Excl. VAT):</strong> {formatKES(taxReport.sales.sales_before_vat)}</p>
                    <p className="text-sm"><strong>VAT to Remit:</strong> {formatKES(taxReport.sales.vat_collected)}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No data available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

