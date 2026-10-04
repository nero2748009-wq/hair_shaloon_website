import { useEffect, useRef } from "react"
import "./home.css"

const FRAME_COUNT = 59 // must match the number printed by `ls frames | wc -l`
const frameSrc = (i: number) =>
  `/frames/f_${String(i + 1).padStart(3, "0")}.jpg`

export default function Home() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Scroll-scrubbed hero frames
  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!wrap || !canvas || !ctx) return

    const images: HTMLImageElement[] = []
    let current = 0
    let target = 0
    let lastDrawn = -1
    let rafId = 0

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      img.src = frameSrc(i)
      if (i === 0) {
        img.onload = () => {
          canvas.width = img.naturalWidth
          canvas.height = img.naturalHeight
          ctx.drawImage(img, 0, 0)
          lastDrawn = 0
        }
      }
      images.push(img)
    }

    const updateTarget = () => {
      const rect = wrap.getBoundingClientRect()
      const total = wrap.offsetHeight - window.innerHeight
      if (total <= 0) return
      const progress = Math.max(0, Math.min(1, -rect.top / total))
      target = progress * (FRAME_COUNT - 1)
    }

    const tick = () => {
      current += (target - current) * 0.2
      const idx = Math.round(current)
      const img = images[idx]
      if (idx !== lastDrawn && img && img.complete && canvas.width) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        lastDrawn = idx
      }
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener("scroll", updateTarget, { passive: true })
    window.addEventListener("resize", updateTarget)
    updateTarget()
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("scroll", updateTarget)
      window.removeEventListener("resize", updateTarget)
    }
  }, [])

  // Mock forms
  useEffect(() => {
    const pairs: [string, string][] = [
      ["bookingForm", "bookingConfirm"],
      ["courseForm", "courseConfirm"],
    ]

    const cleanups = pairs.map(([formId, confirmId]) => {
      const form = document.getElementById(formId)
      const confirm = document.getElementById(confirmId)
      if (!form || !confirm) return () => {}

      const handler = (e: Event) => {
        e.preventDefault()
        confirm.classList.add("show")
        confirm.scrollIntoView({ behavior: "smooth", block: "nearest" })
      }
      form.addEventListener("submit", handler)
      return () => form.removeEventListener("submit", handler)
    })

    return () => cleanups.forEach((c) => c())
  }, [])

  return (
    <>
      <nav className="nav">
        <a href="#top" className="wordmark">
          Magic Mirror
        </a>

        <ul className="nav-links">
          <li>
            <a href="#services">Services</a>
          </li>
          <li>
            <a href="#book">Book</a>
          </li>
          <li>
            <a href="#course">Course</a>
          </li>
          <li>
            <a href="#visit">Visit</a>
          </li>
        </ul>
      </nav>

      <div id="top" className="hero-wrap" ref={wrapRef}>
        <div className="hero-sticky">
          <canvas ref={canvasRef} className="hero-video" />

          <div className="hero-scrim"></div>

          <div className="hero-copy">
            <div className="hero-ctas">
              <a href="#book" className="btn btn-gold">
                Book an appointment
              </a>

              <a href="#course" className="btn btn-ghost">
                Apply for the course
              </a>
            </div>
          </div>

          <div className="scroll-hint">
            <span className="line"></span>
            Scroll
          </div>
        </div>
      </div>

      <section className="services" id="services">
        <div className="section-inner">
          <div className="kicker">Services</div>

          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              marginBottom: "40px",
            }}
          >
            What we do in the chair
          </h2>

          <div className="svc-grid">
            <div className="svc-card">
              <div className="svc-num">01</div>
              <h3>Haircuts</h3>
              <p>
                Classic and modern cuts, shaped to face and hair type — fades,
                crops, and everything between.
              </p>
            </div>

            <div className="svc-card">
              <div className="svc-num">02</div>
              <h3>Beard Grooming</h3>
              <p>
                Line-ups, full shaping, and straight-razor finishing for a
                beard that holds its shape.
              </p>
            </div>

            <div className="svc-card">
              <div className="svc-num">03</div>
              <h3>Hair Highlights</h3>
              <p>
                Subtle to bold colour work, applied and toned by hand in the
                chair.
              </p>
            </div>

            <div className="svc-card">
              <div className="svc-num">04</div>
              <h3>Cleansing</h3>
              <p>
                Deep face cleansing to lift dirt and oil and leave skin
                genuinely refreshed.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="form-section" id="book">
        <div className="section-inner form-grid">
          <div className="form-head">
            <div className="kicker">Appointments</div>

            <h2>Book your chair</h2>

            <p>
              Tell us what you want done and when works for you — we'll call or
              message to confirm the slot.
            </p>

            <div className="form-note">
              This form is a working demo on this page only: it isn't connected
              to a booking calendar yet. For a confirmed slot right now, call
              or message the numbers below.
            </div>
          </div>

          <form id="bookingForm">
            <div className="field-row two">
              <div className="field">
                <label htmlFor="bk-name">Full name</label>
                <input
                  id="bk-name"
                  type="text"
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="bk-phone">Phone number</label>
                <input
                  id="bk-phone"
                  type="tel"
                  placeholder="98X-XXXXXXX"
                  required
                />
              </div>
            </div>

            <div className="field-row two">
              <div className="field">
                <label htmlFor="bk-service">Service</label>
                <select id="bk-service">
                  <option>Haircut</option>
                  <option>Beard Grooming</option>
                  <option>Hair Highlights</option>
                  <option>Cleansing</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="bk-date">Preferred date</label>
                <input id="bk-date" type="date" />
              </div>
            </div>

            <div className="field">
              <label htmlFor="bk-time">Preferred time</label>
              <input id="bk-time" type="time" />
            </div>

            <div className="field">
              <label htmlFor="bk-notes">Notes (optional)</label>
              <textarea
                id="bk-notes"
                placeholder="Anything we should know before you sit down"
              ></textarea>
            </div>

            <div className="form-footer">
              <button type="submit" className="btn btn-gold">
                Request appointment
              </button>
            </div>

            <div className="confirm-msg" id="bookingConfirm">
              Thanks! Your request has been noted on this page. Call +977
              984-5011004 to confirm your slot.
            </div>
          </form>
        </div>
      </section>

      <section
        className="form-section"
        id="course"
        style={{
          background: "var(--panel)",
          borderTop: "1px solid var(--panel-line)",
          borderBottom: "1px solid var(--panel-line)",
        }}
      >
        <div className="section-inner form-grid">
          <div className="form-head">
            <div className="kicker">Basic Barber & Beautician Course</div>

            <h2>Learn the trade</h2>

            <p>
              We run a basic barber and beautician course out of the same shop
              — hands-on, chair-side training from working barbers.
            </p>

            <div className="form-note">
              This form is a working demo on this page only: it isn't wired to
              an enrolment system yet. To apply today, contact us directly
              using the details below.
            </div>
          </div>

          <form id="courseForm">
            <div className="field-row two">
              <div className="field">
                <label htmlFor="ap-name">Full name</label>
                <input
                  id="ap-name"
                  type="text"
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="ap-phone">Phone number</label>
                <input
                  id="ap-phone"
                  type="tel"
                  placeholder="98X-XXXXXXX"
                  required
                />
              </div>
            </div>

            <div className="field-row two">
              <div className="field">
                <label htmlFor="ap-email">Email (optional)</label>
                <input
                  id="ap-email"
                  type="email"
                  placeholder="you@example.com"
                />
              </div>

              <div className="field">
                <label htmlFor="ap-course">Course interest</label>
                <select id="ap-course">
                  <option>Basic Barber Course</option>
                  <option>Basic Beautician Course</option>
                  <option>Not sure yet</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label htmlFor="ap-msg">Message (optional)</label>
              <textarea
                id="ap-msg"
                placeholder="Prior experience, preferred batch timing, questions"
              ></textarea>
            </div>

            <div className="form-footer">
              <button type="submit" className="btn btn-mint">
                Submit application
              </button>
            </div>

            <div className="confirm-msg" id="courseConfirm">
              Thanks for applying! We'll reach out on the number provided — or
              email sumantheeng58@gmail.com to follow up sooner.
            </div>
          </form>
        </div>
      </section>

      <section className="visit" id="visit">
        <div className="section-inner visit-grid">
          <div>
            <div className="kicker">Visit / Contact</div>

            <h2>Find the chair</h2>

            <div className="visit-detail">
              <div className="visit-detail-label">Address</div>
              <div className="visit-detail-value">
                4 Shital Mahal Chowk, Hetauda-4, Nepal
              </div>
            </div>

            <div className="visit-detail">
              <div className="visit-detail-label">Phone</div>
              <div className="visit-detail-value">
                <a href="tel:+9779845011004">+977 984-5011004</a>
                <br />
                <a href="tel:+9779811216701">+977 981-1216701</a>
              </div>
            </div>

            <div className="visit-detail">
              <div className="visit-detail-label">Email</div>
              <div className="visit-detail-value">
                <a href="mailto:sumantheeng58@gmail.com">
                  sumantheeng58@gmail.com
                </a>
              </div>
            </div>

            <div className="visit-detail">
              <div className="visit-detail-label">Facebook</div>
              <div className="visit-detail-value">
                <a
                  href="https://www.facebook.com/p/Magic-Mirror-61578855432208/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Magic Mirror on Facebook
                </a>
              </div>
            </div>
          </div>

          <div>
            <div className="map-frame">
              <iframe
                src="https://maps.google.com/maps?q=Shital%20Mahal%20Chowk%2C%20Hetauda%2C%20Nepal&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Magic Mirror location map"
              ></iframe>
            </div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Shital+Mahal+Chowk%2C+Hetauda-4%2C+Nepal"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                marginTop: "14px",
                fontSize: "14px",
                color: "var(--mint)",
                textDecoration: "underline",
              }}
            >
              Open in Google Maps →
            </a>
          </div>
        </div>
      </section>

      <footer>
        <div>© 2026 Magic Mirror Barber & Salon — Hetauda-4</div>

        <div>
          <a
            href="https://www.facebook.com/p/Magic-Mirror-61578855432208/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>
          &nbsp;·&nbsp; Shital Mahal Chowk, Hetauda-4
        </div>
      </footer>
    </>
  )
}