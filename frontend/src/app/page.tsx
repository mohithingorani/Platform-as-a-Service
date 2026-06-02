import Nav from "./components/landing/Nav";
import Hero from "./components/landing/Hero";
import TechMarquee from "./components/landing/TechMarquee";
import Features from "./components/landing/Features";
import Bento from "./components/landing/Bento";
import Architecture from "./components/landing/Architecture";
import Stats from "./components/landing/Stats";
import Pricing from "./components/landing/Pricing";
import FAQ from "./components/landing/FAQ";
import CTA from "./components/landing/CTA";
import Footer from "./components/landing/Footer";

export default function LandingPage() {
  return (
    <div id="top" className="min-h-screen bg-bg-primary">
      <Nav />
      <main>
        <Hero />
        <TechMarquee />
        <Features />
        <Bento />
        <Architecture />
        <Stats />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
