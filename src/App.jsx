import Hero from "./components/Hero";
import NavBar from "./components/Navbar";
import { lazy, Suspense, useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

const Features = lazy(() => import("./components/Features"));
const Story = lazy(() => import("./components/Story"));
const Contact = lazy(() => import("./components/Contact"));
const Services = lazy(() => import("./components/service"));
const Footer = lazy(() => import("./components/Footer"));
const FinalFooterLogo = lazy(() => import("./components/final_footer_logo"));

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    const updateLenis = (time) => {
      lenis.raf(time * 1000);
    };

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(updateLenis);

    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden">
      <NavBar />
      <Hero />
      <Suspense fallback={null}>
        <Features />
        <Story />
        <Services />
        <Contact />
        <Footer />
        <FinalFooterLogo />
      </Suspense>
    </main>
  );
}

export default App;
