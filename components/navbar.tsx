import { useEffect, useState } from "react"
import "./navbar.css"

// One list drives the nav, so links are edited in a single place
const LINKS = [
  { href: "#services", label: "Services" },
  { href: "#book", label: "Book" },
  { href: "#course", label: "Course" },
  { href: "#visit", label: "Visit" },
]

export default function NavBar() {
  // Whether the mobile menu is open
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  // Close the menu when Escape is pressed
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <nav className={`nav ${open ? "open" : ""}`}>
      <div className="nav-bar">
        <a href="#top" className="wordmark" onClick={close}>
          Magic Mirror
        </a>

        {/* Hamburger button (phones only) */}
        <button
          type="button"
          className="nav-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="nav-links"
          onClick={() => setOpen((o) => !o)}
        >
          <span></span>
          <span></span>
          <span></span>
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