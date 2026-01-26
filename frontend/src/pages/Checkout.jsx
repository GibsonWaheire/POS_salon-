import { useState, useEffect } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowRight } from "lucide-react"
import { toast } from "sonner"
import NavigationHeader from "@/components/NavigationHeader"
import LandingFooter from "@/components/landing/LandingFooter"
import { useAuth } from "@/context/AuthContext"
import { usePageSeo } from "@/hooks/usePageSeo"
import { getAuthHeaders } from "@/lib/api"

const PLAN_MAP = {
  essential: { name: "Essential", monthly: 29, annual: 261, tagline: "Perfect for small businesses" },
  advance: { name: "Advance", monthly: 79, annual: 711, tagline: "For growing businesses" },
  expert: { name: "Expert", monthly: 299, annual: 2691, tagline: "For enterprise businesses" },
}

import { API_BASE_URL as API_BASE } from '../config/api'

export default function Checkout() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const planSlug = (searchParams.get("plan") || sessionStorage.getItem("checkout_plan") || "essential").toLowerCase().trim()
  const billingParam = (searchParams.get("billing") || searchParams.get("billing_interval") || sessionStorage.getItem("checkout_billing") || "monthly").toLowerCase()
  const [billingInterval, setBillingInterval] = useState(billingParam === "annual" ? "annual" : "monthly")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const plan = PLAN_MAP[planSlug]

  usePageSeo(
    plan ? `Checkout – ${plan.name} | Salonyst` : "Checkout | Salonyst",
    "Complete your purchase and start using Salonyst."
  )

  // Store plan context in sessionStorage
  useEffect(() => {
    if (planSlug && billingInterval) {
      sessionStorage.setItem("checkout_plan", planSlug)
      sessionStorage.setItem("checkout_billing", billingInterval)
    }
  }, [planSlug, billingInterval])

  // Redirect if no plan selected
  useEffect(() => {
    if (!plan) {
      navigate("/pricing", { replace: true })
    }
  }, [plan, navigate])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && plan) {
      const loginUrl = `/login?plan=${planSlug}&billing=${billingInterval}&redirect=${encodeURIComponent(`/checkout?plan=${planSlug}&billing=${billingInterval}`)}`
      navigate(loginUrl, { replace: true })
    }
  }, [isAuthenticated, plan, planSlug, billingInterval, navigate])

  const priceLabel = plan && (billingInterval === "annual" ? `$${plan.annual} / year` : `$${plan.monthly} / month`)

  const createSessionAndRedirect = async () => {
    const headers = { ...getAuthHeaders(), "Content-Type": "application/json" }
    const res = await fetch(`${API_BASE}/checkout/create-session`, {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify({ plan: planSlug, billing_interval: billingInterval }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || "Could not start checkout")
    if (data.url) window.location.href = data.url
    else throw new Error("No checkout URL received")
  }

  const handleProceedToPayment = async () => {
    setError("")
    setLoading(true)
    try {
      await createSessionAndRedirect()
    } catch (err) {
      setError(err.message || "Could not start checkout")
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Don't render checkout if not authenticated or no plan
  if (!isAuthenticated || !plan) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <NavigationHeader />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-1">Review your plan and complete payment to get started.</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>{plan.tagline}</CardDescription>
            <div className="flex gap-4 mt-4">
              <button
                type="button"
                onClick={() => setBillingInterval("monthly")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${billingInterval === "monthly" ? "bg-[#ef4444] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingInterval("annual")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${billingInterval === "annual" ? "bg-[#ef4444] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                Annual (save 25%)
              </button>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{priceLabel}</p>
            <p className="text-sm text-gray-500 mt-1">Charged in KES via Paystack; converted from USD at checkout.</p>
          </CardHeader>
        </Card>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* User Information Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Review your account details before proceeding to payment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-sm text-gray-500">Name</Label>
              <p className="text-base font-medium">{user?.name || "N/A"}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-500">Email</Label>
              <p className="text-base font-medium">{user?.email || "N/A"}</p>
            </div>
            <div className="pt-2 border-t">
              <Link 
                to={`/login?redirect=${encodeURIComponent(`/checkout?plan=${planSlug}&billing=${billingInterval}`)}`} 
                className="text-sm text-[#ef4444] hover:underline"
              >
                Sign in as a different account
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Payment Card */}
        <Card>
          <CardHeader>
            <CardTitle>Proceed to payment</CardTitle>
            <CardDescription>
              You&apos;ll be redirected to Paystack to complete payment in KES (converted from USD at checkout).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleProceedToPayment}
              disabled={loading}
              className="w-full bg-[#ef4444] hover:bg-[#dc2626]"
            >
              {loading ? "Redirecting..." : "Proceed to payment"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-8">
          <Link to="/pricing" className="hover:underline">Back to pricing</Link>
        </p>
      </main>
      <LandingFooter />
    </div>
  )
}
