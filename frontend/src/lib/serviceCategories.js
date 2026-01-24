/**
 * Service categories: used for grouping/filtering services in POS and Services admin.
 * Business types: POS setting ("What kind of business are you?"), separate from categories.
 */

/** Service categories – for filtering and tagging services. */
export const SERVICE_CATEGORIES = [
  { id: "all", name: "All Services" },
  { id: "hair", name: "Hair" },
  { id: "nails", name: "Nail Salon" },
  { id: "facial", name: "Facial & Skin" },
  { id: "bridal", name: "Bridal" },
  { id: "threading", name: "Threading" },
  { id: "massage", name: "Massage" },
  { id: "spa", name: "Spa" },
  { id: "beauty", name: "Beauty" },
  { id: "general", name: "General" },
]

/** Category ids excluding "all" (for Services form dropdown). */
export const CATEGORIES_FOR_FORM = SERVICE_CATEGORIES.filter((c) => c.id !== "all")

/** Business types – POS setting only. Used in Settings / Business type dropdown. */
export const BUSINESS_TYPES = [
  { id: "massage", name: "Massage" },
  { id: "hair", name: "Hair" },
  { id: "spa", name: "Spa" },
  { id: "makeup_artists", name: "Make Up Artists" },
  { id: "beauty", name: "Beauty" },
  { id: "barber_shop", name: "Barber Shop" },
  { id: "bridal", name: "Bridal" },
  { id: "tattoo", name: "Tattoo" },
  { id: "pet_grooming", name: "Pet Grooming" },
  { id: "nail_salon", name: "Nail Salon" },
  { id: "aesthetic_skin_care", name: "Aesthetic Skin Care" },
  { id: "salon_booth_rental", name: "Salon Booth Rental" },
]

export function getCategoryName(id) {
  return SERVICE_CATEGORIES.find((c) => c.id === id)?.name ?? id
}

export function getBusinessTypeName(id) {
  return BUSINESS_TYPES.find((b) => b.id === id)?.name ?? id
}
