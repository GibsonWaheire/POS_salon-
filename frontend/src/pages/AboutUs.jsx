import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Phone, Mail, MapPin, Target, Users, Package, Heart, Zap, Award, TrendingUp, Shield, CheckCircle2 } from "lucide-react"
import Breadcrumb from "@/components/Breadcrumb"
import NavigationHeader from "@/components/NavigationHeader"
import LandingFooter from "@/components/landing/LandingFooter"
import dashboardScreenshot from "@/assets/dashboard-screenshot.png"
import posScreenshot from "@/assets/pos-screenshot.png"

export default function AboutUs() {
  const values = [
    { icon: Target, title: "Simplicity", desc: "Technology should be easy to use and understand", color: "from-[#ef4444] to-red-600" },
    { icon: Shield, title: "Reliability", desc: "Systems built to be dependable and secure", color: "from-blue-500 to-blue-600" },
    { icon: Zap, title: "Innovation", desc: "Continuous improvement based on customer feedback", color: "from-purple-500 to-purple-600" },
    { icon: Heart, title: "Support", desc: "Committed to helping our customers succeed", color: "from-pink-500 to-pink-600" }
  ]

  const features = [
    { icon: CheckCircle2, text: "Comprehensive appointment scheduling and management" },
    { icon: CheckCircle2, text: "Point-of-sale system with multiple payment options" },
    { icon: CheckCircle2, text: "Staff management with commission tracking" },
    { icon: CheckCircle2, text: "Inventory management and tracking" },
    { icon: CheckCircle2, text: "Customer relationship management" },
    { icon: CheckCircle2, text: "Financial reporting and analytics" },
    { icon: CheckCircle2, text: "Expense tracking and management" }
  ]

  const stats = [
    { number: "500+", label: "Salons Using Salonyst", icon: Users },
    { number: "50K+", label: "Transactions Processed", icon: TrendingUp },
    { number: "10K+", label: "Happy Customers", icon: Heart },
    { number: "98%", label: "Customer Satisfaction", icon: Award }
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
              { label: "About Us" }
            ]} />
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                  About Us
                </h1>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-8">
                  Empowering beauty and wellness businesses with comprehensive management solutions designed to help you grow and succeed.
                </p>
                <div className="flex gap-4">
                  <Link to="/signup">
                    <Button className="bg-[#ef4444] hover:bg-[#dc2626] text-white text-sm px-8 py-6 h-auto">
                      Get Started
                    </Button>
                  </Link>
                  <Link
                    to="#contact"
                    onClick={(e) => {
                      const el = document.getElementById('contact')
                      if (el) {
                        e.preventDefault()
                        el.scrollIntoView({ behavior: 'smooth' })
                      }
                    }}
                  >
                    <Button variant="outline" className="text-sm px-8 py-6 h-auto">
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <img 
                  src={dashboardScreenshot} 
                  alt="Salonyst dashboard – overview of sales, commissions, and staff" 
                  className="aspect-video md:aspect-[16/10] w-full rounded-3xl object-cover object-top shadow-2xl border border-gray-200"
                />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500 rounded-2xl opacity-20"></div>
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-purple-500 rounded-xl opacity-20"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ef4444] to-red-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600 text-sm md:text-base">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 max-w-6xl">
        <div className="space-y-20">
          {/* Mission Section */}
          <section className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ef4444] to-red-600 flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                <p>
                  Salonyst is dedicated to empowering beauty and wellness businesses with comprehensive management solutions. We believe that every salon, spa, and beauty business deserves tools that help them grow, streamline operations, and deliver exceptional customer experiences.
                </p>
                <p>
                  Our mission is to provide intuitive, powerful software that simplifies day-to-day operations, allowing business owners to focus on what they do best - serving their clients and growing their brand.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src={posScreenshot} 
                alt="Salonyst POS – services, current sale, M-Pesa, and commission tracking" 
                className="aspect-[4/3] rounded-3xl object-cover object-top shadow-2xl border border-gray-200"
                loading="lazy"
              />
            </div>
          </section>

          {/* Who We Are Section */}
          <section className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative order-2 md:order-1">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=450&fit=crop&auto=format" 
                alt="Salonyst team collaboration" 
                className="aspect-[4/3] rounded-3xl object-cover shadow-2xl border border-gray-200"
                loading="lazy"
              />
            </div>
            <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 order-1 md:order-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Who We Are</h2>
              <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
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
            <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100">
              <div className="text-center mb-12">
                <h2 className="text-xl font-bold text-gray-900 mb-4">What We Offer</h2>
                <p className="text-sm text-gray-700 max-w-2xl mx-auto">
                  Salonyst provides a complete point-of-sale and management system specifically designed for salons, spas, and beauty businesses.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <div key={index} className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-r from-gray-50 to-white hover:shadow-lg transition-all duration-300 border border-gray-100 group">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ef4444] to-red-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-sm text-gray-700 pt-2">{feature.text}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* See Salonyst in action */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">See Salonyst in action</h2>
              <p className="text-sm text-gray-600 max-w-2xl mx-auto">
                Your command center for sales, staff, and commissions – all in one place.
              </p>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200 bg-gray-50">
              <img
                src={dashboardScreenshot}
                alt="Salonyst dashboard screenshot"
                className="w-full aspect-video object-cover object-top"
                loading="lazy"
              />
            </div>
          </section>

          {/* Values Section */}
          <section>
            <div className="text-center mb-12">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Our Values</h2>
              <p className="text-sm text-gray-600 max-w-2xl mx-auto">
                The principles that guide everything we do at Salonyst
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <div key={index} className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-[#ef4444]/30 transition-all duration-300 group">
                    <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#ef4444] transition-colors">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.desc}</p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ef4444] via-red-600 to-red-700 p-12 text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="text-center mb-12">
                <h2 className="text-xl font-bold mb-4">Get In Touch</h2>
                <p className="text-base opacity-90 max-w-2xl mx-auto">
                  Have questions or want to learn more? We're here to help you succeed.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                    <Phone className="h-7 w-7" />
                  </div>
                  <p className="text-sm opacity-90 mb-2">Phone</p>
                  <a href="tel:+254726899113" className="text-base font-semibold hover:underline">+254 726 899 113</a>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                    <Mail className="h-7 w-7" />
                  </div>
                  <p className="text-sm opacity-90 mb-2">Email</p>
                  <a href="mailto:info@Mcgibsdigitalsolutions.com" className="text-base font-semibold hover:underline break-all">info@Mcgibsdigitalsolutions.com</a>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                    <MapPin className="h-7 w-7" />
                  </div>
                  <p className="text-sm opacity-90 mb-2">Location</p>
                  <p className="text-base font-semibold">Kasarani-Mwiki Nairobi, Team Plaza, Room 06</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
