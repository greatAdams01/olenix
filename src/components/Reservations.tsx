import { motion } from 'motion/react';

export default function Reservations() {
  return (
    <section id="reservations" className="border-t border-warm section-light">
      <div className="grid lg:grid-cols-2 min-h-[480px]">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden min-h-[320px]"
        >
          <img src="/img/img-4.jpg" alt="VIP experience at Olenix" className="absolute inset-0 w-full h-full object-cover" />
        </motion.div>

        <div className="section-dark relative flex flex-col justify-center px-6 sm:px-10 lg:px-16 xl:px-24 py-16 md:py-24">
          <div className="absolute inset-0 lounge-glow-dark pointer-events-none" />
          <div className="relative">
            <p className="section-eyebrow mb-5">Reservations</p>
            <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl leading-tight mb-6 text-cream-50">
              Book a table
            </h2>
            <p className="section-body font-light leading-relaxed max-w-md mb-10 text-sm md:text-base">
              We look forward to hosting you. VIP sections, bottle service, and confirmed reservations — secure your spot via WhatsApp or our booking form.
            </p>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event('open-booking-modal'))}
              className="btn-gold self-start"
            >
              Make a reservation
            </button>
            <p className="mt-10 text-[10px] uppercase tracking-widest text-cream-50/40">
              Open 24 hours · Deposit required · Cancel 24h ahead
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
