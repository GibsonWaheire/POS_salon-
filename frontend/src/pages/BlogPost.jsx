import { useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, Calendar, User, ExternalLink } from "lucide-react"
import Breadcrumb from "@/components/Breadcrumb"
import NavigationHeader from "@/components/NavigationHeader"
import LandingFooter from "@/components/landing/LandingFooter"
import { getPostBySlug, blogPosts } from "@/data/blogData"
import { usePageSeo } from "@/hooks/usePageSeo"

const SITE_URL = "https://salonyst.com"

export default function BlogPost() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const post = getPostBySlug(slug)

  const title = post ? `${post.title} | Salonyst Blog` : "Blog | Salonyst"
  const description = post
    ? `${post.excerpt} Read more on the Salonyst blog.`
    : "Salonyst blog – tips and insights for salon and spa owners."
  usePageSeo(title, description)

  useEffect(() => {
    if (!slug) return
    const p = getPostBySlug(slug)
    if (!p) navigate("/blog", { replace: true })
  }, [slug, navigate])

  useEffect(() => {
    if (!post) return
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      author: { "@type": "Organization", name: post.author },
      url: `${SITE_URL}/blog/${post.slug}`,
      image: post.image,
      publisher: { "@type": "Organization", name: "Salonyst", url: SITE_URL },
    })
    document.head.appendChild(script)
    return () => {
      if (script.parentNode) document.head.removeChild(script)
    }
  }, [post])

  if (!post) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <NavigationHeader />

      <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: post.title },
          ]}
        />

        <header className="mb-10">
          <p className="text-sm font-medium text-[#ef4444] uppercase tracking-wide mb-2">
            {post.category}
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {post.author}
            </span>
            <time dateTime={post.date} className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {post.dateDisplay}
            </time>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readingTime}
            </span>
          </div>
        </header>

        <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mb-10">
          <img
            src={post.image}
            alt={post.imageAlt}
            className="w-full aspect-[16/10] object-cover"
          />
        </div>

        <div className="prose prose-lg max-w-none text-gray-700">
          {post.paragraphs.map((p, i) => (
            <p key={i} className="mb-6 leading-relaxed">
              {p}
            </p>
          ))}
        </div>

        <section className="mt-12 pt-10 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Related on Salonyst</h2>
          <ul className="space-y-2 mb-8">
            {post.internalLinks.map((l, i) => (
              <li key={i}>
                <Link
                  to={l.href}
                  className="text-[#ef4444] hover:text-[#dc2626] font-medium transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <h2 className="text-xl font-bold text-gray-900 mb-4">References & further reading</h2>
          <ul className="space-y-2">
            {post.externalLinks.map((l, i) => (
              <li key={i}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-gray-700 hover:text-[#ef4444] transition-colors"
                >
                  {l.label}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-14 flex flex-wrap gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/blog")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Button>
          <Link to="/#contact">
            <Button className="gap-2 bg-[#ef4444] hover:bg-[#dc2626]">
              Contact Us
            </Button>
          </Link>
        </div>

        <section className="mt-16 pt-10 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">More from the Salonyst blog</h2>
          <ul className="grid sm:grid-cols-2 gap-4">
            {blogPosts
              .filter((p) => p.slug !== post.slug)
              .slice(0, 4)
              .map((p) => (
                <li key={p.slug}>
                  <Link
                    to={`/blog/${p.slug}`}
                    className="block p-4 rounded-xl border border-gray-200 hover:border-[#ef4444] hover:bg-gray-50 transition-all"
                  >
                    <span className="font-semibold text-gray-900">{p.title}</span>
                    <span className="block text-sm text-gray-600 mt-1">{p.dateDisplay}</span>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      </article>

      <LandingFooter />
    </div>
  )
}
