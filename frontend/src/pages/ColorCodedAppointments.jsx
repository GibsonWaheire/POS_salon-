import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Palette, Calendar, ArrowLeft, CheckCircle2 } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function ColorCodedAppointments() {
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
              <Palette className="h-8 w-8 text-pink-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Color-Coded Appointments
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Visual organization at a glance. Use colors to categorize appointments by type, priority, or status.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Default Color System</CardTitle>
              <CardDescription>Automatic colors based on appointment status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                  <div>
                    <h4 className="font-semibold text-green-800">Scheduled</h4>
                    <p className="text-sm text-green-600">Confirmed appointments</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full"></div>
                  <div>
                    <h4 className="font-semibold text-yellow-800">Pending</h4>
                    <p className="text-sm text-yellow-600">Awaiting confirmation</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="w-8 h-8 bg-red-500 rounded-full"></div>
                  <div>
                    <h4 className="font-semibold text-red-800">Cancelled</h4>
                    <p className="text-sm text-red-600">Cancelled appointments</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                  <div>
                    <h4 className="font-semibold text-blue-800">Completed</h4>
                    <p className="text-sm text-blue-600">Finished appointments</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Custom Colors</CardTitle>
                <CardDescription>Assign colors to appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Choose from predefined color palette</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Color by service type or priority</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Visual distinction in calendar view</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Quick identification in table view</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Use Cases</CardTitle>
                <CardDescription>How to use color coding</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>VIP customers - special color</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Service types - different colors</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Urgent appointments - highlight</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Team assignments - color by staff</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Available Colors</CardTitle>
              <CardDescription>Choose from our color palette</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 gap-3">
                {['green', 'yellow', 'red', 'blue', 'orange', 'purple'].map((color) => (
                  <div key={color} className="text-center">
                    <div className={`w-12 h-12 bg-${color}-500 rounded-lg mx-auto mb-2`}></div>
                    <p className="text-xs font-medium capitalize">{color}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button
              size="lg"
              onClick={() => navigate("/signup")}
              className="bg-[#ef4444] hover:bg-[#dc2626] text-white"
            >
              Start Using Color Coding
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
