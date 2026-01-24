import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Repeat, Calendar, ArrowLeft, CheckCircle2 } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function RecurringBookings() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-16">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <Repeat className="h-8 w-8 text-purple-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Recurring Bookings
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Set up repeating appointments automatically. Perfect for regular clients, weekly treatments, or monthly maintenance.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Flexible Recurring Patterns</CardTitle>
              <CardDescription>Choose how often appointments repeat</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold mb-2 text-blue-800">Daily</h4>
                  <p className="text-sm text-blue-700 mb-3">Perfect for daily treatments or check-ins</p>
                  <ul className="text-xs text-blue-600 space-y-1">
                    <li>• Daily skincare routines</li>
                    <li>• Post-surgery care</li>
                    <li>• Intensive treatment plans</li>
                  </ul>
                </div>
                <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold mb-2 text-green-800">Weekly</h4>
                  <p className="text-sm text-green-700 mb-3">Ideal for regular maintenance appointments</p>
                  <ul className="text-xs text-green-600 space-y-1">
                    <li>• Weekly haircuts</li>
                    <li>• Regular facials</li>
                    <li>• Maintenance treatments</li>
                  </ul>
                </div>
                <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold mb-2 text-purple-800">Monthly</h4>
                  <p className="text-sm text-purple-700 mb-3">Great for monthly check-ups and services</p>
                  <ul className="text-xs text-purple-600 space-y-1">
                    <li>• Monthly color touch-ups</li>
                    <li>• Regular maintenance</li>
                    <li>• Subscription services</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Series Management</CardTitle>
                <CardDescription>Control recurring appointment series</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Set start and end dates for the series</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Preview all appointments before creating</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Cancel entire series with one click</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Modify individual appointments in series</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Automatic Generation</CardTitle>
                <CardDescription>Save time with automated scheduling</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Create entire series from one template</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>All appointments linked to parent series</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Visual indicator shows recurring appointments</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Easy to identify and manage series</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Benefits</CardTitle>
              <CardDescription>Why use recurring bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Time Savings</h4>
                  <p className="text-sm text-gray-600">Set up once, appointments create automatically</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Customer Retention</h4>
                  <p className="text-sm text-gray-600">Keep regular clients coming back</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Predictable Schedule</h4>
                  <p className="text-sm text-gray-600">Plan ahead with guaranteed bookings</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Less Admin Work</h4>
                  <p className="text-sm text-gray-600">Reduce manual appointment creation</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button
              size="lg"
              onClick={() => navigate("/signup")}
              className="bg-[#ef4444] hover:bg-[#dc2626] text-white"
            >
              Start Using Recurring Bookings
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
