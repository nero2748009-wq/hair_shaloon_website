import { useRef } from "react"
import useScrollProgress from "./useScrollProgress"
import "./shopBand.css"

/* Put shop.jpeg in your public/ folder. It is served from "/shop.jpeg". */
const SHOP_SRC = "/shop.jpeg"

export default function ShopBand() {
  const ref = useRef<HTMLElement>(null)
  useScrollProgress(ref)

  return (
    <section className="shop-band" ref={ref} aria-label="Inside the shop">
      {/* The frame opens up like a curtain as the band scrolls into view */}
      <div className="shop-frame">
        <div className="shop-media">
          <img src={SHOP_SRC} alt="Inside the Moss Salon barber shop" loading="lazy" />
        </div>
      </div>

      {/* Caption: each piece arrives a beat after the one before it */}
      <div className="shop-caption">
        <div className="shop-kicker">The shop</div>

        <h2>Come in, sit down, walk out sharper.</h2>

        <span className="shop-rule" aria-hidden="true" />

        <p className="shop-sub">
          Unhurried cuts, careful beard work and a chair that's ready when you are.
        </p>

        <a href="#book" className="btn btn-gold shop-cta">
          Book your chair
        </a>
      </div>
    </section>
  )
}