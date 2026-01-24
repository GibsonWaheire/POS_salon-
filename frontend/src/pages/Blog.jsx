import { useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Clock, ArrowRight, BookOpen, ExternalLink } from "lucide-react"
import Breadcrumb from "@/components/Breadcrumb"
import NavigationHeader from "@/components/NavigationHeader"
import LandingFooter from "@/components/landing/LandingFooter"
import { blogPosts, BLOG_META } from "@/data/blogData"
import { usePageSeo } from "@/hooks/usePageSeo"

const SITE_URL = "https://salonyst.com"

const authorityLinks = [
  { label: "Professional Beauty Association (Pro Beauty)", href: "https://www.probeauty.org/", desc: "Industry association and resources" },
  { label: "Associated Skin Care Professionals (ASCP)", href: "https://www.ascpskincare.com/", desc: "Skincare professional education and business tools" },
  { label: "U.S. Small Business Administration (SBA)", href: "https://www.sba.gov/", desc: "Small business guides, funding, and compliance" },
  { label: "U.S. Bureau of Labor Statistics – Personal Care", href: "https://www.bls.gov/ooh/personal-care-and-service/barbers-hairstylists-and-cosmetologists.htm", desc: "Employment and wage data for barbers, hairstylists, cosmetologists" },
  { label: "IRS – Small Business and Self-Employed", href: "https://www.irs.gov/businesses/small-businesses-self-employed", desc: "Tax and compliance for small businesses" },
]

export default function Blog() {
  usePageSeo(BLOG_META.title, BLOG_META.description)

  useEffect(() => {
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Salonyst Blog",
      description: BLOG_META.description,
      url: `${SITE_URL}/blog`,
      publisher: {
        "@type": "Organization",
        name: "Salonyst",
        url: SITE_URL,
      },
      blogPost: blogPosts.map((p) => ({
        "@type": "BlogPosting",
        headline: p.title,
        description: p.excerpt,
        datePublished: p.date,
        author: { "@type": "Organization", name: p.author },
        url: `${SITE_URL}/blog/${p.slug}`,
      })),
    })
    document.head.appendChild(script)
    return () => {
      if (script.parentNode) document.head.removeChild(script)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <NavigationHeader />

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ef4444]/10 via-blue-50/50 to-purple-50/30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ef4444]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <Breadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: "Blog" },
              ]}
            />
            <div className="flex flex-col md:flex-row md:items-center gap-10">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                  Salonyst Blog
                </h1>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Tips, guides, and insights for salon and spa owners. The{" "}
                  <strong>Salonyst blog page</strong> is where we share best practices on staff
                  management, inventory, appointments, POS, and growing your beauty business. Explore
                  articles below, and check our{" "}
                  <Link to="/#features-section" className="text-[#ef4444] hover:underline font-medium">
                    features
                  </Link>
                  ,{" "}
                  <Link to="/pricing" className="text-[#ef4444] hover:underline font-medium">
                    pricing
                  </Link>
                  , and{" "}
                  <Link to="/solutions/hair" className="text-[#ef4444] hover:underline font-medium">
                    solutions
                  </Link>{" "}
                  for more.
                </p>
                <div className="flex items-center gap-2 text-gray-600">
                  <BookOpen className="h-5 w-5" />
                  <span>{blogPosts.length} articles</span>
                </div>
              </div>
              <div className="relative flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=400&fit=crop"
                  alt="Salonyst blog – salon and spa management insights"
                  className="rounded-2xl object-cover shadow-xl w-full max-w-md aspect-[3/2]"
                />
                <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-[#ef4444] rounded-xl opacity-20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-6xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 group"
            >
              <Link to={`/blog/${post.slug}`} className="block">
                <div className="h-44 overflow-hidden bg-gray-100">
                  <img
                    src={post.image}
                    alt={post.imageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs font-semibold text-[#ef4444] uppercase tracking-wide mb-2">
                    {post.category}
                  </p>
                  <h2 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#ef4444] transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                    <time dateTime={post.date}>{post.dateDisplay}</time>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.readingTime}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-2 text-[#ef4444] font-medium text-sm group-hover:gap-3 transition-all">
                    Read more
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <section className="mt-20 rounded-2xl border border-gray-200 bg-white p-8 md:p-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Authority links &amp; resources
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl">
            We reference trusted industry and government sources across the Salonyst blog. Here are
            some useful links for salon and spa owners.
          </p>
          <ul className="space-y-4">
            {authorityLinks.map((a, i) => (
              <li key={i}>
                <a
                  href={a.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-wrap items-baseline gap-2 text-gray-700 hover:text-[#ef4444] transition-colors"
                >
                  <span className="font-medium">{a.label}</span>
                  <ExternalLink className="h-4 w-4 opacity-60 group-hover:opacity-100" />
                  <span className="text-sm text-gray-500 w-full md:w-auto">— {a.desc}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#ef4444] via-red-600 to-red-700 p-10 md:p-14 text-white">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-3">Stay updated</h2>
            <p className="text-red-100 mb-6">
              New articles on the Salonyst blog regularly. Get tips on running your salon or spa.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/#contact">
                <Button className="bg-white text-[#ef4444] hover:bg-gray-100 shadow-lg">
                  Contact us
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline" className="border-white/40 text-white hover:bg-white/10">
                  Start free trial
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}
