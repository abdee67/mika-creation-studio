import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  useGSAP(() => {
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
      },
    });

    clipAnimation.to(".mask-clip-path", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
    });
  });

  return (
    <div id="about" className="min-h-screen w-screen">
      <div className="relative flex min-h-[78vh] flex-col items-center justify-center overflow-hidden px-4 pb-20 pt-24 text-center md:min-h-[86vh]">
        <h2 className="special-font max-w-[92rem] text-center font-zentry text-[3.8rem] font-black uppercase leading-[.82] text-black/90 sm:text-[4.8rem] md:text-[6.6rem] lg:text-[8.2rem] xl:text-[9.4rem]">
          <span className="block">Disc<b>o</b>ver the</span>
          <span className="block">world&apos;s largest</span>
          <span className="block">shared</span>
          <span className="block">adventure</span>
        </h2>

        <div className="mt-10 max-w-3xl font-circular-web text-base leading-relaxed text-black/80 md:text-xl">
          <p>Video, events, branding, and Softwares shaped around story.</p>
          <p className="mt-3 text-gray-500">
            We bring creative production and digital craft together for brands
            that need to look sharp, move fast, and feel memorable.
          </p>
        </div>
      </div>

      <div className="h-dvh w-screen" id="clip">
        <div className="mask-clip-path about-image">
          <img
            src="img/about.webp"
            alt="Background"
            className="absolute left-0 top-0 size-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
