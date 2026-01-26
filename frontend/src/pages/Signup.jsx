import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Lock, Phone, User, Chrome } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/context/AuthContext"

export default function Signup() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const planParam = (searchParams.get("plan") || "").toLowerCase()
  const billingParam = (searchParams.get("billing") || "monthly").toLowerCase()
  const plan = planParam && planParam !== "free" ? planParam : null
  const billing = billingParam === "annual" ? "annual" : "monthly"
  const { login, googleLogin } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: ""
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [signupMethod, setSignupMethod] = useState("email") // "email", "phone", "google"

  // Plan mapping for display
  const PLAN_MAP = {
    essential: { name: "Essential", monthly: 29, annual: 261 },
    advance: { name: "Advance", monthly: 79, annual: 711 },
    expert: { name: "Expert", monthly: 299, annual: 2691 },
  }

  // Store plan context in sessionStorage
  useEffect(() => {
    if (plan && billing) {
      sessionStorage.setItem("checkout_plan", plan)
      sessionStorage.setItem("checkout_billing", billing)
    }
  }, [plan, billing])

  // Helper to build checkout URL
  const getCheckoutUrl = () => {
    const planToUse = plan || sessionStorage.getItem("checkout_plan") || "essential"
    const billingToUse = billing || sessionStorage.getItem("checkout_billing") || "monthly"
    return `/checkout?plan=${planToUse}&billing=${billingToUse}`
  }

  const handleEmailSignup = async (e) => {
    e.preventDefault()
    setError("")
    
    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields")
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
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || null,
          ...(plan ? { plan } : {}),
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Signup failed")
      }
      
      if (data.success) {
        toast.success("Account created successfully! Logging you in...")
        // Auto-login after signup
        const loginResult = await login(formData.email, formData.password)
        if (loginResult.success) {
          // Redirect to checkout if plan is selected, otherwise dashboard
          if (plan) {
            navigate(getCheckoutUrl())
          } else {
            navigate("/dashboard")
          }
        } else {
          navigate("/login")
        }
      }
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.")
      toast.error(err.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  const handlePhoneSignup = async (e) => {
    e.preventDefault()
    setError("")
    
    if (!formData.name || !formData.phone || !formData.password) {
      setError("Please fill in all required fields")
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
    
    // For phone signup, we'll use phone as email temporarily
    // In production, you'd want a separate phone authentication system
    setLoading(true)
    
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name,
          email: `phone_${formData.phone.replace(/\s+/g, '')}@salonpos.local`,
          password: formData.password,
          phone: formData.phone,
          ...(plan ? { plan } : {}),
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Signup failed")
      }
      
      if (data.success) {
        toast.success("Account created successfully! Logging you in...")
        // Auto-login after signup
        const loginResult = await login(`phone_${formData.phone.replace(/\s+/g, '')}@salonpos.local`, formData.password)
        if (loginResult.success) {
          // Redirect to checkout if plan is selected, otherwise dashboard
          if (plan) {
            navigate(getCheckoutUrl())
          } else {
            navigate("/dashboard")
          }
        } else {
          navigate("/login")
        }
      }
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.")
      toast.error(err.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  // Load Google Identity Services
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.body.appendChild(script)

    script.onload = () => {
      if (window.google && import.meta.env.VITE_GOOGLE_CLIENT_ID) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleCallback,
        })
        
        // Render button if on Google tab
        if (signupMethod === 'google') {
          window.google.accounts.id.renderButton(
            document.getElementById('google-signin-button'),
            { theme: 'outline', size: 'large', width: '100%' }
          )
        }
      }
    }

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [signupMethod])

  const handleGoogleCallback = async (response) => {
    if (!response.credential) {
      toast.error("Google authentication failed")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Decode the JWT token to get user info (optional, for display)
      const result = await googleLogin(response.credential)
      if (result.success) {
        toast.success("Account created successfully!")
        // Redirect to checkout if plan is selected, otherwise dashboard
        if (plan) {
          navigate(getCheckoutUrl())
        } else {
          navigate("/dashboard")
        }
      } else {
        setError(result.error || "Google signup failed")
        toast.error(result.error || "Google signup failed")
      }
    } catch (err) {
      setError(err.message || "Failed to create account with Google")
      toast.error(err.message || "Google signup failed")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = () => {
    if (!window.google) {
      toast.error("Google sign-in is not available. Please use email or phone signup.")
      return
    }

    try {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback: show popup
          window.google.accounts.oauth2.initTokenClient({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
            scope: 'email profile',
            callback: (tokenResponse) => {
              // For OAuth2 flow, you'd need to exchange token for user info
              // For now, use the ID token from the prompt
              toast.info("Please complete Google sign-in in the popup")
            }
          }).requestAccessToken()
        }
      })
    } catch (err) {
      toast.error("Google sign-in failed. Please try again.")
    }
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50 via-blue-100/50 to-indigo-50 dark:from-blue-950/20 dark:via-blue-900/10 dark:to-indigo-950/20"></div>
        <svg className="absolute bottom-0 left-0 w-full h-64 text-blue-100 dark:text-blue-900/20" fill="currentColor" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 via-indigo-600/35 to-purple-600/30 dark:from-blue-700/30 dark:via-indigo-700/25 dark:to-purple-700/20"></div>
        <div className="relative z-10 flex flex-col justify-center p-12 text-foreground">
          <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-4">
              Salonyst
            </h1>
            <p className="text-muted-foreground mt-1 text-lg mb-4">Professional Management System</p>
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              Create your account and start managing your salon operations efficiently. 
              Join hundreds of salons already using our system.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 relative">
        <div className="w-full max-w-md relative z-10">
          {/* Mobile Branding */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Salonyst
            </h1>
            <p className="text-sm text-muted-foreground">Create Your Account</p>
          </div>

          {/* Signup Card */}
          <Card className="rounded-3xl border-2 border-blue-200/50 dark:border-blue-800/50 shadow-2xl backdrop-blur-md bg-gradient-to-br from-white/95 to-blue-50/95 dark:from-card/95 dark:to-blue-950/95 overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
            
            <CardHeader className="space-y-3 pb-4 pt-6">
              {plan && PLAN_MAP[plan] && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Selected Plan: <span className="font-bold">{PLAN_MAP[plan].name}</span>
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    {billing === "annual" 
                      ? `$${PLAN_MAP[plan].annual}/year` 
                      : `$${PLAN_MAP[plan].monthly}/month`}
                  </p>
                </div>
              )}
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Create Account
              </CardTitle>
              <CardDescription className="text-base">
                {plan ? "Sign up to continue with your selected plan" : "Sign up to start managing your salon"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Signup Method Tabs */}
              <div className="flex gap-2 mb-6 border-b">
                <button
                  onClick={() => setSignupMethod("email")}
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${
                    signupMethod === "email"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email
                </button>
                <button
                  onClick={() => setSignupMethod("phone")}
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${
                    signupMethod === "phone"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Phone className="h-4 w-4 inline mr-1" />
                  Phone
                </button>
                <button
                  onClick={() => setSignupMethod("google")}
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${
                    signupMethod === "google"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Chrome className="h-4 w-4 inline mr-1" />
                  Google
                </button>
              </div>

              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Email Signup Form */}
              {signupMethod === "email" && (
                <form onSubmit={handleEmailSignup} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        disabled={loading}
                        className="h-11 pl-10 text-base rounded-xl border-2"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        disabled={loading}
                        className="h-11 pl-10 text-base rounded-xl border-2"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+254 700 000 000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={loading}
                        className="h-11 pl-10 text-base rounded-xl border-2"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="At least 6 characters"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        disabled={loading}
                        minLength={6}
                        className="h-11 pl-10 text-base rounded-xl border-2"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                        disabled={loading}
                        className="h-11 pl-10 text-base rounded-xl border-2"
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-11 text-base font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" 
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              )}

              {/* Phone Signup Form */}
              {signupMethod === "phone" && (
                <form onSubmit={handlePhoneSignup} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name-phone">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name-phone"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        disabled={loading}
                        className="h-11 pl-10 text-base rounded-xl border-2"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone-signup">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone-signup"
                        type="tel"
                        placeholder="+254 700 000 000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        disabled={loading}
                        className="h-11 pl-10 text-base rounded-xl border-2"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-phone">Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password-phone"
                        type="password"
                        placeholder="At least 6 characters"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        disabled={loading}
                        minLength={6}
                        className="h-11 pl-10 text-base rounded-xl border-2"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword-phone">Confirm Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword-phone"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                        disabled={loading}
                        className="h-11 pl-10 text-base rounded-xl border-2"
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-11 text-base font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" 
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              )}

              {/* Google Signup */}
              {signupMethod === "google" && (
                <div className="space-y-5">
                  <div className="text-center py-8">
                    <Chrome className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                    <p className="text-muted-foreground mb-6">
                      Sign up quickly with your Google account
                    </p>
                    <div id="google-signin-button" className="flex justify-center mb-4"></div>
                    <Button
                      type="button"
                      onClick={handleGoogleSignup}
                      className="w-full h-11 text-base font-semibold rounded-xl border-2 hover:bg-muted"
                      variant="outline"
                      disabled={loading}
                    >
                      <Chrome className="h-5 w-5 mr-2" />
                      Continue with Google
                    </Button>
                    {!import.meta.env.VITE_GOOGLE_CLIENT_ID && (
                      <p className="text-xs text-muted-foreground mt-4">
                        Google sign-in is not configured. Please use email or phone signup.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="relative my-6">
                <Separator className="my-4" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-gradient-to-r from-white/95 to-blue-50/95 dark:from-card/95 dark:to-blue-950/95 px-3 text-xs uppercase text-muted-foreground font-medium">
                    Already have an account?
                  </span>
                </div>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-xl border-2"
                  onClick={() => {
                    const loginUrl = plan 
                      ? `/login?plan=${plan}&billing=${billing}&redirect=${encodeURIComponent(getCheckoutUrl())}`
                      : "/login"
                    navigate(loginUrl)
                  }}
                >
                  Sign In Instead
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Footer Note */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <Badge variant="outline" className="rounded-full px-3 py-1 bg-blue-50/50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
              <span className="text-xs text-muted-foreground">Secure & Protected</span>
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
