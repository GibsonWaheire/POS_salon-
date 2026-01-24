import { useMemo } from "react"

/**
 * Custom hook for POS text replacement logic
 * @param {Object} posConfig - POS configuration object
 * @returns {Function} Text replacement function
 */
export function usePOSTextReplacement(posConfig) {
  const replacePOSText = useMemo(() => {
    return (text, defaultText = null) => {
      if (!posConfig) return defaultText || text
      
      // Replace common patterns
      let replaced = text
        .replace(/#1 Salon Software To Grow Your Business/g, posConfig.heroTitle)
        .replace(/Salonyst is an all-in-one salon management software/g, posConfig.heroDescription.split('.')[0] + '.')
        .replace(/salon software/gi, posConfig.softwareName.toLowerCase())
        .replace(/Salon Software/g, posConfig.softwareName)
        .replace(/salon staff members/gi, `${posConfig.industryTerm} staff members`)
        .replace(/salon services/gi, `${posConfig.industryTerm} services`)
        .replace(/Salons Using Salonyst/g, `${posConfig.pluralTerm ? posConfig.pluralTerm.charAt(0).toUpperCase() + posConfig.pluralTerm.slice(1) : posConfig.displayName + 's'} Using Salonyst`)
        .replace(/Trusted Salon Software For/g, `Trusted ${posConfig.softwareName} For`)
        .replace(/Your salon name/gi, `Your ${posConfig.businessTerm} name`)
        .replace(/your salon/gi, `your ${posConfig.businessTerm}`)
        .replace(/Tell us about your salon/gi, `Tell us about your ${posConfig.businessTerm}`)
      
      return replaced
    }
  }, [posConfig])

  return replacePOSText
}
