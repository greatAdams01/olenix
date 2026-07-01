import { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookingModal from '../components/BookingModal';
import { watchHashScroll } from '../lib/hashScroll';
import { supabase } from '../lib/supabase';
import { listMenuCategories, listMenuItems } from '../lib/menuApi';
import { mapCategory, mapMenuItem, type MenuCategory, type MenuItem } from '../types/database';
import CloudinaryImg from '../components/CloudinaryImg';

const EXCLUSIVE_CATEGORIES = [
  'Champagne',
  'Cognac',
  'Whiskey & Brandy',
  'Tequila',
  'Spirit & Vodka',
  'Wine',
  'Premium Additions',
];

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => watchHashScroll(), []);

  const fetchMenu = useCallback(async () => {
    const [itemsRes, catsRes] = await Promise.all([listMenuItems(), listMenuCategories()]);

    if (itemsRes.error) console.error(itemsRes.error);
    else if (itemsRes.data) setMenuItems(itemsRes.data.map(mapMenuItem));

    if (catsRes.error) console.error(catsRes.error);
    else if (catsRes.data) setCategories(catsRes.data.map(mapCategory));

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMenu();
    const channel = supabase
      .channel('public-menu-page')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menu' }, fetchMenu)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_categories' }, fetchMenu)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchMenu]);

  let fullMenu = categories.map((cat) => ({
    id: cat.id,
    category: cat.name,
    imageUrl: cat.imageUrl,
    items: menuItems.filter((item) => item.category === cat.name),
  }));

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

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    fullMenu = fullMenu.map((section) => ({
      ...section,
      items: section.items.filter(
        (item) => item.name.toLowerCase().includes(q) || (item.desc && item.desc.toLowerCase().includes(q)),
      ),
    }));
  }

  fullMenu = fullMenu.filter((section) => section.items.length > 0);

  fullMenu.sort((a, b) => {
    const aEx = EXCLUSIVE_CATEGORIES.includes(a.category);
    const bEx = EXCLUSIVE_CATEGORIES.includes(b.category);
    if (aEx && !bEx) return -1;
    if (!aEx && bEx) return 1;
    return a.category.localeCompare(b.category);
  });

  const scrollToCategory = (categoryId: string) => {
    const el = document.getElementById(`category-${categoryId}`);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 160;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 text-warm-900 font-sans">
      <Navbar />

      <section className="section-dark relative pt-28 pb-12 md:pt-32 md:pb-16 px-6 sm:px-10 lg:px-16 border-b border-warm-dark">
        <div className="absolute inset-0 lounge-glow-dark pointer-events-none" />
        <div className="relative max-w-7xl mx-auto">
          <p className="section-eyebrow mb-4">Food &amp; drink</p>
          <h1 className="section-title text-4xl md:text-6xl lg:text-7xl leading-tight max-w-3xl text-cream-50">
            Full menu
          </h1>
          <p className="section-body font-light max-w-xl text-sm md:text-base leading-relaxed mt-6">
            Premium spirits, signature pours, and exquisite dishes — everything we serve at Olenix.
          </p>
        </div>
      </section>

      {loading ? (
        <div className="py-24 text-center text-warm-500 text-sm animate-pulse">Loading menu...</div>
      ) : (
        <>
          <div className="sticky top-[4.5rem] z-40 bg-lounge-950/95 backdrop-blur-xl border-b border-warm-dark">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-5 overflow-x-auto w-full sm:w-auto [&::-webkit-scrollbar]:hidden whitespace-nowrap">
                {fullMenu.map((section) => (
                  <button
                    key={`nav-${section.id}`}
                    onClick={() => scrollToCategory(section.id || section.category)}
                    className="text-[10px] uppercase tracking-widest text-cream-50/65 hover:text-gold-400 transition-colors font-semibold shrink-0"
                  >
                    {section.category}
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:w-64 shrink-0">
                <Search className="w-4 h-4 text-cream-50/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search menu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-lounge-800/60 border border-gold-500/20 py-2 pl-10 pr-4 text-xs text-cream-50 placeholder:text-cream-50/35 focus:border-gold-500 outline-none rounded-sm transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="space-y-0">
            {fullMenu.map((section, index) => {
              const isDark = index % 2 === 1;
              return (
              <section
                key={section.id}
                id={`category-${section.id || section.category}`}
                className={`scroll-mt-40 py-16 md:py-24 border-b border-warm ${isDark ? 'section-dark' : 'section-light'}`}
              >
                <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-col md:flex-row gap-10 lg:gap-16">
                  <div className="md:w-1/3 flex flex-col gap-5">
                    {section.imageUrl && (
                      <div className={`w-full aspect-[4/3] overflow-hidden rounded-sm border shadow-md ${isDark ? 'border-gold-500/20' : 'border-gold-500/15'}`}>
                        <CloudinaryImg publicId={section.imageUrl} alt={section.category} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <h2 className={`text-2xl md:text-3xl font-serif uppercase tracking-widest mb-3 ${isDark ? 'text-gold-400' : 'text-gold-600'}`}>
                        {section.category}
                      </h2>
                      <div className="gold-line w-12 !bg-gradient-to-r from-gold-500/70 to-transparent" />
                    </div>
                  </div>

                  <div className="md:w-2/3 flex flex-col gap-6 md:gap-8">
                    {section.items.map((item) => (
                      <div key={item.id} className={`group border-b pb-6 last:border-0 ${isDark ? 'border-gold-500/15' : 'border-gold-500/10'}`}>
                        <div className="flex justify-between items-baseline gap-4 mb-1">
                          <h4 className={`text-sm font-semibold uppercase tracking-wider transition-colors ${isDark ? 'text-cream-50 group-hover:text-gold-400' : 'text-warm-900 group-hover:text-gold-600'}`}>
                            {item.name}
                          </h4>
                          <span className={`text-sm font-mono shrink-0 font-medium ${isDark ? 'text-gold-400' : 'text-gold-600'}`}>{item.price}</span>
                        </div>
                        {item.desc && (
                          <p className="text-sm section-body font-light leading-relaxed max-w-2xl">{item.desc}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
            })}

            {fullMenu.length === 0 && (
              <div className="text-center text-warm-500 py-24">No menu items match your search.</div>
            )}
          </div>
        </>
      )}

      <Footer />
      <BookingModal />
    </div>
  );
}
