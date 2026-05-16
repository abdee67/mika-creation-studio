/**
 * ServiceCards.jsx
 *
 * DESKTOP  — hover fan-out (cards spread left/right on hover)
 *
 * MOBILE   — CARTA / card-game ScrollTrigger
 *   • All 6 cards stacked. Only each card's icon-strip peeks above the front card.
 *   • Section PINS to the screen.
 *   • Each scroll step: the FRONT card throws to the BACK with a carta arc.
 *   • Remaining cards shift forward one position.
 *   • After all 6 cycles → section UNPINS → normal scroll continues.
 *   • Scroll UP reverses: back card arc-returns to front.
 *
 * Drop into src/components/ServiceCards.jsx
 * Add <ServiceCards /> to App.jsx
 */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── 6 Service cards ──────────────────────────────────────────────────────────
const CARDS = [
  {
    id:"film",   title:"Film & Video",   icon:"🎬", num:"01",
    bg:"#c8a951", color:"#000",
    services:["Campaign Film","Branded Content","Social Content","Documentary","Motion Graphics"],
  },
  {
    id:"photo",  title:"Photography",    icon:"📷", num:"02",
    bg:"#1e4d8c", color:"#fff",
    services:["Editorial","Product","Portrait","Event Coverage","Art Direction"],
  },
  {
    id:"brand",  title:"Brand Identity", icon:"✦",  num:"03",
    bg:"#6d28d9", color:"#fff",
    services:["Strategy","Visual Identity","Art Direction","Copywriting","DTP"],
  },
  {
    id:"social", title:"Social Media",   icon:"◈",  num:"04",
    bg:"#c2440e", color:"#fff",
    services:["Strategy","Content Creation","TikTok / Reels","Community Mgmt","Influencer"],
  },
  {
    id:"events", title:"Activations",    icon:"⚡", num:"05",
    bg:"#065f46", color:"#fff",
    services:["Event Planning","Pop-ups","Production","Experiential","Art Direction"],
  },
  {
    id:"motion", title:"Motion & Post",  icon:"∞",  num:"06",
    bg:"#7f1d1d", color:"#fff",
    services:["VFX","Colour Grading","Sound Design","Animation","Titles"],
  },
];

// ── Stack geometry (mobile) ──────────────────────────────────────────────────
const TOTAL      = CARDS.length;
const PEEK       = 30;   // px each back card peeks above the front card
const SCALE_STEP = 0.04; // scale reduction per position behind front

/** CSS properties for a given deck position (0 = front, 5 = furthest back) */
function stackPos(position) {
  return {
    xPercent: -50,
    yPercent: -50,
    y:      -position * PEEK,
    scale:   1 - position * SCALE_STEP,
    zIndex:  TOTAL - position,
    x:       0,
    rotation:0,
  };
}

/** Apply stack positions instantly */
function setDeck(cards, order) {
  order.forEach((cardIdx, pos) => {
    gsap.set(cards[cardIdx], stackPos(pos));
  });
}

/**
 * Throw front card to the back (CARTA forward).
 * @param {Element[]} cards   — DOM card elements
 * @param {number[]}  order   — mutable current deck order (front→back)
 * @param {Function}  done    — called when animation completes
 */
function throwToBack(cards, order, done) {
  const frontIdx  = order[0];
  const front     = cards[frontIdx];
  const backPos   = stackPos(TOTAL - 1);
  const tl        = gsap.timeline({ onComplete: done });

  // 1. Front card arcs up-right and out of view
  tl.to(front, {
    x: 180, y: -320, rotation: 22, scale: 0.68,
    duration: 0.38, ease: "power2.in",
  });

  // 2. Simultaneously: positions 1→5 each advance one step forward
  order.slice(1).forEach((cardIdx, i) => {
    tl.to(cards[cardIdx], {
      ...stackPos(i),        // was position i+1, now i
      duration: 0.42,
      ease: "power2.out",
    }, 0);                   // ← same start time as the throw
  });

  // 3. Snap flying card to just above its back position (invisible frame)
  tl.set(front, {
    xPercent: -50,
    yPercent: -50,
    x: 0,
    y: backPos.y - 24,
    scale: backPos.scale,
    zIndex: backPos.zIndex,
    rotation: -6,
  });

  // 4. Settle into back position with a little bounce
  tl.to(front, {
    y: backPos.y,
    rotation: 0,
    duration: 0.24,
    ease: "back.out(2)",
  });

  // Update order array IN-PLACE: [0,1,2,3,4,5] → [1,2,3,4,5,0]
  order.push(order.shift());
}

