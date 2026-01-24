import { useMemo } from "react"
import { getPOSType, fromKebabCase } from "@/lib/posTypes"

/**
 * Custom hook to manage landing page data
 * @param {string} posType - POS type from URL params
 * @param {Object} counters - Counters state
 * @returns {Object} Landing data including POS config and stats
 */
export function useLandingData(posType, counters) {
  // Get POS configuration if posType is provided (memoized for stable reference)
  const posConfig = useMemo(() => {
    return posType ? getPOSType(fromKebabCase(posType)) : null
  }, [posType])

  // Stats configuration
  const stats = useMemo(() => {
    return [
      { 
        value: counters.salons, 
        label: posConfig 
          ? `${posConfig.pluralTerm ? posConfig.pluralTerm.charAt(0).toUpperCase() + posConfig.pluralTerm.slice(1) : posConfig.displayName + 's'} Using Salonyst` 
          : "Salons Using Salonyst", 
        suffix: "+" 
      },
      { value: counters.transactions, label: "Transactions Processed", suffix: "+" },
      { value: counters.customers, label: "Happy Customers", suffix: "+" },
      { value: counters.satisfaction, label: "Customer Satisfaction", suffix: "%" }
    ]
  }, [counters, posConfig])

  return {
    posConfig,
    stats,
  }
}
