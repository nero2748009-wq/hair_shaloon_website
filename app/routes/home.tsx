import NavBar from "../../components/navbar"
import Frame from "../../components/frame"
import Footer from "../../components/footer"
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

export default function Home() {
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

      <BookingSection />

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
              className="map-link"
              href="https://www.google.com/maps/search/?api=1&query=Shital+Mahal+Chowk%2C+Hetauda-4%2C+Nepal"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Google Maps →
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}