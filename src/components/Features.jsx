import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { TiLocationArrow } from "react-icons/ti";

import { assetPath } from "../utils/assetPath";

gsap.registerPlugin(ScrollTrigger);

const pullHeadline = "Take a look on what we achieved";
const isAbsoluteUrl = (url = "") => /^(https?:)?\/\//.test(url);
const resolveProjectUrl = (url) => (isAbsoluteUrl(url) ? url : assetPath(url));

export const BentoTilt = ({ children, className = "" }) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!itemRef.current) return;

    const { left, top, width, height } =
      itemRef.current.getBoundingClientRect();

    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;

    const tiltX = (relativeY - 0.5) * 5;
    const tiltY = (relativeX - 0.5) * -5;

    const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.95, .95, .95)`;
    setTransformStyle(newTransform);
  };

  const handleMouseLeave = () => {
    setTransformStyle("");
  };

  return (
    <div
      ref={itemRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
    >
      {children}
    </div>
  );
};

const LazyFeatureVideo = ({ src, className = "" }) => {
  const videoRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const videoSrc = resolveProjectUrl(src);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    if (!("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: "600px 0px" }
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      src={shouldLoad ? videoSrc : undefined}
      loop
      muted
      autoPlay={shouldLoad}
      playsInline
      preload={shouldLoad ? "metadata" : "none"}
      className={className}
    />
  );
};

const HorizontalPullWords = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return undefined;

    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const track = trackRef.current;
      const letters = gsap.utils.toArray("[data-feature-pull-letter]");
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reduceMotion) {
        gsap.set(track, { x: 0 });
        return;
      }

      const entranceDistance = Math.max(window.innerHeight * 0.9, 520);
      const pinnedDistance = Math.max(window.innerWidth * 1.55, 1250);

      const scrollTween = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: () => `+=${entranceDistance + pinnedDistance}`,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      scrollTween
        .fromTo(
          track,
          { x: () => window.innerWidth * 0.95 },
          {
            x: () => window.innerWidth * 0.08,
            duration: entranceDistance,
            ease: "none",
          }
        )
        .to(track, {
          x: () => -(track.scrollWidth - window.innerWidth * 0.92),
          duration: pinnedDistance,
          ease: "none",
        });

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${pinnedDistance}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });

      letters.forEach((letter, index) => {
        const yStart = gsap.utils.wrap([120, -150, 95, -85], index);
        const rotationStart = gsap.utils.wrap([-16, 12, -9, 18], index);

        gsap.fromTo(
          letter,
          {
            yPercent: yStart,
            rotation: rotationStart,
          },
          {
            yPercent: 0,
            rotation: 0,
            ease: "elastic.out(1.15, 0.9)",
            scrollTrigger: {
              trigger: letter,
              containerAnimation: scrollTween,
              start: "left 92%",
              end: "left 52%",
              scrub: 0.55,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[82svh] w-full overflow-hidden bg-black text-blue-50 sm:h-screen"
      aria-label={pullHeadline}
    >
      <div
        ref={trackRef}
        className="absolute left-0 top-1/2 flex w-max -translate-y-1/2 items-center gap-[clamp(1.5rem,5vw,5rem)] whitespace-nowrap px-[22vw] will-change-transform"
      >
        <svg
          viewBox="0 0 386 127"
          fill="none"
          className="hidden w-[clamp(11rem,24vw,24rem)] shrink-0 text-yellow-300/80 sm:block"
          aria-hidden="true"
        >
          <path
            d="M2 123C9 36 84.5 17 124 26C217.8 47.4 207 115 177.5 123C105.8 142.5 110.7 2 232.5 2C310.5 2 366.5 79 376 118L356.5 105.5"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 123C9 36 84.5 17 124 26C217.8 47.4 207 115 177.5 123C105.8 142.5 110.7 2 232.5 2C310.5 2 366.5 79 376 118L384 97"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <h2 className="special-font font-zentry text-[clamp(4.6rem,15vw,13rem)] font-black lowercase leading-[0.82] tracking-[-0.04em] text-white">
          {Array.from(pullHeadline).map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              data-feature-pull-letter
              aria-hidden="true"
              className="inline-block"
              style={{ willChange: "transform" }}
            >
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </h2>

        <svg
          viewBox="0 0 140 127"
          fill="none"
          className="w-[clamp(5rem,11vw,9rem)] shrink-0 text-yellow-300/80"
          aria-hidden="true"
        >
          <path
            d="M2 2.4C100.5 2.4 130.2 52.4 118.4 125.1L99.7 107.9"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 2.4C100.5 2.4 130.2 52.4 118.4 125.1L138 110.2"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
};

export const BentoCard = ({ src, title, description, workUrl }) => {
  const href = resolveProjectUrl(workUrl || src);
  const external = isAbsoluteUrl(href);

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      aria-label="See work"
      className="group relative block size-full overflow-hidden"
    >
      <LazyFeatureVideo
        src={src}
        className="absolute left-0 top-0 size-full object-cover object-center"
      />
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/25 via-transparent to-black/70 transition-colors duration-300 group-hover:bg-black/25 group-focus-visible:bg-black/25" />
      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/45 group-hover:opacity-100 group-focus-visible:bg-black/45 group-focus-visible:opacity-100">
        <span className="inline-flex items-center gap-2 border border-white/30 bg-black/55 px-5 py-3 font-general text-xs uppercase tracking-[0.28em] text-blue-50">
          see work
          <TiLocationArrow className="text-base" />
        </span>
      </div>

      <div className="relative z-30 flex size-full flex-col justify-between p-3 text-blue-50 sm:p-5">
        <div>
          <h1 className="bento-title special-font">{title}</h1>
          {description && (
            <p className="mt-2 hidden max-w-64 text-[11px] leading-relaxed text-blue-50/80 sm:block md:mt-3 md:text-base">
              {description}
            </p>
          )}
        </div>
      </div>
    </a>
  );
};

const Features = () => (
  <section id="about" className="bg-black pb-24 md:pb-52">
    <HorizontalPullWords />

    <div className="container mx-auto px-3 md:px-10">
      <BentoTilt className="border-hsla relative mb-3 h-[min(78vw,28rem)] min-h-72 w-full overflow-hidden rounded-md sm:mb-5 sm:h-96 md:mb-7 md:h-[65vh]">
        <BentoCard
          src="videos/feature-1.mp4"
          title={
            <>
              fi<b>l</b>m
            </>
          }
          description="Cinematic video production, editing, and campaign visuals for brands, artists, and launches."
        />
      </BentoTilt>

      <div className="grid w-full auto-rows-[minmax(9.5rem,34vw)] grid-cols-2 gap-3 sm:auto-rows-[minmax(13rem,30vw)] sm:gap-5 md:auto-rows-[32vh] md:gap-7 lg:auto-rows-[38vh]">
        <BentoTilt className="bento-tilt_1 col-span-1 row-span-2 min-h-80 sm:min-h-[28rem] md:min-h-0">
          <BentoCard
            src="videos/feature-2.mp4"
            title={
              <>
                eve<b>n</b>ts
              </>
            }
            description="Event coverage built for atmosphere, memory, and social-ready delivery."
          />
        </BentoTilt>

        <BentoTilt className="bento-tilt_1 col-span-1">
          <BentoCard
            src="videos/feature-3.mp4"
            title={
              <>
                bra<b>n</b>d
              </>
            }
            description="Identity systems, creative direction, and launch assets that make a business recognizable."
          />
        </BentoTilt>

        <BentoTilt className="bento-tilt_1 col-span-1">
          <BentoCard
            src="videos/feature-4.mp4"
            title={
              <>
                w<b>e</b>bsites
              </>
            }
            description="Modern Websites with motion, clear storytelling, and responsive production-ready builds."
          />
        </BentoTilt>

        <BentoTilt className="bento-tilt_2 col-span-1">
          <div className="flex size-full flex-col justify-between bg-violet-300 p-3 sm:p-5">
            <h1 className="bento-title special-font max-w-64 text-black">
              M<b>o</b>re w<b>o</b>rk in m<b>o</b>tion.
            </h1>

            <TiLocationArrow className="m-2 scale-[3] self-end sm:m-5 sm:scale-[5]" />
          </div>
        </BentoTilt>

        <BentoTilt className="bento-tilt_2 col-span-1">
          <BentoCard
            src="videos/feature-5.mp4"
            title={
              <>
                m<b>o</b>tion
              </>
            }
            description="Short-form post, motion, color, and sound for campaign delivery."
          />
        </BentoTilt>
      </div>
    </div>
  </section>
);

export default Features;
