import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const lineup = [
  { name: 'Premium Live Band', day: 'Wednesdays', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80' },
  { name: 'Vibes and Comedy Night', day: 'Thursdays', img: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&q=80' },
  { name: 'Music and Vibes Night', day: 'Fridays', img: 'https://images.unsplash.com/photo-1544785349-c4a5301826fd?auto=format&fit=crop&q=80' },
  { name: 'Karaoke Night', day: 'Saturdays', img: 'https://images.unsplash.com/photo-1516280440502-861d8fcfe148?auto=format&fit=crop&q=80' },
  { name: 'Ladies Night', day: 'Sundays', img: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&q=80' },
  { name: 'Movie Night', day: 'Tuesdays', img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80' },
];

export default function Entertainment() {
  const [activeImg, setActiveImg] = useState(lineup[0].img);

  return (
    <section id="entertainment" className="py-24 bg-zinc-950 bg-gradient-to-tl from-gold-500/20 via-zinc-950 to-white/5 text-gold-400 px-4 border-t border-white/10">
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
                   <span className="text-xl md:text-3xl font-serif text-gold-400/60 group-hover:text-gold-400 group-hover:italic transition-all">{event.name}</span>
                   <span className="text-[10px] md:text-xs tracking-[0.2em] font-mono text-gold-400/40 uppercase group-hover:text-gold-400/80">{event.day}</span>
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
