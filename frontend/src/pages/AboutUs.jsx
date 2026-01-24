import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Phone, Mail, MapPin, Target, Users, Package, Heart } from "lucide-react"
import Breadcrumb from "@/components/Breadcrumb"

export default function AboutUs() {
  const values = [
    { icon: Target, title: "Simplicity", desc: "Technology should be easy to use and understand" },
    { icon: Package, title: "Reliability", desc: "Systems built to be dependable and secure" },
    { icon: Heart, title: "Innovation", desc: "Continuous improvement based on customer feedback" },
    { icon: Users, title: "Support", desc: "Committed to helping our customers succeed" }
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
              { label: "About Us" }
            ]} />
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
                  About Us
                </h1>
                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
                  Empowering beauty and wellness businesses with comprehensive management solutions designed to help you grow and succeed.
                </p>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-[#ef4444] via-red-500 to-pink-500 p-8 flex items-center justify-center shadow-2xl">
                  <Users className="h-32 w-32 text-white opacity-80" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500 rounded-2xl opacity-20"></div>
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-purple-500 rounded-xl opacity-20"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 max-w-6xl">
        <div className="space-y-20">
          {/* Mission Section */}
          <section className="relative">
            <div className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ef4444] to-red-600 flex items-center justify-center flex-shrink-0">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
                  <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                    <p>
                      Salonyst is dedicated to empowering beauty and wellness businesses with comprehensive management solutions. We believe that every salon, spa, and beauty business deserves tools that help them grow, streamline operations, and deliver exceptional customer experiences.
                    </p>
                    <p>
                      Our mission is to provide intuitive, powerful software that simplifies day-to-day operations, allowing business owners to focus on what they do best - serving their clients and growing their brand.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Who We Are Section */}
          <section className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-8 flex items-center justify-center shadow-2xl">
                <Package className="h-24 w-24 text-white opacity-80" />
              </div>
            </div>
            <div className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Who We Are</h2>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>
                  Salonyst was founded with a clear vision: to revolutionize how beauty and wellness businesses manage their operations. We understand the unique challenges faced by salon owners, from appointment scheduling and staff management to inventory tracking and financial reporting.
                </p>
                <p>
                  Our team combines deep industry knowledge with cutting-edge technology to deliver solutions that are both powerful and easy to use. We're committed to continuous innovation and providing exceptional support to our customers.
                </p>
              </div>
            </div>
          </section>

          {/* What We Offer Section */}
          <section>
            <div className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100">
              <h2 className="text-4xl font-bold text-gray-900 mb-8">What We Offer</h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Salonyst provides a complete point-of-sale and management system specifically designed for salons, spas, and beauty businesses. Our platform includes:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Comprehensive appointment scheduling and management",
                  "Point-of-sale system with multiple payment options",
                  "Staff management with commission tracking",
                  "Inventory management and tracking",
                  "Customer relationship management",
                  "Financial reporting and analytics",
                  "Expense tracking and management"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:shadow-md transition-all duration-300 border border-gray-100">
                    <div className="w-2 h-2 rounded-full bg-[#ef4444] mt-2 flex-shrink-0"></div>
                    <span className="text-lg text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section>
            <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <div key={index} className="p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:shadow-xl hover:border-[#ef4444]/30 transition-all duration-300">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ef4444] to-red-600 flex items-center justify-center mb-6 shadow-lg">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-lg text-gray-600 leading-relaxed">{value.desc}</p>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ef4444] via-red-600 to-red-700 p-12 text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-8">Contact Us</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-90 mb-1">Phone</p>
                    <a href="tel:+254726899113" className="text-lg font-semibold hover:underline">+254 726 899 113</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-90 mb-1">Email</p>
                    <a href="mailto:info@Mcgibsdigitalsolutions.com" className="text-lg font-semibold hover:underline break-all">info@Mcgibsdigitalsolutions.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-90 mb-1">Location</p>
                    <p className="text-lg font-semibold">Kasarani-Mwiki Nairobi, Team Plaza, Room 06</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
