import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Zap,
  Calendar,
  Users,
  Package,
  User,
  ShoppingCart,
  Plus,
  X,
  ArrowRight,
  CheckCircle2
} from "lucide-react"

const mockServices = [
  { id: 1, name: "Root Touch Up w/Carolann", duration: "30 mins", price: 70.00 },
  { id: 2, name: "Keratin Treatment", duration: "3 hrs", price: 250.00 },
  { id: 3, name: "Consultation Session", duration: "15 mins", price: 0.00 },
  { id: 4, name: "Haircut Blowout w/Rudy Ruffo", duration: "1 hr", price: 75.00 },
  { id: 5, name: "Haircut Mens w/Rudy Ruffo", duration: "30 mins", price: 40.00 },
]

const sidebarItems = [
  { id: "quick-sale", label: "Quick Sale", icon: Zap, active: true },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "staff", label: "Manage Staff", icon: Users },
  { id: "products", label: "Products", icon: Package },
  { id: "clients", label: "Clients", icon: User },
]

export default function DemoModal({ open, onOpenChange }) {
  const [selectedSidebarItem, setSelectedSidebarItem] = useState("quick-sale")
  const [selectedServices, setSelectedServices] = useState([])
  const [currentStep, setCurrentStep] = useState("service-selection") // service-selection, cart, payment, receipt
  const [selectedCategory, setSelectedCategory] = useState("Hair Service")

  const handleAddService = (service) => {
    setSelectedServices([...selectedServices, service])
    setCurrentStep("cart")
  }

  const handleRemoveService = (serviceId) => {
    setSelectedServices(selectedServices.filter(s => s.id !== serviceId))
  }

  const handleContinue = () => {
    if (currentStep === "service-selection" && selectedServices.length > 0) {
      setCurrentStep("cart")
    } else if (currentStep === "cart") {
      setCurrentStep("payment")
    } else if (currentStep === "payment") {
      setCurrentStep("receipt")
    }
  }

  const handleSidebarClick = (itemId) => {
    setSelectedSidebarItem(itemId)
    if (itemId === "quick-sale") {
      setCurrentStep("service-selection")
    }
  }

  const calculateTotal = () => {
    return selectedServices.reduce((sum, service) => sum + service.price, 0)
  }

  const resetDemo = () => {
    setSelectedServices([])
    setCurrentStep("service-selection")
    setSelectedSidebarItem("quick-sale")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-[95vw] h-[95vh] p-0 overflow-hidden bg-white sm:rounded-lg !translate-x-[-50%] !translate-y-[-50%]">
        <div className="flex flex-col md:flex-row h-full">
          {/* Sidebar */}
          <div className="hidden md:flex w-64 bg-[#1A202C] text-white flex-col">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold">Salonyst</h2>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                const isActive = selectedSidebarItem === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSidebarClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-gray-700 text-white border-l-4 border-[#ef4444]"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="border-b bg-white p-4 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Select Services</h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Panel - Service Selection */}
              <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                {currentStep === "service-selection" && (
                  <div className="space-y-6">
                    {/* Category Filter */}
                    <div className="max-w-xs">
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Hair Service">Hair Service</SelectItem>
                          <SelectItem value="Nail Service">Nail Service</SelectItem>
                          <SelectItem value="Facial Service">Facial Service</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Service List */}
                    <div className="space-y-3">
                      {mockServices.map((service) => (
                        <div
                          key={service.id}
                          className="bg-white rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow border border-gray-200"
                        >
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>{service.duration}</span>
                              <span className="font-medium text-gray-900">
                                From ${service.price.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleAddService(service)}
                            className="rounded-full bg-[#ef4444] hover:bg-[#dc2626] text-white h-10 w-10 p-0"
                          >
                            <Plus className="h-5 w-5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === "cart" && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-lg p-6">
                      <h2 className="text-xl font-bold mb-4">Selected Services</h2>
                      <div className="space-y-3">
                        {selectedServices.map((service) => (
                          <div
                            key={service.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{service.name}</p>
                              <p className="text-sm text-gray-600">${service.price.toFixed(2)}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveService(service.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 pt-4 border-t">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total:</span>
                          <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === "payment" && (
                  <div className="max-w-md mx-auto bg-white rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Payment</h2>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">Total Amount</p>
                        <p className="text-2xl font-bold">${calculateTotal().toFixed(2)}</p>
                      </div>
                      <div className="space-y-2">
                        <Button className="w-full bg-[#5E278E] hover:bg-[#4a1f6e] text-white">
                          Cash Payment
                        </Button>
                        <Button className="w-full bg-[#5E278E] hover:bg-[#4a1f6e] text-white">
                          Card Payment
                        </Button>
                        <Button className="w-full bg-[#5E278E] hover:bg-[#4a1f6e] text-white">
                          M-Pesa Payment
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === "receipt" && (
                  <div className="max-w-md mx-auto bg-white rounded-lg p-6">
                    <div className="text-center mb-6">
                      <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold mb-2">Transaction Complete!</h2>
                      <p className="text-gray-600">Receipt #RCP-{Date.now().toString().slice(-6)}</p>
                    </div>
                    <div className="space-y-3 mb-6">
                      {selectedServices.map((service) => (
                        <div key={service.id} className="flex justify-between">
                          <span>{service.name}</span>
                          <span>${service.price.toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="pt-3 border-t flex justify-between font-bold">
                        <span>Total:</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={resetDemo}
                        variant="outline"
                        className="flex-1"
                      >
                        Try Again
                      </Button>
                      <Button
                        onClick={() => onOpenChange(false)}
                        className="flex-1 bg-[#5E278E] hover:bg-[#4a1f6e] text-white"
                      >
                        Close Demo
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Panel - Cart Summary */}
              {currentStep !== "payment" && currentStep !== "receipt" && (
                <div className="hidden lg:block w-80 border-l bg-white p-6 overflow-y-auto">
                  <div className="mb-6">
                    <div className="bg-gray-100 rounded-lg p-4 mb-4">
                      <div className="w-12 h-12 bg-gray-300 rounded-full mb-2"></div>
                      <h3 className="font-semibold">Roots 212 Hair salon</h3>
                      <p className="text-sm text-gray-600">10513 SW Meeting St.4</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Service List</h3>
                    {selectedServices.length === 0 ? (
                      <div className="text-center py-12">
                        <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-sm">
                          Your Service List is Empty!
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          You haven't added anything..
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {selectedServices.map((service) => (
                          <div
                            key={service.id}
                            className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <p className="font-medium text-sm">{service.name}</p>
                            <p className="text-xs text-gray-600 mt-1">
                              {service.duration} • ${service.price.toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedServices.length > 0 && (
                      <div className="pt-4 border-t space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Sub Total</span>
                          <span className="font-medium">${calculateTotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold">
                          <span>Total</span>
                          <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                        <Button
                          onClick={handleContinue}
                          className="w-full mt-4 bg-[#5E278E] hover:bg-[#4a1f6e] text-white"
                        >
                          Continue
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
