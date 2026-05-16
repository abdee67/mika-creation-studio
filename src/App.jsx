import Hero from "./components/Hero";
import NavBar from "./components/Navbar";
import Features from "./components/Features";
import Story from "./components/Story";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Services from "./components/service";

function App() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden">
      <NavBar />
      <Hero />
      <Features />
      <Story />
      <Services />
      <Contact />
      <Footer />
    </main>
  );
}

export default App;
