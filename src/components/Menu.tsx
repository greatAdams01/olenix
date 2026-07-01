import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { listMenuCategories, listMenuItems } from '../lib/menuApi';
import { mapCategory, mapMenuItem, type MenuCategory, type MenuItem } from '../types/database';

const EXCLUSIVE_CATEGORIES = [
  'Champagne',
  'Cognac',
  'Whiskey & Brandy',
  'Tequila',
  'Spirit & Vodka',
  'Wine',
  'Premium Additions',
];

export default function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMenu = useCallback(async () => {
    const [itemsRes, catsRes] = await Promise.all([listMenuItems(), listMenuCategories()]);
    if (itemsRes.data) setMenuItems(itemsRes.data.map(mapMenuItem));
    if (catsRes.data) setCategories(catsRes.data.map(mapCategory));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMenu();
    const channel = supabase
      .channel('public-menu')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menu' }, fetchMenu)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_categories' }, fetchMenu)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchMenu]);

  const featured = [...categories]
    .map((cat) => ({
      category: cat.name,
      items: menuItems.filter((i) => i.category === cat.name).slice(0, 3),
    }))
    .filter((s) => s.items.length > 0)
    .sort((a, b) => {
      const aEx = EXCLUSIVE_CATEGORIES.includes(a.category);
      const bEx = EXCLUSIVE_CATEGORIES.includes(b.category);
      if (aEx && !bEx) return -1;
      if (!aEx && bEx) return 1;
      return a.category.localeCompare(b.category);
    })
    .slice(0, 4);

  if (loading) {
    return (
      <section id="menu" className="py-20 section-warm border-t border-warm text-center text-warm-500 text-sm animate-pulse">
        Loading menu…
      </section>
    );
  }

  return (
    <section id="menu" className="border-t border-warm section-warm">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[360px] lg:min-h-[600px] overflow-hidden order-2 lg:order-1">
          <img src="/img/img-8.jpg" alt="Drinks at Olenix" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-lounge-950/25" />
        </div>

        <div className="section-dark relative flex flex-col justify-center px-6 sm:px-10 lg:px-16 xl:px-20 py-16 md:py-24 order-1 lg:order-2 border-b lg:border-b-0 lg:border-l border-warm-dark">
          <div className="absolute inset-0 lounge-glow-dark pointer-events-none" />
          <div className="relative">
            <p className="section-eyebrow mb-4">Food &amp; drink</p>
            <h2 className="section-title text-3xl md:text-5xl mb-6 leading-tight text-cream-50">
              From champagne
              <br />
              to kitchen
            </h2>
            <p className="section-body font-light leading-relaxed mb-10 max-w-md">
              Premium spirits, wines, and Nigerian &amp; international dishes — explore our full menu online or ask your server.
            </p>

            <div className="space-y-8 mb-10">
              {featured.map((section) => (
                <div key={section.category}>
                  <h3 className="text-[10px] uppercase tracking-[0.25em] text-gold-400 font-bold mb-3 border-b border-gold-500/25 pb-2">
                    {section.category}
                  </h3>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item.id} className="flex justify-between gap-4 text-sm">
                        <span className="text-cream-50/90">{item.name}</span>
                        <span className="font-mono text-gold-400 text-xs shrink-0">{item.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <Link
              to="/menu"
              className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-gold-400 hover:text-gold-300 transition-colors group"
            >
              View full menu
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
