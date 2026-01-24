import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Scissors, Sparkles, Users, Heart, Building2, ArrowRight, Palette } from "lucide-react"
import Breadcrumb from "@/components/Breadcrumb"
import NavigationHeader from "@/components/NavigationHeader"
import { BUSINESS_TYPES } from "@/lib/serviceCategories"
import { toKebabCase } from "@/lib/posTypes"

export default function Solutions() {
  // Map all business types to solution cards
  const solutions = BUSINESS_TYPES.map((businessType) => {
    // Map icons based on business type
    const iconMap = {
      barber_shop: Users,
      massage: Heart,
      hair: Scissors,
      spa: Sparkles,
      makeup_artists: Palette,
      beauty: Sparkles,
      bridal: Heart,
      tattoo: Palette,
      pet_grooming: Heart,
      nail_salon: Heart,
      aesthetic_skin_care: Sparkles,
      salon_booth_rental: Building2,
    }
    
    // Map gradients based on business type
    const gradientMap = {
      barber_shop: "from-purple-500 to-purple-600",
      massage: "from-blue-500 to-blue-600",
      hair: "from-[#ef4444] to-red-600",
      spa: "from-blue-500 to-blue-600",
      makeup_artists: "from-pink-500 to-pink-600",
      beauty: "from-orange-500 to-orange-600",
      bridal: "from-pink-500 to-pink-600",
      tattoo: "from-gray-700 to-gray-800",
      pet_grooming: "from-green-500 to-green-600",
      nail_salon: "from-pink-500 to-pink-600",
      aesthetic_skin_care: "from-indigo-500 to-indigo-600",
      salon_booth_rental: "from-indigo-500 to-indigo-600",
    }
    
    return {
      id: businessType.id,
      title: `For ${businessType.name}`,
      description: `Complete management solution for ${businessType.name.toLowerCase()} businesses. Manage appointments, track performance, and streamline operations.`,
      icon: iconMap[businessType.id] || Building2,
      gradient: gradientMap[businessType.id] || "from-gray-500 to-gray-600",
    }
  })

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <NavigationHeader />

      {/* Dark Header Section */}
      <section className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Breadcrumb items={[
              { label: "Home", href: "/" },
              { label: "Solutions" }
            ]} />
            <div className="mt-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Solutions
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl">
                Tailored solutions for different types of beauty and wellness businesses
              </p>
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
                  <h2 className="text-lg font-bold text-gray-900 mb-4 group-hover:text-[#ef4444] transition-colors">
                    {solution.title}
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">{solution.description}</p>
                  <Link to={`/solutions/${toKebabCase(solution.id)}`} className="inline-flex items-center gap-2 text-[#ef4444] hover:text-[#dc2626] font-medium transition-colors">
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
            <h2 className="text-xl font-bold mb-6">Find Your Perfect Solution</h2>
            <p className="text-base mb-8 opacity-90 max-w-2xl mx-auto">
              Not sure which solution is right for your business? Our team can help you determine the best fit based on your specific needs and requirements.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/#contact">
                <Button className="bg-white text-[#ef4444] hover:bg-gray-100 text-sm px-8 py-6 h-auto shadow-xl">
                  Contact Us
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 text-sm px-8 py-6 h-auto">
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
