import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

const navLinks = [
  { name: 'Our Story', href: '/#about' },
  { name: 'Menu', href: '/menu' },
  { name: 'Nights', href: '/#entertainment' },
  { name: 'Gallery', href: '/#gallery' },
  { name: 'Visit', href: '/#location' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isDark = !scrolled;

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        className={`text-center transition-all duration-300 overflow-hidden ${
          scrolled ? 'max-h-0 opacity-0' : 'max-h-12 opacity-100'
        }`}
      >
        <div className="bg-lounge-950 text-cream-50/80 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.35em] py-2.5 px-4 font-medium">
          Open 24 hours · KM 47, Lekki-Epe Expressway, Oko-Ado, Lagos
        </div>
      </div>

      <nav
        className={`transition-all duration-300 ${
          isDark
            ? 'bg-lounge-950/90 backdrop-blur-xl border-b border-gold-500/15'
            : 'bg-cream-50/97 backdrop-blur-xl border-b border-warm shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-[4.5rem]">
            <Link
              to="/"
              className={`font-serif text-xl md:text-2xl font-semibold tracking-[0.12em] uppercase transition-colors ${
                isDark ? 'text-gold-400 hover:text-gold-300' : 'text-gold-600 hover:text-gold-500'
              }`}
            >
              Olenix
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-[10px] uppercase tracking-[0.22em] transition-colors ${
                    isDark ? 'text-cream-50/75 hover:text-gold-400' : 'text-warm-700 hover:text-gold-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="hidden md:block">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event('open-booking-modal'))}
                className="btn-gold !py-2.5 !px-6 !text-[9px]"
              >
                Reservations
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2 transition-colors ${isDark ? 'text-gold-400' : 'text-gold-600'}`}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`lg:hidden border-t overflow-hidden ${
                isDark ? 'border-gold-500/20 bg-lounge-950' : 'border-warm bg-cream-50'
              }`}
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block py-3 text-sm uppercase tracking-widest transition-colors ${
                      isDark ? 'text-cream-50/80 hover:text-gold-400' : 'text-warm-700 hover:text-gold-600'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    window.dispatchEvent(new Event('open-booking-modal'));
                  }}
                  className="btn-gold w-full mt-3"
                >
                  Reservations
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
