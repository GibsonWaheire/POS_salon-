import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw, Calendar, ArrowLeft, CheckCircle2 } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function EasyRescheduling() {
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
              <RefreshCw className="h-8 w-8 text-orange-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Easy Rescheduling
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Reschedule appointments quickly and easily. Multiple methods to accommodate any situation.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Multiple Rescheduling Methods</CardTitle>
              <CardDescription>Choose the method that works best for you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold mb-3 text-blue-800 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Drag & Drop
                  </h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Simply drag appointments to new time slots in calendar view
                  </p>
                  <ul className="text-xs text-blue-600 space-y-1">
                    <li>• Visual and intuitive</li>
                    <li>• See conflicts immediately</li>
                    <li>• Quick adjustments</li>
                  </ul>
                </div>
                <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold mb-3 text-green-800 flex items-center gap-2">
                    <RefreshCw className="h-5 w-5" />
                    Reschedule Button
                  </h4>
                  <p className="text-sm text-green-700 mb-3">
                    Click reschedule button and select new date/time
                  </p>
                  <ul className="text-xs text-green-600 space-y-1">
                    <li>• Precise time selection</li>
                    <li>• Date picker interface</li>
                    <li>• Available in table view</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Fast rescheduling options</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Reschedule from appointment details</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Bulk reschedule multiple appointments</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Reschedule entire recurring series</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Quick time slot suggestions</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Smart Features</CardTitle>
                <CardDescription>Intelligent rescheduling assistance</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Automatic conflict detection</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Suggest available time slots</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Notify customer automatically</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Update all related records</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Benefits</CardTitle>
              <CardDescription>Why easy rescheduling matters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Time Savings</h4>
                  <p className="text-sm text-gray-600">Reschedule in seconds, not minutes</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Customer Satisfaction</h4>
                  <p className="text-sm text-gray-600">Accommodate changes quickly</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Reduced Errors</h4>
                  <p className="text-sm text-gray-600">Automatic conflict prevention</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Flexibility</h4>
                  <p className="text-sm text-gray-600">Multiple ways to reschedule</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Better Planning</h4>
                  <p className="text-sm text-gray-600">See availability instantly</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Automation</h4>
                  <p className="text-sm text-gray-600">Automatic notifications sent</p>
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
              Start Using Easy Rescheduling
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
