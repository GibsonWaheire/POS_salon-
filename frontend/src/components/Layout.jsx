import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import { 
  LayoutDashboard, 
  Scissors, 
  UserCog, 
  CreditCard,
  LogOut,
  User,
  Package,
  TrendingDown,
  FileText,
  DollarSign,
  Users,
  Clock,
  ShoppingCart,
  Calendar
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { isAdmin } from "@/lib/api"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Staff", href: "/staff", icon: UserCog },
  { name: "Services", href: "/services", icon: Scissors },
  { name: "Shifts", href: "/shifts", icon: Clock },
  { name: "Commission Payments", href: "/commission-payments", icon: DollarSign },
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "Sales", href: "/sales", icon: ShoppingCart },
  { name: "Appointments", href: "/appointments", icon: Calendar, adminOnly: true },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Expenses", href: "/expenses", icon: TrendingDown },
  { name: "Reports", href: "/reports", icon: FileText },
  // Admin-only navigation items
  { name: "Users", href: "/users", icon: Users, adminOnly: true },
  // Customers removed - not used in walk-in only business model
  // POS removed - only accessible via staff login
]

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-[#1A202C] text-white">
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center border-b border-gray-700 px-6">
              <h1 className="text-xl font-bold text-white">Salonyst</h1>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
              {navigation
                .filter(item => !item.adminOnly || isAdmin())
                .map((item) => {
                  const isActive = location.pathname === item.href
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-gray-800 text-white border-l-4 border-[#ef4444]"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  )
                })}
            </nav>
            
            {/* User info and logout */}
            <div className="border-t border-gray-700 p-4 space-y-2">
              {user && (
                <div className="flex items-center gap-2 px-3 py-2 text-sm">
                  <User className="h-4 w-4 text-gray-300" />
                  <span className="text-gray-300">{user.name}</span>
                  <Badge variant="secondary" className="ml-auto text-xs bg-gray-700 text-gray-300">
                    {user.role}
                  </Badge>
                </div>
              )}
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-gray-300 hover:bg-gray-800 hover:text-white"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

