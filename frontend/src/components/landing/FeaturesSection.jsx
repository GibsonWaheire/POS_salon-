import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

/**
 * Features Section Component
 * @param {Object} props
 * @param {Array} props.features - Array of feature objects with title, icon, and subFeatures
 */
export default function FeaturesSection({ features }) {
  return (
    <section id="features-section" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#ef4444]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-6 mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
            Whatever Your Focus,<br />
            <span className="text-[#ef4444]">You're in the Right Place</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Streamline your daily tasks by automating operations, from scheduling appointments and managing clients to handling retail sales, overseeing staff, and processing payments.
          </p>
        </div>

        {/* Features – horizontal table */}
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-lg">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b-2 border-gray-200">
                {features.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <TableHead
                      key={index}
                      className="py-6 px-6 text-center first:pl-6 last:pr-6 bg-gray-50"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ef4444] to-red-600 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <span className="font-bold text-gray-900 text-sm">{feature.title}</span>
                      </div>
                    </TableHead>
                  )
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[0, 1, 2, 3, 4, 5, 6, 7].map((rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-gray-50/80">
                  {features.map((feature, colIndex) => (
                    <TableCell
                      key={colIndex}
                      className="py-4 px-6 text-center text-gray-700 text-sm first:pl-6 last:pr-6"
                    >
                      {feature.subFeatures[rowIndex] ?? "—"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  )
}
