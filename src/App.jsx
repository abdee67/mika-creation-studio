import Hero from "./components/Hero";
import NavBar from "./components/Navbar";
import { lazy, Suspense } from "react";
const Features = lazy(() => import("./components/Features"));
const Story = lazy(() => import("./components/Story"));
const Contact = lazy(() => import("./components/Contact"));
const Services = lazy(() => import("./components/service"));

function App() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden">
      <NavBar />
      <Hero />
      <Suspense fallback={null}>
        <Features />
        <Story />
        <Services />
        <Contact />
        {/* <FinalFooterLogo /> */}
      </Suspense>
    </main>
  );
}

export default App;
