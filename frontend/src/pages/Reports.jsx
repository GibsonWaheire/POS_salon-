import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Calendar, TrendingUp, DollarSign, Receipt } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

const formatKES = (amount) => {
  return `KES ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default function Reports() {
  const { demoMode, isDemoUser } = useAuth()
  const [dailyReport, setDailyReport] = useState(null)
  const [commissionReport, setCommissionReport] = useState(null)
  const [financialSummary, setFinancialSummary] = useState(null)
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
      const response = await fetch(`http://localhost:5001/api/reports/commission-payout?start_date=${commissionStartDate}&end_date=${commissionEndDate}&demo_mode=${demoModeParam}`)
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
      const response = await fetch(`http://localhost:5001/api/reports/financial-summary?start_date=${financialStartDate}&end_date=${financialEndDate}&demo_mode=${demoModeParam}`)
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
  }, [commissionStartDate, commissionEndDate])

  useEffect(() => {
    fetchFinancialSummary()
  }, [financialStartDate, financialEndDate])

  useEffect(() => {
    fetchTaxReport()
  }, [taxMonth])

  const handleExport = (data, filename) => {
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
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
                    <Button
                      variant="outline"
                      onClick={() => handleExport(dailyReport, `daily-report-${dailyDate}.json`)}
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
                  {commissionReport && (
                    <Button
                      variant="outline"
                      onClick={() => handleExport(commissionReport, `commission-report-${commissionStartDate}-${commissionEndDate}.json`)}
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
              ) : commissionReport ? (
                <div className="space-y-6">
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
                  {financialSummary && (
                    <Button
                      variant="outline"
                      onClick={() => handleExport(financialSummary, `financial-summary-${financialStartDate}-${financialEndDate}.json`)}
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
              ) : financialSummary ? (
                <div className="space-y-6">
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
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Total Costs</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                          {formatKES(financialSummary.costs.total_commission_earned + financialSummary.costs.total_expenses)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Commission Earned: {formatKES(financialSummary.costs.total_commission_earned)}
                        </p>
                        {financialSummary.costs.total_commission_paid !== undefined && (
                          <>
                            <p className="text-xs text-blue-600 mt-1">
                              Commission Paid: {formatKES(financialSummary.costs.total_commission_paid)}
                            </p>
                            <p className="text-xs text-orange-600 mt-1">
                              Commission Pending: {formatKES(financialSummary.costs.total_commission_pending)}
                            </p>
                          </>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Expenses: {formatKES(financialSummary.costs.total_expenses)}
                        </p>
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
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Expenses by Category</h3>
                    <div className="space-y-2">
                      {Object.entries(financialSummary.costs.expenses_by_category).map(([category, amount]) => (
                        <div key={category} className="flex items-center justify-between p-2 border rounded-lg">
                          <span className="capitalize font-medium">{category.replace('_', ' ')}</span>
                          <span className="font-bold">{formatKES(amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
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

