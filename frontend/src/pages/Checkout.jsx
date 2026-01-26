import { useState, useEffect } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowRight, Lock, Mail, User, Phone } from "lucide-react"
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
  const { isAuthenticated, login } = useAuth()
  const planSlug = (searchParams.get("plan") || "essential").toLowerCase().trim()
  const billingParam = (searchParams.get("billing") || searchParams.get("billing_interval") || "monthly").toLowerCase()
  const [billingInterval, setBillingInterval] = useState(billingParam === "annual" ? "annual" : "monthly")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "", phone: "" })

  const plan = PLAN_MAP[planSlug]

  usePageSeo(
    plan ? `Checkout – ${plan.name} | Salonyst` : "Checkout | Salonyst",
    "Complete your purchase and start using Salonyst."
  )

  useEffect(() => {
    if (!plan) navigate("/pricing", { replace: true })
  }, [plan, navigate])

  const priceLabel = plan && (billingInterval === "annual" ? `$${plan.annual} / year` : `$${plan.monthly} / month`)

  const handleSignupThenCheckout = async (e) => {
    e.preventDefault()
    setError("")
    if (!formData.name || !formData.email || !formData.password) {
      setError("Name, email, and password are required")
      return
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    setLoading(true)
    try {
      const signupRes = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || null,
        }),
      })
      const signupData = await signupRes.json()
      if (!signupRes.ok) throw new Error(signupData.error || "Signup failed")
      toast.success("Account created. Redirecting to payment...")
      const loginResult = await login(formData.email, formData.password)
      if (!loginResult.success) throw new Error("Login failed after signup")
      await createSessionAndRedirect()
    } catch (err) {
      setError(err.message || "Something went wrong")
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

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

  if (!plan) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <NavigationHeader />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-1">Choose your plan and complete payment to get started.</p>
        </div>

        <Card className="mb-8">
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

        {isAuthenticated ? (
          <Card>
            <CardHeader>
              <CardTitle>Proceed to payment</CardTitle>
              <CardDescription>You&apos;re logged in. You&apos;ll be redirected to Paystack to pay in KES (converted from USD at checkout).</CardDescription>
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
              <p className="text-sm text-gray-500 mt-4 text-center">
                <Link to={`/login?redirect=${encodeURIComponent(`/checkout?plan=${planSlug}&billing=${billingInterval}`)}`} className="text-[#ef4444] hover:underline">Sign in as a different account</Link>
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Create your account</CardTitle>
              <CardDescription>Sign up, then you&apos;ll pay via Paystack in KES (converted from USD at checkout).</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignupThenCheckout} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full name *</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+254 700 000 000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="At least 6 characters"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10"
                      disabled={loading}
                      minLength={6}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="confirm">Confirm password *</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirm"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="pl-10"
                      disabled={loading}
                    />
                  </div>
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-[#ef4444] hover:bg-[#dc2626]">
                  {loading ? "Creating account…" : "Create account & continue to payment"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
              <p className="text-sm text-gray-500 mt-4 text-center">
                Already have an account? <Link to={`/login?redirect=${encodeURIComponent(`/checkout?plan=${planSlug}&billing=${billingInterval}`)}`} className="text-[#ef4444] hover:underline">Sign in</Link>
              </p>
            </CardContent>
          </Card>
        )}

        <p className="text-center text-sm text-gray-500 mt-8">
          <Link to="/pricing" className="hover:underline">Back to pricing</Link>
        </p>
      </main>
      <LandingFooter />
    </div>
  )
}
