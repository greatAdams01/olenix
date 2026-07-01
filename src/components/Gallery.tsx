import { motion } from 'motion/react';

export default function Gallery() {
  const images = Array.from({ length: 35 }, (_, i) => `/img/img-${i + 14}.jpg`);
  const heroImage = images[0];
  const gridImages = images.slice(1, 13);

  return (
    <section id="gallery" className="border-t border-warm-dark section-dark">
      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 md:py-20">
        <div className="absolute inset-0 lounge-glow-dark pointer-events-none" />
        <div className="relative">
          <p className="section-eyebrow mb-3">The vibe</p>
          <h2 className="section-title text-3xl md:text-5xl text-cream-50">Gallery</h2>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="w-full max-h-[70vh] overflow-hidden border-y border-warm-dark"
      >
        <img src={heroImage} alt="Olenix lounge" className="w-full h-full object-cover max-h-[70vh]" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
          {gridImages.map((src, idx) => (
            <motion.div
              key={src}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (idx % 8) * 0.04 }}
              className="aspect-square overflow-hidden group ring-1 ring-gold-500/10"
            >
              <img
                src={src}
                alt={`Olenix ${idx + 2}`}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
