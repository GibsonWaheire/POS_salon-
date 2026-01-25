import Breadcrumb from "@/components/Breadcrumb"

/**
 * Minimal, professional page hero. Same style as Help Center.
 * Use for About Us, Why Choose Us, Success Stories, etc.
 */
export default function PageHero({ breadcrumbItems, title, description, actions }) {
  return (
    <header className="border-b border-gray-200 bg-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <Breadcrumb items={breadcrumbItems} />
        <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
          {title}
        </h1>
        {description && (
          <p className="text-gray-600 mb-6">{description}</p>
        )}
        {actions && <div className="flex flex-wrap gap-4">{actions}</div>}
      </div>
    </header>
  )
}
