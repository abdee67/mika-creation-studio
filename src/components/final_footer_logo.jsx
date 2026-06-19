import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FinalFooterLogo = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    let ctx;

    const init = () => {
      if (ctx) ctx.revert();

      const vw = window.innerWidth;
      const textW = text.scrollWidth;

      // Start: text fully off-screen to the right (only CREATION would peek if we did vw - textW)
      // We start at vw so the entire text begins just beyond the right edge
      const startX = vw;

      // End: text left-edge flush with viewport left edge (MIKA fully visible)
      // If text is narrower than screen (unlikely at these sizes), center it gracefully
      const endX = vw - textW;

      ctx = gsap.context(() => {
        gsap.fromTo(
          text,
          { x: startX },
          {
            x: endX,
            ease: "none", // pure 1:1 scrub with scroll
            scrollTrigger: {
              trigger: container,
              start: "top bottom",
              end: "bottom bottom",
              scrub: 20,
              invalidateOnRefresh: true,
            },
          }
        );
      }, container);
    };

    // Wait one frame so fonts/layout are settled
    const raf = requestAnimationFrame(init);

    const onResize = () => {
      ScrollTrigger.refresh();
      init();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <footer
      ref={containerRef}
      className="relative w-full overflow-hidden bg-black"
      style={{ height: "fit-content", minHeight: "400px" }}
    >


      {/* Small label, Snack-Media-style */}
      <div
        className="absolute left-8 top-8 text-xs uppercase tracking-[0.3em] text-white/30"
        style={{ fontFamily: "'Helvetica Neue', Helvetica, sans-serif" }}
      >
        Est. 2026
      </div>

      {/* Scroll-scrubbed display text */}
      <div className="absolute inset-0 flex items-center">
        <h1
          ref={textRef}
          className="pointer-events-none m-0 select-none p-0"
          style={{
            whiteSpace: "nowrap",
            fontFamily: "'Arial Black', 'Helvetica Neue', Arial, sans-serif",
            fontWeight: 1000,
            // Large enough that "MIKA CREATION" is always wider than any screen
            fontSize: "clamp(200px, 32vw, 420px)",
            lineHeight: "0.85",
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            color: "#c8a951",
            willChange: "transform",
          }}
        >
          Mika Creation
        </h1>
      </div>
    </footer>
  );
};

export default FinalFooterLogo;
