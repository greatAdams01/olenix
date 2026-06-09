import { motion } from 'motion/react';

const features = [
  {
    img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80',
    title: 'Premium Cuisine',
    description: 'Exquisite Nigerian and International dishes crafted to perfection.'
  },
  {
    img: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&q=80',
    title: 'Elegant Spaces',
    description: 'Luxurious dining and relaxation areas, including Outdoor Seating & VIP Sections.'
  },
  {
    img: 'https://images.unsplash.com/photo-1530103862676-de8c9d09c251?auto=format&fit=crop&q=80',
    title: 'Exceptional Service',
    description: 'A dedicated team ensuring your comfort and satisfaction at all times.'
  },
  {
    img: 'https://images.unsplash.com/photo-1574391884720-bbc3740c5b68?auto=format&fit=crop&q=80',
    title: 'Vibrant Nightlife',
    description: 'Dynamic entertainment creating the perfect atmosphere for your evenings.'
  },
  {
    img: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80',
    title: 'Memorable Experiences',
    description: 'Tailored moments for families, friends, and professionals to connect.'
  }
];

export default function Features() {
  return (
    <section id="features" className="bg-black bg-gradient-to-tl from-gold-500/20 via-black to-white/5 text-gold-400 px-4 md:px-12 border-t border-white/10">
      <div className="max-w-[1280px] mx-auto py-24">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
           className="mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-serif mb-4">Why Choose Us</h2>
          <div className="w-16 h-[1px] bg-white/30" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l border-t border-white/10">
          {features.map((feature, index) => (
             <motion.div
               key={index}
               initial={{ opacity: 0, y: 10 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6, delay: index * 0.1 }}
               className={`relative flex flex-col justify-end min-h-[350px] border-b border-r border-white/10 overflow-hidden group ${index === 4 ? 'md:col-span-2 lg:col-span-1' : ''}`}
             >
               <img 
                 src={feature.img} 
                 alt={feature.title} 
                 className="absolute inset-0 w-full h-full object-cover grayscale opacity-30 group-hover:opacity-70 group-hover:scale-105 group-hover:grayscale-[0.2] transition-all duration-700 mix-blend-luminosity group-hover:mix-blend-normal" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
               <div className="relative z-10 p-10 flex flex-col justify-end h-full">
                 <span className="text-[10px] uppercase tracking-widest text-gold-400/50 mb-3 group-hover:text-gold-400/80 transition-colors">{feature.title}</span>
                 <span className="text-sm md:text-base font-light text-gold-400/90 leading-relaxed group-hover:text-gold-400 transition-colors">{feature.description}</span>
               </div>
             </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
