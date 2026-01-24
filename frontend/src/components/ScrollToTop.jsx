import { useEffect } from "react"
import { useLocation } from "react-router-dom"

/**
 * Scrolls to top of window whenever the route (pathname) changes.
 * Use inside Router so footer and other navigation links land users at the top of the new page.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
