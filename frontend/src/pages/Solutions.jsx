import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Scissors, Sparkles, Users, Heart, Building2, ArrowRight, Palette } from "lucide-react"
import Breadcrumb from "@/components/Breadcrumb"

export default function Solutions() {
  const solutions = [
    {
      title: "For Hair Salons",
      description: "Complete management solution for hair salons of all sizes. Manage appointments, track stylist performance, and streamline operations.",
      icon: Scissors,
      gradient: "from-[#ef4444] to-red-600"
    },
    {
      title: "For Spas",
      description: "Comprehensive spa management with appointment scheduling, treatment tracking, and inventory management for products and supplies.",
      icon: Sparkles,
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "For Barber Shops",
      description: "Simple and effective POS system designed for barber shops. Fast checkout, staff management, and customer tracking.",
      icon: Users,
      gradient: "from-purple-500 to-purple-600"
    },
    {
      title: "For Nail Salons",
      description: "Specialized solution for nail salons with service management, product tracking, and appointment scheduling.",
      icon: Heart,
      gradient: "from-pink-500 to-pink-600"
    },
    {
      title: "For Beauty Studios",
      description: "All-in-one platform for beauty studios offering multiple services. Manage appointments, staff, and inventory in one place.",
      icon: Sparkles,
      gradient: "from-orange-500 to-orange-600"
    },
    {
      title: "For Multi-Location Businesses",
      description: "Enterprise solution for businesses with multiple locations. Centralized management with location-specific reporting.",
      icon: Building2,
      gradient: "from-indigo-500 to-indigo-600"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-400 via-green-400 to-yellow-400 rounded-sm"></div>
              <span className="text-2xl font-bold text-gray-900">Salonyst</span>
            </Link>
            <Link to="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ef4444]/10 via-blue-50/50 to-purple-50/30"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ef4444]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <Breadcrumb items={[
              { label: "Home", href: "/" },
              { label: "Solutions" }
            ]} />
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
                  Solutions
                </h1>
                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
                  Tailored solutions for different types of beauty and wellness businesses
                </p>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-8 flex items-center justify-center shadow-2xl">
                  <Palette className="h-32 w-32 text-white opacity-80" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500 rounded-2xl opacity-20"></div>
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-green-500 rounded-xl opacity-20"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 max-w-6xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => {
            const Icon = solution.icon
            return (
              <section key={index} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
                <div className={`h-48 bg-gradient-to-br ${solution.gradient} p-8 flex items-center justify-center`}>
                  <Icon className="h-16 w-16 text-white opacity-80" />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#ef4444] transition-colors">
                    {solution.title}
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">{solution.description}</p>
                  <Link to="/#contact" className="inline-flex items-center gap-2 text-[#ef4444] hover:text-[#dc2626] font-medium transition-colors">
                    Learn More
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </section>
            )
          })}
        </div>

        <section className="mt-20 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ef4444] via-red-600 to-red-700 p-12 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 text-center">
            <h2 className="text-4xl font-bold mb-6">Find Your Perfect Solution</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Not sure which solution is right for your business? Our team can help you determine the best fit based on your specific needs and requirements.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/#contact">
                <Button className="bg-white text-[#ef4444] hover:bg-gray-100 text-lg px-8 py-6 h-auto shadow-xl">
                  Contact Us
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6 h-auto">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
