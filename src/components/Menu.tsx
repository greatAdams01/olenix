import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { listMenuCategories, listMenuItems } from '../lib/menuApi';
import { resolveImageUrl } from '../lib/menuImages';
import { mapCategory, mapMenuItem, type MenuCategory, type MenuItem } from '../types/database';
import CloudinaryImg from './CloudinaryImg';

export default function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMenu = useCallback(async () => {
    const [itemsRes, catsRes] = await Promise.all([listMenuItems(), listMenuCategories()]);

    if (itemsRes.error) {
      console.error(itemsRes.error);
    } else if (itemsRes.data) {
      setMenuItems(itemsRes.data.map(mapMenuItem));
    }

    if (catsRes.error) {
      console.error(catsRes.error);
    } else if (catsRes.data) {
      setCategories(catsRes.data.map(mapCategory));
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMenu();

    const channel = supabase
      .channel('public-menu')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menu' }, fetchMenu)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_categories' }, fetchMenu)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchMenu]);

  const fullMenu = categories.map((cat) => ({
    id: cat.id,
    category: cat.name,
    imageUrl: cat.imageUrl,
    items: menuItems.filter((item) => item.category === cat.name),
  })).filter((section) => section.items.length > 0);

  const featuredMenuItems = [...fullMenu]
    .sort((a, b) => a.category.localeCompare(b.category))
    .slice(0, 3)
    .map((section) => ({
      ...section,
      items: section.items.slice(0, 4),
    }));

  if (loading) {
    return (
      <section id="menu" className="py-24 bg-black px-4 md:px-12 border-t border-white/10">
        <div className="max-w-[1280px] mx-auto text-center text-white/40 text-sm animate-pulse">Loading menu...</div>
      </section>
    );
  }

  return (
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
          {featuredMenuItems.map((section) => (
            <motion.div 
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex flex-col gap-6"
            >
              {section.imageUrl && (
                <div className="w-full h-48 sm:h-64 rounded-sm overflow-hidden relative mb-2">
                  <CloudinaryImg publicId={section.imageUrl} alt={section.category} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20" />
                </div>
              )}
              <h3 className="text-xl font-serif text-gold-500 uppercase tracking-widest border-b border-gold-500/20 pb-4">{section.category}</h3>
              <div className="flex flex-col gap-6">
                {section.items.map((item) => (
                  <div key={item.id} className="group cursor-pointer">
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
          <Link 
            to="/menu"
            className="inline-block px-10 py-4 border border-gold-500 text-gold-500 text-xs font-bold uppercase tracking-widest hover:bg-gold-500 hover:text-black transition-all"
          >
            View Full Menu
          </Link>
        </div>
      </div>
    </section>
  );
}
