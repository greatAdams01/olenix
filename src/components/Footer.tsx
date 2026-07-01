import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="section-dark text-cream-50/80 border-t border-gold-500/20">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          <div>
            <p className="font-serif text-2xl text-gold-400 tracking-widest uppercase mb-4">Olenix</p>
            <p className="text-xs leading-relaxed text-cream-50/55 max-w-xs">
              Xclusive Lounge — premium spirits, dining, and nightlife in Sangotedo, Lagos.
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold-500 font-bold mb-4">Hours &amp; location</p>
            <p className="text-xs leading-relaxed text-cream-50/60 mb-2">Open 24 hours · Every day</p>
            <p className="text-xs leading-relaxed text-cream-50/60">
              KM 47, Lekki-Epe Express Way
              <br />
              Oko-Ado, Lagos
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold-500 font-bold mb-4">Explore</p>
            <nav className="flex flex-col gap-2 text-xs uppercase tracking-widest">
              <Link to="/menu" className="hover:text-gold-400 transition-colors w-fit">
                Menu
              </Link>
              <a href="#reservations" className="hover:text-gold-400 transition-colors w-fit">
                Reservations
              </a>
              <a href="#entertainment" className="hover:text-gold-400 transition-colors w-fit">
                Weekly nights
              </a>
              <a href="#faq" className="hover:text-gold-400 transition-colors w-fit">
                FAQ
              </a>
            </nav>
            <div className="flex flex-wrap gap-4 mt-6 text-[10px] uppercase tracking-widest">
              <a href="https://www.instagram.com/olenixlounge" target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition-colors">
                Instagram
              </a>
              <a href="https://www.tiktok.com/@olenix_xclusivelounge" target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition-colors">
                TikTok
              </a>
              <a href="https://www.facebook.com/profile.php?id=61587656250891" target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition-colors">
                Facebook
              </a>
            </div>
          </div>
        </div>

        <p className="mt-14 pt-8 border-t border-cream-50/10 text-[10px] text-cream-50/35 text-center md:text-left">
          © {new Date().getFullYear()} Olenix Xclusive Lounge · Drink responsibly
        </p>
      </div>
    </footer>
  );
}
