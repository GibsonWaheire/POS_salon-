/**
 * POS Types Configuration
 * Maps POS type IDs to their display information for dynamic landing pages
 */

export const POS_TYPES = {
  barber_shop: {
    id: "barber_shop",
    displayName: "Barber Shop",
    softwareName: "Barbershop Software",
    heroTitle: "#1 Barber Shop Software To Grow Your Business",
    heroDescription: "Salonyst is an all-in-one barber shop management software designed to promote growth in the barbering industry. Helps to manage day-to-day operations and elevate your client experience.",
    industryTerm: "barbershop",
    businessTerm: "barbershop",
    pluralTerm: "barbershops",
    dropdownDescription: "Get the best solution to meet your barber shop requirements.",
  },
  massage: {
    id: "massage",
    displayName: "Massage",
    softwareName: "Massage Therapy Software",
    heroTitle: "#1 Massage Therapy Software To Grow Your Business",
    heroDescription: "Salonyst is an all-in-one massage therapy management software designed to promote growth in the wellness industry. Helps to manage day-to-day operations and elevate your client experience.",
    industryTerm: "massage therapy",
    businessTerm: "massage therapy business",
    pluralTerm: "massage therapy businesses",
    dropdownDescription: "With Salonist, Run and Manage your massage business easily.",
  },
  hair: {
    id: "hair",
    displayName: "Hair Salon",
    softwareName: "Hair Salons Software",
    heroTitle: "#1 Hair Salon Software To Grow Your Business",
    heroDescription: "Salonyst is an all-in-one hair salon management software designed to promote growth in the beauty industry. Helps to manage day-to-day operations and elevate your client experience.",
    industryTerm: "hair salon",
    businessTerm: "hair salon",
    pluralTerm: "hair salons",
    dropdownDescription: "Empower your salon business with a one-stop Hair salon software.",
  },
  spa: {
    id: "spa",
    displayName: "Spa",
    softwareName: "Spa Software",
    heroTitle: "#1 Spa Management Software To Grow Your Business",
    heroDescription: "Salonyst is an all-in-one spa management software designed to promote growth in the wellness industry. Helps to manage day-to-day operations and elevate your client experience.",
    industryTerm: "spa",
    businessTerm: "spa",
    pluralTerm: "spas",
    dropdownDescription: "Salonist reduce the stress of SPA management with an all-in-one software.",
  },
  makeup_artists: {
    id: "makeup_artists",
    displayName: "Make Up Artists",
    softwareName: "Makeup Artist Software",
    heroTitle: "#1 Makeup Artist Software To Grow Your Business",
    heroDescription: "Salonyst is an all-in-one makeup artist management software designed to promote growth in the beauty industry. Helps to manage day-to-day operations and elevate your client experience.",
    industryTerm: "makeup artist",
    businessTerm: "makeup artist business",
    pluralTerm: "makeup artists",
    dropdownDescription: "Professional makeup artist management software for your business.",
  },
  beauty: {
    id: "beauty",
    displayName: "Beauty",
    softwareName: "Beauty Salon Software",
    heroTitle: "#1 Beauty Salon Software To Grow Your Business",
    heroDescription: "Salonyst is an all-in-one beauty salon management software designed to promote growth in the beauty industry. Helps to manage day-to-day operations and elevate your client experience.",
    industryTerm: "beauty salon",
    businessTerm: "beauty salon",
    pluralTerm: "beauty salons",
    dropdownDescription: "Complete beauty salon management solution.",
  },
  bridal: {
    id: "bridal",
    displayName: "Bridal",
    softwareName: "Bridal Salon Software",
    heroTitle: "#1 Bridal Salon Software To Grow Your Business",
    heroDescription: "Salonyst is an all-in-one bridal salon management software designed to promote growth in the bridal industry. Helps to manage day-to-day operations and elevate your client experience.",
    industryTerm: "bridal salon",
    businessTerm: "bridal salon",
    pluralTerm: "bridal salons",
    dropdownDescription: "Grow your bridal salon brand with all-in-one Bridal Salon Software.",
  },
  tattoo: {
    id: "tattoo",
    displayName: "Tattoo",
    softwareName: "Tattoo Artist Software",
    heroTitle: "#1 Tattoo Studio Software To Grow Your Business",
    heroDescription: "Salonyst is an all-in-one tattoo studio management software designed to promote growth in the tattoo industry. Helps to manage day-to-day operations and elevate your client experience.",
    industryTerm: "tattoo studio",
    businessTerm: "tattoo studio",
    pluralTerm: "tattoo studios",
    dropdownDescription: "Leading Tattoo Studio software for managing your tattoo shop business.",
  },
  pet_grooming: {
    id: "pet_grooming",
    displayName: "Pet Grooming",
    softwareName: "Pet Grooming Software",
    heroTitle: "#1 Pet Grooming Software To Grow Your Business",
    heroDescription: "Salonyst is an all-in-one pet grooming management software designed to promote growth in the pet care industry. Helps to manage day-to-day operations and elevate your client experience.",
    industryTerm: "pet grooming",
    businessTerm: "pet grooming business",
    pluralTerm: "pet grooming businesses",
    dropdownDescription: "The best way to manage your pet grooming business or veterinary clinic.",
  },
  nail_salon: {
    id: "nail_salon",
    displayName: "Nail Salon",
    softwareName: "Nail Salon Software",
    heroTitle: "#1 Nail Salon Software To Grow Your Business",
    heroDescription: "Salonyst is an all-in-one nail salon management software designed to promote growth in the beauty industry. Helps to manage day-to-day operations and elevate your client experience.",
    industryTerm: "nail salon",
    businessTerm: "nail salon",
    pluralTerm: "nail salons",
    dropdownDescription: "Use Salonist to create a personalised salon experience for your customers.",
  },
  aesthetic_skin_care: {
    id: "aesthetic_skin_care",
    displayName: "Aesthetic Skin Care",
    softwareName: "Aesthetic skin clinic Software",
    heroTitle: "#1 Aesthetic Skin Care Software To Grow Your Business",
    heroDescription: "Salonyst is an all-in-one aesthetic skin care management software designed to promote growth in the skincare industry. Helps to manage day-to-day operations and elevate your client experience.",
    industryTerm: "aesthetic skin care",
    businessTerm: "aesthetic skin care business",
    pluralTerm: "aesthetic skin care businesses",
    dropdownDescription: "Focus on growth & relax your clinical activities with Salonist",
  },
  salon_booth_rental: {
    id: "salon_booth_rental",
    displayName: "Salon Booth Rental",
    softwareName: "Salon Booth Renter Software",
    heroTitle: "#1 Salon Booth Rental Software To Grow Your Business",
    heroDescription: "Salonyst is an all-in-one salon booth rental management software designed to promote growth in the beauty industry. Helps to manage day-to-day operations and elevate your client experience.",
    industryTerm: "salon booth rental",
    businessTerm: "salon booth rental business",
    pluralTerm: "salon booth rental businesses",
    dropdownDescription: "Manage all of your stations as rentals with easy to use Booth Renter Software.",
  },
}

