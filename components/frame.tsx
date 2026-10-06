import { useEffect, useRef } from "react"
import "./frame.css"

/* Frames live in public/frames/ as f_001.jpg, f_002.jpg ...
   FRAME_COUNT must match the number printed by: ls public/frames | wc -l */
const FRAME_COUNT = 59
const frameSrc = (i: number) =>
  `/frames/f_${String(i + 1).padStart(3, "0")}.jpg`

export default function Frame() {
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

  return (
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
  )
}
