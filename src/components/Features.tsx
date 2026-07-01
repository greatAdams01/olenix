import { motion } from 'motion/react';

const features = [
  {
    img: '/img/img-37.jpg',
    title: 'Premium Spirits',
    description:
      'Our bar features champagne, cognac, whiskey, wine, and spirits — curated for celebrations and late-night indulgence.',
  },
  {
    img: '/img/img-27.jpg',
    title: 'VIP & Bottle Service',
    description:
      'Exclusive sections with dedicated service. Reserve your spot and enjoy a truly private lounge experience.',
  },
  {
    img: '/img/img-40.jpg',
    title: 'Live Entertainment',
    description:
      'From live bands to comedy and karaoke — something special every night of the week.',
  },
];

export default function Features() {
  return (
    <section id="features" className="border-t border-warm section-warm">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 md:py-20 border-b border-warm">
        <p className="section-eyebrow mb-3">The Experience</p>
        <h2 className="section-title text-3xl md:text-4xl">What we offer</h2>
      </div>

      {features.map((feature, index) => {
        const isDark = index % 2 === 0;
        return (
          <motion.article
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            className={`grid lg:grid-cols-2 border-b border-warm ${index % 2 === 1 ? 'lg:[direction:rtl]' : ''}`}
          >
            <div className={`relative min-h-[280px] lg:min-h-[440px] overflow-hidden ${index % 2 === 1 ? 'lg:[direction:ltr]' : ''}`}>
              <img
                src={feature.img}
                alt={feature.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover hover:scale-[1.03] transition-transform duration-700"
              />
            </div>
            <div
              className={`relative flex flex-col justify-center px-6 sm:px-10 lg:px-16 xl:px-20 py-14 md:py-16 ${
                isDark ? 'section-dark' : 'section-light'
              } ${index % 2 === 1 ? 'lg:[direction:ltr]' : ''}`}
            >
              {isDark && <div className="absolute inset-0 lounge-glow-dark pointer-events-none" />}
              <div className="relative">
                <span className={`text-[10px] uppercase tracking-[0.3em] font-bold mb-4 block ${isDark ? 'text-gold-400' : 'text-gold-600'}`}>
                  0{index + 1}
                </span>
                <h3 className={`font-serif text-2xl md:text-4xl mb-5 ${isDark ? 'text-cream-50' : 'text-warm-900'}`}>
                  {feature.title}
                </h3>
                <p className="section-body text-sm md:text-base font-light leading-relaxed max-w-md">{feature.description}</p>
              </div>
            </div>
          </motion.article>
        );
      })}
    </section>
  );
}
