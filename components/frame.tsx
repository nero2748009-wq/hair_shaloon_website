import { useEffect, useRef } from "react"
import "./frame.css"

/* Video lives in public/ and is served from "/".
   It should be encoded with every frame as a keyframe (see ffmpeg -g 1). */
const VIDEO_SRC = "/barber-shop.mp4"

export default function Frame() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Scroll-scrubbed hero video
  useEffect(() => {
    const wrap = wrapRef.current
    const video = videoRef.current
    if (!wrap || !video) return

    let duration = 0
    let target = 0 // video time the scroll position asks for
    let current = 0 // smoothed time we actually seek to
    let rafId = 0

    // Convert scroll position (0 to 1) into a video time
    const updateTarget = () => {
      const rect = wrap.getBoundingClientRect()
      const total = wrap.offsetHeight - window.innerHeight
      if (total <= 0 || !duration) return
      const progress = Math.max(0, Math.min(1, -rect.top / total))
      target = progress * duration
    }

    const onMeta = () => {
      duration = video.duration || 0
      updateTarget()
    }

    // iOS won't paint a frame until play() has been called once
    const primeFrame = () => {
      const p = video.play()
      if (p && p.then) p.then(() => video.pause()).catch(() => {})
    }

    // Runs every screen refresh
    const tick = () => {
      if (duration) {
        // 0.15 = how tightly we follow scroll. 1 = instant, lower = floatier
        current += (target - current) * 0.15

        // Only start a new seek when the previous one has finished.
        // Piling up seeks is what makes the video lag behind the scroll.
        if (!video.seeking && Math.abs(current - video.currentTime) > 1 / 60) {
          video.currentTime = current
        }
      }
      rafId = requestAnimationFrame(tick)
    }

    video.addEventListener("loadedmetadata", onMeta)
    video.addEventListener("loadeddata", primeFrame)
    if (video.readyState >= 1) onMeta()

    window.addEventListener("scroll", updateTarget, { passive: true })
    window.addEventListener("resize", updateTarget)
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      video.removeEventListener("loadedmetadata", onMeta)
      video.removeEventListener("loadeddata", primeFrame)
      window.removeEventListener("scroll", updateTarget)
      window.removeEventListener("resize", updateTarget)
    }
  }, [])

  return (
    <div id="top" className="hero-wrap" ref={wrapRef}>
      <div className="hero-sticky">
        <video
          ref={videoRef}
          className="hero-video"
          src={VIDEO_SRC}
          muted
          playsInline
          preload="auto"
        />

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