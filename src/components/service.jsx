/**
 * ServiceCards.jsx
 *
 * DESKTOP / TABLET  (≥769px)
 *   Full-width, full-height cards — one fills the entire screen.
 *   Scroll DOWN → next card slides in from the RIGHT, covers current.
 *   Scroll UP   → current card slides back OUT to the RIGHT, revealing
 *                 the card beneath it.
 *   One card per scroll step. Snaps cleanly between steps.
 *   onUpdate + queue (same approach as the mobile fix).
 *
 * MOBILE  (<768px)
 *   CARTA deck — unchanged logic.
 *   FIX: "Scroll to explore" hint moved INSIDE the wrapper as an absolute
 *   element at z-index 9999 so it is always visible above the card stack
 *   on small phones (iPhone SE, Galaxy S8, etc.).
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { assetPath } from "../utils/assetPath";

gsap.registerPlugin(ScrollTrigger);

// ── Cards ─────────────────────────────────────────────────────────────────
const CARDS = [
  {
    id: "film",    title: "Film & Video",     icon: "🎬", num: "01",
    img: "img/video.webp", color: "#fff",
    services: ["Campaign Film","Branded Content","Social Content","Documentary","Motion Graphics"],
  },
  {
    id: "photo",   title: "Photography",      icon: "📷", num: "02",
    img: "img/photography  app.webp", color: "#fff",
    services: ["Editorial","Product","Portrait","Event Coverage","Art Direction"],
  },
  {
    id: "brand",   title: "Brand Identity",   icon: "✦",  num: "03",
    img: "img/brand.webp", color: "#fff",
    services: ["Strategy","Visual Identity","Art Direction","Copywriting","DTP"],
  },
  {
    id: "social",  title: "Social Media",     icon: "◈",  num: "04",
    img: "img/smm.webp", color: "#fff",
    services: ["Strategy","Content Creation","TikTok / Reels","Community Mgmt","Influencer"],
  },
  {
    id: "events",  title: "Website & system", icon: "⚡", num: "05",
    img: "img/dev.webp", color: "#fff",
    services: ["Landing page","E-commerce sites","Mobile Applications","Business Websites",],
  },
  {
    id: "motion",  title: "Motion & Post",    icon: "∞",  num: "06",
    img: "img/color_grading.webp", color: "#fff",
    services: ["VFX","Colour Grading","Sound Design","Animation","Titles"],
  },
];

const TOTAL      = CARDS.length;
const PEEK       = 20; // Reduced to fit small screens
const SCALE_STEP = 0.04;

// ── Mobile carta helpers ─────────────────────────────────────────────────
function stackPos(pos) {
  const centerOffset = ((TOTAL - 1) * PEEK) / 2;
  return {
    xPercent:-50, yPercent:-50,
    y: -pos * PEEK + centerOffset,
    scale: 1 - pos * SCALE_STEP,
    zIndex: TOTAL - pos, x:0, rotation:0,
  };
}

// ─────────────────────────────────────────────────────────────────────────
const ServiceCards = () => {
  const sectionRef  = useRef(null);
  const wrapperRef  = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const wrapper = wrapperRef.current;
    const cards   = gsap.utils.toArray("[data-svc-card]", wrapper);
    if (!cards.length) return;

    const mm = gsap.matchMedia();

    // ── DESKTOP / TABLET: pure timeline horizontal slide ────────────────────
    mm.add("(min-width: 769px)", () => {
      const SCROLL_PER = window.innerHeight * 0.9;
      const totalSteps = TOTAL - 1;

      // Initial positions:
      cards.forEach((card, i) => {
        gsap.set(card, {
          xPercent: 0,
          yPercent: 0,
          clipPath: i === 0 ? "inset(0% 0% 0% 0% round 0px)" : "inset(12% -10% 12% 100% round 24px)",
          scale: 1,
          opacity: 1,
          zIndex: i + 1, // natural stacking (higher index = on top)
          transformOrigin: "center center",
        });
        card.style.willChange = "clip-path, transform, opacity";
      });

      const dots = gsap.utils.toArray("[data-dtop-dot]", wrapper);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${SCROLL_PER * totalSteps}`,
          pin: true,
          pinSpacing: true,
          id: "dtop-pin",
          scrub: 1, // Natively smooth scrub replaces the manual queue
          snap: {
            snapTo: 1 / totalSteps,
            duration: { min: 0.25, max: 0.5 },
            ease: "power1.inOut",
          },
          onUpdate(self) {
            // Only update dots based on scrub progress
            const step = Math.round(self.progress * totalSteps);
            dots.forEach((dot, i) => {
              gsap.to(dot, {
                scale: i === step ? 1.6 : 1,
                opacity: i === step ? 1 : 0.28,
                duration: 0.3,
                overwrite: "auto",
              });
            });
          },
        },
      });

      // Build the pure timeline
      for (let i = 1; i < TOTAL; i++) {
        const card = cards[i];
        const prevCard = cards[i - 1];

        tl.fromTo(
          card,
          { clipPath: "inset(12% -10% 12% 100% round 24px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            duration: 1,
            ease: "none",
          },
          i - 1
        );

        if (prevCard) {
          tl.to(
            prevCard,
            {
              scale: 0.88,
              opacity: 0.25,
              duration: 1,
              ease: "none",
            },
            i - 1
          );
        }
      }

      return () => {
        ScrollTrigger.getById("dtop-pin")?.kill();
      };
    });

    // ── MOBILE: CARTA deck pure timeline ──────────────────────────────────
    mm.add("(max-width: 768px)", () => {
      const SCROLL_PER = window.innerHeight * 0.85;

      // Set initial deck position
      cards.forEach((card, i) => {
        gsap.set(card, stackPos(i));
        card.style.willChange = "transform";
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${SCROLL_PER * TOTAL}`,
          pin: true,
          pinSpacing: true,
          id: "carta-pin",
          scrub: 1, // Replaces throwing queue completely
          snap: {
            snapTo: 1 / TOTAL,
            duration: { min: 0.3, max: 0.6 },
            ease: "power2.inOut",
          },
        },
      });

      for (let step = 0; step < TOTAL; step++) {
        const frontIdx = step;
        const frontCard = cards[frontIdx];

        // 1. Throw out
        tl.to(
          frontCard,
          { x: 160, y: -280, rotation: 15, scale: 0.75, duration: 0.5, ease: "power1.inOut" },
          step
        );

        // 2. Drop zIndex instantly when it's out of the way
        tl.set(frontCard, { zIndex: 0 }, step + 0.5);

        // 3. Drop back into the bottom of the deck
        const bp = stackPos(TOTAL - 1);
        tl.to(
          frontCard,
          { x: 0, y: bp.y, rotation: 0, scale: bp.scale, duration: 0.5, ease: "power1.inOut" },
          step + 0.5
        );

        // 4. Set accurate final zIndex at the end of the step
        tl.set(frontCard, { zIndex: bp.zIndex }, step + 1);

        // 5. Shift all other cards forward
        for (let i = 1; i < TOTAL; i++) {
          const cardIdx = (frontIdx + i) % TOTAL;
          const card = cards[cardIdx];
          const targetPos = stackPos(i - 1);

          tl.to(
            card,
            { y: targetPos.y, scale: targetPos.scale, duration: 1, ease: "none" },
            step
          );

          tl.set(card, { zIndex: targetPos.zIndex }, step + 1);
        }
      }

      return () => {
        ScrollTrigger.getById("carta-pin")?.kill();
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  const sectionClass =
    "relative bg-black text-white min-[769px]:h-dvh min-[769px]:min-h-dvh min-[769px]:overflow-hidden max-[768px]:flex max-[768px]:min-h-screen max-[768px]:flex-col";

  const headingClass =
    "shrink-0 px-[clamp(24px,6vw,100px)] min-[769px]:hidden max-[768px]:px-5 max-[768px]:pb-7 max-[768px]:pt-12 max-[380px]:px-4 max-[380px]:pb-6 max-[380px]:pt-10";

  const wrapperClass =
    "relative w-full min-[769px]:h-dvh min-[769px]:max-w-none min-[769px]:overflow-hidden max-[768px]:box-border max-[768px]:flex max-[768px]:flex-col max-[768px]:min-h-[500px] max-[768px]:flex-1 max-[768px]:overflow-visible max-[768px]:pb-8 max-[380px]:min-h-[440px]";

  const hintClass =
    "relative z-30 hidden w-full items-center justify-center gap-4 px-4 py-4 font-mono text-[10px] uppercase tracking-[0.35em] text-white/60 max-[768px]:flex shrink-0";

  const hintLineClass =
    "h-px flex-1 max-w-[40px] bg-white/35";

  const progressClass =
    "pointer-events-none absolute bottom-[clamp(20px,3vh,36px)] left-1/2 z-[1000] hidden -translate-x-1/2 gap-2.5 min-[769px]:flex";

  const deckContainerClass =
    "relative w-full flex-1 min-[769px]:h-full";

  const cardClass =
    "absolute box-border overflow-hidden will-change-transform min-[769px]:left-0 min-[769px]:top-0 min-[769px]:grid min-[769px]:h-full min-[769px]:w-full min-[769px]:grid-rows-[auto_1fr] min-[769px]:rounded-none min-[769px]:shadow-none max-[768px]:left-1/2 max-[768px]:top-1/2 max-[768px]:flex max-[768px]:h-[min(62dvh,430px)] max-[768px]:min-h-[360px] max-[768px]:w-[min(84vw,320px)] max-[768px]:-translate-x-1/2 max-[768px]:-translate-y-1/2 max-[768px]:flex-col max-[768px]:rounded-[14px] max-[768px]:shadow-[0_16px_40px_rgba(0,0,0,0.5)] max-[380px]:h-[min(64dvh,400px)] max-[380px]:min-h-[330px] max-[380px]:w-[min(88vw,296px)]";

  const peekClass =
    "z-[2] box-border flex shrink-0 items-center justify-between border-b border-white/10 min-[769px]:absolute min-[769px]:right-[clamp(24px,5vw,88px)] min-[769px]:top-[clamp(28px,4vw,72px)] min-[769px]:h-14 min-[769px]:w-[min(420px,42vw)] min-[769px]:rounded-full min-[769px]:border min-[769px]:border-white/20 min-[769px]:bg-black/15 min-[769px]:px-5 min-[769px]:backdrop-blur max-[768px]:h-[52px] max-[768px]:w-full max-[768px]:px-[18px] max-[380px]:h-[46px] max-[380px]:px-3.5";

  const bodyClass =
    "relative box-border flex flex-col min-[769px]:z-[1] min-[769px]:max-w-[min(950px,76vw)] min-[769px]:justify-end min-[769px]:gap-0 min-[769px]:px-[clamp(40px,6vw,100px)] min-[769px]:pb-[clamp(36px,5vh,70px)] min-[769px]:pt-[clamp(140px,20vh,230px)] max-[768px]:flex-1 max-[768px]:gap-2.5 max-[768px]:p-[20px_18px_18px] max-[380px]:p-[16px_14px]";

  const titleClass =
    "m-0 font-black uppercase leading-none tracking-[-0.03em] min-[769px]:mb-[clamp(28px,4vh,52px)] min-[769px]:text-[clamp(60px,9.5vw,160px)] min-[769px]:leading-[0.85] min-[769px]:tracking-[-0.04em] max-[768px]:text-[clamp(24px,8vw,34px)]";

  const listClass =
    "m-0 flex list-none flex-col p-0 min-[769px]:max-w-[760px] min-[769px]:flex-row min-[769px]:flex-wrap min-[769px]:gap-x-[clamp(24px,3vw,48px)]";

  const listItemClass =
    "flex items-center gap-2.5 border-t border-white/10 font-mono tracking-[0.04em] min-[769px]:min-w-[clamp(160px,18vw,240px)] min-[769px]:flex-[0_1_auto] min-[769px]:py-[clamp(8px,1.2vh,14px)] min-[769px]:text-[clamp(12px,1.1vw,15px)] max-[768px]:py-[7px] max-[768px]:text-[clamp(11px,3.4vw,13px)]";

  const headlineFont = { fontFamily: "'Arial Black', sans-serif" };
  const serifFont = { fontFamily: "Georgia, serif" };

  // ── JSX ─────────────────────────────────────────────────────────────────
  return (
    <section id="services" ref={sectionRef} className={sectionClass}>

      {/* Mobile heading */}
      <div className={headingClass}>
        <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.5em] text-white/30 max-[380px]:mb-3">
          ◈ What We Do
        </p>
        <h2
          className="m-0 text-[clamp(44px,8vw,110px)] font-black uppercase leading-[0.9] tracking-[-0.04em] max-[768px]:text-[clamp(40px,15vw,66px)] max-[768px]:leading-[0.88] max-[380px]:text-[clamp(34px,14vw,52px)]"
          style={headlineFont}
        >
          Call us if<br />you{" "}
          <em
            className="font-normal text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.35)]"
            style={serifFont}
          >
            need:
          </em>
        </h2>
      </div>

      {/* Cards wrapper */}
      <div className={wrapperClass} ref={wrapperRef}>

        {/* Mobile scroll hint */}
        <div data-svc-hint className={hintClass}>
          <div className={hintLineClass} />
          Scroll to explore
          <div className={hintLineClass} />
        </div>

        {/* Desktop progress dots */}
        <div className={progressClass}>
          {CARDS.map((c, i) => (
            <div
              key={c.id}
              data-dtop-dot
              className="size-[7px] origin-center rounded-full bg-white/90 opacity-30 transition-[opacity,transform] duration-300"
              style={{ opacity: i === 0 ? 1 : 0.28, transform: i === 0 ? "scale(1.6)" : "scale(1)" }}
            />
          ))}
        </div>

        <div className={deckContainerClass}>
          {/* Cards */}
          {CARDS.map((c) => (
            <div
              key={c.id}
              data-svc-card
              className={`${cardClass} bg-black`}
              style={{ color: "#fff" }}
            >
              <img
                src={assetPath(c.img)}
                alt={c.title}
                className="pointer-events-none absolute left-0 top-0 z-0 size-full object-cover"
              />
              <div className="pointer-events-none absolute left-0 top-0 z-[1] size-full bg-black/40 max-[768px]:bg-black/50 min-[769px]:bg-gradient-to-t min-[769px]:from-black/90 min-[769px]:via-black/20 min-[769px]:to-transparent" />

              <div className={peekClass} style={{ zIndex: 2 }}>
                <span className="hidden font-mono text-[10px] uppercase tracking-[0.45em] opacity-80 min-[769px]:block">
                  ◈ What We Do
                </span>
                <span className="text-2xl leading-none min-[769px]:text-[clamp(22px,2.5vw,32px)]">
                  {c.icon}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.35em] opacity-80 min-[769px]:text-[clamp(10px,1vw,13px)]">
                  {c.num}
                </span>
              </div>

              <div className={`${bodyClass} z-[2]`} style={{ zIndex: 2 }}>
                <h3 className={titleClass} style={headlineFont}>{c.title}</h3>
                <hr className="m-0 border-0 border-t border-white/20 min-[769px]:mb-[clamp(16px,2.5vh,28px)]" />
                <ul className={listClass}>
                  {c.services.map((s) => (
                    <li key={s} className={listItemClass}>
                      <span className="size-1 shrink-0 rounded-full bg-current opacity-50" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCards;
