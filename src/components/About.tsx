import { motion } from 'motion/react';

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-black text-white px-4 md:px-12 border-t border-white/10">
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
              <h2 className="text-[10px] text-white/40 uppercase tracking-[0.4em] font-semibold mb-6">Our Story</h2>
              <p className="text-white/70 font-light leading-relaxed text-lg max-w-xl">
                Nestled in the heart of Sangotedo, Lagos, Olenix Xclusive Lounge is a distinctive destination for friends, families, and professionals to relax, connect, and enjoy premium hospitality. We combine exquisite cuisine, refreshing beverages, exceptional service, and vibrant entertainment to create memorable experiences.
              </p>
            </div>
            
            <div className="pl-6 border-l w-max border-white/20">
              <h2 className="text-[10px] text-white/40 uppercase tracking-[0.4em] font-semibold mb-4">Our Philosophy</h2>
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
               <img src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80" alt="Lounge Cocktails" className="w-full h-full object-cover grayscale opacity-80 mix-blend-luminosity group-hover:mix-blend-normal group-hover:grayscale-[0.2] group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" />
               <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-1000"></div>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="bg-zinc-950 p-10 border border-white/5 hover:border-white/20 transition-colors">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 mb-6">Mission</h3>
                  <p className="text-white/50 text-sm leading-relaxed font-light">
                     To consistently deliver exceptional hospitality through quality Nigerian and international cuisine, outstanding service, a welcoming ambiance, and engaging entertainment.
                  </p>
                </div>
                <div className="bg-zinc-950 p-10 border border-white/5 hover:border-white/20 transition-colors">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 mb-6">Vision</h3>
                  <p className="text-white/50 text-sm leading-relaxed font-light">
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
