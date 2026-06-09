import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Features from './components/Features';
import Entertainment from './components/Entertainment';
import Reservations from './components/Reservations';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20">
      <Navbar />
      <Hero />
      <About />
      <Features />
      <Entertainment />
      <Reservations />
      <FAQ />
      <Footer />
    </div>
  );
}
