import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Check, DollarSign, Zap, Shield } from "lucide-react"
import Breadcrumb from "@/components/Breadcrumb"
import NavigationHeader from "@/components/NavigationHeader"

export default function Pricing() {
  const features = [
    "Unlimited appointments and scheduling",
    "Point-of-sale system",
    "Staff management and commission tracking",
    "Inventory management",
    "Customer database",
    "Financial reporting",
    "Expense tracking",
    "Email and phone support"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <NavigationHeader />

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ef4444]/10 via-blue-50/50 to-purple-50/30"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ef4444]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <Breadcrumb items={[
              { label: "Home", href: "/" },
              { label: "Pricing" }
            ]} />
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                  Pricing
                </h1>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  Choose the plan that fits your business needs
                </p>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1556740758-90de374c12ad?w=600&h=600&fit=crop&auto=format" 
                  alt="Pricing and plans" 
                  className="aspect-square rounded-3xl object-cover shadow-2xl"
                />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#ef4444] rounded-2xl opacity-20"></div>
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-blue-500 rounded-xl opacity-20"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 max-w-6xl">
        <div className="space-y-16">
          {/* Flexible Pricing Section */}
          <section className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Flexible Pricing Plans</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              We offer flexible pricing options designed to scale with your business. All plans include our core features with no hidden fees.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Our pricing is based on your business size and specific needs. Contact us to discuss the best plan for your salon, spa, or beauty business.
            </p>
          </section>

          {/* Features Section */}
          <section className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-8">What's Included</h2>
            <p className="text-sm text-gray-700 mb-8">All plans include:</p>
            <div className="grid md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:shadow-md transition-all duration-300 border border-gray-100">
                  <Check className="h-5 w-5 text-[#ef4444] mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Enterprise Section */}
          <section className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Custom Enterprise Plans</h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                  For larger businesses or multiple locations, we offer custom enterprise plans with additional features, priority support, and dedicated account management. Contact us to discuss your specific requirements.
                </p>
              </div>
            </div>
          </section>

          {/* Free Trial Section */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ef4444] via-red-600 to-red-700 p-12 text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  <Zap className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-4">Free Trial</h2>
                  <p className="text-base mb-8 opacity-90 leading-relaxed">
                    Not sure if Salonyst is right for you? We offer a free trial period so you can explore all features and see how it works for your business before making a commitment.
                  </p>
                  <Link to="/signup">
                    <Button className="bg-white text-[#ef4444] hover:bg-gray-100 text-sm px-8 py-6 h-auto shadow-xl">
                      Start Free Trial
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Custom Quote Section */}
          <section className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Get a Custom Quote</h2>
            <p className="text-sm text-gray-700 leading-relaxed mb-8 max-w-2xl mx-auto">
              Want to discuss pricing options or have questions about our plans? Our team is ready to help you find the perfect solution for your business.
            </p>
            <Link to="/#contact">
              <Button variant="outline" className="text-sm px-8 py-6 h-auto">
                Request a Quote
              </Button>
            </Link>
          </section>
        </div>
      </main>
    </div>
  )
}
