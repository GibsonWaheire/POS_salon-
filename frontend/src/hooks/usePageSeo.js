import { useEffect } from "react"

/**
 * Set document title and meta description for the current page (SEO).
 * Ensures a meta name="description" tag exists; creates one if missing.
 */
export function usePageSeo(title, description) {
  useEffect(() => {
    if (title) document.title = title
    if (description) {
      let meta = document.querySelector('meta[name="description"]')
      if (!meta) {
        meta = document.createElement("meta")
        meta.name = "description"
        document.head.appendChild(meta)
      }
      meta.setAttribute("content", description)
    }
  }, [title, description])
}
