import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const slideImages = ['/img/img-39.jpg', '/img/img-23.jpg', '/img/img-43.jpg'];

export default function About() {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % slideImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="about" className="py-24 md:py-32 bg-black bg-gradient-to-tl from-gold-500/20 via-black to-white/5 px-4 md:px-12 border-t border-white/10">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-12"
          >
            <div>
              <h2 className="text-[10px] text-gold-500 uppercase tracking-[0.4em] font-semibold mb-6">Our Story</h2>
              <p className="text-white/80 font-light leading-relaxed text-lg max-w-xl">
                Nestled in the heart of Sangotedo, Lagos, Olenix Xclusive Lounge is a distinctive destination for friends, families, and professionals to relax, connect, and enjoy premium hospitality. We combine exquisite cuisine, refreshing beverages, exceptional service, and vibrant entertainment to create memorable experiences.
              </p>
            </div>
            
            <div className="pl-6 border-l w-max border-gold-500/30">
              <h2 className="text-[10px] text-gold-500 uppercase tracking-[0.4em] font-semibold mb-4">Our Philosophy</h2>
              <p className="text-2xl lg:text-3xl font-serif text-white italic">
                "Fresh Flavours. Healthy Choices.<br/>Exceptional Experiences."
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-12"
          >
             <div className="relative h-[300px] sm:h-[400px] w-full border border-white/10 overflow-hidden group">
               <AnimatePresence mode="wait">
                 <motion.img 
                   key={currentImgIndex}
                   src={slideImages[currentImgIndex]} 
                   alt="Lounge Story" 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   transition={{ duration: 1 }}
                   className="absolute inset-0 w-full h-full object-cover grayscale opacity-80 mix-blend-luminosity group-hover:mix-blend-normal group-hover:grayscale-[0.2] group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" 
                 />
               </AnimatePresence>
               <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-1000 z-10 pointer-events-none"></div>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="bg-zinc-950 p-10 border border-white/5 hover:border-gold-500/30 transition-colors shadow-[0_0_20px_rgba(212,175,55,0.02)]">
                  <h3 className="text-xl font-serif text-gold-500 mb-6 uppercase tracking-widest">Mission</h3>
                  <p className="text-white/80 text-lg leading-relaxed font-serif italic">
                     To consistently deliver exceptional hospitality through quality Nigerian and international cuisine, outstanding service, a welcoming ambiance, and engaging entertainment.
                  </p>
                </div>
                <div className="bg-zinc-950 p-10 border border-white/5 hover:border-gold-500/30 transition-colors shadow-[0_0_20px_rgba(212,175,55,0.02)]">
                  <h3 className="text-xl font-serif text-gold-500 mb-6 uppercase tracking-widest">Vision</h3>
                  <p className="text-white/80 text-lg leading-relaxed font-serif italic">
                     To become Nigeria’s preferred destination for premium dining, relaxation, and entertainment by setting the standard for quality service, vibrant experiences, and lasting guest satisfaction.
                  </p>
                </div>
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
