import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Users, DollarSign, TrendingUp, Clock, UserPlus, FileText, Eye } from "lucide-react"

const formatKES = (amount) => {
  return `KES ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [isDemoMode, setIsDemoMode] = useState(() => {
    // Check localStorage for saved preference, default to false (real mode)
    const saved = localStorage.getItem('dashboard_demo_mode')
    return saved === 'true'
  })
  const [stats, setStats] = useState({
    today_revenue: 0,
    total_commission: 0,
    active_staff_count: 0,
    total_staff_count: 0,
    currently_logged_in: [],
    recent_transactions: [],
    staff_performance: [],
    recent_login_history: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
    // Auto-refresh every 30 seconds only in real mode
    if (!isDemoMode) {
      const interval = setInterval(fetchDashboardStats, 30000)
      return () => clearInterval(interval)
    }
  }, [isDemoMode])

  const fetchDashboardStats = async () => {
    setLoading(true)
    try {
      const endpoint = isDemoMode 
        ? "http://localhost:5001/api/dashboard/stats/demo"
        : "http://localhost:5001/api/dashboard/stats"
      
      const response = await fetch(endpoint)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDemoModeToggle = (checked) => {
    setIsDemoMode(checked)
    localStorage.setItem('dashboard_demo_mode', checked.toString())
    fetchDashboardStats() // Refresh data immediately
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            {isDemoMode ? (
              <span className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-blue-500" />
                Demo Mode - Showing sample data for demonstration
              </span>
            ) : (
              "Welcome to your salon management system"
            )}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Demo Mode Toggle */}
          <div className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-background">
            <Label htmlFor="demo-mode" className="text-sm font-medium cursor-pointer">
              Demo Mode
            </Label>
            <Switch
              id="demo-mode"
              checked={isDemoMode}
              onCheckedChange={handleDemoModeToggle}
            />
            {isDemoMode && (
              <Badge variant="secondary" className="ml-2">
                DEMO
              </Badge>
            )}
          </div>
          
          <Button variant="outline" onClick={fetchDashboardStats} disabled={loading}>
            Refresh
          </Button>
          <Button onClick={() => navigate("/staff")}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
        </div>
      </div>
      
      {isDemoMode && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <div className="flex items-center">
            <Eye className="h-5 w-5 text-blue-500 mr-2" />
            <div>
              <p className="font-semibold text-blue-800">Demo Mode Active</p>
              <p className="text-sm text-blue-600">
                You are viewing sample data. Toggle off to see real data from your system.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-8">Loading dashboard data...</div>
      ) : (
        <>
          {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Sales Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
                <div className="text-2xl font-bold">{formatKES(stats.today_revenue)}</div>
                <p className="text-xs text-muted-foreground">Total sales today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Commission Owed</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatKES(stats.total_commission)}</div>
                <p className="text-xs text-muted-foreground">To be paid to staff</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
                <div className="text-2xl font-bold">{stats.currently_logged_in.length}</div>
                <p className="text-xs text-muted-foreground">Currently logged in</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Staff Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_staff_count}</div>
                <p className="text-xs text-muted-foreground">{stats.active_staff_count} active</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Staff Activity Section */}
            <Card>
              <CardHeader>
                <CardTitle>Staff Activity</CardTitle>
                <CardDescription>Currently logged in staff and recent logins</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.currently_logged_in.length > 0 ? (
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Currently Logged In</h4>
                      <div className="space-y-2">
                        {stats.currently_logged_in.map((staff) => (
                          <div key={staff.id} className="flex items-center justify-between p-2 border rounded-lg">
                            <div>
                              <p className="font-medium">{staff.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {staff.role ? staff.role.charAt(0).toUpperCase() + staff.role.slice(1) : 'Staff'}
                              </p>
                            </div>
                            <Badge variant="default">Active</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No staff currently logged in</p>
                )}
                
                {stats.recent_login_history.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-2">Recent Logins (Last 24h)</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {stats.recent_login_history.slice(0, 5).map((log, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded-lg text-sm">
                          <div>
                            <p className="font-medium">{log.staff_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {log.login_time ? new Date(log.login_time).toLocaleString() : 'N/A'}
                            </p>
                          </div>
                          {log.logout_time ? (
                            <Badge variant="secondary">Logged out</Badge>
                          ) : (
                            <Badge variant="default">Active</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Staff Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Staff Performance (Today)</CardTitle>
                <CardDescription>Sales and commission by staff member</CardDescription>
          </CardHeader>
          <CardContent>
                {stats.staff_performance.length > 0 ? (
                  <div className="space-y-3">
                    {stats.staff_performance.map((perf) => (
                      <div key={perf.staff_id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">{perf.staff_name}</p>
                          <Badge variant="outline">{perf.transactions_count} transactions</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Sales</p>
                            <p className="font-semibold">{formatKES(perf.sales_today)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Commission</p>
                            <p className="font-semibold text-green-600">{formatKES(perf.commission_today)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No sales today</p>
                )}
          </CardContent>
        </Card>
      </div>
      
          {/* Recent Transactions */}
      <Card>
        <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Latest sales and payments from all staff</CardDescription>
                </div>
                <Button variant="outline" onClick={() => navigate("/payments")}>
                  <FileText className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </div>
        </CardHeader>
        <CardContent>
              {stats.recent_transactions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.recent_transactions.map((txn) => (
                      <TableRow key={txn.id}>
                        <TableCell className="font-medium">{txn.staff_name}</TableCell>
                        <TableCell>{formatKES(txn.amount)}</TableCell>
                        <TableCell className="text-green-600">{formatKES(txn.commission)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {txn.payment_method ? txn.payment_method.toUpperCase().replace('_', '-') : 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {txn.created_at ? new Date(txn.created_at).toLocaleTimeString() : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-muted-foreground">No recent transactions</p>
              )}
        </CardContent>
      </Card>
        </>
      )}
    </div>
  )
}
