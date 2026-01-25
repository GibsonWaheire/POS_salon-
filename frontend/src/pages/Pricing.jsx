import React, { useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X, ArrowRight, ChevronDown, ChevronUp } from "lucide-react"
import NavigationHeader from "@/components/NavigationHeader"
import LandingFooter from "@/components/landing/LandingFooter"
import Breadcrumb from "@/components/Breadcrumb"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const PLAN_SLUG = { Essential: "essential", Advance: "advance", Expert: "expert" }

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState("monthly")
  const [searchParams] = useSearchParams()
  const upgrade = searchParams.get("upgrade") === "1"

  const plans = [
    {
      name: "Essential",
      tagline: "Perfect for small businesses",
      monthlyPrice: 29,
      annualPrice: 261, // $29/month * 12 * 0.75 (25% discount)
      features: {
        appointments: { limit: "Unlimited", unlimited: true },
        "Online Booking Management": true,
        "Appointment Calendar": true,
        "Staff Roster": true,
        "Google Calendar Integration": false,
        "Automated Service Reminders": false,
        "Social Booking Integration": false,
        "Room Calendar": false,
        "Waitlists Management": false,
        "Point Of Sale (POS)": true,
        "Expenses Management": true,
        "Cash Register": false,
        "Mobile point of sale": true,
        "Products & Package Management": true,
        "Quick Books Integration": false,
        "Paypal Integration": false,
        "Lead Management System": false,
        "Third Party Addons": false,
        "Membership Card Reader": false,
        "Wordpress Integration": false,
        "Getresponse Integration": false,
        "Mailchimp Integration": false,
        "Shopfiy Integration": false,
        "Clover Integration": false,
        "Stripe Integration": false,
        "Customer Feedback System": false,
        "Customer History Management": true,
        "Rewards /Loyality Points": false,
        "Consultation / Consent Forms": false,
        "Appointment History": false,
        "Before & After photos": false,
        "Documents Management": false,
        "Notes Management": false,
        "Data Export": false,
        "Staff Reports": true,
        "Sales Reports": true,
        "Inventory Reports": false,
        "Appointment Reports": true,
        "Multi Branch Management Reporting": false,
        "Coupons Management": true,
        "Website Booking Integration": true,
        "Gift Cards": false,
        "Membership Subscription": false,
        "SMS Campaigns": false,
        "Email Campaigns": false,
        "Memberships & Ewallet Management": true,
        "Mini Website": false,
        "Google Analytics Management": false,
        "Referral System": false,
        "Ware House Management": false,
        "Product Billing Management": true,
        "Product Consumption Reports": false,
        "Print Barcode /Label": false,
        "Purchase Orders": false,
        "Inventory Management": false,
        "Retail stock management": false,
        "Dedicated Account Manager": false,
        "Data Migration From Your Old System": true,
        "Online and call back support": true,
        "No Shows Fees Management": true,
        "Take deposits to reduce no shows": false,
        "Sell and redeem gift vouchers Cards": false,
        "Third party Payment integrations": false,
        "Third Party Sms Integration": false,
        "Twillo Integration": false,
        "Rebooking reminders": false,
        "WhatsApp Integration": false,
        "Interakt Integration": false,
        "AI Automation Marketing": false,
      }
    },
    {
      name: "Advance",
      tagline: "For growing businesses",
      monthlyPrice: 79,
      annualPrice: 711, // $79/month * 12 * 0.75 (25% discount)
      features: {
        appointments: { limit: "Unlimited", unlimited: true },
        "Online Booking Management": true,
        "Appointment Calendar": true,
        "Staff Roster": true,
        "Google Calendar Integration": false,
        "Automated Service Reminders": true,
        "Social Booking Integration": true,
        "Room Calendar": true,
        "Waitlists Management": false,
        "Point Of Sale (POS)": true,
        "Expenses Management": true,
        "Cash Register": false,
        "Mobile point of sale": true,
        "Products & Package Management": true,
        "Quick Books Integration": false,
        "Paypal Integration": true,
        "Lead Management System": true,
        "Third Party Addons": true,
        "Membership Card Reader": true,
        "Wordpress Integration": true,
        "Getresponse Integration": true,
        "Mailchimp Integration": true,
        "Shopfiy Integration": false,
        "Clover Integration": false,
        "Stripe Integration": true,
        "Customer Feedback System": true,
        "Customer History Management": true,
        "Rewards /Loyality Points": true,
        "Consultation / Consent Forms": false,
        "Appointment History": true,
        "Before & After photos": false,
        "Documents Management": false,
        "Notes Management": true,
        "Data Export": false,
        "Staff Reports": true,
        "Sales Reports": true,
        "Inventory Reports": true,
        "Appointment Reports": true,
        "Multi Branch Management Reporting": false,
        "Coupons Management": true,
        "Website Booking Integration": true,
        "Gift Cards": true,
        "Membership Subscription": true,
        "SMS Campaigns": true,
        "Email Campaigns": true,
        "Memberships & Ewallet Management": true,
        "Mini Website": false,
        "Google Analytics Management": true,
        "Referral System": false,
        "Ware House Management": true,
        "Product Billing Management": true,
        "Product Consumption Reports": true,
        "Print Barcode /Label": true,
        "Purchase Orders": true,
        "Inventory Management": true,
        "Retail stock management": true,
        "Dedicated Account Manager": false,
        "Data Migration From Your Old System": true,
        "Online and call back support": true,
        "No Shows Fees Management": true,
        "Take deposits to reduce no shows": true,
        "Sell and redeem gift vouchers Cards": true,
        "Third party Payment integrations": true,
        "Third Party Sms Integration": true,
        "Twillo Integration": false,
        "Rebooking reminders": false,
        "WhatsApp Integration": true,
        "Interakt Integration": true,
        "AI Automation Marketing": false,
      }
    },
    {
      name: "Expert",
      tagline: "For enterprise businesses",
      monthlyPrice: 299,
      annualPrice: 2691, // $299/month * 12 * 0.75 (25% discount)
      features: {
        appointments: { limit: "Unlimited", unlimited: true },
        "Online Booking Management": true,
        "Appointment Calendar": true,
        "Staff Roster": true,
        "Google Calendar Integration": true,
        "Automated Service Reminders": true,
        "Social Booking Integration": true,
        "Room Calendar": true,
        "Waitlists Management": true,
        "Point Of Sale (POS)": true,
        "Expenses Management": true,
        "Cash Register": true,
        "Mobile point of sale": true,
        "Products & Package Management": true,
        "Quick Books Integration": true,
        "Paypal Integration": true,
        "Lead Management System": true,
        "Third Party Addons": true,
        "Membership Card Reader": true,
        "Wordpress Integration": true,
        "Getresponse Integration": true,
        "Mailchimp Integration": true,
        "Shopfiy Integration": true,
        "Clover Integration": true,
        "Stripe Integration": true,
        "Customer Feedback System": true,
        "Customer History Management": true,
        "Rewards /Loyality Points": true,
        "Consultation / Consent Forms": true,
        "Appointment History": true,
        "Before & After photos": true,
        "Documents Management": true,
        "Notes Management": true,
        "Data Export": true,
        "Staff Reports": true,
        "Sales Reports": true,
        "Inventory Reports": true,
        "Appointment Reports": true,
        "Multi Branch Management Reporting": true,
        "Coupons Management": true,
        "Website Booking Integration": true,
        "Gift Cards": true,
        "Membership Subscription": true,
        "SMS Campaigns": true,
        "Email Campaigns": true,
        "Memberships & Ewallet Management": true,
        "Mini Website": true,
        "Google Analytics Management": true,
        "Referral System": true,
        "Ware House Management": true,
        "Product Billing Management": true,
        "Product Consumption Reports": true,
        "Print Barcode /Label": true,
        "Purchase Orders": true,
        "Inventory Management": true,
        "Retail stock management": true,
        "Dedicated Account Manager": true,
        "Data Migration From Your Old System": true,
        "Online and call back support": true,
        "No Shows Fees Management": true,
        "Take deposits to reduce no shows": true,
        "Sell and redeem gift vouchers Cards": true,
        "Third party Payment integrations": true,
        "Third Party Sms Integration": true,
        "Twillo Integration": true,
        "Rebooking reminders": true,
        "WhatsApp Integration": true,
        "Interakt Integration": true,
        "AI Automation Marketing": true,
      }
    }
  ]

  const featureCategories = [
    {
      name: "Appointments",
      features: [
        { key: "appointments", label: "Appointments" },
        { key: "Online Booking Management", label: "Online Booking Management" },
        { key: "Appointment Calendar", label: "Appointment Calendar" },
        { key: "Staff Roster", label: "Staff Roster" },
        { key: "Google Calendar Integration", label: "Google Calendar Integration" },
        { key: "Automated Service Reminders", label: "Automated Service Reminders" },
        { key: "Social Booking Integration", label: "Social Booking Integration" },
        { key: "Room Calendar", label: "Room Calendar" },
        { key: "Waitlists Management", label: "Waitlists Management" },
      ]
    },
    {
      name: "POS",
      features: [
        { key: "Point Of Sale (POS)", label: "Point Of Sale (POS)" },
        { key: "Expenses Management", label: "Expenses Management" },
        { key: "Cash Register", label: "Cash Register" },
        { key: "Mobile point of sale", label: "Mobile point of sale" },
        { key: "Products & Package Management", label: "Products & Package Management" },
      ]
    },
    {
      name: "Add-ons",
      features: [
        { key: "Quick Books Integration", label: "Quick Books Integration" },
        { key: "Paypal Integration", label: "Paypal Integration" },
        { key: "Lead Management System", label: "Lead Management System" },
        { key: "Third Party Addons", label: "Third Party Addons" },
        { key: "Membership Card Reader", label: "Membership Card Reader" },
        { key: "Wordpress Integration", label: "Wordpress Integration" },
        { key: "Getresponse Integration", label: "Getresponse Integration" },
        { key: "Mailchimp Integration", label: "Mailchimp Integration" },
        { key: "Shopfiy Integration", label: "Shopfiy Integration" },
        { key: "Clover Integration", label: "Clover Integration" },
        { key: "Stripe Integration", label: "Stripe Integration" },
      ]
    },
    {
      name: "Client Management",
      features: [
        { key: "Customer Feedback System", label: "Customer Feedback System" },
        { key: "Customer History Management", label: "Customer History Management" },
        { key: "Rewards /Loyality Points", label: "Rewards /Loyality Points" },
        { key: "Consultation / Consent Forms", label: "Consultation / Consent Forms" },
        { key: "Appointment History", label: "Appointment History" },
        { key: "Before & After photos", label: "Before & After photos" },
        { key: "Documents Management", label: "Documents Management" },
        { key: "Notes Management", label: "Notes Management" },
        { key: "Data Export", label: "Data Export" },
      ]
    },
    {
      name: "Business Analysis Reports",
      features: [
        { key: "Staff Reports", label: "Staff Reports" },
        { key: "Sales Reports", label: "Sales Reports" },
        { key: "Inventory Reports", label: "Inventory Reports" },
        { key: "Appointment Reports", label: "Appointment Reports" },
        { key: "Multi Branch Management Reporting", label: "Multi Branch Management Reporting" },
      ]
    },
    {
      name: "Marketing",
      features: [
        { key: "Coupons Management", label: "Coupons Management" },
        { key: "Website Booking Integration", label: "Website Booking Integration" },
        { key: "Gift Cards", label: "Gift Cards" },
        { key: "Membership Subscription", label: "Membership Subscription" },
        { key: "SMS Campaigns", label: "SMS Campaigns" },
        { key: "Email Campaigns", label: "Email Campaigns" },
        { key: "Memberships & Ewallet Management", label: "Memberships & Ewallet Management" },
        { key: "Mini Website", label: "Mini Website" },
        { key: "Google Analytics Management", label: "Google Analytics Management" },
        { key: "Referral System", label: "Referral System" },
      ]
    },
    {
      name: "Inventory",
      features: [
        { key: "Ware House Management", label: "Ware House Management" },
        { key: "Product Billing Management", label: "Product Billing Management" },
        { key: "Product Consumption Reports", label: "Product Consumption Reports" },
        { key: "Print Barcode /Label", label: "Print Barcode /Label" },
        { key: "Purchase Orders", label: "Purchase Orders" },
        { key: "Inventory Management", label: "Inventory Management" },
        { key: "Retail stock management", label: "Retail stock management" },
      ]
    },
    {
      name: "Onboarding & Support from Salonist",
      features: [
        { key: "Dedicated Account Manager", label: "Dedicated Account Manager" },
        { key: "Data Migration From Your Old System", label: "Data Migration From Your Old System" },
        { key: "Online and call back support", label: "Online and call back support" },
      ]
    },
    {
      name: "Payments and deposits",
      features: [
        { key: "No Shows Fees Management", label: "No Shows Fees Management" },
        { key: "Take deposits to reduce no shows", label: "Take deposits to reduce no shows" },
        { key: "Sell and redeem gift vouchers Cards", label: "Sell and redeem gift vouchers Cards" },
        { key: "Third party Payment integrations", label: "Third party Payment integrations" },
      ]
    },
    {
      name: "Messaging",
      features: [
        { key: "Third Party Sms Integration", label: "Third Party Sms Integration" },
        { key: "Twillo Integration", label: "Twillo Integration" },
        { key: "Rebooking reminders", label: "Rebooking reminders" },
        { key: "WhatsApp Integration", label: "WhatsApp Integration" },
        { key: "Interakt Integration", label: "Interakt Integration" },
        { key: "AI Automation Marketing", label: "AI Automation Marketing" },
      ]
    }
  ]

  const faqs = [
    {
      category: "Subscription",
      questions: [
        {
          q: "What is the cost of a Salonist?",
          a: "Salonist offers flexible pricing plans from Essential at $29/month (or $261/year) up to Expert at $299/month (or $2,691/year). Choose the plan that fits your business needs."
        },
        {
          q: "What is included in the Salonist subscription?",
          a: "Each plan includes different features. Essential and higher include unlimited appointments, POS system, staff management, inventory, reporting, and more. See our pricing table for complete details."
        },
        {
          q: "Are there any hidden fees in the subscription pricing?",
          a: "No, our pricing is transparent. The monthly or annual price you see is what you pay. There are no hidden fees, setup costs, or surprise charges."
        },
        {
          q: "Can I upgrade my subscription plan at any time?",
          a: "Yes, you can upgrade your plan at any time. When you upgrade, you'll immediately gain access to the new features, and we'll prorate the difference for the remainder of your billing cycle."
        },
        {
          q: "How do I cancel my Salonist account?",
          a: "You can cancel your subscription at any time from your account settings. Your account will remain active until the end of your current billing period, and you'll continue to have access to all features until then."
        }
      ]
    },
    {
      category: "Additional Staff Members",
      questions: [
        {
          q: "Can I set staff working hours in Salonist?",
          a: "Yes, Salonist includes staff roster management where you can set individual working hours, schedules, and availability for each staff member."
        },
        {
          q: "Can I add blocked time for staff in the calendar?",
          a: "Yes, with our slot blockers feature, you can block time slots for breaks, days off, or any unavailable periods for individual staff or all staff."
        },
        {
          q: "Do staff members have access to specific features based on their roles?",
          a: "Yes, Salonist supports role-based access control. You can assign different permissions to staff members based on their roles, ensuring they only have access to the features they need."
        }
      ]
    },
    {
      category: "Salonist Payment",
      questions: [
        {
          q: "Can I select multiple payment methods while generating invoices?",
          a: "Yes, Salonist supports multiple payment methods including cash, card, mobile payments (M-Pesa, PayPal, Stripe), and more. You can combine payment methods for a single transaction."
        },
        {
          q: "What payment gateways have in Salonist?",
          a: "Salonist integrates with multiple payment gateways including Stripe, PayPal, Clover, and supports mobile payment options like M-Pesa. Higher tier plans include more payment integration options."
        },
        {
          q: "Can I accept payment via Stripe Card Reader in Salonist?",
          a: "Yes, Stripe integration is available in Advance and Expert plans, allowing you to accept payments via Stripe card readers and terminals."
        },
        {
          q: "Can I integrate Clover with Salonist for easy payments?",
          a: "Yes, Clover integration is available in the Expert plan, providing seamless payment processing through Clover terminals."
        }
      ]
    }
  ]

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavigationHeader />
      {upgrade && (
        <div className="bg-amber-50 border-b border-amber-200 py-3 px-4 text-center text-amber-800 text-sm">
          Complete your purchase to access the app. Choose a plan below to get started.
        </div>
      )}
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[
            { label: "Home", href: "/" },
            { label: "Pricing" }
          ]} />
          <div className="max-w-4xl mx-auto text-center mt-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, Honest, Affordable Pricing
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Best Affordable Plans To Manage Your Business Efficiently
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={`text-sm font-medium ${billingCycle === "monthly" ? "text-white" : "text-gray-400"}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-gray-800 transition-transform ${
                    billingCycle === "annual" ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${billingCycle === "annual" ? "text-white" : "text-gray-400"}`}>
                Annually <span className="text-green-400">Save up to 25%</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {plans.map((plan) => (
              <Card key={plan.name} className={`${plan.name === "Essential" ? "border-2 border-red-500 shadow-lg scale-105" : ""}`}>
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-sm mt-2">{plan.tagline}</CardDescription>
                  <div className="mt-4">
                    <div className="text-4xl font-bold">
                      {formatPrice(billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {billingCycle === "monthly" ? "per month" : `per year (${formatPrice(Math.round(plan.annualPrice / 12))}/month)`}
                    </div>
                    {billingCycle === "annual" && plan.monthlyPrice > 0 && (
                      <div className="text-xs text-gray-400 mt-1">
                        Save {Math.round((1 - plan.annualPrice / (plan.monthlyPrice * 12)) * 100)}% vs monthly
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <Link to={`/checkout?plan=${PLAN_SLUG[plan.name] || "essential"}&billing=${billingCycle}`}>
                    <Button 
                      className={`w-full ${plan.name === "Essential" ? "bg-red-500 hover:bg-red-600" : ""}`}
                      variant={plan.name === "Essential" ? "default" : "outline"}
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">Pricing that Fits Every Business</h2>
          <p className="text-center text-gray-600 mb-8">Unlimited Staffers</p>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="text-left p-4 font-semibold text-gray-900 sticky left-0 bg-gray-50 z-10 min-w-[250px]">Feature</th>
                  {plans.map((plan) => (
                    <th key={plan.name} className={`text-center p-4 font-semibold ${plan.name === "Essential" ? "bg-red-50 text-red-700" : "text-gray-900"}`}>
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {featureCategories.map((category, catIndex) => (
                  <React.Fragment key={category.name}>
                    <tr className="bg-gray-100">
                      <td colSpan={4} className="p-3 font-bold text-gray-900 uppercase text-sm">
                        {category.name}
                      </td>
                    </tr>
                    {category.features.map((feature, featIndex) => (
                      <tr key={feature.key} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-4 text-sm text-gray-700 sticky left-0 bg-white z-10">
                          {feature.label}
                        </td>
                        {plans.map((plan) => {
                          const featureValue = plan.features[feature.key]
                          if (feature.key === "appointments") {
                            return (
                              <td key={plan.name} className="text-center p-4">
                                <span className="text-sm text-gray-700">{featureValue.limit}</span>
                              </td>
                            )
                          }
                          return (
                            <td key={plan.name} className="text-center p-4">
                              {featureValue ? (
                                <Check className="h-5 w-5 text-green-500 mx-auto" />
                              ) : (
                                <X className="h-5 w-5 text-gray-300 mx-auto" />
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-4">Frequently Asked Questions</h2>
          <p className="text-center text-gray-600 mb-12">
            Need clarity? Our FAQ section covers everything you need to make an informed decision.
          </p>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((category, catIndex) => (
              <div key={category.category} className="mb-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">{category.category}</h3>
                {category.questions.map((faq, faqIndex) => (
                  <AccordionItem key={faqIndex} value={`item-${catIndex}-${faqIndex}`} className="bg-white border border-gray-200 rounded-lg mb-2 px-4">
                    <AccordionTrigger className="text-left hover:no-underline">
                      <span className="font-medium text-gray-900">{faq.q}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 pt-2 pb-4">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </div>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-red-600 to-red-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Join the future of your business growth</h2>
          <p className="text-xl mb-8 text-red-100">
            Start managing your salon, spa, or beauty business more efficiently today
          </p>
          <Link to={`/checkout?plan=essential&billing=${billingCycle}`}>
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 text-lg px-8 py-6">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  )
}
