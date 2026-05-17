import { useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import {
  SiTiktok, SiInstagram, SiYoutube, SiGmail, SiTelegram,
} from "react-icons/si";
import { assetPath } from "../utils/assetPath";

const fieldClass =
  "mt-2 w-full rounded-none border-0 border-b border-white/20 bg-transparent " +
  "px-0 py-3 font-robert-regular text-sm text-blue-50 outline-none transition-colors " +
  "placeholder:text-blue-50/30 focus:border-yellow-300 sm:py-4 sm:text-base";

const Field = ({ label, children }) => (
  <label className="block font-general text-[9px] uppercase tracking-[0.28em] text-blue-50 sm:text-[10px] sm:tracking-[0.32em]">
    {label}
    {children}
  </label>
);

// ── Social links ──────────────────────────────────────────────────────────────
const SOCIALS = [
  {
    icon: SiInstagram,
    label: "Instagram",
    href: "https://instagram.com/onarebel",
    color: "#E1306C",
  },
  {
    icon: SiTiktok,
    label: "TikTok",
    href: "https://tiktok.com/@onarebel",
    color: "#ffffff",
  },
  {
    icon: SiYoutube,
    label: "YouTube",
    href: "https://youtube.com/@onarebel",
    color: "#FF0000",
  },
  {
    icon: SiTelegram,
    label: "Telegram",
    href: "https://t.me/onarebel",
    color: "#2AABEE",
  },
  {
    icon: SiGmail,
    label: "Gmail",
    href: "mailto:hello@onarebel.com",
    color: "#EA4335",
  },
];

// ── Single social icon pill — always shows color, bigger icon ─────────────────
const SocialPill = ({ icon: Icon, label, href, color }) => (
  <a
    href={href}
    target={href.startsWith("mailto") ? "_self" : "_blank"}
    rel="noreferrer"
    className="group flex flex-1 flex-col items-center justify-center gap-1.5 rounded-xl border py-3 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07] sm:py-4"
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

// ─────────────────────────────────────────────────────────────────────────────
const Contact = () => {
  const [status, setStatus] = useState("idle");

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 1400);
  };

  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden bg-black text-blue-50"
      style={{ minHeight: "100dvh" }}
    >
      {/* ── Decorative background ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <img src={assetPath("img/noise.png")} alt="" aria-hidden="true"
          className="contact-noise-x contact-noise-x-a" />
        <img src={assetPath("img/noise.png")} alt="" aria-hidden="true"
          className="contact-noise-x contact-noise-x-b" />
        <div className="contact-bg-title-wrap absolute left-1/2 top-[53%] z-[1] w-[92vw] -translate-x-1/2 -translate-y-1/2 md:top-1/2 md:w-[116vw]">
          <h2
            className="contact-bg-title-3d special-font text-center font-zentry font-black uppercase leading-none text-blue-50/[0.12] max-[380px]:text-[7.5rem]"
            style={{ fontSize: "clamp(4rem,18vw,12rem)" }}
          >
            Let&apos;s b<b>u</b>ild your next visual st<b>o</b>ry together.
          </h2>
        </div>
        <div className="absolute inset-0 z-[3] bg-[radial-gradient(circle_at_22%_18%,rgba(251,255,102,0.13),transparent_28%),radial-gradient(circle_at_80%_72%,rgba(87,102,255,0.17),transparent_34%)]" />
      </div>

      {/* ── Foreground ── */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-14 sm:px-6 sm:py-[4.5rem] md:min-h-dvh md:justify-center md:px-8 md:py-20 lg:px-12 xl:px-16">

        {/* Heading */}
        <div className="mb-6 w-full max-w-[34rem] sm:mb-8 md:mb-10 md:max-w-[46rem] lg:max-w-[52rem]">
          <p className="font-general text-[9px] uppercase tracking-[0.4em] text-yellow-300 sm:text-[10px]">
            Contact us
          </p>
          <h2
            className="special-font mt-3 font-zentry font-black uppercase leading-[0.86] text-blue-50 sm:mt-4"
            style={{ fontSize: "clamp(2.6rem,10vw,5rem)" }}
          >
            Start your <b>n</b>ext project.
          </h2>
          <p
            className="mt-3 font-robert-regular leading-[1.7] text-blue-50/60 sm:mt-4"
            style={{ fontSize: "clamp(0.8rem,1.8vw,0.95rem)", maxWidth: "26rem" }}
          >
            Tell us what you are building, filming, launching, or celebrating.
            We will shape the right production plan around it.
          </p>
        </div>

        {/* Form */}
        <div className="w-full max-w-[34rem] md:max-w-[46rem] lg:max-w-[52rem]">
          <form
            onSubmit={handleSubmit}
            className="w-full border border-white/[0.12] bg-black/20 shadow-2xl shadow-black/60"
            style={{ padding: "clamp(1.25rem,4vw,2.5rem)" }}
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
              <Field label="Full name">
                <input type="text" name="fullName" autoComplete="name" required
                  placeholder="Your name" className={fieldClass} />
              </Field>
              <Field label="Email">
                <input type="email" name="email" autoComplete="email" required
                  placeholder="you@example.com" className={fieldClass} />
              </Field>
            </div>

            <div className="mt-6 sm:mt-8">
              <Field label="Phone (optional)">
                <input type="tel" name="phone" autoComplete="tel"
                  placeholder="+251 900 000 000" className={fieldClass} />
              </Field>
            </div>

            <div className="mt-6 sm:mt-8">
              <Field label="Service">
                <select name="service" className={`${fieldClass} cursor-pointer`} defaultValue="">
                  <option value="" disabled className="bg-black text-blue-50/40">What do you need?</option>
                  {["Film & Video Production","Photography","Brand Identity",
                    "Social Media","Activations & Events","Motion & Post",
                    "Other / Not sure yet"].map(s => (
                    <option key={s} value={s} className="bg-black text-blue-50">{s}</option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="mt-6 sm:mt-8">
              <Field label="Message">
                <textarea name="message" required rows={5}
                  placeholder="Tell us about your project…"
                  className={`${fieldClass} min-h-[120px] resize-y leading-7 sm:min-h-[140px]`} />
              </Field>
            </div>

            <div className="mt-8 flex flex-col items-stretch gap-3 sm:mt-10 sm:flex-row sm:items-center sm:gap-4">
              <button
                type="submit"
                disabled={status === "sending" || status === "sent"}
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-3 bg-yellow-300 px-8 py-3 font-general text-xs uppercase tracking-[0.12em] text-black transition-all duration-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[180px]"
              >
                {status === "sending" ? (
                  <><span className="animate-spin text-base">◌</span> Sending…</>
                ) : status === "sent" ? <>✓ Sent!</> : (
                  <>Send message <TiLocationArrow className="text-lg" /></>
                )}
              </button>
              {status === "sent" && (
                <p className="font-general text-[10px] uppercase tracking-[0.3em] text-yellow-300">
                  We&apos;ll get back to you soon.
                </p>
              )}
            </div>

            <p className="mt-4 font-robert-regular text-[10px] leading-5 text-blue-50/25 sm:mt-5 sm:text-[11px]">
              By submitting you agree to be contacted about your project. No spam, ever.
            </p>
          </form>
        </div>

        {/* ── Address strip ──────────────────────────────────────────────── */}
        <div className="mt-8 w-full max-w-[34rem] md:max-w-[46rem] lg:max-w-[52rem]">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <div className="flex items-center gap-1.5">
              <svg width="10" height="13" viewBox="0 0 11 14" fill="none" className="shrink-0 opacity-35">
                <path d="M5.5 0C3.01 0 1 2.01 1 4.5c0 3.375 4.5 9 4.5 9s4.5-5.625 4.5-9C10 2.01 7.99 0 5.5 0Zm0 6.125A1.625 1.625 0 1 1 5.5 2.875a1.625 1.625 0 0 1 0 3.25Z" fill="white"/>
              </svg>
              <span className="font-robert-regular text-[11px] text-blue-50/35 sm:text-xs">
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

          <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-4">

            {/* Brand + copyright */}
            <div className="flex items-center gap-3">
              <span
                className="font-zentry font-black uppercase text-blue-50/80"
                style={{ fontSize: "clamp(0.85rem,2vw,1rem)", letterSpacing: "-0.02em" }}
              >
                On A Rebel
              </span>
              <span className="h-3 w-px bg-white/15" />
              <span className="font-robert-regular text-[10px] text-blue-50/25 sm:text-[11px]">
                © {new Date().getFullYear()} All rights reserved.
              </span>
            </div>

            {/* Powered-by — dev credit */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="font-robert-regular text-[10px] text-blue-50/20 sm:text-[11px]">
                crafted by
              </span>
              <a
                href="https://t.me/ClassNotFound"
                target="_blank"
                rel="noreferrer"
                className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-sm border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 transition-all duration-300 hover:border-yellow-300/30 hover:bg-yellow-300/5"
              >
                {/* blinking cursor */}
                <span className="animate-pulse font-general text-[10px] text-yellow-300/60">
                  _
                </span>
                <span className="font-general text-[10px] uppercase tracking-[0.2em] text-blue-50/50 transition-colors group-hover:text-yellow-300/80">
                  ClassNotFound
                </span>
                {/* trailing slash — dev nod */}
                <span className="font-general text-[10px] text-blue-50/20 group-hover:text-yellow-300/40">
                  /&gt;
                </span>
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Contact;
