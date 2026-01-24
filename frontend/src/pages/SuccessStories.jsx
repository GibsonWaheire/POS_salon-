import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Quote, Star, TrendingUp } from "lucide-react"
import Breadcrumb from "@/components/Breadcrumb"
import NavigationHeader from "@/components/NavigationHeader"

export default function SuccessStories() {
  const stories = [
    {
      business: "Elegance Hair Salon",
      location: "Nairobi, Kenya",
      type: "Hair Salon",
      testimonial: "Salonyst has transformed how we manage our salon. The appointment system is seamless, and our staff love how easy it is to track commissions. Our revenue has increased by 30% since implementing the system.",
      results: "30% revenue increase, 50% reduction in no-shows",
      gradient: "from-[#ef4444] to-red-600"
    },
    {
      business: "Serenity Spa & Wellness",
      location: "London, United Kingdom",
      type: "Spa",
      testimonial: "The inventory management feature has been a game-changer. We no longer run out of products unexpectedly, and the expense tracking helps us understand our costs better. The reporting features give us insights we never had before.",
      results: "Better inventory control, improved cost management",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      business: "Modern Cuts Barber Shop",
      location: "New York, USA",
      type: "Barber Shop",
      testimonial: "As a barber shop owner, I needed something simple and effective. Salonyst delivers exactly that. The POS system is fast, and my barbers can easily track their earnings. Customer management helps us build relationships with repeat clients.",
      results: "Faster checkout, improved customer retention",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      business: "Glow Beauty Studio",
      location: "Dubai, UAE",
      type: "Beauty Salon",
      testimonial: "The staff management features are excellent. We can easily schedule shifts, track performance, and calculate commissions automatically. This has saved us hours of administrative work every week.",
      results: "80% reduction in admin time, accurate commission tracking",
      gradient: "from-pink-500 to-pink-600"
    },
    {
      business: "Luxe Nail Bar",
      location: "Sydney, Australia",
      type: "Nail Salon",
      testimonial: "Managing multiple locations was a challenge until we found Salonyst. The centralized system allows us to track performance across all locations and manage inventory efficiently. Our customer satisfaction has improved significantly.",
      results: "Multi-location management, improved customer satisfaction",
      gradient: "from-orange-500 to-orange-600"
    },
    {
      business: "Bridal Beauty House",
      location: "Toronto, Canada",
      type: "Bridal Salon",
      testimonial: "For bridal services, scheduling and coordination are crucial. Salonyst's appointment system handles complex bookings perfectly, and the customer database helps us personalize each bride's experience. Our bookings have doubled.",
      results: "Doubled bookings, improved customer experience",
      gradient: "from-indigo-500 to-indigo-600"
    }
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
              { label: "Success Stories" }
            ]} />
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                  Success Stories
                </h1>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  See how salons and beauty businesses are growing with Salonyst
                </p>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=600&fit=crop&auto=format" 
                  alt="Success and growth" 
                  className="aspect-square rounded-3xl object-cover shadow-2xl"
                />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500 rounded-2xl opacity-20"></div>
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-purple-500 rounded-xl opacity-20"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8">
          {stories.map((story, index) => (
            <article key={index} className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${story.gradient} flex items-center justify-center mb-6`}>
                <Star className="h-8 w-8 text-white" />
              </div>
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-2">{story.business}</h2>
                <p className="text-gray-600">{story.type} • {story.location}</p>
              </div>
              <div className="relative mb-6">
                <Quote className="h-8 w-8 text-[#ef4444] mb-4 opacity-50" />
                <p className="text-sm text-gray-700 leading-relaxed italic pl-8">
                  {story.testimonial}
                </p>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-base text-gray-900">
                  <strong className="text-[#ef4444]">Key Results:</strong> <span className="text-gray-700">{story.results}</span>
                </p>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-20 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ef4444] via-red-600 to-red-700 p-12 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 text-center">
            <h2 className="text-xl font-bold mb-4">Share Your Success Story</h2>
            <p className="text-base mb-8 opacity-90 max-w-2xl mx-auto">
              Are you a Salonyst customer with a success story to share? We'd love to hear from you.
            </p>
            <Link to="/#contact">
              <Button className="bg-white text-[#ef4444] hover:bg-gray-100 text-sm px-8 py-6 h-auto shadow-xl">
                Contact Us
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
