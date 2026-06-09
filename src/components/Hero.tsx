import { motion } from 'motion/react';

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden relative">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-60 grayscale mix-blend-luminosity"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80')` }}
      />
      
      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/80 via-transparent to-transparent" />
      
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-20">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="text-white/40 uppercase tracking-[0.4em] text-xs md:text-sm mb-6 font-medium">Olenix Xclusive Lounge</p>
          <h1 className="text-6xl md:text-7xl xl:text-[80px] font-serif text-white mb-8 leading-[0.85]">
            Where luxury<br className="hidden md:block"/><span className="italic text-white/50 md:ml-4">meets nightlife.</span>
          </h1>
          <p className="text-lg text-white/60 font-light max-w-md mx-auto border-l-2 border-white/20 pl-6 text-left mb-12">
            Where Exceptional Dining Meets Unforgettable Experiences.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#reservations"
              className="w-full sm:w-auto px-8 py-4 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors"
            >
              Make a Reservation
            </a>
            <a 
              href="#entertainment"
              className="w-full sm:w-auto px-8 py-4 bg-transparent text-white border border-white/20 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
            >
              Explore Events
            </a>
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 opacity-70"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <span className="block text-[10px] uppercase tracking-widest text-white mb-4 text-center">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent mx-auto" />
      </motion.div>
    </div>
  );
}
