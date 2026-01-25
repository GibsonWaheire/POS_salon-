import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react"
import { BUSINESS_TYPES } from "@/lib/serviceCategories"
import { toKebabCase } from "@/lib/posTypes"

/**
 * Landing Footer Component
 */
export default function LandingFooter() {
  const navigate = useNavigate()
  const location = useLocation()
  const isOnLanding = location.pathname === "/" || location.pathname.startsWith("/solutions/")

  const handleContactClick = (e) => {
    e.preventDefault()
    if (isOnLanding) {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
    } else {
      navigate("/#contact")
    }
  }

  return (
    <footer className="border-t border-gray-800 bg-gray-900 text-gray-300">
      <div className="container mx-auto px-6 sm:px-10 lg:px-12 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16 mb-16 lg:mb-20">
          {/* Follow Us */}
          <div>
            <h3 className="font-semibold text-white mb-6 text-base">Follow Us</h3>
            <div className="flex gap-5">
              <a href="#" className="text-gray-400 hover:text-white transition-colors p-1 -m-1 rounded" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors p-1 -m-1 rounded" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors p-1 -m-1 rounded" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors p-1 -m-1 rounded" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Other Links */}
          <div>
            <h3 className="font-semibold text-white mb-6 text-base">Other Links</h3>
            <ul className="space-y-3.5 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Salon Scheduling Software</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hair Salon Scheduling Software</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Barber Shop Scheduling Software</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Massage Scheduling Software</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Beauty Salon Booking Software</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Makeup Artist Booking Software</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Spa Scheduling Software</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Mobile Salon Scheduling Software</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Nail Salon Scheduling Software</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Bridal Salon Scheduling Software</a></li>
            </ul>
          </div>

          {/* Who Can Use It? */}
          <div>
            <h3 className="font-semibold text-white mb-6 text-base">Who Can Use It?</h3>
            <ul className="space-y-3.5 text-sm">
              {BUSINESS_TYPES.map((businessType) => (
                <li key={businessType.id}>
                  <a
                    href={`/solutions/${toKebabCase(businessType.id)}`}
                    onClick={(e) => { e.preventDefault(); navigate(`/solutions/${toKebabCase(businessType.id)}`); }}
                    className="hover:text-white transition-colors"
                  >
                    {businessType.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Discount Coupons Section */}
        <div className="pt-12 lg:pt-14 border-t border-gray-700/80">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 lg:p-10 text-center text-white">
            <h3 className="text-xl lg:text-2xl font-bold mb-3">Special Offer</h3>
            <p className="mb-6 text-gray-100">Get 20% off on your first subscription</p>
            <Button className="bg-white text-blue-600 hover:bg-gray-100 font-medium px-6 py-2.5">
              Get Discount Coupon
            </Button>
          </div>
        </div>

        <Separator className="my-10 lg:my-12 bg-gray-700/60" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Salonyst. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="/privacy-policy" onClick={(e) => { e.preventDefault(); navigate("/privacy-policy"); }} className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms-of-service" onClick={(e) => { e.preventDefault(); navigate("/terms-of-service"); }} className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
