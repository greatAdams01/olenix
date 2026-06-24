import { MapPin } from 'lucide-react';

export default function MapSection() {
  return (
    <section id="location" className="py-24 px-4 md:px-12 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex flex-col gap-4 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-light tracking-tighter text-white uppercase">
              <span className="text-white/40 italic mr-4 font-serif">Our</span>
              Location
            </h2>
            <p className="text-white/60 font-light leading-relaxed text-sm md:text-base max-w-md">
              Discover the ultimate nightlife destination in Lagos. Join us for unforgettable experiences, premium drinks, and exclusive entertainment.
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-4 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Address</span>
              <span className="text-sm font-light text-white">KM 47, Lekki-Epe Express Way,<br/>Oko-Ado, Lagos.</span>
            </div>
          </div>
        </div>
        
        <div className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden border border-white/10 relative bg-zinc-900">
          <iframe 
            src="https://maps.google.com/maps?q=Olenix+Lounge,+Lekki-Epe+Express+Way,+Lagos&t=m&z=15&ie=UTF8&iwloc=&output=embed" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 w-full h-full filter invert grayscale opacity-80 hover:filter-none hover:opacity-100 transition-all duration-700 ease-in-out"
          ></iframe>
          
          {/* Overlay to ensure the map looks part of the dark theme initially */}
          <div className="absolute inset-0 pointer-events-none mix-blend-overlay bg-black/20"></div>
        </div>
      </div>
    </section>
  );
}
