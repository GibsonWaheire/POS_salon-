import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Quote, Star, TrendingUp } from "lucide-react"
import Breadcrumb from "@/components/Breadcrumb"

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
      location: "Mombasa, Kenya",
      type: "Spa",
      testimonial: "The inventory management feature has been a game-changer. We no longer run out of products unexpectedly, and the expense tracking helps us understand our costs better. The reporting features give us insights we never had before.",
      results: "Better inventory control, improved cost management",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      business: "Modern Cuts Barber Shop",
      location: "Kisumu, Kenya",
      type: "Barber Shop",
      testimonial: "As a barber shop owner, I needed something simple and effective. Salonyst delivers exactly that. The POS system is fast, and my barbers can easily track their earnings. Customer management helps us build relationships with repeat clients.",
      results: "Faster checkout, improved customer retention",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      business: "Glow Beauty Studio",
      location: "Nakuru, Kenya",
      type: "Beauty Salon",
      testimonial: "The staff management features are excellent. We can easily schedule shifts, track performance, and calculate commissions automatically. This has saved us hours of administrative work every week.",
      results: "80% reduction in admin time, accurate commission tracking",
      gradient: "from-pink-500 to-pink-600"
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
              { label: "Success Stories" }
            ]} />
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
                  Success Stories
                </h1>
                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
                  See how salons and beauty businesses are growing with Salonyst
                </p>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-[#ef4444] via-red-500 to-pink-500 p-8 flex items-center justify-center shadow-2xl">
                  <TrendingUp className="h-32 w-32 text-white opacity-80" />
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
        <div className="grid md:grid-cols-2 gap-8">
          {stories.map((story, index) => (
            <article key={index} className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${story.gradient} flex items-center justify-center mb-6`}>
                <Star className="h-8 w-8 text-white" />
              </div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{story.business}</h2>
                <p className="text-gray-600">{story.type} • {story.location}</p>
              </div>
              <div className="relative mb-6">
                <Quote className="h-8 w-8 text-[#ef4444] mb-4 opacity-50" />
                <p className="text-lg text-gray-700 leading-relaxed italic pl-8">
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
            <h2 className="text-4xl font-bold mb-4">Share Your Success Story</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Are you a Salonyst customer with a success story to share? We'd love to hear from you.
            </p>
            <Link to="/#contact">
              <Button className="bg-white text-[#ef4444] hover:bg-gray-100 text-lg px-8 py-6 h-auto shadow-xl">
                Contact Us
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
