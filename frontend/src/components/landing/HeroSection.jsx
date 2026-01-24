import { ChevronDown } from "lucide-react"

/**
 * Hero Section Component
 * @param {Object} props
 * @param {Object|null} props.posConfig - POS configuration object
 * @param {Function} props.onScrollToDemo - Callback to scroll to demo section
 */
export default function HeroSection({ posConfig, onScrollToDemo }) {
  return (
    <section className="relative py-20 md:py-32 bg-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>
            {posConfig ? posConfig.heroTitle : "#1 Salon Software To Grow Your Business"}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-normal">
            {posConfig ? posConfig.heroDescription : "Salonyst is an all-in-one salon management software designed to promote growth in the beauty and wellness industry. Helps to manage day-to-day operations and elevate your client experience."}
          </p>
          <div className="pt-8 flex flex-col items-center gap-4">
            <div 
              onClick={onScrollToDemo}
              className="animate-bounce cursor-pointer"
            >
              <ChevronDown className="h-8 w-8 text-gray-600 hover:text-[#ef4444] transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
