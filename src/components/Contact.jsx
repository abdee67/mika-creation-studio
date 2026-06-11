import { useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
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

// ─────────────────────────────────────────────────────────────────────────────
const Contact = () => {
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    const formData = new FormData(e.target);
    const data = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      service: formData.get("service"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/send_telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus("sent");
        e.target.reset();
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden bg-black text-blue-50"
      style={{ minHeight: "100dvh" }}
    >
      {/* ── Decorative background ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <img src={assetPath("img/noise.webp")} alt="" loading="lazy" decoding="async" aria-hidden="true"
          className="contact-noise-x contact-noise-x-a" />
        <img src={assetPath("img/noise.webp")} alt="" loading="lazy" decoding="async" aria-hidden="true"
          className="contact-noise-x contact-noise-x-b" />
        <div className="contact-bg-title-wrap absolute left-1/2 top-[53%] z-[1] w-[92vw] -translate-x-1/2 -translate-y-1/2 md:top-1/2 md:w-[116vw]">
          <h2
            className="contact-bg-title-3d special-font text-center font-zentry font-black uppercase leading-none text-blue-50/[0.22] max-[380px]:text-[7.5rem]"
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
              {status === "error" && (
                <p className="font-general text-[10px] uppercase tracking-[0.3em] text-red-500">
                  Failed to send. Please try again.
                </p>
              )}
            </div>

            <p className="mt-4 font-robert-regular text-[10px] leading-5 text-blue-50/30 sm:mt-5 sm:text-[11px]">
              By submitting you agree to be contacted about your project. No spam, ever.
            </p>
          </form>
        </div>



      </div>
    </section>
  );
};

export default Contact;
