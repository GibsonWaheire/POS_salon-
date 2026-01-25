import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Monitor } from "lucide-react"
import NavigationHeader from "@/components/NavigationHeader"
import LandingFooter from "@/components/landing/LandingFooter"
import { usePageSeo } from "@/hooks/usePageSeo"

export default function Download() {
  usePageSeo(
    "Use Salonyst | Online",
    "Use Salonyst in your browser. No download required."
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <NavigationHeader />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Use Salonyst</h1>
        <p className="text-lg text-gray-600 mb-10">
          Salonyst runs in your browser. No desktop install needed—just sign in and go.
        </p>
        <Link to="/dashboard">
          <Button size="lg" className="bg-[#ef4444] hover:bg-[#dc2626]">
            <Monitor className="mr-2 h-5 w-5" />
            Use online
          </Button>
        </Link>
        <p className="text-sm text-gray-500 mt-8">
          <Link to="/login" className="text-[#ef4444] hover:underline">Sign in</Link>
          {" · "}
          <Link to="/pricing" className="text-[#ef4444] hover:underline">Pricing</Link>
        </p>
      </main>
      <LandingFooter />
    </div>
  )
}
