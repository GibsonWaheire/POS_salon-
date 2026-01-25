import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import NavigationHeader from "@/components/NavigationHeader"
import LandingFooter from "@/components/landing/LandingFooter"
import PageHero from "@/components/PageHero"
import { usePageSeo } from "@/hooks/usePageSeo"

const WHY_CHOOSE_META = {
  title: "Why Choose Us | Salonyst – Built for Salons & Spas",
  description: "Discover what makes Salonyst the preferred choice: built for salons, easy to use, comprehensive features, and reliable support.",
}

export default function WhyChooseUs() {
  usePageSeo(WHY_CHOOSE_META.title, WHY_CHOOSE_META.description)
  const benefits = [
    {
      number: "01",
      title: "Built Specifically for Salons",
      description: "Unlike generic business software, Salonyst is designed from the ground up for salons, spas, and beauty businesses. Every feature is tailored to meet the unique needs of the beauty and wellness industry, from appointment scheduling to commission tracking.",
      gradient: "from-[#ef4444] to-red-600"
    },
    {
      number: "02",
      title: "Easy to Use",
      description: "We believe powerful software shouldn't be complicated. Salonyst features an intuitive interface that your staff can learn quickly. No extensive training required - get started and productive right away.",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      number: "03",
      title: "Comprehensive Features",
      description: "Everything you need in one platform: appointment management with online booking capabilities, point-of-sale system supporting cash and mobile payments, staff management with automated commission calculations, inventory tracking and low stock alerts, customer database with purchase history, financial reports and analytics, and expense tracking and management.",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      number: "04",
      title: "Affordable Pricing",
      description: "We offer transparent, affordable pricing designed for businesses of all sizes. No hidden fees, no surprise charges. Choose the plan that fits your business needs and scale as you grow.",
      gradient: "from-green-500 to-green-600"
    },
    {
      number: "05",
      title: "Reliable Support",
      description: "Our dedicated support team is here to help you succeed. Whether you need help setting up your system, training your staff, or resolving issues, we're committed to providing timely and effective support.",
      gradient: "from-orange-500 to-orange-600"
    },
    {
      number: "06",
      title: "Secure and Reliable",
      description: "Your business data is important to us. Salonyst uses industry-standard security measures to protect your information. Our systems are built for reliability, ensuring your business operations run smoothly.",
      gradient: "from-indigo-500 to-indigo-600"
    },
    {
      number: "07",
      title: "Continuous Improvement",
      description: "We listen to our customers and continuously improve our platform. Regular updates bring new features and enhancements based on real user feedback, ensuring Salonyst evolves with your business needs.",
      gradient: "from-pink-500 to-pink-600"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <NavigationHeader />
      <PageHero
        breadcrumbItems={[{ label: "Home", href: "/" }, { label: "Why Choose Us" }]}
        title="Why Choose Salonyst"
        description="Discover what makes Salonyst the preferred choice for salons and beauty businesses across the region."
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 max-w-6xl">
        <div className="space-y-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="group relative overflow-hidden rounded-3xl bg-white border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-500"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${benefit.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              <div className="relative p-8 md:p-10">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-3xl font-bold text-white">{benefit.number}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 group-hover:text-[#ef4444] transition-colors">
                      {benefit.title}
                    </h2>
                    <p className="text-sm text-gray-700 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ef4444] via-red-600 to-red-700 p-12 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 text-center">
            <h2 className="text-xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-base mb-10 opacity-90 max-w-2xl mx-auto">
              Join hundreds of salons already using Salonyst to streamline their operations and grow their business.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/signup">
                <Button className="bg-white text-[#ef4444] hover:bg-gray-100 text-sm px-8 py-6 h-auto shadow-xl">
                  Sign Up Now
                </Button>
              </Link>
              <Link to="/#contact">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 text-sm px-8 py-6 h-auto">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
