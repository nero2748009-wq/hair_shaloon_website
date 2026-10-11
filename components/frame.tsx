import { Fragment, useEffect, useRef } from "react"
import type { CSSProperties } from "react"
import "./frame.css"

const VIDEO_SRC = "/barber-shop.mp4"

const ABOUT_HEADING = "A barber's chair, kept the old way since 2018."
const ABOUT_TEXT =
  "Moss Salon is a neighbourhood barber shop and salon at Shital Mahal Chowk in Hetauda-4. We focus on the things done well: a clean haircut, a beard shaped to your face, colour that looks natural, and a proper face cleanse to finish."

const HEADING_WORDS = ABOUT_HEADING.split(" ")
const TEXT_WORDS = ABOUT_TEXT.split(" ")

/* Each animated piece plays during its own slice of the section's scroll
   progress (0 to 1):  --s = where it starts, --l = how long it takes. */
const slice = (s: number, l: number) =>
  ({ "--s": s, "--l": l } as CSSProperties)

export default function Frame() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const aboutRef = useRef<HTMLElement>(null)

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

  // About section: animation follows the scroll position, forwards AND backwards.
  // We only publish one number (--p, 0 to 1) and the CSS does the rest.
  useEffect(() => {
    const section = aboutRef.current
    if (!section) return

    // Reduced motion: show everything in its final state
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      section.style.setProperty("--p", "1")
      return
    }

    let target = 0 // progress the scroll position asks for
    let shown = -1 // progress currently written to the page
    let rafId = 0
    let running = false

    const measure = () => {
      const vh = window.innerHeight
      const rect = section.getBoundingClientRect()

      // Starts when the section's top is 85% down the screen,
      // finishes when its bottom reaches 80% down (so all the text is readable).
      const start = vh * 0.85
      const distance = Math.max(start - (vh * 0.8 - rect.height), vh * 0.4)
      target = Math.max(0, Math.min(1, (start - rect.top) / distance))
    }

    const frame = () => {
      // Ease toward the target so it feels smooth instead of jumpy
      const next =
        Math.abs(target - shown) < 0.0005 ? target : shown + (target - shown) * 0.14
      if (next !== shown) {
        shown = next
        section.style.setProperty("--p", shown.toFixed(4))
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

    shown = 0
    section.style.setProperty("--p", "0")
    onScroll()

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return (
    <>
      {/* The tall wrapper only holds the sticky video. It sets the scroll distance. */}
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
            <div className="hero-eyebrow">Haircuts &amp; Beards · Est. 2018</div>
            <h1>Too clean to be stressed.</h1>
            <p className="hero-sub">
              Watch the work speak for itself. Book when you're ready.
            </p>

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

      {/* About lives OUTSIDE the 400vh wrapper so it starts after the video
          finishes instead of overlapping and spilling out of it */}
      <section ref={aboutRef} className="about-section">
        <div className="section-inner about">
          {/* Logo: unveiled by a wipe that follows the scroll */}
          <div className="about-media" style={slice(0, 0.45)}>
            <img src="/4.png" alt="Moss Salon logo" />
          </div>

          <div className="about-body">
            <div className="kicker about-kicker" style={slice(0.08, 0.2)}>
              About the shop
            </div>

            {/* Heading: each word rises out of its own mask */}
            <h2 aria-label={ABOUT_HEADING}>
              {HEADING_WORDS.map((word, i) => (
                <Fragment key={i}>
                  <span className="word" aria-hidden="true">
                    <span className="word-inner" style={slice(0.12 + i * 0.05, 0.22)}>
                      {word}
                    </span>
                  </span>{" "}
                </Fragment>
              ))}
            </h2>

            {/* Thin gold line that draws itself between heading and text */}
            <span className="about-rule" style={slice(0.5, 0.2)} aria-hidden="true" />

            {/* Paragraph: words light up one by one as you read down the page */}
            <p aria-label={ABOUT_TEXT}>
              {TEXT_WORDS.map((word, i) => (
                <Fragment key={i}>
                  <span
                    className="about-word"
                    aria-hidden="true"
                    style={slice(0.5 + (i / TEXT_WORDS.length) * 0.4, 0.12)}
                  >
                    {word}
                  </span>{" "}
                </Fragment>
              ))}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}