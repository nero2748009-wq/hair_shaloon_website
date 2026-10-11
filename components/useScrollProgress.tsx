import { useEffect } from "react"
import type { RefObject } from "react"

/* Writes a smoothed number from 0 to 1 into the element's --p CSS variable.
   0 = the element is just entering at the bottom of the screen,
   1 = it has just left at the top.
   The CSS decides what that number animates. Works forwards and backwards. */
export default function useScrollProgress(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Reduced motion: park in a calm, fully revealed state
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--p", "0.6")
      return
    }

    let target = 0
    let shown = -1
    let rafId = 0
    let running = false

    const measure = () => {
      const vh = window.innerHeight
      const rect = el.getBoundingClientRect()
      target = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)))
    }

    const frame = () => {
      // Ease toward the target so it feels smooth instead of jumpy
      const next =
        Math.abs(target - shown) < 0.0005 ? target : shown + (target - shown) * 0.12
      if (next !== shown) {
        shown = next
        el.style.setProperty("--p", shown.toFixed(4))
      }
      if (shown !== target) {
        rafId = requestAnimationFrame(frame)
      } else {
        running = false
      }
    }

    const onScroll = () => {
      measure()
      if (!running) {
        running = true
        rafId = requestAnimationFrame(frame)
      }
    }

    // Start from the real position so there's no jump on load
    measure()
    shown = target
    el.style.setProperty("--p", shown.toFixed(4))

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [ref])
}