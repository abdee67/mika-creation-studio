/**
 * Story.jsx — "Who Are We"
 *
 * KEY FIX (desktop):
 *   The old gallery used a single fixed height (72vh) on the wrapper which
 *   clipped the center column to ~1 image.
 *   Now:
 *     • Gallery wrapper has NO fixed height — center column sets the natural height
 *     • Left / Right columns have their OWN height (90vh) + overflow:hidden box
 *       so auto-scroll is still clipped correctly without touching center
 *     • Fade overlays live on each side column independently
 */

import { useLayoutEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const LEFT_IMGS = ["img/about.webp", "img/gallery-1.webp", "img/gallery-2.webp", "img/gallery-3.webp"];
const CENTER_IMGS = ["img/contact-1.webp", "img/contact-2.webp", "img/gallery-4.webp"];
const RIGHT_IMGS = ["img/gallery-5.webp", "img/swordman.webp", "img/entrance.webp", "img/about.webp"];
const WORDS = ["FEARLESS", "MOTIVATED", "BOLD", "RELENTLESS", "CREATIVE", "HONEST", "DARING", "WILD"];

const imageEdgeFade = {
  position: "absolute",
  left: 0,
  right: 0,
  height: "20%",
  zIndex: 2,
  pointerEvents: "none",
};

const columnFade = {
  position: "absolute",
  left: 0,
  right: 0,
  height: "30%",
  zIndex: 5,
  pointerEvents: "none",
};

// ── Dot ───────────────────────────────────────────────────────────────────
const Dot = () => (
  <span style={{
    display: "inline-block", width: 5, height: 5, borderRadius: "50%",
    background: "currentColor", margin: "0 22px", verticalAlign: "middle", opacity: 0.35,
  }} />
);

// ── Text marquee stripe ────────────────────────────────────────────────────
const TextStripe = ({ dir = "rtl", speed = 7 }) => {
  const items = [...WORDS, ...WORDS, ...WORDS];
  return (
    <div style={{ overflow: "hidden", width: "100%" }}>
      <div style={{
        display: "inline-flex", alignItems: "center", whiteSpace: "nowrap",
        animation: `stripe-${dir} ${speed}s linear infinite`,
        willChange: "transform",
      }}>
        {items.map((w, i) => (
          <span key={i} style={{
            fontSize: "clamp(14px,1.7vw,20px)", fontWeight: 1000,
            letterSpacing: "0.32em", textTransform: "uppercase",
            fontFamily: "'Arial Black',sans-serif",
            color: i % 2 === 0 ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.5)",
            display: "inline-flex", alignItems: "center",
          }}>
            {w}<Dot />
          </span>
        ))}
      </div>
    </div>
  );
};

