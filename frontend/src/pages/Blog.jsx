import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, ArrowRight, BookOpen, Calendar } from "lucide-react"
import Breadcrumb from "@/components/Breadcrumb"

export default function Blog() {
  const blogPosts = [
    {
      title: "5 Tips for Managing Salon Staff Effectively",
      date: "January 15, 2026",
      readingTime: "5 min read",
      excerpt: "Learn best practices for scheduling, communication, and performance management in your salon.",
      gradient: "from-[#ef4444] to-red-600"
    },
    {
      title: "How to Increase Customer Retention in Your Salon",
      date: "January 10, 2026",
      readingTime: "7 min read",
      excerpt: "Strategies for building lasting relationships with clients and encouraging repeat visits.",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "Inventory Management Best Practices for Salons",
      date: "January 5, 2026",
      readingTime: "6 min read",
      excerpt: "Tips for tracking products, reducing waste, and ensuring you never run out of essential supplies.",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      title: "Understanding Salon Commission Structures",
      date: "December 28, 2025",
      readingTime: "8 min read",
      excerpt: "A guide to setting up fair and motivating commission systems for your salon staff.",
      gradient: "from-green-500 to-green-600"
    },
    {
      title: "Digital Transformation for Beauty Businesses",
      date: "December 20, 2025",
      readingTime: "10 min read",
      excerpt: "How modern POS systems are revolutionizing the beauty and wellness industry.",
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
              { label: "Blog" }
            ]} />
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
                  Blog
                </h1>
                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
                  Insights, tips, and best practices for running a successful salon business
                </p>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-8 flex items-center justify-center shadow-2xl">
                  <BookOpen className="h-32 w-32 text-white opacity-80" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#ef4444] rounded-2xl opacity-20"></div>
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-green-500 rounded-xl opacity-20"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 max-w-6xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <article key={index} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
              <div className={`h-48 bg-gradient-to-br ${post.gradient} p-8 flex items-center justify-center`}>
                <Calendar className="h-16 w-16 text-white opacity-80" />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#ef4444] transition-colors">
                  {post.title}
                </h2>
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <time className="font-medium">{post.date}</time>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {post.readingTime}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">{post.excerpt}</p>
                <Link to="#" className="inline-flex items-center gap-2 text-[#ef4444] hover:text-[#dc2626] font-medium transition-colors">
                  Read More
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-20 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ef4444] via-red-600 to-red-700 p-12 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 text-center">
            <p className="text-xl mb-6 opacity-90">More articles coming soon</p>
            <Link to="/#contact">
              <Button className="bg-white text-[#ef4444] hover:bg-gray-100 text-lg px-8 py-6 h-auto shadow-xl">
                Subscribe for Updates
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
