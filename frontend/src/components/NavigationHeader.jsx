import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Menu } from "lucide-react"

export default function NavigationHeader() {
  const navigate = useNavigate()

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-center">
          {/* Logo */}
          <div className="absolute left-4 sm:left-8 flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-400 via-green-400 to-yellow-400 rounded-sm"></div>
              <span className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>
                Salonyst
              </span>
            </Link>
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
                <DropdownMenuItem onClick={() => {
                  if (window.location.pathname !== "/") {
                    navigate("/");
                    setTimeout(() => {
                      const element = document.getElementById('features-section');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 300);
                  } else {
                    document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}>All Features</DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  if (window.location.pathname !== "/") {
                    navigate("/");
                    setTimeout(() => {
                      const element = document.getElementById('features-section');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 300);
                  } else {
                    document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}>Appointment Management</DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  if (window.location.pathname !== "/") {
                    navigate("/");
                    setTimeout(() => {
                      const element = document.getElementById('features-section');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 300);
                  } else {
                    document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}>POS System</DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  if (window.location.pathname !== "/") {
                    navigate("/");
                    setTimeout(() => {
                      const element = document.getElementById('features-section');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 300);
                  } else {
                    document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}>Inventory</DropdownMenuItem>
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
  )
}
