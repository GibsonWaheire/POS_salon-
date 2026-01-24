/**
 * Trusted Brands Section Component
 * @param {Object} props
 * @param {Array<string>} props.salonTypes - Array of salon type names
 * @param {Object|null} props.posConfig - POS configuration object
 */
export default function TrustedBrandsSection({ salonTypes, posConfig }) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          {posConfig ? `Trusted ${posConfig.softwareName} For` : "Trusted Salon Software For"}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {salonTypes.map((type, index) => (
            <div key={index} className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200">
              <span className="text-base font-semibold text-gray-900 text-center">{type}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
