import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Calendar, ArrowLeft, CheckCircle2, FileDown } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function CalendarSyncExport() {
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
              <Download className="h-8 w-8 text-teal-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Calendar Sync & Export
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Export your appointments to external calendars or sync with Google Calendar. Keep everything in sync across platforms.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Export Formats</CardTitle>
              <CardDescription>Choose your preferred export format</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <FileDown className="h-6 w-6 text-blue-600" />
                    <h4 className="font-semibold text-blue-800">iCal Format</h4>
                  </div>
                  <p className="text-sm text-blue-700 mb-3">
                    Standard calendar format compatible with all major calendar applications
                  </p>
                  <ul className="text-xs text-blue-600 space-y-1">
                    <li>✓ Google Calendar</li>
                    <li>✓ Apple Calendar</li>
                    <li>✓ Outlook</li>
                    <li>✓ Any iCal-compatible app</li>
                  </ul>
                </div>
                <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3 mb-3">
                    <FileDown className="h-6 w-6 text-green-600" />
                    <h4 className="font-semibold text-green-800">CSV Format</h4>
                  </div>
                  <p className="text-sm text-green-700 mb-3">
                    Spreadsheet format for data analysis and reporting
                  </p>
                  <ul className="text-xs text-green-600 space-y-1">
                    <li>✓ Excel/Google Sheets</li>
                    <li>✓ Data analysis</li>
                    <li>✓ Reporting</li>
                    <li>✓ Backup purposes</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Export Features</CardTitle>
                <CardDescription>What you can export</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Export by date range</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Include all appointment details</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Customer and staff information</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Service details and notes</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sync Options</CardTitle>
                <CardDescription>Keep calendars synchronized</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>One-time export or scheduled sync</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Bidirectional sync with Google Calendar</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Automatic updates when appointments change</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Conflict resolution and merging</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Use Cases</CardTitle>
              <CardDescription>When to use calendar export</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Backup</h4>
                  <p className="text-sm text-gray-600">Keep a backup of all appointments</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Reporting</h4>
                  <p className="text-sm text-gray-600">Analyze appointment data in Excel</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Integration</h4>
                  <p className="text-sm text-gray-600">Sync with external systems</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Mobile Access</h4>
                  <p className="text-sm text-gray-600">View on phone calendar apps</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Team Sharing</h4>
                  <p className="text-sm text-gray-600">Share schedule with team</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Client Access</h4>
                  <p className="text-sm text-gray-600">Let clients sync to their calendar</p>
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
              Start Using Calendar Export
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