/**
 * Reverse: bring back card to front (scroll-up recovery).
 */
function throwToFront(cards, order, done) {
  // The card currently at the BACK was the most recent front
  const backIdx = order[TOTAL - 1];
  const back    = cards[backIdx];
  const frontP  = stackPos(0);
  const tl      = gsap.timeline({ onComplete: done });

  // 1. Back card arcs up-left toward front
  tl.to(back, {
    x: -180, y: -320, rotation: -22, scale: 0.68,
    duration: 0.38, ease: "power2.in",
  });

  // 2. Others shift back one position
  order.slice(0, -1).forEach((cardIdx, i) => {
    tl.to(cards[cardIdx], {
      ...stackPos(i + 1),
      duration: 0.42,
      ease: "power2.out",
    }, 0);
  });

  // 3. Snap to just below front position
  tl.set(back, {
    xPercent: -50,
    yPercent: -50,
    x: 0,
    y: frontP.y + 30,
    scale: frontP.scale,
    zIndex: frontP.zIndex,
    rotation: 8,
  });

  // 4. Settle
  tl.to(back, {
    y: frontP.y,
    rotation: 0,
    duration: 0.26,
    ease: "back.out(1.8)",
  });

  // Update order: [1,2,3,4,5,0] → [0,1,2,3,4,5]
  order.unshift(order.pop());
}

// ────────────────────────────────────────────────────────────────────────────

