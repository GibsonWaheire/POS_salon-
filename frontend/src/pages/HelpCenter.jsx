import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Search, Phone } from "lucide-react"
import Breadcrumb from "@/components/Breadcrumb"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import NavigationHeader from "@/components/NavigationHeader"
import LandingFooter from "@/components/landing/LandingFooter"
import {
  faqCategories,
  HELP_CENTER_META,
  SUPPORT_PHONE,
} from "@/data/helpCenterData"
import { usePageSeo } from "@/hooks/usePageSeo"

function filterFaqs(categories, query) {
  const q = (query || "").trim().toLowerCase()
  if (!q) return categories

  return categories
    .map((cat) => ({
      ...cat,
      questions: cat.questions.filter(
        (faq) =>
          faq.q.toLowerCase().includes(q) || faq.a.toLowerCase().includes(q)
      ),
    }))
    .filter((cat) => cat.questions.length > 0)
}

function HelpCenterHero({ searchQuery, onSearchChange }) {
  return (
    <header className="border-b border-gray-200 bg-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Help Center" },
          ]}
        />
        <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
          Help Center
        </h1>
        <p className="text-gray-600 mb-8">
          Find answers to common questions about Salonyst
        </p>
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
            aria-hidden
          />
          <input
            type="search"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ef4444] focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
            aria-label="Search FAQs"
          />
        </div>
      </div>
    </header>
  )
}

function FAQCategory({ category, openItems, onToggle }) {
  return (
    <section className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100">
      <h2 className="text-lg font-bold text-gray-900 mb-8">
        {category.category}
      </h2>
      <div className="space-y-4">
        {category.questions.map((faq, i) => {
          const key = `${category.id}-${i}`
          const isOpen = openItems[key]
          return (
            <Collapsible
              key={key}
              open={isOpen}
              onOpenChange={() => onToggle(key)}
            >
              <CollapsibleTrigger
                className="w-full text-left group"
                aria-expanded={isOpen}
              >
                <div className="flex items-center justify-between p-6 bg-gray-50 group-hover:bg-gray-100 transition-colors rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.q}
                  </h3>
                  {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-gray-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-600 flex-shrink-0" />
                  )}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-6 pt-4 border-l-4 border-[#ef4444] ml-6 bg-gray-50 rounded-r-lg">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )
        })}
      </div>
    </section>
  )
}

function HelpCenterCTA() {
  return (
    <section className="mt-20 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ef4444] via-red-600 to-red-700 p-12 text-white">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="relative z-10 text-center">
        <h2 className="text-xl font-bold mb-4">Still Have Questions?</h2>
        <p className="text-base mb-8 opacity-90 max-w-2xl mx-auto">
          Can't find what you're looking for? Our support team is here to help.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`}>
            <Button
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 text-sm px-8 py-6 h-auto gap-2"
            >
              <Phone className="h-5 w-5" />
              Call Us
            </Button>
          </a>
          <Link to="/#contact">
            <Button className="bg-white text-[#ef4444] hover:bg-gray-100 text-sm px-8 py-6 h-auto shadow-xl">
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("")
  const [openItems, setOpenItems] = useState({})

  usePageSeo(HELP_CENTER_META.title, HELP_CENTER_META.description)

  const filteredCategories = useMemo(
    () => filterFaqs(faqCategories, searchQuery),
    [searchQuery]
  )

  const toggleItem = (key) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <NavigationHeader />

      <HelpCenterHero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 max-w-6xl">
        <div className="space-y-12">
          {filteredCategories.length === 0 ? (
            <section className="bg-white rounded-3xl p-12 shadow-lg border border-gray-100 text-center">
              <p className="text-gray-600 mb-4">
                No FAQs match &ldquo;{searchQuery}&rdquo;. Try a different search
                or browse categories above.
              </p>
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
                className="text-[#ef4444] border-[#ef4444] hover:bg-[#ef4444]/5"
              >
                Clear search
              </Button>
            </section>
          ) : (
            filteredCategories.map((category) => (
              <FAQCategory
                key={category.id}
                category={category}
                openItems={openItems}
                onToggle={toggleItem}
              />
            ))
          )}
        </div>

        <HelpCenterCTA />
      </main>

      <LandingFooter />
    </div>
  )
}
