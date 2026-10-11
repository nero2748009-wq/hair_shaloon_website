import NavBar from "../../components/navbar"
import Frame from "../../components/frame"
import Footer from "../../components/footer"
import ShopBand from "../../components/shopBand"
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

      {/* The shop photo: a breather between "what we do" and "book a chair" */}
      <ShopBand />

      <BookingSection />

      <section className="visit" id="visit">
        <div className="section-inner visit-grid">
          <div>
            <div className="kicker">Visit / Contact</div>

            <h2>Find the chair</h2>

            <div className="visit-detail">
              <div className="visit-detail-label">Address</div>
              <div className="visit-detail-value">
                Daffodil Street, Tingen City
              </div>
            </div>

            <div className="visit-detail">
              <div className="visit-detail-label">Phone</div>
              <div className="visit-detail-value">
                <a href="tel:+977 0000000000">+977 0000000000</a>
                <br />
                <a href="tel:+9779811216701">+977 0000000000</a>
              </div>
            </div>

            <div className="visit-detail">
              <div className="visit-detail-label">Email</div>
              <div className="visit-detail-value">
                <a href="mailto:abc@gmail.com">moss@gmail.com</a>
              </div>
            </div>

            <div className="visit-detail">
              <div className="visit-detail-label">Facebook</div>
              <div className="visit-detail-value">
                <a href="#" target="_blank" rel="noopener noreferrer">
                  Moss
                </a>
              </div>
            </div>
          </div>

          <div>
            <div className="map-frame">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2970.09361978615!2d12.4894761!3d41.89084365!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132f61b6fc6433df%3A0x165f79d5d2332163!2sColosseo%2C%2000184%20Roma%20RM%2C%20Italy!5e0!3m2!1sen!2snp!4v1791709369086!5m2!1sen!2snp"
                className="absolute top-0 left-0 w-full h-full border-0"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Colosseum Map"
              />
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