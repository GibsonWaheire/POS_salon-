import { Link, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Monitor } from "lucide-react"
import NavigationHeader from "@/components/NavigationHeader"
import LandingFooter from "@/components/landing/LandingFooter"
import { usePageSeo } from "@/hooks/usePageSeo"

export default function Welcome() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get("session_id")

  usePageSeo("Welcome to Salonyst | You're all set", "Complete your setup. Use Salonyst online.")

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <NavigationHeader />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 max-w-2xl text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-8">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">You&apos;re all set</h1>
        <p className="text-lg text-gray-600 mb-10">
          Thanks for your purchase. Use Salonyst online in your browser—no download required.
        </p>
        <Link to="/dashboard">
          <Button size="lg" className="bg-[#ef4444] hover:bg-[#dc2626] text-white">
            <Monitor className="mr-2 h-5 w-5" />
            Use online
          </Button>
        </Link>
        {sessionId && (
          <p className="mt-8 text-sm text-gray-400">
            Payment confirmed. Session: <span className="font-mono">{sessionId.slice(0, 20)}…</span>
          </p>
        )}
      </main>
      <LandingFooter />
    </div>
  )
}
