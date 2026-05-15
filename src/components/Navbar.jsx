import clsx from "clsx";
import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { FaBars, FaTimes } from "react-icons/fa";

import Button from "./Button";

const navItems = [
  { label: "HOME", href: "#hero" },
  { label: "WORK", href: "#about" },
  { label: "SERVICES", href: "#about" },
  { label: "STUDIO", href: "#story" },
  { label: "CONTACT", href: "#contact" },
];

const NavBar = () => {
  // State for toggling audio and visual indicator
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Refs for audio and navigation container
  const audioElementRef = useRef(null);
  const navContainerRef = useRef(null);

  const { y: currentScrollY } = useWindowScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Toggle audio and visual indicator
  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  };

  // Manage audio playback
  useEffect(() => {
    if (isAudioPlaying) {
      audioElementRef.current.play();
    } else {
      audioElementRef.current.pause();
    }
  }, [isAudioPlaying]);

  useEffect(() => {
    if (currentScrollY === 0) {
      // Topmost position: show navbar without floating-nav
      setIsNavVisible(true);
      navContainerRef.current.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      // Scrolling down: hide navbar and apply floating-nav
      setIsNavVisible(false);
      navContainerRef.current.classList.add("floating-nav");
    } else if (currentScrollY < lastScrollY) {
      // Scrolling up: show navbar with floating-nav
      setIsNavVisible(true);
      navContainerRef.current.classList.add("floating-nav");
    }

    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,
    });
  }, [isNavVisible]);

  return (
    <div
      ref={navContainerRef}
      className="fixed inset-x-3 top-3 z-50 h-14 border-none transition-all duration-700 sm:inset-x-6 sm:h-16"
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="relative flex size-full items-center justify-between p-3 sm:p-4">
          {/* Logo and Product button */}
          <div className="flex min-w-0 items-center gap-3 sm:gap-7">
            <img src="/img/logo.png" alt="logo" className="w-9 shrink-0 sm:w-10" />

            <Button
              id="product-button"
              title="Services"
              rightIcon={<TiLocationArrow />}
              containerClass="hidden items-center justify-center gap-1 bg-blue-50 md:flex"
            />
          </div>

          {/* Navigation Links and Audio Button */}
          <div className="flex h-full items-center">
            <div className="hidden md:block">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="nav-hover-btn"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <button
              onClick={toggleAudioIndicator}
              aria-label={isAudioPlaying ? "Pause background audio" : "Play background audio"}
              className="ml-4 flex items-center space-x-0.5 md:ml-8 lg:ml-10"
            >
              <audio
                ref={audioElementRef}
                className="hidden"
                src="/audio/loop.mp3"
                loop
              />
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={clsx("indicator-line", {
                    active: isIndicatorActive,
                  })}
                  style={{
                    animationDelay: `${bar * 0.1}s`,
                  }}
                />
              ))}
            </button>

            <button
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="ml-5 flex size-9 items-center justify-center rounded-full bg-blue-50 text-black md:hidden"
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          <div
            className={clsx(
              "absolute inset-x-0 top-[calc(100%+0.5rem)] overflow-hidden rounded-lg border border-white/10 bg-black/95 transition-all duration-300 md:hidden",
              isMenuOpen
                ? "max-h-80 opacity-100"
                : "pointer-events-none max-h-0 opacity-0"
            )}
          >
            <div className="flex flex-col p-2">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-md px-4 py-3 font-general text-xs uppercase text-blue-50 transition-colors hover:bg-white/10"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default NavBar;
