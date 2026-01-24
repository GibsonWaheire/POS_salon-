import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight } from "lucide-react"

/**
 * Contact Section Component
 * @param {Object} props
 * @param {Object} props.formData - Form data state
 * @param {Function} props.setFormData - Form data setter
 * @param {boolean} props.isSubmitting - Submission state
 * @param {Function} props.handleSubmit - Submit handler
 * @param {Object|null} props.posConfig - POS configuration object
 */
export default function ContactSection({ formData, setFormData, isSubmitting, handleSubmit, posConfig }) {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Request a Quote</h2>
            <p className="text-xl text-gray-600">
              Get in touch with us to learn more about our POS system and receive a customized quote
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Contact Information */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Contact Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-gray-900">Phone</p>
                  <a href="tel:+254726899113" className="text-gray-600 hover:text-gray-900 transition-colors">
                    +254 726 899 113
                  </a>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Location</p>
                  <p className="text-gray-600">
                    Kasarani-Mwiki Nairobi<br />
                    Team Plaza, Room 06
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <a href="mailto:info@Mcgibsdigitalsolutions.com" className="text-gray-600 hover:text-gray-900 transition-colors">
                    info@Mcgibsdigitalsolutions.com
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Contact Us</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-900">Name *</Label>
                    <Input
                      id="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      disabled={isSubmitting}
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-900">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      disabled={isSubmitting}
                      className="bg-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-900">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="e.g. +1 234 567 8900"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={isSubmitting}
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessName" className="text-gray-900">Business Name</Label>
                    <Input
                      id="businessName"
                      placeholder={posConfig ? `Your ${posConfig.businessTerm} name` : "Your salon name"}
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      disabled={isSubmitting}
                      className="bg-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-gray-900">Message / Requirements</Label>
                  <Textarea
                    id="message"
                    placeholder={posConfig ? `Tell us about your ${posConfig.businessTerm} and any specific requirements...` : "Tell us about your salon and any specific requirements..."}
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    disabled={isSubmitting}
                    className="bg-white"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-[#5E278E] hover:bg-[#4a1f6e] text-white"
                  disabled={isSubmitting}
                  size="lg"
                >
                  {isSubmitting ? "Sending..." : "Request Quote"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
