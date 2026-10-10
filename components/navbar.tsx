import { useEffect, useRef, useState } from "react"
import "./navbar.css"

// One list drives the nav, so links are edited in a single place
const LINKS = [
  { href: "#services", label: "Services" },
  { href: "#book", label: "Book" },
  { href: "#course", label: "Course" },
  { href: "#visit", label: "Visit" },
]

// Must match the breakpoint in navbar.css
const DESKTOP_QUERY = "(min-width: 760px)"

export default function NavBar() {
  // Whether the mobile menu is open
  const [open, setOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const close = () => setOpen(false)

  // Close on Escape (and return focus to the toggle so keyboard users aren't lost)
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  // Close when tapping or clicking anywhere outside the nav
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [open])

  // Reset the menu if the window grows to desktop width (e.g. rotating a tablet),
  // so it doesn't come back already open when shrunk again
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY)
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false)
    }
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  return (
    <nav ref={navRef} className={`nav ${open ? "open" : ""}`} aria-label="Main">
      <div className="nav-bar">
        <a href="#top" className="logo" onClick={close}>
          <img src="/logo.png" alt="Home" />
        </a>

        {/* Hamburger button (phones only) */}
        <button
          ref={toggleRef}
          type="button"
          className="nav-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="nav-links"
          onClick={() => setOpen((o) => !o)}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>

        {/* Inline row on desktop, dropdown panel on phones */}
        <ul className="nav-links" id="nav-links">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={close}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}