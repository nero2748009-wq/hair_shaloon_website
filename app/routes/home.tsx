import { useEffect, useRef, useState } from "react"
import type { CSSProperties } from "react"
import NavBar from "../../components/navbar"
import Frame from "../../components/frame"
import Footer from "../../components/footer"
import ShopBand from "../../components/shopBand"
import useScrollProgress from "../../components/useScrollProgress"
import "./home.css"
import BookingSection from "../../components/bokingSection"

const SERVICES = [
  {
    title: "Haircuts",
    text: "Classic and modern cuts, shaped to face and hair type — fades, crops, and everything between.",
  },
  {
    title: "Beard Grooming",
    text: "Line-ups, full shaping, and straight-razor finishing for a beard that holds its shape.",
  },
  {
    title: "Hair Highlights",
    text: "Subtle to bold colour work, applied and toned by hand in the chair.",
  },
  {
    title: "Cleansing",
    text: "Deep face cleansing to lift dirt and oil and leave skin genuinely refreshed.",
  },
]

/* Where the map points. Change this one line to move the pin.
   (It was showing the Colosseum before; this now follows your real address.) */
const MAP_QUERY = "Shital Mahal Chowk, Hetauda-4, Nepal"
const MAP_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`

/* Each piece of the Visit section plays during its own slice of the scroll:
   --s = where it starts (0 to 1), --l = how long it takes. */
const slice = (s: number, l: number) =>
  ({ "--s": s, "--l": l } as CSSProperties)

export default function Home() {
  const visitRef = useRef<HTMLElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapActive, setMapActive] = useState(false)

  // Drives the Visit section's scroll animation
  useScrollProgress(visitRef)

  // The map ignores the mouse/finger until you click it, so scrolling the page
  // (especially on a phone) never gets "stuck" inside the map. Click outside to release it.
  useEffect(() => {
    if (!mapActive) return

    const release = (e: PointerEvent) => {
      if (mapRef.current && !mapRef.current.contains(e.target as Node)) {
        setMapActive(false)
      }
    }
    document.addEventListener("pointerdown", release)
    return () => document.removeEventListener("pointerdown", release)
  }, [mapActive])

  return (
    <>
      <NavBar />
      <Frame />

      <section className="services" id="services">
        <div className="section-inner">
          <div className="kicker">Services</div>

          <h2>What we do in the chair</h2>

          <div className="svc-grid">
            {SERVICES.map((s, i) => (
              <div className="svc-card" key={s.title}>
                <div className="svc-num">{String(i + 1).padStart(2, "0")}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The shop photo: a breather between "what we do" and "book a chair" */}
      <ShopBand />

      <BookingSection />

      <section className="visit" id="visit" ref={visitRef}>
        <div className="section-inner visit-grid">
          <div>
            <div className="kicker">Visit / Contact</div>

            <h2>Find the chair</h2>

            <div className="visit-detail" style={slice(0.1, 0.2)}>
              <div className="visit-detail-label">Address</div>
              <div className="visit-detail-value">
                Daffodil Street, Tingen City
              </div>
            </div>

            <div className="visit-detail" style={slice(0.17, 0.2)}>
              <div className="visit-detail-label">Phone</div>
              <div className="visit-detail-value">
                <a href="tel:+977 0000000000">+977 0000000000</a>
                <br />
                <a href="tel:+9779811216701">+977 0000000000</a>
              </div>
            </div>

            <div className="visit-detail" style={slice(0.24, 0.2)}>
              <div className="visit-detail-label">Email</div>
              <div className="visit-detail-value">
                <a href="mailto:abc@gmail.com">moss@gmail.com</a>
              </div>
            </div>

            <div className="visit-detail" style={slice(0.31, 0.2)}>
              <div className="visit-detail-label">Facebook</div>
              <div className="visit-detail-value">
                <a href="#" target="_blank" rel="noopener noreferrer">
                  Moss
                </a>
              </div>
            </div>
          </div>

          {/* Map card: dark green map on top, address bar underneath */}
          <div className="map-wrap" style={slice(0.1, 0.3)}>
            <div
              ref={mapRef}
              className={`map-frame${mapActive ? " is-active" : ""}`}
              onClick={() => setMapActive(true)}
            >
              <iframe
                src={MAP_EMBED_SRC}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Map showing the shop location"
              />

              <span className="map-hint" aria-hidden="true">
                Click to explore
              </span>
            </div>

            <div className="map-bar">
              <div>
                <div className="map-bar-label">Moss Salon</div>
                <div className="map-bar-text">Shital Mahal Chowk, Hetauda-4</div>
              </div>

              <a
                className="map-link"
                href={MAP_LINK}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get directions
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}