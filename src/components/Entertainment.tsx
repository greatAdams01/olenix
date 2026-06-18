import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const lineup = [
  { name: 'Movie Night', day: 'Mondays', img: '/img/img-1.jpg' },
  { name: 'Ladies\' Night', day: 'Wednesdays', img: '/img/img-2.jpg' },
  { name: 'Karaoke Night', day: 'Thursdays', img: '/img/img-3.jpg' },
  { name: 'Music and Vibes', day: 'Fridays', img: '/img/img-4.jpg' },
  { name: 'Comedy Night', day: 'Saturdays', img: '/img/img-5.jpg' },
  { name: 'Exotic Lifeband', day: 'Sundays', img: '/img/img-6.jpg' },
];

export default function Entertainment() {
  const [activeImg, setActiveImg] = useState(lineup[0].img);

  return (
    <section id="entertainment" className="py-24 bg-zinc-950 bg-gradient-to-tl from-gold-500/20 via-zinc-950 to-white/5 px-4 border-t border-white/10">
      <div className="max-w-[1280px] mx-auto md:px-12">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
           className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-12 gap-4"
        >
          <h2 className="text-3xl md:text-5xl font-serif text-gold-400">Weekly Lineup</h2>
          <span className="text-xs uppercase tracking-[0.4em] font-semibold text-gold-400/40">Curated Vibes</span>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 mt-12">
          <div className="w-full lg:w-1/2">
            <ul className="space-y-0 border-t border-white/10">
              {lineup.map((event, index) => (
                 <motion.li
                   key={index}
                   onMouseEnter={() => setActiveImg(event.img)}
                   initial={{ opacity: 0, x: -20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 0.5, delay: index * 0.1 }}
                   className="flex justify-between items-center group cursor-pointer py-6 border-b border-white/10"
                 >
                   <span className="text-xl md:text-3xl font-serif text-white group-hover:text-gold-400 group-hover:italic transition-all">{event.name}</span>
                   <span className="text-[10px] md:text-xs tracking-[0.2em] font-mono text-white/60 uppercase group-hover:text-white">{event.day}</span>
                 </motion.li>
              ))}
            </ul>
          </div>
          <div className="w-full lg:w-1/2 relative h-[400px] lg:h-[600px] overflow-hidden border border-white/10">
             <AnimatePresence mode="wait">
               <motion.img 
                  key={activeImg}
                  src={activeImg}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 w-full h-full object-cover grayscale opacity-80 mix-blend-luminosity"
               />
             </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
