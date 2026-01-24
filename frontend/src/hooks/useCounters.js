import { useState, useEffect } from "react"

/**
 * Custom hook to manage counter animations
 * @returns {Object} Counters state
 */
export function useCounters() {
  const [counters, setCounters] = useState({ 
    salons: 0, 
    transactions: 0, 
    customers: 0, 
    satisfaction: 0 
  })

  // Animate counters on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const targets = { salons: 500, transactions: 50000, customers: 10000, satisfaction: 98 }
            const duration = 2000
            const steps = 60
            const increment = duration / steps
            
            Object.keys(targets).forEach((key) => {
              let current = 0
              const target = targets[key]
              const stepValue = target / steps
              
              const timer = setInterval(() => {
                current += stepValue
                if (current >= target) {
                  current = target
                  clearInterval(timer)
                }
                setCounters((prev) => ({ ...prev, [key]: Math.floor(current) }))
              }, increment)
            })
          }
        })
      },
      { threshold: 0.5 }
    )
    
    const statsSection = document.getElementById('stats')
    if (statsSection) observer.observe(statsSection)
    
    return () => observer.disconnect()
  }, [])

  return { counters }
}