// ── Desktop vertical auto-scroll column ───────────────────────────────────
// Wraps in its OWN height+overflow box so it never bleeds outside.
// Fade overlays are absolutely positioned inside here.
const VertCol = ({ imgs, dir, speed = 7, height }) => {
  const repeated = Array.from({ length: 5 }, () => imgs).flat();
  return (
    <div style={{
      position: "relative",
      height,
      overflow: "hidden",
      background: "#000",
      isolation: "isolate",
      transform: "translateZ(0)",
      WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 11%, #000 89%, transparent 100%)",
      maskImage: "linear-gradient(to bottom, transparent 0%, #000 11%, #000 89%, transparent 100%)",
    }}>

      {/* top fade */}
      <div style={{
        ...columnFade,
        top: 0,
        background: "linear-gradient(to bottom,#000 0%,rgba(0,0,0,0.88) 28%,transparent 100%)",
      }} />
      {/* bottom fade */}
      <div style={{
        ...columnFade,
        bottom: 0,
        background: "linear-gradient(to top,#000 0%,rgba(0,0,0,0.88) 28%,transparent 100%)",
      }} />

      <div style={{
        display: "flex", flexDirection: "column", gap: 0,
        animation: `vert-${dir} ${speed}s linear infinite`,
        willChange: "transform",
        transform: "translate3d(0,0,0)",
        backfaceVisibility: "hidden",
      }}>
        {repeated.map((src, i) => (
          <div key={i} style={{
            position: "relative",
            width: "100%",
            aspectRatio: "3/4",
            overflow: "hidden",
            flexShrink: 0,
          }}>
            <img src={src} alt="" loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transform: "translateZ(0) scale(1.16)",
                backfaceVisibility: "hidden",
              }} />
            <div style={{
              ...imageEdgeFade,
              top: 0,
              background: "linear-gradient(to bottom,rgba(0,0,0,0.7),transparent)",
            }} />
            <div style={{
              ...imageEdgeFade,
              bottom: 0,
              background: "linear-gradient(to top,rgba(0,0,0,0.7),transparent)",
            }} />
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Main ───────────────────────────────────────────────────────────────────
const Story = () => {
  const sectionRef = useRef(null);
  const headRef = useRef(null);
  const galleryRef = useRef(null);
  const centerColRef = useRef(null);
  const [sideColumnHeight, setSideColumnHeight] = useState("90vh");

  useLayoutEffect(() => {
    const centerCol = centerColRef.current;
    if (!centerCol || typeof ResizeObserver === "undefined") return undefined;

    const setMeasuredHeight = () => {
      setSideColumnHeight(`${centerCol.getBoundingClientRect().height}px`);
    };

    setMeasuredHeight();

    const observer = new ResizeObserver(setMeasuredHeight);
    observer.observe(centerCol);
    window.addEventListener("resize", setMeasuredHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", setMeasuredHeight);
    };
  }, []);

  useGSAP(() => {


    // Heading slide up
    gsap.from(headRef.current, {
      y: 60, opacity: 0, duration: 1.2, ease: "expo.out",
      scrollTrigger: {
        trigger: headRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });

    // Desktop: subtle parallax on gallery wrapper
    const mm = gsap.matchMedia();
    mm.add("(min-width:1024px)", () => {
      gsap.fromTo(galleryRef.current,
        { y: 40 },
        {
          y: -40, ease: "none",
          scrollTrigger: {
            trigger: galleryRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        }
      );
    });
  }, { scope: sectionRef });

  return (
    <>
      <style>{`
        @keyframes stripe-rtl { from{transform:translateX(0)} to{transform:translateX(-33.333%)} }
        @keyframes stripe-ltr { from{transform:translateX(-33.333%)} to{transform:translateX(0)} }
        @keyframes vert-up    { from{transform:translateY(0)} to{transform:translateY(-20%)} }
        @keyframes vert-down  { from{transform:translateY(-20%)} to{transform:translateY(0)} }

        #story-gallery {
          display:grid !important;
          grid-template-columns:minmax(110px,0.74fr) minmax(280px,1fr) minmax(110px,0.74fr);
          gap:clamp(8px,1vw,18px);
          width:min(100% - 48px,1080px);
          margin:0 auto;
          align-items:start;
        }

        @media(max-width:1023px){
          #story-gallery {
            grid-template-columns:minmax(48px,0.62fr) minmax(168px,1.76fr) minmax(48px,0.62fr);
            gap:6px;
            width:calc(100% - 20px);
          }
        }

        @media(max-width:360px){
          #story-gallery {
            grid-template-columns:minmax(40px,0.56fr) minmax(152px,1.88fr) minmax(40px,0.56fr);
            gap:5px;
            width:calc(100% - 16px);
          }
        }
      `}</style>

      <section id="story" ref={sectionRef}
        style={{ background: "#000", color: "#fff" }}>

        {/* TOP STRIPE */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "24px 0", overflow: "hidden",
        }}>
          <TextStripe dir="rtl" speed={7} />
        </div>

        {/* HEADER */}
        <div ref={headRef}
          style={{ padding: "100px clamp(32px,6vw,100px) 80px" }}>

          <p style={{
            fontSize: "10px", letterSpacing: "0.5em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)", fontFamily: "monospace", marginBottom: "20px",
          }}>◈ Our Story</p>

          <h2 style={{
            fontSize: "clamp(52px,10vw,140px)", fontWeight: 900, lineHeight: 0.9,
            letterSpacing: "-0.04em", textTransform: "uppercase",
            fontFamily: "'Arial Black',sans-serif", margin: 0, maxWidth: "900px",
          }}>
            Who{" "}
            <span style={{
              WebkitTextStroke: "1.5px rgba(255,255,255,0.35)",
              color: "transparent",
            }}>Are</span>{" "}
            We
          </h2>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "48px" }}>
            <p style={{
              maxWidth: "440px", fontSize: "clamp(13px,1.3vw,16px)", lineHeight: 1.85,
              color: "rgba(255,255,255,0.45)", fontFamily: "Georgia,serif", fontStyle: "italic",
            }}>
              We are a collective of rebels — storytellers, creators, and
              visionaries who refuse to follow the expected path. Every frame we
              capture is a declaration. Every project we touch becomes a statement.
              We don&apos;t make content. We make culture.
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            DESKTOP GALLERY
            No fixed height here — center column
            determines the natural section height.
            Left/Right each manage their own height box.
        ═══════════════════════════════════════════ */}
        <div
          id="story-gallery"
          ref={galleryRef}
        >
          {/* LEFT — auto-scroll UP, self-contained 90vh clip box */}
          <VertCol imgs={LEFT_IMGS} dir="up" speed={7} height={sideColumnHeight} />

          {/* CENTER — all 3 images fully visible */}
          <div ref={centerColRef} style={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
            position: "relative",
            zIndex: 1,
            overflow: "hidden",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 8%, #000 92%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, transparent 0%, #000 8%, #000 92%, transparent 100%)",
          }}>
            <div style={{
              ...columnFade,
              top: 0,
              background: "linear-gradient(to bottom,#000 0%,rgba(0,0,0,0.82) 30%,transparent 100%)",
            }} />
            <div style={{
              ...columnFade,
              bottom: 0,
              background: "linear-gradient(to top,#000 0%,rgba(0,0,0,0.82) 30%,transparent 100%)",
            }} />
            {CENTER_IMGS.map((src, i) => (
              <div key={i} style={{
                position: "relative",
                width: "100%",
                aspectRatio: "3/4",
                overflow: "hidden",
              }}>
                <img src={src} alt="" loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    transform: "translateZ(0) scale(1.13)",
                    backfaceVisibility: "hidden",
                  }} />
                <div style={{
                  ...imageEdgeFade,
                  top: 0,
                  background: "linear-gradient(to bottom,rgba(0,0,0,0.68),transparent)",
                }} />
                <div style={{
                  ...imageEdgeFade,
                  bottom: 0,
                  background: "linear-gradient(to top,rgba(0,0,0,0.68),transparent)",
                }} />
              </div>
            ))}
          </div>

          {/* RIGHT — auto-scroll DOWN, self-contained 90vh clip box */}
          <VertCol imgs={RIGHT_IMGS} dir="down" speed={7} height={sideColumnHeight} />
        </div>

        {/* BOTTOM STRIPE */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "24px 0", overflow: "hidden", marginTop: 0,
        }}>
          <TextStripe dir="ltr" speed={7} />
        </div>

      </section>
    </>
  );
};

export default Story;
