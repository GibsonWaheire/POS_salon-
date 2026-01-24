import { useState, useEffect } from "react"
import { useParams, useLocation } from "react-router-dom"
import { toast } from "sonner"
import WhatsAppChat from "@/components/WhatsAppChat"
import { useLandingData } from "@/hooks/useLandingData"
import { useCounters } from "@/hooks/useCounters"
import { usePOSTextReplacement } from "@/hooks/usePOSTextReplacement"
import NavigationHeader from "@/components/NavigationHeader"
import HeroSection from "@/components/landing/HeroSection"
import DemoSection from "@/components/landing/DemoSection"
import TrustedBrandsSection from "@/components/landing/TrustedBrandsSection"
import FeaturesSection from "@/components/landing/FeaturesSection"
import AppointmentBookingSection from "@/components/landing/AppointmentBookingSection"
import StatsSection from "@/components/landing/StatsSection"
import ContactSection from "@/components/landing/ContactSection"
import LandingFooter from "@/components/landing/LandingFooter"
import { features, salonTypes, trustedBrands } from "@/data/landingConstants"

export default function Landing() {
  const { posType } = useParams()
  const location = useLocation()

  // Use custom hooks
  const { counters } = useCounters()
  const { posConfig, stats } = useLandingData(posType, counters)
  const replacePOSText = usePOSTextReplacement(posConfig)
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Appointment form state
  const [appointmentForm, setAppointmentForm] = useState({
    customerName: "",
    phone: "",
    date: "",
    time: "",
    service: "",
    location: "salon",
    homeAddress: "",
    staff: ""
  })
  const [appointmentSubmitted, setAppointmentSubmitted] = useState(false)
  
  // Update document title based on POS type
  useEffect(() => {
    if (posConfig) {
      document.title = `${posConfig.softwareName} | Salonyst`
    } else {
      document.title = "Salonyst | Salon Management Software"
    }
  }, [posConfig])

  // Scroll to contact section when navigating to /#contact (e.g. from footer on other pages)
  useEffect(() => {
    if (location.hash === "#contact") {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
    }
  }, [location.pathname, location.hash])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!formData.name || !formData.email) {
      toast.error("Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    setTimeout(() => {
      toast.success("Thank you! We'll contact you soon with a quote.")
      setFormData({
        name: "",
        email: "",
        phone: "",
        businessName: "",
        message: ""
      })
      setIsSubmitting(false)
    }, 1000)
  }

  const handleScrollToDemo = () => {
    document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif" }}>
      {/* WhatsApp Chat Widget */}
      <WhatsAppChat />

      {/* Header/Navigation */}
      <NavigationHeader />

      {/* Hero Section */}
      <HeroSection posConfig={posConfig} onScrollToDemo={handleScrollToDemo} />

      {/* Embedded Demo Section */}
      <DemoSection posConfig={posConfig} />

      {/* Trusted By Brands - Animated */}
      <section className="py-8 bg-white border-y border-gray-200 overflow-hidden relative">
        <div className="flex animate-scroll whitespace-nowrap">
          {[...trustedBrands, ...trustedBrands, ...trustedBrands].map((brand, index) => (
            <div key={index} className="text-gray-600 font-bold text-xl px-16 flex-shrink-0" style={{ fontSize: '20px', fontWeight: 700 }}>
              {brand}
            </div>
          ))}
        </div>
      </section>

      {/* Trusted Salon Software For... */}
      <TrustedBrandsSection salonTypes={salonTypes} posConfig={posConfig} />

      {/* Features Section */}
      <FeaturesSection features={features} />

      {/* Appointment Booking Form Simulation */}
      <AppointmentBookingSection posConfig={posConfig} />

      {/* Statistics Section */}
      <StatsSection stats={stats} />

      {/* Request Quote/Contact Section */}
      <ContactSection 
        formData={formData}
        setFormData={setFormData}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
        posConfig={posConfig}
      />

      {/* Footer */}
      <LandingFooter />
    </div>
  )
}
