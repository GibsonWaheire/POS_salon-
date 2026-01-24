/**
 * Statistics Section Component
 * @param {Object} props
 * @param {Array} props.stats - Array of stat objects with value, label, and suffix
 */
export default function StatsSection({ stats }) {
  return (
    <section id="stats" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-gray-900">
                {stat.value.toLocaleString()}{stat.suffix}
              </div>
              <div className="text-gray-600 text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
