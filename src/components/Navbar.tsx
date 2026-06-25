import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const location = useLocation();
  const isMenuPage = location.pathname === '/menu';

  const navLinks = [
    { name: 'About', href: '/#about' },
    { name: 'Experience', href: '/#features' },
    { name: 'Entertainment', href: '/#entertainment' },
    { name: 'Menu', href: '/menu' },
    { name: 'Gallery', href: '/#gallery' },
    { name: 'Reservations', href: '/#reservations' },
    { name: 'FAQ', href: '/#faq' },
  ];

  return (
    <nav className="fixed w-full z-50 bg-black/90 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0 flex flex-col">
            <Link to="/" className="font-serif text-2xl font-bold tracking-widest text-gold-500 uppercase leading-none">
              <span>OLENIX</span>
            </Link>
           <span className="text-[10px] tracking-[0.3em] text-gold-400/80 uppercase mt-1">Xclusive Lounge</span>
          </div>
          <div className="hidden md:block">
            <div className="flex items-baseline gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-gold-400/70 hover:text-gold-400 text-[11px] uppercase tracking-widest transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="px-6 py-2 border border-gold-500/20 text-[10px] uppercase tracking-tighter text-gold-400/90">
              Lagos, Nigeria
            </div>
            <button 
              onClick={() => window.dispatchEvent(new Event('open-booking-modal'))}
              className="px-6 py-2 bg-gold-500 text-black text-[10px] font-bold uppercase tracking-widest hover:bg-gold-400 transition-colors shadow-[0_0_10px_rgba(212,175,55,0.3)]"
            >
              Book Now
            </button>
          </div>
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gold-400 hover:text-gold-400 hover:bg-white/10 focus:outline-none transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-gold-400 hover:text-gold-400 block px-3 py-3 text-base uppercase tracking-widest font-medium transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <button 
                onClick={() => {
                  setIsOpen(false);
                  window.dispatchEvent(new Event('open-booking-modal'));
                }}
                className="w-full text-left text-black bg-gold-500 block px-3 py-3 mt-4 text-base uppercase tracking-widest font-bold transition-colors"
              >
                Book Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
