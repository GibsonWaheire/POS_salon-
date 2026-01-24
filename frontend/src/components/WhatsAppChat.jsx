import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, X, Send } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const WHATSAPP_NUMBER = "254726899113"
const PREMADE_MESSAGES = [
  "Hi, I'm interested in Salonyst",
  "Can I get a demo?",
  "What's the pricing?",
  "I need more information",
  "I'm interested in other POS solutions"
]

export default function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [hasShownPopup, setHasShownPopup] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState("")

  useEffect(() => {
    // Show popup after 30 seconds if user hasn't interacted
    const popupTimer = setTimeout(() => {
      if (!hasShownPopup && !isOpen) {
        setShowPopup(true)
        setHasShownPopup(true)
      }
    }, 30000) // 30 seconds

    return () => clearTimeout(popupTimer)
  }, [hasShownPopup, isOpen])

  const handleWhatsAppClick = (message = "") => {
    const text = message || selectedMessage || "Hi, I'm interested in Salonyst"
    const encodedMessage = encodeURIComponent(text)
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
    setIsOpen(false)
    setShowPopup(false)
  }

  const handlePremadeMessage = (message) => {
    setSelectedMessage(message)
    handleWhatsAppClick(message)
  }

  return (
    <>
      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <Card className="max-w-md w-full border-2 shadow-2xl animate-in zoom-in-95">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">Looking for Something Else?</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPopup(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-muted-foreground mb-4">
                Interested in other POS solutions or digital services?
              </p>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => {
                    window.open("https://mcgibsdigitalsolutions.com", "_blank")
                    setShowPopup(false)
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
                >
                  Visit McGibs Digital Solutions
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPopup(false)}
                  className="w-full"
                >
                  No, thanks
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* WhatsApp Chat Widget */}
      <div className="fixed bottom-4 right-4 z-40">
        {/* Chat Box */}
        {isOpen && (
          <Card className="w-80 md:w-96 mb-4 border-2 shadow-2xl animate-in slide-in-from-bottom-4">
            <CardContent className="p-0">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-t-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Salonyst Support</p>
                    <p className="text-xs text-white/80">Typically replies instantly</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Premade Messages */}
              <div className="p-4 bg-muted/30 max-h-96 overflow-y-auto">
                <p className="text-sm font-medium mb-3">Quick messages:</p>
                <div className="space-y-2">
                  {PREMADE_MESSAGES.map((msg, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-2 px-3 text-sm hover:bg-blue-50 dark:hover:bg-blue-950/20"
                      onClick={() => handlePremadeMessage(msg)}
                    >
                      {msg}
                    </Button>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-muted-foreground mb-2">Or send a custom message:</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={selectedMessage}
                      onChange={(e) => setSelectedMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && selectedMessage) {
                          handleWhatsAppClick()
                        }
                      }}
                      className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleWhatsAppClick()}
                      disabled={!selectedMessage}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* WhatsApp Button */}
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all duration-300 animate-bounce hover:scale-110"
          size="lg"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <MessageCircle className="h-6 w-6 text-white" />
          )}
        </Button>

        {/* Notification Badge */}
        {!isOpen && !hasShownPopup && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 animate-pulse">
            <span className="text-xs">1</span>
          </Badge>
        )}
      </div>
    </>
  )
}
