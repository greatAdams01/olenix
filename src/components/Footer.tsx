import { MapPin, Phone, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white px-4 md:px-12 py-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
      <div className="flex flex-col gap-1">
        <span className="text-[9px] uppercase tracking-widest text-gold-400/40">Location</span>
        <span className="text-[10px] font-light text-white/70">KM 47, Lekki-Epe Express Way, Oko-Ado, Lagos.</span>
      </div>
      <div className="flex flex-wrap md:flex-nowrap gap-4 md:gap-6">
        <a href="https://www.instagram.com/olenixlounge?utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-[9px] uppercase tracking-widest text-white/60 hover:text-white transition-colors">IG: @olenixlounge</a>
        <a href="https://www.tiktok.com/@olenix_xclusivelounge?_r=1&_t=ZS-972zVKSYM1F" target="_blank" rel="noopener noreferrer" className="text-[9px] uppercase tracking-widest text-white/60 hover:text-white transition-colors">TikTok: @olenix_xclusivelounge</a>
        <a href="https://www.facebook.com/profile.php?id=61587656250891&mibextid=rS40aB7S9Ucbxw6v" target="_blank" rel="noopener noreferrer" className="text-[9px] uppercase tracking-widest text-white/60 hover:text-white transition-colors">FB: Olenix Olenix</a>
      </div>
    </footer>
  );
}
