import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronDown, ChevronUp, Search, Phone, HelpCircle } from "lucide-react"
import Breadcrumb from "@/components/Breadcrumb"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("")
  const [openItems, setOpenItems] = useState({})

  const toggleItem = (categoryIndex, faqIndex) => {
    const key = `${categoryIndex}-${faqIndex}`
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "How do I sign up for Salonyst?",
          a: "Click the Signup button in the header or visit the signup page. You'll need to provide your business information and create an account. Once registered, you can start setting up your salon profile."
        },
        {
          q: "How long does it take to set up?",
          a: "You can have Salonyst up and running in under an hour. The initial setup includes adding your services, staff members, and basic business information. Our intuitive interface makes the process quick and straightforward."
        },
        {
          q: "Do I need technical knowledge to use Salonyst?",
          a: "No technical knowledge is required. Salonyst is designed to be user-friendly and intuitive. If you need assistance, our support team is available to help you get started."
        }
      ]
    },
    {
      category: "Features",
      questions: [
        {
          q: "Can I manage multiple staff members?",
          a: "Yes, Salonyst supports unlimited staff members. You can add staff, assign roles, track their schedules, and manage commissions for each team member individually."
        },
        {
          q: "Does Salonyst support mobile payments?",
          a: "Yes, Salonyst supports multiple payment methods including cash, M-Pesa, and card payments. You can process transactions quickly and securely through the POS system."
        },
        {
          q: "Can I track inventory?",
          a: "Absolutely. Salonyst includes comprehensive inventory management. You can track products, set low stock alerts, and monitor usage to ensure you never run out of essential supplies."
        },
        {
          q: "How does commission tracking work?",
          a: "Salonyst automatically calculates commissions based on sales. You can set commission rates for different staff members or services. The system tracks all commissions and generates reports for easy payment processing."
        }
      ]
    },
    {
      category: "Support",
      questions: [
        {
          q: "How can I contact support?",
          a: "You can reach our support team via phone at +254 726 899 113 or email at info@Mcgibsdigitalsolutions.com. We also offer help through our contact form on the website."
        },
        {
          q: "What are your support hours?",
          a: "Our support team is available during business hours. For urgent issues, please call our support line. We aim to respond to all inquiries within 24 hours."
        },
        {
          q: "Do you offer training?",
          a: "Yes, we provide training resources and can arrange training sessions for you and your staff. Contact us to learn more about our training options."
        }
      ]
    },
    {
      category: "Billing & Pricing",
      questions: [
        {
          q: "What are your pricing plans?",
          a: "We offer flexible pricing plans to suit businesses of all sizes. Please visit our pricing page or contact us for detailed information about our plans and pricing."
        },
        {
          q: "Are there any hidden fees?",
          a: "No, we believe in transparent pricing. All fees are clearly stated upfront. There are no hidden charges or surprise fees."
        },
        {
          q: "Can I change my plan later?",
          a: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
        }
      ]
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
              { label: "Help Center" }
            ]} />
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
                  Help Center
                </h1>
                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8">
                  Find answers to common questions about Salonyst
                </p>
                <div className="relative max-w-xl">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for help..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ef4444] focus:border-transparent shadow-sm"
                  />
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 p-8 flex items-center justify-center shadow-2xl">
                  <HelpCircle className="h-32 w-32 text-white opacity-80" />
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
        <div className="space-y-12">
          {faqs.map((category, catIndex) => (
            <section key={catIndex} className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">{category.category}</h2>
              <div className="space-y-4">
                {category.questions.map((faq, faqIndex) => {
                  const key = `${catIndex}-${faqIndex}`
                  const isOpen = openItems[key]
                  return (
                    <Collapsible key={faqIndex} open={isOpen} onOpenChange={() => toggleItem(catIndex, faqIndex)}>
                      <CollapsibleTrigger className="w-full text-left">
                        <div className="flex items-center justify-between p-6 bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl border border-gray-200">
                          <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.q}</h3>
                          {isOpen ? (
                            <ChevronUp className="h-5 w-5 text-gray-600 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-600 flex-shrink-0" />
                          )}
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="p-6 pt-4 border-l-4 border-[#ef4444] ml-6 bg-gray-50 rounded-r-lg">
                          <p className="text-lg text-gray-700 leading-relaxed">{faq.a}</p>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )
                })}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-20 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ef4444] via-red-600 to-red-700 p-12 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 text-center">
            <h2 className="text-4xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="tel:+254726899113">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6 h-auto gap-2">
                  <Phone className="h-5 w-5" />
                  Call Us
                </Button>
              </a>
              <Link to="/#contact">
                <Button className="bg-white text-[#ef4444] hover:bg-gray-100 text-lg px-8 py-6 h-auto shadow-xl">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
