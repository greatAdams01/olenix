import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Loader2 } from 'lucide-react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Menu() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'menu'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data());
      setMenuItems(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const groupedMenu = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = { category: item.category, items: [] };
    acc[item.category].items.push(item);
    return acc;
  }, {} as Record<string, { category: string, items: any[] }>);

  const fullMenu = Object.values(groupedMenu);
  const featuredMenuItems = fullMenu.slice(0, 3);

  const filteredMenu = fullMenu.map(section => ({
    ...section,
    items: section.items.filter((item: any) => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.desc?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  return (
    <>
      <section id="menu" className="py-24 bg-black bg-gradient-to-tr from-gold-500/10 via-black to-white/5 px-4 md:px-12 border-t border-white/10 relative">
        <div className="max-w-[1280px] mx-auto">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-center mb-16 md:mb-24"
          >
            <span className="text-[10px] uppercase tracking-[0.4em] font-semibold text-gold-500">Taste of Luxury</span>
            <h2 className="text-4xl md:text-6xl font-serif text-white mt-4 mb-6">Our Menu</h2>
            <div className="w-12 h-[1px] bg-gold-500/50 mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-8 mb-16">
            {featuredMenuItems.map((section, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col gap-8"
              >
                <h3 className="text-xl font-serif text-gold-500 uppercase tracking-widest border-b border-gold-500/20 pb-4">{section.category}</h3>
                <div className="flex flex-col gap-8">
                  {section.items.map((item, i) => (
                    <div key={i} className="group cursor-pointer">
                      <div className="flex justify-between items-baseline mb-2">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-white group-hover:text-gold-400 transition-colors pr-4">{item.name}</h4>
                        <span className="text-xs font-mono text-gold-500 shrink-0">{item.price}</span>
                      </div>
                      <p className="text-xs text-white/70 font-light leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-block px-10 py-4 border border-gold-500 text-gold-500 text-xs font-bold uppercase tracking-widest hover:bg-gold-500 hover:text-black transition-all"
            >
              View Full Menu
            </button>
          </div>
        </div>
      </section>

      {/* Full Menu Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl h-[90vh] flex flex-col bg-zinc-950/90 backdrop-blur-xl border border-gold-500/20 shadow-[0_0_50px_rgba(212,175,55,0.1)] rounded-sm overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-50" />
              
              <div className="p-6 md:p-10 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 shrink-0 bg-black/50">
                <div>
                  <h2 className="text-2xl md:text-3xl font-serif text-white mb-2">Full Menu</h2>
                  <p className="text-[10px] text-gold-500 uppercase tracking-widest">Explore our complete offerings</p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Search menu..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 py-2 pl-10 pr-4 text-xs text-white placeholder:text-white/40 focus:border-gold-500 outline-none rounded-sm transition-colors"
                  />
                </div>

                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 md:top-8 md:right-8 text-white/50 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-10 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gold-500/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                {filteredMenu.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {filteredMenu.map((section, idx) => (
                      <div key={idx} className="flex flex-col gap-6">
                        <h3 className="text-lg font-serif text-gold-500 uppercase tracking-widest border-b border-gold-500/20 pb-2 sticky top-0 bg-zinc-950/90 py-2 z-10 backdrop-blur-sm">{section.category}</h3>
                        <div className="flex flex-col gap-6">
                          {section.items.map((item, i) => (
                            <div key={i} className="group">
                              <div className="flex justify-between items-baseline mb-1">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-white pr-4">{item.name}</h4>
                                <span className="text-[10px] font-mono text-gold-500 shrink-0">{item.price}</span>
                              </div>
                              <p className="text-[10px] text-white/60 font-light leading-relaxed">{item.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                    <Search className="w-12 h-12 text-white/20 mb-4" />
                    <p className="text-white text-sm">No menu items found matching "{searchQuery}"</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
