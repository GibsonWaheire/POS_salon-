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
    <footer className="border-t bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/about-us" onClick={(e) => { e.preventDefault(); navigate("/about-us"); }} className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Leadership</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Refund policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Write for us</a></li>
              <li><a href={isOnLanding ? "#contact" : "/#contact"} onClick={handleContactClick} className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="/blog" onClick={(e) => { e.preventDefault(); navigate("/blog"); }} className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sitemap</a></li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Other Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Other Links</h3>
            <ul className="space-y-2 text-sm">
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
            <h3 className="font-semibold mb-4 text-white">Who Can Use It?</h3>
            <ul className="space-y-2 text-sm">
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

          {/* Our Resources */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Our Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Videos</a></li>
              <li><a href="/help-center" onClick={(e) => { e.preventDefault(); navigate("/help-center"); }} className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="/help-center" onClick={(e) => { e.preventDefault(); navigate("/help-center"); }} className="hover:text-white transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Updates</a></li>
              <li><a href="/success-stories" onClick={(e) => { e.preventDefault(); navigate("/success-stories"); }} className="hover:text-white transition-colors">Case Studies</a></li>
              <li><a href="/success-stories" onClick={(e) => { e.preventDefault(); navigate("/success-stories"); }} className="hover:text-white transition-colors">Client Testimonials</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Reseller Partner Program</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Affiliate Partnership</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Compare Us</a></li>
            </ul>
          </div>
        </div>

        {/* Discount Coupons Section */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-center text-white">
            <h3 className="text-2xl font-bold mb-2">Special Offer</h3>
            <p className="mb-4">Get 20% off on your first subscription</p>
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              Get Discount Coupon
            </Button>
          </div>
        </div>

        <Separator className="my-8 bg-gray-700" />
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Salonyst. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