const ServiceCards = () => {
  const sectionRef = useRef(null);
  const wrapperRef = useRef(null);
  const leaveTimer = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const wrapper = wrapperRef.current;
    const cards   = gsap.utils.toArray(".svc-card", wrapper);
    if (!cards.length) return;

    const mm = gsap.matchMedia();

    // ── DESKTOP: hover fan-out ───────────────────────────────────────────
    mm.add("(min-width: 769px)", () => {
      const CARD_W     = 320;
      const HOVER_GAP  = 110;
      const CLUSTER_GAP= 145;

      // Apply initial rotations from CARDS data
      cards.forEach((card, i) => {
        gsap.set(card, {
          rotation: [4,-5,5,-8,5,-4][i] ?? 4,
          transformOrigin: "center center",
        });
      });

      cards.forEach((card, idx) => {
        card.addEventListener("mouseenter", () => {
          if (leaveTimer.current) { clearTimeout(leaveTimer.current); leaveTimer.current = null; }
          const baseTop = cards[idx].offsetTop;

          gsap.to(card, {
            x:0, y:40-baseTop, rotation:0, scale:1.08,
            duration:0.85, ease:"elastic.out(1,0.55)", overwrite:true, zIndex:10,
          });
          // Spread cards right
          cards.slice(idx+1).forEach((c,s) => {
            const tx = cards[idx].offsetLeft + CARD_W + HOVER_GAP + s*CLUSTER_GAP - c.offsetLeft;
            const ty = tx * Math.tan(CARDS[idx+1+s].rotation ?? 4 * Math.PI/180);
            gsap.to(c,{ x:tx, y:ty, rotation:CARDS[idx+1+s]?.rotation??4, scale:1, duration:0.9, ease:"elastic.out(1,0.5)", overwrite:true });
          });
          // Spread cards left
          cards.slice(0,idx).reverse().forEach((c,s) => {
            const i2 = idx-1-s;
            const tx = cards[idx].offsetLeft - HOVER_GAP - CARD_W - s*CLUSTER_GAP - c.offsetLeft;
            const ty = tx * Math.tan(CARDS[i2]?.rotation??-4 * Math.PI/180);
            gsap.to(c,{ x:tx, y:ty, rotation:CARDS[i2]?.rotation??-4, scale:1, duration:0.9, ease:"elastic.out(1,0.5)", overwrite:true });
          });
        });

        card.addEventListener("mouseleave", () => {
          leaveTimer.current = setTimeout(() => {
            cards.forEach((c,i) => {
              gsap.to(c,{ x:0, y:0, scale:1, rotation:[4,-5,5,-8,5,-4][i]??4, duration:0.9, ease:"elastic.out(1,0.5)", overwrite:true, zIndex:i+1 });
            });
          }, 80);
        });
      });
    });

    // ── MOBILE: CARTA scroll stack ───────────────────────────────────────
    mm.add("(max-width: 768px)", () => {
      const SCROLL_PER = window.innerHeight * 0.85;
      // Mutable deck order array. order[0] = current front card index.
      const order = [0,1,2,3,4,5];
      let busy = false;

      // Place all cards in initial stack positions
      setDeck(cards, order);

      // ── PIN the section for (TOTAL * SCROLL_PER) extra scroll space ──
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${SCROLL_PER * TOTAL}`,
        pin: true,
        pinSpacing: true,
        id: "carta-pin",
      });

      // ── One trigger per card step ─────────────────────────────────────
      for (let step = 0; step < TOTAL; step++) {
        ScrollTrigger.create({
          trigger: section,
          start: `top+=${step * SCROLL_PER} top`,
          end:   `top+=${(step + 1) * SCROLL_PER} top`,

          onEnter: () => {
            if (busy) return;
            busy = true;
            throwToBack(cards, order, () => { busy = false; });
          },

          onLeaveBack: () => {
            if (busy) return;
            busy = true;
            throwToFront(cards, order, () => { busy = false; });
          },
        });
      }

      return () => {
        ScrollTrigger.getById("carta-pin")?.kill();
      };
    });

    return () => {
      mm.revert();
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
    };
  }, []);

  return (
    <>
      <style>{`
        /* ── Section ──────────────────────────────────────────── */
        .svc-section {
          background: #000;
          color: #fff;
          padding: 120px 0 160px;
          overflow: hidden;
          position: relative;
        }

        /* ── Heading ──────────────────────────────────────────── */
        .svc-head {
          padding: 0 clamp(24px,6vw,100px);
          margin-bottom: 80px;
        }
        .svc-head p {
          font-size:10px; letter-spacing:.5em; text-transform:uppercase;
          color:rgba(255,255,255,.3); font-family:monospace; margin-bottom:20px;
        }
        .svc-head h2 {
          font-size:clamp(44px,8vw,110px); font-weight:900; line-height:.9;
          letter-spacing:-.04em; text-transform:uppercase;
          font-family:'Arial Black',sans-serif; margin:0;
        }
        .svc-head h2 em {
          font-style:italic; font-family:Georgia,serif; font-weight:400;
          -webkit-text-stroke:1.5px rgba(255,255,255,.35); color:transparent;
        }

        /* ── Desktop wrapper + fan positions ─────────────────── */
        .svc-cards-wrapper {
          position:relative; width:100%; max-width:1400px;
          height:560px; margin:0 auto; display:flex; justify-content:center;
        }
        .svc-card {
          width:320px; height:460px; position:absolute;
          display:flex; flex-direction:column; justify-content:flex-start;
          padding:0; border-radius:14px;
          box-shadow:0 16px 40px rgba(0,0,0,.5);
          cursor:pointer; box-sizing:border-box; will-change:transform;
          top:50px; overflow:hidden;
        }
        .svc-card:nth-child(1){ left:calc(50% - 680px); z-index:1; }
        .svc-card:nth-child(2){ left:calc(50% - 400px); z-index:2; }
        .svc-card:nth-child(3){ left:calc(50% - 160px); z-index:3; }
        .svc-card:nth-child(4){ left:calc(50% +  80px); z-index:4; }
        .svc-card:nth-child(5){ left:calc(50% + 320px); z-index:5; }
        .svc-card:nth-child(6){ left:calc(50% + 560px); z-index:6; }

        /* Bridge hover gap for middle cards */
        .svc-card:nth-child(2)::after,
        .svc-card:nth-child(3)::after,
        .svc-card:nth-child(4)::after,
        .svc-card:nth-child(5)::after {
          content:''; position:absolute; top:0; bottom:0; left:-28px; right:-28px;
        }

        /* ── Icon peek strip (always visible at top) ─────────── */
        .svc-peek {
          width:100%; height:56px; flex-shrink:0;
          display:flex; align-items:center; justify-content:space-between;
          padding:0 18px; box-sizing:border-box;
          border-bottom: 1px solid rgba(255,255,255,.1);
        }
        .svc-peek-icon { font-size:26px; line-height:1; }
        .svc-peek-num {
          font-size:10px; letter-spacing:.35em; font-family:monospace;
          opacity:.45; text-transform:uppercase;
        }

        /* ── Card body ───────────────────────────────────────── */
        .svc-body {
          padding:24px 20px 20px;
          display:flex; flex-direction:column; flex:1;
          gap:12px;
        }
        .svc-body h3 {
          font-size:clamp(20px,2.2vw,28px); font-weight:900;
          font-family:'Arial Black',sans-serif;
          letter-spacing:-.03em; line-height:1; text-transform:uppercase; margin:0;
        }
        .svc-body hr { border:none; border-top:1px solid rgba(255,255,255,.18); margin:0; }
        .svc-body ul { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:0; }
        .svc-body ul li {
          font-size:clamp(11px,1vw,13px); font-family:monospace;
          letter-spacing:.04em; display:flex; align-items:center; gap:10px;
          padding:6px 0; border-top:1px solid rgba(255,255,255,.08);
        }
        .svc-bullet {
          width:4px; height:4px; border-radius:50%;
          background:currentColor; flex-shrink:0; opacity:.5;
        }

        /* ── MOBILE overrides ────────────────────────────────── */
        @media (max-width: 768px) {
          .svc-section {
            padding: 0;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }

          .svc-head {
            padding: 48px 20px 28px;
            margin-bottom: 0;
            flex-shrink: 0;
          }

          .svc-head h2 {
            font-size: clamp(40px, 15vw, 66px);
            line-height: .88;
          }

          /* Cards wrapper becomes a centered STACK */
          .svc-cards-wrapper {
            flex: 1;
            min-height: min(560px, 68dvh);
            max-width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            /* Extra top padding so peeking cards don't overlap heading */
            padding-top: ${(TOTAL - 1) * PEEK + 16}px;
            padding-bottom: 40px;
            box-sizing: border-box;
          }

          .svc-card {
            /* Mobile: full-width centered card */
            position: absolute;
            width: min(84vw, 320px);
            height: min(62dvh, 430px);
            min-height: 360px;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            /* GSAP overrides top/left/transform, so we just set defaults here */
          }

          .svc-body {
            padding: 20px 18px 18px;
            gap: 10px;
          }

          .svc-body h3 {
            font-size: clamp(24px, 8vw, 34px);
          }

          .svc-body ul li {
            font-size: clamp(11px, 3.4vw, 13px);
            padding: 7px 0;
          }

          /* Remove desktop fan positions on mobile */
          .svc-card:nth-child(1),
          .svc-card:nth-child(2),
          .svc-card:nth-child(3),
          .svc-card:nth-child(4),
          .svc-card:nth-child(5),
          .svc-card:nth-child(6) {
            left: 50%;
            top: 50%;
            transform-origin: center center;
          }

          /* Larger peek strip on mobile so icon is legible */
          .svc-peek { height: 52px; }
          .svc-peek-icon { font-size: 24px; }

          /* Scroll hint */
          .svc-scroll-hint {
            display: flex !important;
          }
        }

        @media (max-width: 380px) {
          .svc-head {
            padding: 40px 16px 24px;
          }

          .svc-card {
            width: min(88vw, 296px);
            height: min(64dvh, 410px);
            min-height: 340px;
          }

          .svc-peek {
            height: 48px;
            padding: 0 14px;
          }

          .svc-body {
            padding: 18px 16px 16px;
          }
        }

        /* Hidden on desktop, shown on mobile */
        .svc-scroll-hint {
          display: none;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px 0 32px;
          font-size: 9px;
          letter-spacing: .35em;
          text-transform: uppercase;
          color: rgba(255,255,255,.25);
          font-family: monospace;
          flex-shrink: 0;
        }
        .svc-scroll-hint-line {
          width: 1px; height: 32px;
          background: linear-gradient(to bottom, rgba(255,255,255,.3), transparent);
        }
      `}</style>

      <section id="services" ref={sectionRef} className="svc-section">

        {/* Heading */}
        <div className="svc-head">
          <p>◈ What We Do</p>
          <h2>Call us if<br/>you <em>need:</em></h2>
        </div>

        {/* Scroll hint (mobile only) */}
        <div className="svc-scroll-hint">
          <div className="svc-scroll-hint-line"/>
          Scroll to explore
          <div className="svc-scroll-hint-line"/>
        </div>

        {/* Card stack */}
        <div className="svc-cards-wrapper" ref={wrapperRef}>
          {CARDS.map((c) => (
            <div
              key={c.id}
              className="svc-card"
              style={{ background: c.bg, color: c.color }}
            >
              {/* ── Peek strip — visible when card is behind others ── */}
              <div className="svc-peek">
                <span className="svc-peek-icon">{c.icon}</span>
                <span className="svc-peek-num">{c.num}</span>
              </div>

              {/* ── Card body ── */}
              <div className="svc-body">
                <h3>{c.title}</h3>
                <hr/>
                <ul>
                  {c.services.map((s) => (
                    <li key={s}>
                      <span className="svc-bullet"/>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

      </section>
    </>
  );
};

export default ServiceCards;
