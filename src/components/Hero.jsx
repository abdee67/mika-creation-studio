import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { TiLocationArrow } from "react-icons/ti";
import { useCallback, useEffect, useRef, useState } from "react";

import Button from "./Button";
import VideoPreview from "./VideoPreview";
import DVDLoader from "./DVDLoader";
import { assetPath } from "../utils/assetPath";

gsap.registerPlugin(ScrollTrigger);

const totalVideos = 4;
const videos = Array.from({ length: totalVideos }, (_, index) => index + 1);
const requiredHeroAssets = [
  "logo-image",
  ...videos.map((videoIndex) => `hero-video-${videoIndex}`),
];
const homeSlots = {
  1: "topRight",
  2: "bottomLeft",
  3: "topLeft",
  4: "bottomRight",
};

const Hero = () => {
  const [previewIndex, setPreviewIndex] = useState(1);
  const [clickedIndex, setClickedIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [isHeroReady, setIsHeroReady] = useState(false);

  const clickVideoRef = useRef(null);
  const activeIndexRef = useRef(1);
  const readyAssetsRef = useRef(new Set());

  const getNextIndex = (index) => (index % totalVideos) + 1;

  const markHeroAssetReady = useCallback((assetId) => {
    if (readyAssetsRef.current.has(assetId)) return;

    readyAssetsRef.current.add(assetId);

    if (readyAssetsRef.current.size >= requiredHeroAssets.length) {
      setIsHeroReady(true);
    }
  }, []);

  useEffect(() => {
    const preloadImage = (src, assetId) => {
      const image = new Image();

      image.onload = () => markHeroAssetReady(assetId);
      image.onerror = () => markHeroAssetReady(assetId);
      image.src = src;
    };

    preloadImage(assetPath("img/logo.png"), "logo-image");

    const fallbackTimer = setTimeout(() => {
      setIsHeroReady(true);
    }, 30000);

    return () => clearTimeout(fallbackTimer);
  }, [markHeroAssetReady]);

  const handleMiniVdClick = () => {
    const nextIndex = getNextIndex(activeIndexRef.current);
    const heroTrigger = ScrollTrigger.getById("hero-video-sequence");

    setHasClicked(true);
    setClickedIndex(nextIndex);
    setPreviewIndex(nextIndex);
    activeIndexRef.current = nextIndex;

    if (heroTrigger) {
      const targetProgress = (nextIndex - 1) / (totalVideos - 1);
      const targetScroll =
        heroTrigger.start + (heroTrigger.end - heroTrigger.start) * targetProgress;

      window.scrollTo({ top: targetScroll });
    }
  };

  useGSAP(
    () => {
      if (!hasClicked) return;

      gsap.set("#click-video", { visibility: "visible" });
      gsap.to("#click-video", {
        transformOrigin: "center center",
        scale: 1,
        width: "100%",
        height: "100%",
        duration: 1,
        ease: "power1.inOut",
        onStart: () => clickVideoRef.current?.play(),
        onComplete: () => gsap.set("#click-video", { visibility: "hidden" }),
      });
      gsap.from("#current-video", {
        transformOrigin: "center center",
        scale: 0,
        duration: 1.5,
        ease: "power1.inOut",
      });
    },
    { dependencies: [clickedIndex], revertOnUpdate: true }
  );

  useGSAP(() => {
    const videoEls = gsap.utils.toArray("[data-hero-slot-video]");
    const getSlots = () => {
      const frame = document.getElementById("video-frame");
      const frameRect = frame?.getBoundingClientRect();
      const viewportWidth = frameRect?.width || window.innerWidth;
      const viewportHeight = frameRect?.height || window.innerHeight;
      const miniWidth = gsap.utils.clamp(110, 320, viewportWidth * 0.24);
      const miniHeight = gsap.utils.clamp(82, 230, viewportHeight * 0.22);
      const edgeX = gsap.utils.clamp(12, 72, viewportWidth * 0.045);
      const topY = gsap.utils.clamp(70, 120, viewportHeight * 0.11);
      const bottomY =
        viewportHeight -
        miniHeight -
        gsap.utils.clamp(28, 82, viewportHeight * 0.08);

      return {
        center: {
          x: 0,
          y: 0,
          width: "100%",
          height: "100%",
          borderRadius: 0,
          autoAlpha: 1,
          scale: 1,
        },
        topRight: {
          x: viewportWidth - miniWidth - edgeX,
          y: topY,
          width: miniWidth,
          height: miniHeight,
          borderRadius: 8,
          autoAlpha: 1,
          scale: 1,
        },
        bottomLeft: {
          x: edgeX,
          y: bottomY,
          width: miniWidth,
          height: miniHeight,
          borderRadius: 8,
          autoAlpha: 1,
          scale: 1,
        },
        topLeft: {
          x: edgeX,
          y: topY,
          width: miniWidth,
          height: miniHeight,
          borderRadius: 8,
          autoAlpha: 1,
          scale: 1,
        },
        bottomRight: {
          x: viewportWidth - miniWidth - edgeX,
          y: bottomY,
          width: miniWidth,
          height: miniHeight,
          borderRadius: 8,
          autoAlpha: 1,
          scale: 1,
        },
      };
    };

    const slots = getSlots();

    videoEls.forEach((video, index) => {
      const videoIndex = index + 1;
      const slot = videoIndex === 1 ? "center" : homeSlots[videoIndex];

      gsap.set(video, {
        ...slots[slot],
        zIndex: videoIndex === 1 ? 10 : 20,
      });
    });

    const timeline = gsap.timeline({
      scrollTrigger: {
        id: "hero-video-sequence",
        trigger: "#hero",
        start: "top top",
        end: `+=${(totalVideos - 1) * 950}`,
        scrub: 1.2,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const activeIndex =
            Math.round(self.progress * (totalVideos - 1)) + 1;

          if (activeIndexRef.current !== activeIndex) {
            activeIndexRef.current = activeIndex;
            setPreviewIndex(activeIndex);
          }
        },
        invalidateOnRefresh: true,
      },
    });

    videos.slice(0, -1).forEach((videoIndex, index) => {
      const outgoing = videoEls[videoIndex - 1];
      const incoming = videoEls[videoIndex];
      const transitionPoint = index;

      timeline
        .set(outgoing, { zIndex: 25 }, transitionPoint)
        .set(incoming, { zIndex: 30 }, transitionPoint)
        .to(
          outgoing,
          {
            ...slots[homeSlots[videoIndex]],
            ease: "none",
            duration: 1,
          },
          transitionPoint
        )
        .to(
          incoming,
          {
            ...slots.center,
            ease: "none",
            duration: 1,
          },
          transitionPoint
        )
        .set(outgoing, { zIndex: 20 }, transitionPoint + 1)
        .set(incoming, { zIndex: 10 }, transitionPoint + 1);
    });
  });

  const getVideoSrc = (index) => assetPath(`videos/hero-${index}.mp4`);

  return (
    <>
      {showLoader && (
        <DVDLoader
          isDone={isHeroReady}
          minimumDuration={3000}
          onDone={() => setShowLoader(false)}
        />
      )}

      <div
        id="hero"
        className="relative h-dvh min-h-screen w-full overflow-x-hidden bg-black"
      >
        <div
          id="video-frame"
          className="relative z-10 h-dvh min-h-screen w-screen overflow-hidden rounded-none bg-black"
        >
          {videos.map((videoIndex) => (
            <video
              key={videoIndex}
              src={getVideoSrc(videoIndex)}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              onCanPlay={() => markHeroAssetReady(`hero-video-${videoIndex}`)}
              onLoadedData={() => markHeroAssetReady(`hero-video-${videoIndex}`)}
              onError={() => markHeroAssetReady(`hero-video-${videoIndex}`)}
              data-hero-slot-video
              className="absolute left-0 top-0 size-full object-cover object-center"
            />
          ))}

          <div className="mask-clip-path absolute-center absolute z-50 size-36 cursor-pointer overflow-hidden rounded-lg sm:size-52 md:size-64">
            <VideoPreview>
              <div
                onClick={handleMiniVdClick}
                className="origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100"
              >
                <video
                  src={getVideoSrc(getNextIndex(previewIndex))}
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  id="current-video"
                  className="size-36 origin-center scale-150 object-cover object-center sm:size-52 md:size-64"
                />
              </div>
            </VideoPreview>
          </div>

          <video
            ref={clickVideoRef}
            src={getVideoSrc(clickedIndex)}
            loop
            muted
            playsInline
            preload="metadata"
            id="click-video"
            className="absolute-center invisible absolute z-20 size-36 object-cover object-center sm:size-52 md:size-64"
          />

          {/* Bottom-right title (inside frame) */}
          <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75">
            CRE<b>A</b>TI<b>ON</b>
          </h1>

          {/* Hero text content */}
          <div id="hero-content" className="absolute left-0 top-0 z-40 size-full">
            <div className="mt-20 max-w-[min(92vw,38rem)] px-4 sm:mt-24 sm:px-10">
              <h1 className="special-font hero-heading text-blue-100">
                mik<b>a</b>
              </h1>
              <p className="mb-5 max-w-60 font-robert-regular text-sm text-blue-100 sm:max-w-64 sm:text-base">
                Video production <br /> Events, brands & Softwares
              </p>
              <Button
                id="watch-trailer"
                title="Start a project"
                leftIcon={<TiLocationArrow />}
                containerClass="bg-yellow-300 flex-center gap-1"
              />
            </div>
          </div>
        </div>

        {/* Ghost title behind frame */}
        <h1 className="special-font hero-heading absolute bottom-5 right-5 text-black">
          ST<b>U</b>DIO
        </h1>
      </div>
    </>
  );
};

export default Hero;
