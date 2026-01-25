import { Link, useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Menu, Building2 } from "lucide-react"
import { solutionsDropdownItems, solutionIcons, featuresDropdownItems, featureIcons, whySalonistDropdownItems, whySalonistIcons } from "@/data/landingConstants"
import { toKebabCase } from "@/lib/posTypes"

export default function NavigationHeader() {
  const navigate = useNavigate()
  const location = useLocation()
  const isOnLanding = location.pathname === "/" || location.pathname.startsWith("/solutions/")

  const scrollToFeatures = () => {
    if (isOnLanding) {
      document.getElementById("features-section")?.scrollIntoView({ behavior: "smooth", block: "start" })
    } else {
      navigate("/")
      setTimeout(() => {
        document.getElementById("features-section")?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 300)
    }
  }

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
              <DropdownMenuTrigger
                className="text-base font-semibold text-gray-800 hover:text-gray-900 transition-colors flex items-center gap-2 py-2"
                style={{ fontSize: "18px", fontWeight: 600 }}
              >
                Why Salonist
                <ChevronDown className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[950px] p-8 bg-white shadow-xl" align="start">
                <div className="grid grid-cols-3 gap-8">
                  {whySalonistDropdownItems.map((column, colIndex) => (
                    <div key={colIndex} className="space-y-3">
                      {column.map((item) => {
                        const Icon = whySalonistIcons[item.id] || Building2
                        return (
                          <DropdownMenuItem
                            key={item.id}
                            onClick={() => navigate(item.path)}
                            className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
                          >
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#ef4444] to-red-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0 pt-1">
                              <h4 className="font-bold text-gray-900 text-sm mb-1.5 group-hover:text-[#ef4444] transition-colors leading-tight">
                                {item.title}
                              </h4>
                              <p className="text-xs text-gray-600 leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          </DropdownMenuItem>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger
                className="text-base font-semibold text-gray-800 hover:text-gray-900 transition-colors flex items-center gap-2 py-2"
                style={{ fontSize: "18px", fontWeight: 600 }}
              >
                Features
                <ChevronDown className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[950px] p-8 bg-white shadow-xl" align="start">
                <div className="grid grid-cols-3 gap-8">
                  {featuresDropdownItems.map((column, colIndex) => (
                    <div key={colIndex} className="space-y-3">
                      {column.map((item) => {
                        const Icon = featureIcons[item.id] || Building2
                        return (
                          <DropdownMenuItem
                            key={item.id}
                            onClick={() => (item.path ? navigate(item.path) : scrollToFeatures())}
                            className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
                          >
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#ef4444] to-red-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0 pt-1">
                              <h4 className="font-bold text-gray-900 text-sm mb-1.5 group-hover:text-[#ef4444] transition-colors leading-tight">
                                {item.title}
                              </h4>
                              <p className="text-xs text-gray-600 leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          </DropdownMenuItem>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger
                className="text-base font-semibold text-gray-800 hover:text-gray-900 transition-colors flex items-center gap-2 py-2"
                style={{ fontSize: "18px", fontWeight: 600 }}
              >
                Solutions
                <ChevronDown className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[950px] p-8 bg-white shadow-xl" align="start">
                <div className="grid grid-cols-3 gap-8">
                  {solutionsDropdownItems.map((column, colIndex) => (
                    <div key={colIndex} className="space-y-3">
                      {column.map((item) => {
                        const Icon = solutionIcons[item.id] || Building2
                        const posType = item.posType
                        return (
                          <DropdownMenuItem
                            key={item.id}
                            onClick={() => navigate(`/solutions/${toKebabCase(item.id)}`)}
                            className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
                          >
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#ef4444] to-red-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0 pt-1">
                              <h4 className="font-bold text-gray-900 text-sm mb-1.5 group-hover:text-[#ef4444] transition-colors leading-tight">
                                {posType.softwareName}
                              </h4>
                              <p className="text-xs text-gray-600 leading-relaxed">
                                {posType.dropdownDescription}
                              </p>
                            </div>
                          </DropdownMenuItem>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
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
