import { MapPin, Phone, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white px-4 md:px-12 py-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
      <div className="flex flex-col gap-1">
        <span className="text-[9px] uppercase tracking-widest text-gold-400/40">Location</span>
        <span className="text-[10px] font-light text-white/70">KM 47, Lekki-Epe Express Way, Oko-Ado, Lagos.</span>
      </div>
      <div className="flex flex-wrap md:flex-nowrap gap-4 md:gap-6">
        <a href="#" className="text-[9px] uppercase tracking-widest text-white/60 hover:text-white transition-colors">IG: @olenixlounge</a>
        <a href="#" className="text-[9px] uppercase tracking-widest text-white/60 hover:text-white transition-colors">TikTok: @olenix_xclusivelounge</a>
        <a href="#" className="text-[9px] uppercase tracking-widest text-white/60 hover:text-white transition-colors">FB: Olenix Olenix</a>
      </div>
    </footer>
  );
}
