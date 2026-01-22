import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/AuthContext"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await login(email, password)
      if (result.success) {
        navigate("/dashboard")
      } else {
        setError(result.error || "Invalid email or password")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const features = [
    { text: "Smart Appointment Scheduling" },
    { text: "Customer Management" },
    { text: "Seamless Payments" },
    { text: "Service Tracking" }
  ]

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Curved Wave Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50 via-blue-100/50 to-indigo-50 dark:from-blue-950/20 dark:via-blue-900/10 dark:to-indigo-950/20"></div>
        <svg className="absolute bottom-0 left-0 w-full h-64 text-blue-100 dark:text-blue-900/20" fill="currentColor" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
        <svg className="absolute top-0 right-0 w-full h-64 text-indigo-100 dark:text-indigo-900/20 rotate-180" fill="currentColor" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>

      {/* Left Side - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Animated Blue Gradient Background - Thicker/More Intense */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 via-indigo-600/35 to-purple-600/30 dark:from-blue-700/30 dark:via-indigo-700/25 dark:to-purple-700/20"></div>
        <div className="absolute inset-0 login-grid opacity-30"></div>
        
        {/* Curved Floating Orbs - More Intense */}
        <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-500/50 dark:bg-blue-700/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-indigo-500/50 dark:bg-indigo-700/30 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-purple-500/40 dark:bg-purple-700/20 rounded-full blur-2xl animate-float"></div>
        
        <div className="relative z-10 flex flex-col justify-center p-12 text-foreground">
          {/* Branding with Curved Badge */}
          <div className="mb-12">
            <div className="mb-4">
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Salon POS
              </h1>
              <p className="text-muted-foreground mt-1">Professional Management System</p>
            </div>
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              Streamline your salon operations with our comprehensive point of sale system. 
              Manage appointments, customers, services, and payments all in one place.
            </p>
          </div>

          {/* Features List with Curved Cards */}
          <div className="space-y-4">
            {features.map((feature, index) => {
              return (
                <Card
                  key={index}
                  className="rounded-3xl border-2 border-blue-200/50 dark:border-blue-800/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30 backdrop-blur-sm hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="p-5">
                    <span className="font-medium text-foreground">{feature.text}</span>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 pb-48 relative">
        <div className="absolute inset-0 login-grid opacity-10"></div>
        
        <div className="w-full max-w-md relative z-10">
          {/* Mobile Branding */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Salon POS
            </h1>
            <p className="text-sm text-muted-foreground">Professional Management System</p>
          </div>

          {/* Login Card with Curved Design */}
          <Card className="rounded-3xl border-2 border-blue-200/50 dark:border-blue-800/50 shadow-2xl backdrop-blur-md bg-gradient-to-br from-white/95 to-blue-50/95 dark:from-card/95 dark:to-blue-950/95 overflow-hidden relative">
            {/* Curved Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
            
            <CardHeader className="space-y-3 pb-4 pt-6">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-base">
                Sign in to your account to continue managing your salon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-2xl border-2 border-destructive/20 flex items-center gap-2">
                    <span className="font-medium">{error}</span>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@salon.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="h-11 text-base rounded-xl border-2 focus:border-blue-400 dark:focus:border-blue-600 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="h-11 text-base rounded-xl border-2 focus:border-blue-400 dark:focus:border-blue-600 transition-colors"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 text-base font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-600/50 transition-all duration-300 hover:-translate-y-0.5" 
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Sign In"}
                </Button>
              </form>

              {/* Divider using Separator component */}
              <div className="relative my-6">
                <Separator className="my-4" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-gradient-to-r from-white/95 to-blue-50/95 dark:from-card/95 dark:to-blue-950/95 px-3 text-xs uppercase text-muted-foreground font-medium">
                    Or
                  </span>
                </div>
              </div>

              {/* Staff Access */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Staff member?
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-xl border-2 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all"
                  onClick={() => navigate("/staff-login")}
                >
                  Staff Login
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Footer Note with Badge */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <Badge variant="outline" className="rounded-full px-3 py-1 bg-blue-50/50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
              <span className="text-xs text-muted-foreground">Secure & Protected</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Demo Details Section at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600/90 via-indigo-600/85 to-transparent dark:from-blue-900/90 dark:via-indigo-900/85 backdrop-blur-sm border-t border-blue-500/30 dark:border-blue-700/30">
        <div className="container mx-auto px-4 md:px-8 py-6">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-white mb-4 text-center">Demo Salon Credentials</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <Card className="rounded-2xl border-2 border-white/20 bg-white/10 backdrop-blur-md">
                <CardContent className="p-4">
                  <p className="text-xs text-blue-100 mb-1 font-medium">Email</p>
                  <p className="text-sm font-semibold text-white">manager@salon.com</p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-2 border-white/20 bg-white/10 backdrop-blur-md">
                <CardContent className="p-4">
                  <p className="text-xs text-blue-100 mb-1 font-medium">Password</p>
                  <p className="text-sm font-semibold text-white">demo123</p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-2 border-white/20 bg-white/10 backdrop-blur-md">
                <CardContent className="p-4">
                  <p className="text-xs text-blue-100 mb-1 font-medium">Salon</p>
                  <p className="text-sm font-semibold text-white">Premium Beauty Salon</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

