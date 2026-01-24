import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

/**
 * Appointment Booking Section Component
 * @param {Object} props
 * @param {Object|null} props.posConfig - POS configuration object
 */
export default function AppointmentBookingSection({ posConfig }) {
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

  const handleSubmit = (e) => {
    e.preventDefault()
    // Validation
    if (!appointmentForm.customerName || !appointmentForm.phone || !appointmentForm.date || !appointmentForm.time || !appointmentForm.service) {
      toast.error("Please fill in all required fields")
      return
    }
    if (appointmentForm.location === "home" && !appointmentForm.homeAddress) {
      toast.error("Please provide home address for home service")
      return
    }
    // Simulate submission
    setAppointmentSubmitted(true)
    toast.success("Appointment booked successfully! Your appointment will appear in the POS system for staff to process.")
  }

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#ef4444]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 mb-4">
              Try Our Appointment Booking
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Experience how easy it is for your customers to book appointments. This form demonstrates the booking flow that integrates seamlessly with your POS system.
            </p>
          </div>

          {!appointmentSubmitted ? (
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-gray-200">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="appt-name" className="text-base font-semibold text-gray-900">
                      Customer Name <span className="text-[#ef4444]">*</span>
                    </Label>
                    <Input
                      id="appt-name"
                      placeholder="Enter customer name"
                      value={appointmentForm.customerName}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, customerName: e.target.value })}
                      className="h-12 text-base"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="appt-phone" className="text-base font-semibold text-gray-900">
                      Phone Number <span className="text-[#ef4444]">*</span>
                    </Label>
                    <Input
                      id="appt-phone"
                      type="tel"
                      placeholder="e.g. +1 234 567 8900"
                      value={appointmentForm.phone}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, phone: e.target.value })}
                      className="h-12 text-base"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="appt-date" className="text-base font-semibold text-gray-900">
                      Appointment Date <span className="text-[#ef4444]">*</span>
                    </Label>
                    <Input
                      id="appt-date"
                      type="date"
                      value={appointmentForm.date}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="h-12 text-base"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="appt-time" className="text-base font-semibold text-gray-900">
                      Appointment Time <span className="text-[#ef4444]">*</span>
                    </Label>
                    <Select
                      value={appointmentForm.time}
                      onValueChange={(value) => setAppointmentForm({ ...appointmentForm, time: value })}
                      required
                    >
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                        <SelectItem value="11:00">11:00 AM</SelectItem>
                        <SelectItem value="12:00">12:00 PM</SelectItem>
                        <SelectItem value="13:00">1:00 PM</SelectItem>
                        <SelectItem value="14:00">2:00 PM</SelectItem>
                        <SelectItem value="15:00">3:00 PM</SelectItem>
                        <SelectItem value="16:00">4:00 PM</SelectItem>
                        <SelectItem value="17:00">5:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appt-service" className="text-base font-semibold text-gray-900">
                    Service <span className="text-[#ef4444]">*</span>
                  </Label>
                  <Select
                    value={appointmentForm.service}
                    onValueChange={(value) => setAppointmentForm({ ...appointmentForm, service: value })}
                    required
                  >
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="haircut">Haircut & Style</SelectItem>
                      <SelectItem value="blowout">Blowout</SelectItem>
                      <SelectItem value="color">Color - Full Head</SelectItem>
                      <SelectItem value="highlights">Highlights</SelectItem>
                      <SelectItem value="manicure">Manicure</SelectItem>
                      <SelectItem value="pedicure">Pedicure</SelectItem>
                      <SelectItem value="facial">Facial Treatment</SelectItem>
                      <SelectItem value="massage">Massage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-semibold text-gray-900">
                    Service Location <span className="text-[#ef4444]">*</span>
                  </Label>
                  <RadioGroup
                    value={appointmentForm.location}
                    onValueChange={(value) => setAppointmentForm({ ...appointmentForm, location: value, homeAddress: value === "salon" ? "" : appointmentForm.homeAddress })}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="salon" id="salon" />
                      <Label htmlFor="salon" className="text-base cursor-pointer">Salon</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="home" id="home" />
                      <Label htmlFor="home" className="text-base cursor-pointer">Home Service</Label>
                    </div>
                  </RadioGroup>
                </div>

                {appointmentForm.location === "home" && (
                  <div className="space-y-2">
                    <Label htmlFor="appt-address" className="text-base font-semibold text-gray-900">
                      Home Address <span className="text-[#ef4444]">*</span>
                    </Label>
                    <Input
                      id="appt-address"
                      placeholder="Enter home address"
                      value={appointmentForm.homeAddress}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, homeAddress: e.target.value })}
                      className="h-12 text-base"
                      required={appointmentForm.location === "home"}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="appt-staff" className="text-base font-semibold text-gray-900">
                    Preferred Staff (Optional)
                  </Label>
                  <Select
                    value={appointmentForm.staff}
                    onValueChange={(value) => setAppointmentForm({ ...appointmentForm, staff: value })}
                  >
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Any available staff" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Available</SelectItem>
                      <SelectItem value="john">John Doe</SelectItem>
                      <SelectItem value="jane">Jane Smith</SelectItem>
                      <SelectItem value="mike">Mike Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#ef4444] hover:bg-[#dc2626] text-white text-lg py-6 h-auto font-semibold shadow-lg"
                >
                  Book Appointment
                </Button>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 shadow-2xl border border-gray-200 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Appointment Booked Successfully!</h3>
              <p className="text-lg text-gray-600 mb-6">
                Your appointment has been confirmed. The details will appear in the POS system for staff to process.
              </p>
              <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left space-y-2">
                <p className="text-sm text-gray-600"><strong className="text-gray-900">Customer:</strong> {appointmentForm.customerName}</p>
                <p className="text-sm text-gray-600"><strong className="text-gray-900">Phone:</strong> {appointmentForm.phone}</p>
                <p className="text-sm text-gray-600"><strong className="text-gray-900">Date:</strong> {new Date(appointmentForm.date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600"><strong className="text-gray-900">Time:</strong> {appointmentForm.time}</p>
                <p className="text-sm text-gray-600"><strong className="text-gray-900">Service:</strong> {appointmentForm.service}</p>
                <p className="text-sm text-gray-600"><strong className="text-gray-900">Location:</strong> {appointmentForm.location === "salon" ? "Salon" : "Home Service"}</p>
                {appointmentForm.location === "home" && (
                  <p className="text-sm text-gray-600"><strong className="text-gray-900">Address:</strong> {appointmentForm.homeAddress}</p>
                )}
              </div>
              <Button
                onClick={() => {
                  setAppointmentSubmitted(false)
                  setAppointmentForm({
                    customerName: "",
                    phone: "",
                    date: "",
                    time: "",
                    service: "",
                    location: "salon",
                    homeAddress: "",
                    staff: ""
                  })
                }}
                variant="outline"
                className="text-base"
              >
                Book Another Appointment
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
