import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookingModal from '../components/BookingModal';
import { watchHashScroll } from '../lib/hashScroll';
import { supabase } from '../lib/supabase';
import { listMenuCategories, listMenuItems } from '../lib/menuApi';
import { resolveImageUrl } from '../lib/menuImages';
import { mapCategory, mapMenuItem, type MenuCategory, type MenuItem } from '../types/database';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => watchHashScroll(), []);

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
      .channel('public-menu-page')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menu' }, fetchMenu)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_categories' }, fetchMenu)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchMenu]);

  // Group items by category
  let fullMenu = categories.map((cat) => ({
    id: cat.id,
    category: cat.name,
    imageUrl: resolveImageUrl(cat.imageUrl),
    items: menuItems.filter((item) => item.category === cat.name),
  }));

  // Handle items that belong to categories that don't exist in menu_categories
  const existingCatNames = categories.map((c) => c.name);
  const orphanItems = menuItems.filter((item) => !existingCatNames.includes(item.category));
  if (orphanItems.length > 0) {
    const orphanGroups = orphanItems.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, MenuItem[]>);

    for (const [catName, items] of Object.entries(orphanGroups)) {
      fullMenu.push({ id: `orphan-${catName}`, category: catName, imageUrl: '', items });
    }
  }

  // Filter based on search query
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    fullMenu = fullMenu.map(section => ({
      ...section,
      items: section.items.filter(item => 
        item.name.toLowerCase().includes(q) || 
        (item.desc && item.desc.toLowerCase().includes(q))
      )
    }));
  }

  // Finally filter out empty sections
  fullMenu = fullMenu.filter((section) => section.items.length > 0);

  const scrollToCategory = (categoryId: string) => {
    const el = document.getElementById(`category-${categoryId}`);
    if (el) {
      // Offset by navbar height (80px) + sticky subnav height (approx 60px) + padding
      const top = el.getBoundingClientRect().top + window.scrollY - 160;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20">
      <Navbar />
      
      {/* Hero Header */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 md:px-12 bg-black bg-gradient-to-tr from-gold-500/10 via-black to-white/5 border-b border-white/10 relative">
        <div className="max-w-[1280px] mx-auto text-center">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="flex flex-col items-center"
          >
            <span className="text-[10px] uppercase tracking-[0.4em] font-semibold text-gold-500 mb-4">Taste of Luxury</span>
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">Our Full Menu</h1>
            <div className="w-16 h-[1px] bg-gold-500/50 mx-auto mb-8" />
            <p className="text-white/60 font-light max-w-xl text-sm leading-relaxed">
              Explore our curated selection of premium beverages, signature cocktails, and exquisite dishes crafted for an unforgettable experience.
            </p>
          </motion.div>
        </div>
      </section>

      {loading ? (
        <div className="py-24 text-center text-white/40 text-sm animate-pulse">Loading menu...</div>
      ) : (
        <>
          {/* Sticky Category Navigation & Search */}
          <div className="sticky top-20 z-40 bg-black/95 backdrop-blur-md border-b border-white/10">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6 overflow-x-auto w-full sm:w-auto [&::-webkit-scrollbar]:hidden whitespace-nowrap">
                {fullMenu.map((section) => (
                  <button
                    key={`nav-${section.id}`}
                    onClick={() => scrollToCategory(section.id || section.category)}
                    className="text-[10px] uppercase tracking-widest text-white/60 hover:text-gold-400 transition-colors font-bold shrink-0"
                  >
                    {section.category}
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:w-64 shrink-0">
                <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search menu..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 py-2 pl-10 pr-4 text-xs text-white placeholder:text-white/40 focus:border-gold-500 outline-none rounded-sm transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Menu Sections */}
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-24 md:space-y-32">
            {fullMenu.map((section) => (
              <section key={section.id} id={`category-${section.id || section.category}`} className="scroll-mt-40">
                <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
                  {/* Category Header/Image */}
                  <div className="md:w-1/3 flex flex-col gap-6">
                    {section.imageUrl && (
                      <div className="w-full aspect-[4/3] rounded-sm overflow-hidden relative">
                        <img src={section.imageUrl} alt={section.category} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20" />
                      </div>
                    )}
                    <div>
                      <h2 className="text-3xl font-serif text-gold-500 uppercase tracking-widest mb-4">{section.category}</h2>
                      <div className="w-12 h-[1px] bg-gold-500/20" />
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="md:w-2/3 flex flex-col gap-8 md:gap-10">
                    {section.items.map((item) => (
                      <div key={item.id} className="group">
                        <div className="flex justify-between items-baseline mb-2">
                          <h4 className="text-base font-bold uppercase tracking-widest text-white group-hover:text-gold-400 transition-colors pr-4">{item.name}</h4>
                          <span className="text-sm font-mono text-gold-500 shrink-0">{item.price}</span>
                        </div>
                        <p className="text-sm text-white/60 font-light leading-relaxed max-w-2xl">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ))}

            {fullMenu.length === 0 && (
              <div className="text-center text-white/40 py-24">
                No menu items available at the moment.
              </div>
            )}
          </div>
        </>
      )}

      <Footer />
      <BookingModal />
    </div>
  );
}
