import { motion } from 'motion/react';

export default function About() {
  return (
    <section id="about" className="border-t border-warm section-light">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl"
        >
          <p className="section-eyebrow mb-5">Welcome</p>
          <h2 className="section-title text-3xl sm:text-4xl md:text-5xl leading-tight mb-8">
            Located in Sangotedo, Olenix is a lounge &amp; cocktail bar with premium spirits and robust culinary offerings.
          </h2>
          <p className="section-body text-base md:text-lg font-light leading-relaxed">
            A distinctive destination for friends, families, and professionals to relax, connect, and enjoy exceptional
            hospitality — from top-shelf bottles to live entertainment, every night of the week.
          </p>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 border-t border-warm">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative min-h-[320px] lg:min-h-[520px] overflow-hidden"
        >
          <img src="/img/img-39.jpg" alt="Olenix lounge atmosphere" className="absolute inset-0 w-full h-full object-cover" />
        </motion.div>
        <div className="section-dark relative flex flex-col justify-center px-6 sm:px-10 lg:px-16 xl:px-20 py-16 md:py-20 border-t lg:border-t-0 lg:border-l border-warm-dark">
          <div className="absolute inset-0 lounge-glow-dark pointer-events-none" />
          <div className="relative">
            <p className="section-eyebrow mb-4">Philosophy</p>
            <blockquote className="font-serif text-2xl md:text-3xl text-cream-50 italic leading-snug mb-10">
              &ldquo;After the haste of the day — a place to relax, unwind, and celebrate.&rdquo;
            </blockquote>
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.25em] text-gold-400 font-bold mb-3">Mission</h3>
                <p className="section-body text-sm leading-relaxed font-light">
                  Deliver exceptional hospitality through quality cuisine, outstanding service, and engaging entertainment.
                </p>
              </div>
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.25em] text-gold-400 font-bold mb-3">Vision</h3>
                <p className="section-body text-sm leading-relaxed font-light">
                  Nigeria&apos;s preferred destination for premium dining, relaxation, and nightlife.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
