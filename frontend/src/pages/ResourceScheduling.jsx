import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Box, Calendar, ArrowLeft, CheckCircle2 } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function ResourceScheduling() {
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <Box className="h-8 w-8 text-indigo-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Resource Scheduling
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Manage rooms, equipment, and other resources. Ensure optimal utilization and prevent double-booking of resources.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Resource Types</CardTitle>
              <CardDescription>Manage different types of resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Box className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Rooms</h4>
                      <p className="text-sm text-gray-600">Massage rooms, treatment rooms, consultation rooms</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Box className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Equipment</h4>
                      <p className="text-sm text-gray-600">Tanning beds, steam rooms, specialized equipment</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Box className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Vehicles</h4>
                      <p className="text-sm text-gray-600">Mobile service vehicles, delivery vehicles</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Box className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Other</h4>
                      <p className="text-sm text-gray-600">Any other schedulable resource</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Resource Management</CardTitle>
                <CardDescription>Create and manage resources</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Add unlimited resources</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Organize by type (room, equipment, etc.)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Activate or deactivate resources</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>See resource usage in calendar</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conflict Prevention</CardTitle>
                <CardDescription>Never double-book resources</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Automatic conflict detection</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Real-time availability checking</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Visual indicators in calendar</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Resource assignment tracking</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Benefits</CardTitle>
              <CardDescription>Why resource scheduling matters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2 text-blue-800">Optimize Usage</h4>
                  <p className="text-sm text-blue-700">Maximize resource utilization</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold mb-2 text-green-800">Prevent Conflicts</h4>
                  <p className="text-sm text-green-700">No double-booking of resources</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold mb-2 text-purple-800">Better Planning</h4>
                  <p className="text-sm text-purple-700">See resource availability at a glance</p>
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
              Start Using Resource Scheduling
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
