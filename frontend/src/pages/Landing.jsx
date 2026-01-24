import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { 
  ArrowRight,
  Calendar,
  Play,
  Star
} from "lucide-react"
import { toast } from "sonner"
import WhatsAppChat from "@/components/WhatsAppChat"

// Real Image Components - POS machines and printing focused
const HeroImage1 = () => (
  <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
    <img 
      src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop&q=80" 
      alt="POS Terminal Machine" 
      className="w-full h-auto object-cover"
      loading="lazy"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
  </div>
)

const HeroImage2 = () => (
  <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
    <img 
      src="https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&h=600&fit=crop&q=80" 
      alt="Receipt Printing" 
      className="w-full h-auto object-cover"
      loading="lazy"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
  </div>
)

const HeroImage3 = () => (
  <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
    <img 
      src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&q=80" 
      alt="Payment Terminal" 
      className="w-full h-auto object-cover"
      loading="lazy"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
  </div>
)

const HeroImage4 = () => (
  <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
    <img 
      src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=600&fit=crop&q=80" 
      alt="Salon with POS System" 
      className="w-full h-auto object-cover"
      loading="lazy"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
  </div>
)

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
  const [api, setApi] = useState(null)
  const [counters, setCounters] = useState({ salons: 0, transactions: 0, customers: 0, satisfaction: 0 })

  // Auto-play carousel
  useEffect(() => {
    if (!api) return
    
    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext()
      } else {
        api.scrollTo(0) // Loop back to start
      }
    }, 5000) // Auto-advance every 5 seconds
    
    return () => clearInterval(interval)
  }, [api])

  // Animate counters on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const targets = { salons: 500, transactions: 50000, customers: 10000, satisfaction: 98 }
            const duration = 2000
            const steps = 60
            const increment = duration / steps
            
            Object.keys(targets).forEach((key) => {
              let current = 0
              const target = targets[key]
              const stepValue = target / steps
              
              const timer = setInterval(() => {
                current += stepValue
                if (current >= target) {
                  current = target
                  clearInterval(timer)
                }
                setCounters((prev) => ({ ...prev, [key]: Math.floor(current) }))
              }, increment)
            })
          }
        })
      },
      { threshold: 0.5 }
    )
    
    const statsSection = document.getElementById('stats')
    if (statsSection) observer.observe(statsSection)
    
    return () => observer.disconnect()
  }, [])

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
      title: "Sales & POS Management",
      description: "Streamline your point of sale operations with fast, intuitive transaction processing"
    },
    {
      title: "Staff & Commission Tracking",
      description: "Manage staff schedules, track commissions, and generate professional payslips"
    },
    {
      title: "Inventory Management",
      description: "Keep track of products, monitor stock levels, and manage inventory efficiently"
    },
    {
      title: "Financial Reports & Analytics",
      description: "Comprehensive reports for sales, expenses, and financial insights"
    },
    {
      title: "Customer Management & Loyalty",
      description: "Build customer relationships with loyalty points and purchase history tracking"
    },
    {
      title: "Shift & Attendance Tracking",
      description: "Monitor staff attendance, manage shifts, and track working hours"
    }
  ]

  const benefits = [
    {
      title: "Save Time",
      description: "Automate daily tasks and focus on growing your business"
    },
    {
      title: "Increase Revenue",
      description: "Better tracking and insights help identify growth opportunities"
    },
    {
      title: "Improve Customer Relationships",
      description: "Build loyalty with customer management and personalized service"
    },
    {
      title: "Professional Reporting",
      description: "Generate detailed reports for better business decision-making"
    }
  ]

  const testimonials = [
    {
      name: "Sarah Mwangi",
      role: "Owner, Glamour Hair Salon",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80",
      rating: 5,
      text: "Salonyst has transformed how we manage our salon. The POS system is incredibly intuitive and our staff love how easy it is to process payments and track sales."
    },
    {
      name: "James Ochieng",
      role: "Manager, Elite Barbershop",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80",
      rating: 5,
      text: "The commission tracking feature is a game-changer. We can now accurately calculate and pay our staff commissions, which has improved morale significantly."
    },
    {
      name: "Amina Hassan",
      role: "Director, Beauty & Beyond Spa",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&q=80",
      rating: 5,
      text: "The reporting features give us insights we never had before. We can see exactly which services are most popular and make data-driven decisions about our business."
    }
  ]

  const stats = [
    { value: counters.salons, label: "Salons Using Salonyst", suffix: "+" },
    { value: counters.transactions, label: "Transactions Processed", suffix: "+" },
    { value: counters.customers, label: "Happy Customers", suffix: "+" },
    { value: counters.satisfaction, label: "Customer Satisfaction", suffix: "%" }
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
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Salonyst
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

      {/* Hero Section with Carousel */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text Content */}
            <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                    Smart and simple
                  </span>
                  <br />
                  <span className="text-foreground">POS software for salons</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-xl leading-relaxed">
                  Managing invoicing and payments is simple and pain-free with Salonyst's fully integrated point-of-sale and payment features. Transform your salon operations today.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Request a Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/signup")}
                  className="rounded-lg text-lg px-8 py-6 h-auto border-2 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all duration-300"
                >
                  Get Started Free
                </Button>
              </div>
            </div>

            {/* Right Side - Carousel */}
            <div className="relative animate-in fade-in slide-in-from-right duration-700">
              <Carousel
                setApi={setApi}
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full max-w-2xl mx-auto"
              >
                <CarouselContent>
                  <CarouselItem>
                    <div className="flex items-center justify-center p-2">
                      <HeroImage1 />
                    </div>
                  </CarouselItem>
                  <CarouselItem>
                    <div className="flex items-center justify-center p-2">
                      <HeroImage2 />
                    </div>
                  </CarouselItem>
                  <CarouselItem>
                    <div className="flex items-center justify-center p-2">
                      <HeroImage3 />
                    </div>
                  </CarouselItem>
                  <CarouselItem>
                    <div className="flex items-center justify-center p-2">
                      <HeroImage4 />
                    </div>
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex -left-12 bg-white/90 hover:bg-white shadow-lg" />
                <CarouselNext className="hidden md:flex -right-12 bg-white/90 hover:bg-white shadow-lg" />
              </Carousel>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="stats" className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-4xl md:text-5xl font-bold">
                  {stat.value.toLocaleString()}{stat.suffix}
                </div>
                <div className="text-blue-100 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Manage Your Salon</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you run your salon more efficiently
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="border-2 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-xl hover:-translate-y-2 duration-300"
              >
                <CardHeader>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Salonyst?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform your salon operations with our comprehensive management solution
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center border-2 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-xl hover:-translate-y-2 duration-300">
                <CardHeader>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join hundreds of satisfied salon owners who trust Salonyst
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full object-cover"
                      loading="lazy"
                    />
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <CardDescription className="text-sm">{testimonial.role}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">See Salonyst in Action</h2>
              <p className="text-xl text-muted-foreground">
                Watch how easy it is to manage your salon with our intuitive POS system
              </p>
            </div>
            <Card className="border-2 overflow-hidden shadow-2xl">
              <div className="relative aspect-video bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto cursor-pointer hover:bg-white/30 transition-all duration-300">
                    <Play className="h-10 w-10 text-white ml-1" />
                  </div>
                  <p className="text-white font-medium">Watch Demo Video</p>
                </div>
                {/* Placeholder for video - replace with actual video embed */}
              </div>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg"
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    Book a Demo
                    <Calendar className="ml-2 h-4 w-4" />
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    onClick={() => navigate("/signup")}
                  >
                    Start Free Trial
                  </Button>
                </div>
              </CardContent>
            </Card>
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
                  <div>
                    <p className="font-medium">Phone</p>
                    <a href="tel:+254726899113" className="text-muted-foreground hover:text-foreground transition-colors">
                      +254 726 899 113
                    </a>
                  </div>
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground">
                      Kasarani-Mwiki Nairobi<br />
                      Team Plaza, Room 06
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <a href="mailto:info@Mcgibsdigitalsolutions.com" className="text-muted-foreground hover:text-foreground transition-colors">
                      info@Mcgibsdigitalsolutions.com
                    </a>
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
              <div className="mb-4">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Salonyst
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Professional salon management system for modern businesses.
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>
                  <a href="tel:+254726899113" className="hover:text-foreground transition-colors">
                    +254 726 899 113
                  </a>
                </div>
                <div>
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
            <p>© {new Date().getFullYear()} Salonyst. All rights reserved.</p>
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
