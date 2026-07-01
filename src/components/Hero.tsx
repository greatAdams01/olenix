import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] grid lg:grid-cols-2">
      {/* Dark editorial copy */}
      <div className="section-dark relative z-10 flex flex-col justify-end px-6 sm:px-10 lg:px-16 xl:px-20 pt-36 pb-12 lg:py-24 lg:min-h-[100svh] order-2 lg:order-1">
        <div className="absolute inset-0 lounge-glow-dark pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative max-w-xl"
        >
          <p className="section-eyebrow mb-6">Sangotedo, Lagos</p>
          <h1 className="font-serif text-[2.75rem] sm:text-5xl lg:text-[3.25rem] xl:text-6xl text-cream-50 leading-[1.05] tracking-tight mb-8">
            A Lagos
            <br />
            <span className="italic text-gold-400">cocktail bar</span>
            <br />
            &amp; lounge
          </h1>
          <p className="section-body text-base md:text-lg font-light leading-relaxed mb-10 max-w-md">
            Premium spirits, curated nights, and a place to unwind after the haste of the day — open every hour, every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event('open-booking-modal'))}
              className="btn-gold w-full sm:w-auto"
            >
              Book a table
            </button>
            <Link to="/menu" className="btn-outline-light w-full sm:w-auto text-center">
              View menu
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Hero image */}
      <div className="relative min-h-[45vh] lg:min-h-[100svh] order-1 lg:order-2 overflow-hidden">
        <img
          src="/img/img-43.jpg"
          alt="Olenix Xclusive Lounge interior"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-lounge-950/80 via-transparent to-transparent lg:from-lounge-950/50" />
        <div className="absolute bottom-6 left-6 right-6 lg:left-auto lg:right-8 lg:bottom-12 lg:max-w-xs">
          <p className="text-[10px] uppercase tracking-[0.3em] text-cream-50/90 font-semibold drop-shadow-sm">
            Open 24 hours · 365 days
          </p>
        </div>
      </div>
    </section>
  );
}
