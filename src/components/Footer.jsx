import {
  SiTiktok, SiInstagram, SiYoutube, SiGmail, SiTelegram,
} from "react-icons/si";

// ── Social links ──────────────────────────────────────────────────────────────
const SOCIALS = [
  {
    icon: SiInstagram,
    label: "Instagram",
    href: "https://instagram.com/mika",
    color: "#E1306C",
  },
  {
    icon: SiTiktok,
    label: "TikTok",
    href: "https://tiktok.com/@mika",
    color: "#ffffff",
  },
  {
    icon: SiYoutube,
    label: "YouTube",
    href: "https://youtube.com/@mika",
    color: "#FF0000",
  },
  {
    icon: SiTelegram,
    label: "Telegram",
    href: "https://t.me/mika",
    color: "#2AABEE",
  },
  {
    icon: SiGmail,
    label: "Gmail",
    href: "mailto:hello@mika.com",
    color: "#EA4335",
  },
];

// ── Single social icon pill — always shows color, bigger icon ─────────────────
const SocialPill = ({ icon: Icon, label, href, color }) => (
  <a
    href={href}
    target={href.startsWith("mailto") ? "_self" : "_blank"}
    rel="noreferrer"
    className="group flex flex-1 flex-col items-center justify-center gap-1.5 py-3 transition-all duration-300 sm:py-4"
  >
    <Icon
      style={{ color, fontSize: "clamp(20px, 4vw, 26px)" }}
      className="transition-transform duration-300 group-hover:scale-110"
    />
    <span
      className="font-general uppercase text-blue-50/35 transition-colors duration-300 group-hover:text-blue-50/70"
      style={{ fontSize: "clamp(7px, 1.5vw, 10px)", letterSpacing: "0.2em" }}
    >
      {label}
    </span>
  </a>
);

const Footer = () => {
  return (
    <footer className="flex w-full justify-center bg-black px-4 py-10 text-white md:px-8">
      <div className="flex w-full max-w-7xl flex-col items-center">
        {/* ── Address strip ──────────────────────────────────────────────── */}
        <div className="mt-8 w-full max-w-[34rem] md:max-w-[46rem] lg:max-w-[52rem]">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <div className="flex items-center gap-1.5">
              <svg width="10" height="13" viewBox="0 0 11 14" fill="none" className="shrink-0 opacity-35">
                <path d="M5.5 0C3.01 0 1 2.01 1 4.5c0 3.375 4.5 9 4.5 9s4.5-5.625 4.5-9C10 2.01 7.99 0 5.5 0Zm0 6.125A1.625 1.625 0 1 1 5.5 2.875a1.625 1.625 0 0 1 0 3.25Z" fill="white"/>
              </svg>
              <span className="font-robert-regular text-[11px] text-blue-50/25 sm:text-xs">
                Addis Ababa, Ethiopia
              </span>
            </div>
            <span className="h-3 w-px bg-white/10" />
            <span className="font-robert-regular text-[11px] text-blue-50/25 sm:text-xs">
              Mon – Fri · 9 AM – 6 PM EAT
            </span>
          </div>
        </div>

        {/* ── Social pills — always horizontal, spread side to side ──────── */}
        <div className="mt-4 w-full max-w-[34rem] md:max-w-[46rem] lg:max-w-[52rem]">
          {/* flex with no-wrap + gap so all 5 are always in one row */}
          <div className="flex w-full flex-nowrap gap-2 sm:gap-3">
            {SOCIALS.map((s) => (
              <SocialPill key={s.label} {...s} />
            ))}
          </div>
        </div>


        {/* ── Copyright / Powered-by bar ────────────────────────────────── */}
        <div className="mt-10 w-full max-w-[34rem] md:max-w-[46rem] lg:max-w-[52rem]">

          {/* Full-width hairline */}
          <div className="mb-5 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">

            {/* Brand + copyright */}
            <div className="flex items-center gap-3">
              <span
                className="font-zentry font-black uppercase text-blue-50/80"
                style={{ fontSize: "clamp(0.85rem,2vw,1rem)", letterSpacing: "-0.02em" }}
              >
                Mika Creations
              </span>
              <span className="h-3 w-px bg-white/15" />
              <span className="font-robert-regular text-[10px] text-blue-50/25 sm:text-[11px]">
                © {new Date().getFullYear()} All rights reserved.
              </span>
            </div>

            {/* Powered-by — dev credit */}
            <div className="ml-auto flex items-center gap-2">
              <span className="font-robert-regular text-[10px] text-blue-50/25 sm:text-[11px]">
                crafted by
              </span>
              <a
                href="https://t.me/ClassNotFound"
                target="_blank"
                rel="noreferrer"
                className="group relative inline-flex items-center gap-1.5 overflow-hidden bg-white/[0.03] px-2.5 py-1 transition-all duration-300 hover:bg-blue-300/5"
              >
                {/* blinking cursor */}
                <span className="animate-pulse font-general text-[20px] text-blue-50/60">
                  _
                </span>
                <span className="font-general text-[10px] tracking-[0.2em] text-blue-50/50 transition-colors group-hover:text-blue-300/80">
                  ClassNotFound
                </span>
                {/* trailing slash — dev nod */}
                <span className="font-general text-[10px] text-blue-50/20 group-hover:text-blue-300/40">
                  /&gt;
                </span>
              </a>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
