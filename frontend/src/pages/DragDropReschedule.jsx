import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Move, Calendar, ArrowLeft, CheckCircle2 } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function DragDropReschedule() {
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Move className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Drag & Drop Reschedule
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simply drag appointments to new time slots. Intuitive calendar interface makes rescheduling effortless and fast.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Visual Calendar Interface</CardTitle>
              <CardDescription>See all appointments at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Month View:</strong> See your entire month's schedule in one view</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Week View:</strong> Focus on weekly planning and adjustments</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Day View:</strong> Detailed daily schedule management</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Agenda View:</strong> List view for quick reference</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Drag to Reschedule</CardTitle>
                <CardDescription>Move appointments with a simple drag</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Click and drag any appointment to a new time slot. The system automatically checks for conflicts and updates the schedule.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Instant visual feedback</li>
                  <li>• Automatic conflict detection</li>
                  <li>• Real-time availability checking</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resize Duration</CardTitle>
                <CardDescription>Adjust appointment length easily</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Drag the edges of appointments to extend or shorten their duration. Perfect for accommodating last-minute changes.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Extend or shorten appointments</li>
                  <li>• Visual duration indicators</li>
                  <li>• Service duration validation</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Smart Conflict Prevention</CardTitle>
              <CardDescription>Never double-book again</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold mb-2 text-green-800">Slot Availability</h4>
                  <p className="text-sm text-green-700">Checks if time slot is available</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold mb-2 text-yellow-800">Staff Conflicts</h4>
                  <p className="text-sm text-yellow-700">Prevents overlapping appointments</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold mb-2 text-blue-800">Resource Conflicts</h4>
                  <p className="text-sm text-blue-700">Ensures resources aren't double-booked</p>
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
              Try Drag & Drop Rescheduling
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