/**
 * Get POS type configuration by ID
 * @param {string} posTypeId - The POS type ID (e.g., "barber_shop", "massage")
 * @returns {Object} POS type configuration or default barber_shop config
 */
export function getPOSType(posTypeId) {
  if (!posTypeId) return null
  // Convert kebab-case to snake_case for lookup
  const normalizedId = posTypeId.replace(/-/g, "_")
  return POS_TYPES[normalizedId] || null
}

/**
 * Get POS display name by ID
 * @param {string} posTypeId - The POS type ID
 * @returns {string} Display name or empty string
 */
export function getPOSDisplayName(posTypeId) {
  const posType = getPOSType(posTypeId)
  return posType ? posType.displayName : ""
}

/**
 * Convert POS type ID to URL-friendly kebab-case
 * @param {string} posTypeId - The POS type ID
 * @returns {string} Kebab-case version (e.g., "barber-shop")
 */
export function toKebabCase(posTypeId) {
  return posTypeId.replace(/_/g, "-")
}

/**
 * Convert kebab-case URL to POS type ID
 * @param {string} kebabCase - The kebab-case string (e.g., "barber-shop")
 * @returns {string} POS type ID (e.g., "barber_shop")
 */
export function fromKebabCase(kebabCase) {
  return kebabCase.replace(/-/g, "_")
}
