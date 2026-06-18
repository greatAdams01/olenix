import { motion } from 'motion/react';

export default function Gallery() {
  // We have images from img-14.jpg to img-48.jpg
  const images = Array.from({ length: 35 }, (_, i) => `/img/img-${i + 14}.jpg`);

  return (
    <section id="gallery" className="py-24 bg-black border-t border-white/10 px-4 md:px-12">
      <div className="max-w-[1280px] mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-16 md:mb-24"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] font-semibold text-gold-500">The Experience</span>
          <h2 className="text-3xl md:text-5xl font-serif text-white mt-4 mb-6">Our Gallery</h2>
          <div className="w-12 h-[1px] bg-gold-500/50 mx-auto" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((src, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (idx % 10) * 0.1, duration: 0.5 }}
              className="relative aspect-square overflow-hidden group rounded-sm border border-white/10"
            >
              <img
                src={src}
                alt={`Gallery image ${idx + 1}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
