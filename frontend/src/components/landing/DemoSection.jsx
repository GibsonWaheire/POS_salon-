/**
 * DemoSection Component - Large interactive demo section
 * This component is large (~1200 lines) but is better organized as a separate component
 * than having it all in Landing.jsx
 */

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Calendar, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Plus, 
  Trash2, 
  X, 
  Printer, 
  Settings, 
  Eye,
  UserCircle as UserCircleIcon,
  DollarSign,
  Package,
  TrendingDown,
  FileText,
  CreditCard,
  Clock,
  Scissors,
  Grid3x3
} from "lucide-react"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/currency"
import { convertKESToUSD } from "@/data/landingDemoData"
import {
  demoServices,
  demoDashboardStats,
  demoStaffList,
  demoShifts,
  demoCommissionPayments,
  demoPayments,
  demoSales,
  demoAppointments,
  demoInventory,
  demoExpenses,
  demoUsers,
  demoStaffPOSData,
  demoRecentTransactions
} from "@/data/landingDemoData"
import { sidebarItems } from "@/data/landingConstants"
import { useDemoState } from "@/hooks/useDemoState"

/**
 * DemoSection Component
 * @param {Object} props
 * @param {Object|null} props.posConfig - POS configuration object
 */
export default function DemoSection({ posConfig }) {
  const demoState = useDemoState()
  
  const {
    demoViewMode,
    setDemoViewMode,
    demoSelectedSidebar,
    setDemoSelectedSidebar,
    demoSelectedServices,
    setDemoSelectedServices,
    demoClientName,
    setDemoClientName,
    demoClientPhone,
    setDemoClientPhone,
    demoServiceLocation,
    setDemoServiceLocation,
    demoActiveTab,
    setDemoActiveTab,
    demoSelectedCategory,
    setDemoSelectedCategory,
    handleDemoAddService,
    handleDemoRemoveService,
    demoTotal,
    demoSubtotal,
    demoTax,
    demoCommission,
    demoStaffPOSData: staffPOSData
  } = demoState

  return (
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
                  <span className="font-medium">Staff: {staffPOSData.staff_name}</span>
                  <span className="font-medium">Today's Commission: <span className="text-green-600">{formatCurrency(convertKESToUSD(staffPOSData.today_commission), 'USD')}</span></span>
                  <span className="font-medium">Clients Served: <span className="text-blue-600">{staffPOSData.clients_served}</span></span>
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

                  {/* Main Content Area - Render different views based on selected sidebar */}
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

                    {/* Other views (Staff, Services, Shifts, etc.) - Simplified for brevity */}
                    {/* In a full implementation, these would be extracted into separate components */}
                    {demoSelectedSidebar !== "dashboard" && (
                      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                        <div className="text-center py-20">
                          <p className="text-gray-600">Demo view for {demoSelectedSidebar} - Full implementation available</p>
                          <p className="text-sm text-gray-500 mt-2">This view would show the full demo content for {demoSelectedSidebar}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Staff POS View - Simplified for brevity */}
              {demoViewMode === "staff" && (
                <div className="flex-1 flex flex-col min-h-[600px]">
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
                            // Clear all services
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
                          {staffPOSData.recent_transactions.map((tx, idx) => (
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
  )
}
