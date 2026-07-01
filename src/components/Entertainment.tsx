import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const lineup = [
  { name: 'Movie Night', day: 'Mondays', img: '/img/img-1.jpg' },
  { name: "Ladies' Night", day: 'Wednesdays', img: '/img/img-2.jpg' },
  { name: 'Karaoke Night', day: 'Thursdays', img: '/img/img-3.jpg' },
  { name: 'Music & Vibes', day: 'Fridays', img: '/img/img-4.jpg' },
  { name: 'Comedy Night', day: 'Saturdays', img: '/img/img-5.jpg' },
  { name: 'Exotic Live Band', day: 'Sundays', img: '/img/img-6.jpg' },
];

export default function Entertainment() {
  const [active, setActive] = useState(0);

  return (
    <section id="entertainment" className="border-t border-warm-dark section-dark">
      <div className="grid lg:grid-cols-2">
        <div className="relative px-6 sm:px-10 lg:px-16 xl:px-20 py-16 md:py-24 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-warm-dark">
          <div className="absolute inset-0 lounge-glow-dark pointer-events-none" />
          <div className="relative">
            <p className="section-eyebrow mb-4">Weekly lineup</p>
            <h2 className="section-title text-3xl md:text-5xl mb-10 leading-tight text-cream-50">
              Nights at
              <br />
              Olenix
            </h2>
            <ul className="space-y-0">
              {lineup.map((event, index) => (
                <li key={event.name}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    className={`w-full flex justify-between items-baseline gap-4 py-4 border-t border-gold-500/20 text-left transition-colors ${
                      active === index ? 'text-gold-400' : 'text-cream-50/90 hover:text-gold-400'
                    }`}
                  >
                    <span className="font-serif text-lg md:text-2xl">{event.name}</span>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-cream-50/45 shrink-0">{event.day}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative min-h-[400px] lg:min-h-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={lineup[active].img}
              src={lineup[active].img}
              alt={lineup[active].name}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-lounge-950/90 to-transparent">
            <p className="text-cream-50 text-sm font-serif italic">{lineup[active].name}</p>
            <p className="text-cream-50/60 text-[10px] uppercase tracking-widest mt-1">{lineup[active].day}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
