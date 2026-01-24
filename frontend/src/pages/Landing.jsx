import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Scissors, 
  Users, 
  DollarSign, 
  BarChart3, 
  Package, 
  Clock, 
  ArrowRight,
  Mail,
  Phone,
  Building2,
  TrendingUp,
  Shield,
  Zap
} from "lucide-react"
import { toast } from "sonner"
import WhatsAppChat from "@/components/WhatsAppChat"

export default function Landing() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simple validation
    if (!formData.name || !formData.email) {
      toast.error("Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    // Simulate form submission
    setTimeout(() => {
      toast.success("Thank you! We'll contact you soon with a quote.")
      setFormData({
        name: "",
        email: "",
        phone: "",
        businessName: "",
        message: ""
      })
      setIsSubmitting(false)
    }, 1000)
  }

  const features = [
    {
      icon: Scissors,
      title: "Sales & POS Management",
      description: "Streamline your point of sale operations with fast, intuitive transaction processing"
    },
    {
      icon: Users,
      title: "Staff & Commission Tracking",
      description: "Manage staff schedules, track commissions, and generate professional payslips"
    },
    {
      icon: Package,
      title: "Inventory Management",
      description: "Keep track of products, monitor stock levels, and manage inventory efficiently"
    },
    {
      icon: BarChart3,
      title: "Financial Reports & Analytics",
      description: "Comprehensive reports for sales, expenses, and financial insights"
    },
    {
      icon: Users,
      title: "Customer Management & Loyalty",
      description: "Build customer relationships with loyalty points and purchase history tracking"
    },
    {
      icon: Clock,
      title: "Shift & Attendance Tracking",
      description: "Monitor staff attendance, manage shifts, and track working hours"
    }
  ]

  const benefits = [
    {
      icon: Zap,
      title: "Save Time",
      description: "Automate daily tasks and focus on growing your business"
    },
    {
      icon: TrendingUp,
      title: "Increase Revenue",
      description: "Better tracking and insights help identify growth opportunities"
    },
    {
      icon: Users,
      title: "Improve Customer Relationships",
      description: "Build loyalty with customer management and personalized service"
    },
    {
      icon: Shield,
      title: "Professional Reporting",
      description: "Generate detailed reports for better business decision-making"
    }
  ]

  const steps = [
    {
      number: "1",
      title: "Request a Quote",
      description: "Contact us with your salon details and requirements"
    },
    {
      number: "2",
      title: "Setup & Configuration",
      description: "We'll help you configure the system for your specific needs"
    },
    {
      number: "3",
      title: "Start Managing",
      description: "Begin managing your salon operations efficiently"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* WhatsApp Chat Widget */}
      <WhatsAppChat />

      {/* Header/Navigation */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Scissors className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Salon POS
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#benefits" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Benefits
              </a>
              <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
              <Button 
                variant="outline" 
                onClick={() => navigate("/login")}
                className="rounded-lg"
              >
                Login
              </Button>
              <Button 
                onClick={() => navigate("/signup")}
                className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                Get Started
              </Button>
            </nav>
            <div className="md:hidden">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-100/50 to-indigo-50 dark:from-blue-950/20 dark:via-blue-900/10 dark:to-indigo-950/20"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Complete POS Solution
              </span>
              <br />
              <span className="text-foreground">for Your Salon</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Streamline operations, manage staff, track sales, and grow your salon business with our comprehensive point of sale system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-6 h-auto"
              >
                Request a Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate("/login")}
                className="rounded-lg text-lg px-8 py-6 h-auto border-2"
              >
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Manage Your Salon</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you run your salon more efficiently
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="border-2 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Salon POS?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform your salon operations with our comprehensive management solution
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <Card key={index} className="text-center border-2">
                  <CardHeader>
                    <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="border-2 text-center h-full">
                  <CardHeader>
                    <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-white">{step.number}</span>
                    </div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Request Quote/Contact Section */}
      <section id="contact" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Request a Quote</h2>
              <p className="text-xl text-muted-foreground">
                Get in touch with us to learn more about our POS system and receive a customized quote
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Contact Information */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    Reach out to us directly
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <a href="tel:+254726899113" className="text-muted-foreground hover:text-foreground transition-colors">
                        +254 726 899 113
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-muted-foreground">
                        Kasarani-Mwiki Nairobi<br />
                        Team Plaza, Room 06
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Email</p>
                      <a href="mailto:info@Mcgibsdigitalsolutions.com" className="text-muted-foreground hover:text-foreground transition-colors">
                        info@Mcgibsdigitalsolutions.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Form */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Contact Us</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you with pricing and setup information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+254 700 000 000"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                          id="businessName"
                          placeholder="Your salon name"
                          value={formData.businessName}
                          onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message / Requirements</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us about your salon and any specific requirements..."
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        disabled={isSubmitting}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      disabled={isSubmitting}
                      size="lg"
                    >
                      {isSubmitting ? "Sending..." : "Request Quote"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Scissors className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Salon POS
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Professional salon management system for modern businesses.
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <a href="tel:+254726899113" className="hover:text-foreground transition-colors">
                    +254 726 899 113
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <Building2 className="h-4 w-4 mt-0.5" />
                  <span>Kasarani-Mwiki Nairobi<br />Team Plaza, Room 06</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#benefits" className="hover:text-foreground transition-colors">Benefits</a></li>
                <li><a href="#contact" className="hover:text-foreground transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#contact" className="hover:text-foreground transition-colors">Contact Us</a></li>
                <li><a href="#contact" className="hover:text-foreground transition-colors">Request Quote</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Account</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button onClick={() => navigate("/login")} className="hover:text-foreground transition-colors">
                    Login
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/staff-login")} className="hover:text-foreground transition-colors">
                    Staff Login
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Salon POS. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
