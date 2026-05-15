import { useEffect, useState, useRef } from "react";
import { TiLocationArrow } from "react-icons/ti";

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
      src={shouldLoad ? src : undefined}
      loop
      muted
      autoPlay={shouldLoad}
      playsInline
      preload={shouldLoad ? "metadata" : "none"}
      className={className}
    />
  );
};

export const BentoCard = ({ src, title, description, isComingSoon }) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoverOpacity, setHoverOpacity] = useState(0);
  const hoverButtonRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!hoverButtonRef.current) return;
    const rect = hoverButtonRef.current.getBoundingClientRect();

    setCursorPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => setHoverOpacity(1);
  const handleMouseLeave = () => setHoverOpacity(0);

  return (
    <div className="relative size-full">
      <LazyFeatureVideo
        src={src}
        className="absolute left-0 top-0 size-full object-cover object-center"
      />
      <div className="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50">
        <div>
          <h1 className="bento-title special-font">{title}</h1>
          {description && (
            <p className="mt-3 max-w-64 text-xs md:text-base">{description}</p>
          )}
        </div>

        {isComingSoon && (
          <div
            ref={hoverButtonRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="border-hsla relative flex w-fit cursor-pointer items-center gap-1 overflow-hidden rounded-full bg-black px-5 py-2 text-xs uppercase text-white/20"
          >
            {/* Radial gradient hover effect */}
            <div
              className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
              style={{
                opacity: hoverOpacity,
                background: `radial-gradient(100px circle at ${cursorPosition.x}px ${cursorPosition.y}px, #656fe288, #00000026)`,
              }}
            />
            <TiLocationArrow className="relative z-20" />
            <p className="relative z-20">coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Features = () => (
  <section id="about" className="bg-black pb-24 md:pb-52">
    <div className="container mx-auto px-3 md:px-10">
      <div className="-mx-3 overflow-hidden py-20 md:-mx-10 md:py-28">
        <div
          className="flex w-max whitespace-nowrap"
          style={{ animation: "feature-marquee 24s linear infinite" }}
        >
          {[1, 2].map((item) => (
            <h2
              key={item}
              className="special-font pr-12 font-zentry text-6xl font-black uppercase leading-[.82] text-white sm:text-7xl md:pr-20 md:text-8xl lg:text-9xl xl:text-[11rem]"
            >
              Disc<b>o</b>ver the world&apos;s largest shared adventure
            </h2>
          ))}
        </div>
      </div>

      <BentoTilt className="border-hsla relative mb-5 h-80 w-full overflow-hidden rounded-md sm:h-96 md:mb-7 md:h-[65vh]">
        <BentoCard
          src="videos/feature-1.mp4"
          title={
            <>
              fi<b>l</b>m
            </>
          }
          description="Cinematic video production, editing, and campaign visuals for brands, artists, and launches."
          isComingSoon
        />
      </BentoTilt>

      <div className="grid w-full grid-cols-1 gap-5 md:auto-rows-[32vh] md:grid-cols-2 md:gap-7 lg:auto-rows-[38vh]">
        <BentoTilt className="bento-tilt_1 h-80 md:col-span-1 md:row-span-2 md:h-auto">
          <BentoCard
            src="videos/feature-2.mp4"
            title={
              <>
                eve<b>n</b>ts
              </>
            }
            description="Event coverage built for atmosphere, memory, and social-ready delivery."
            isComingSoon
          />
        </BentoTilt>

        <BentoTilt className="bento-tilt_1 h-80 md:col-span-1 md:h-auto">
          <BentoCard
            src="videos/feature-3.mp4"
            title={
              <>
                bra<b>n</b>d
              </>
            }
            description="Identity systems, creative direction, and launch assets that make a business recognizable."
            isComingSoon
          />
        </BentoTilt>

        <BentoTilt className="bento-tilt_1 h-80 md:col-span-1 md:h-auto">
          <BentoCard
            src="videos/feature-4.mp4"
            title={
              <>
                w<b>e</b>bsites
              </>
            }
            description="Modern Websites with motion, clear storytelling, and responsive production-ready builds."
            isComingSoon
          />
        </BentoTilt>

        <BentoTilt className="bento-tilt_2 h-72 md:h-auto">
          <div className="flex size-full flex-col justify-between bg-violet-300 p-5">
            <h1 className="bento-title special-font max-w-64 text-black">
              M<b>o</b>re w<b>o</b>rk in m<b>o</b>tion.
            </h1>

            <TiLocationArrow className="m-5 scale-[5] self-end" />
          </div>
        </BentoTilt>

        <BentoTilt className="bento-tilt_2 h-72 md:h-auto">
          <LazyFeatureVideo
            src="videos/feature-5.mp4"
            className="size-full object-cover object-center"
          />
        </BentoTilt>
      </div>
    </div>
  </section>
);

export default Features;
