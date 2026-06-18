import { useState, useEffect, useCallback, type FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import {
  deleteMenuCategory,
  deleteMenuItem,
  listMenuCategories,
  listMenuItems,
  saveMenuCategory,
  saveMenuItem,
} from '../../lib/menuApi';
import { rpcErrorMessage } from '../../lib/rpc';
import { mapCategory, mapMenuItem, type MenuCategory, type MenuItem } from '../../types/database';
import { getCategoryImageUrl, resolveImageUrl } from '../../lib/menuImages';
import { Plus, Loader2, Image as ImageIcon, Search } from 'lucide-react';

export default function MenuAdmin() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ category: '', name: '', price: '', desc: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catFormData, setCatFormData] = useState({ name: '', imageUrl: '' });

  const [categorySearch, setCategorySearch] = useState('');
  const [itemSearch, setItemSearch] = useState('');

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
      .channel('admin-menu')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menu' }, fetchMenu)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_categories' }, fetchMenu)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchMenu]);

  const openModal = (item: MenuItem | null = null) => {
    if (item) {
      setEditingId(item.id);
      setFormData({ category: item.category, name: item.name, price: item.price, desc: item.desc || '' });
    } else {
      setEditingId(null);
      setFormData({ category: categories[0]?.name || '', name: '', price: '', desc: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await saveMenuItem({
        id: editingId ?? undefined,
        category: formData.category,
        name: formData.name,
        price: formData.price,
        description: formData.desc,
      });
      if (!result.ok) throw new Error('error' in result ? result.error : 'unknown');
      closeModal();
      await fetchMenu();
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        alert(rpcErrorMessage(err.message));
      } else {
        alert('Failed to save menu item.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    const result = await deleteMenuItem(id);
    if (!result.ok) {
      alert(rpcErrorMessage('error' in result ? result.error : 'unknown'));
      return;
    }
    await fetchMenu();
  };

  const openCatModal = (cat: MenuCategory | null = null) => {
    if (cat) {
      setEditingCatId(cat.id);
      setCatFormData({ name: cat.name, imageUrl: cat.imageUrl || '' });
    } else {
      setEditingCatId(null);
      setCatFormData({ name: '', imageUrl: '' });
    }
    setIsCatModalOpen(true);
  };

  const closeCatModal = () => {
    setIsCatModalOpen(false);
    setEditingCatId(null);
  };

  const handleCatSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await saveMenuCategory({
        id: editingCatId ?? undefined,
        name: catFormData.name,
        imageUrl: catFormData.imageUrl,
      });
      if (!result.ok) throw new Error('error' in result ? result.error : 'unknown');
      closeCatModal();
      await fetchMenu();
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        alert(rpcErrorMessage(err.message));
      } else {
        alert('Failed to save category.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCatDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? (Menu items will still exist but might not have a matching category block)')) return;
    const result = await deleteMenuCategory(id);
    if (!result.ok) {
      alert(rpcErrorMessage('error' in result ? result.error : 'unknown'));
      return;
    }
    await fetchMenu();
  };

  const groupedMenu = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const dbCatNames = categories.map((c) => c.name);
  const orphanCats = Object.keys(groupedMenu)
    .filter((name) => !dbCatNames.includes(name))
    .map((name) => ({ id: null as string | null, name, imageUrl: '' }));

  const displayCategories: Array<MenuCategory & { id: string | null }> = [
    ...categories,
    ...orphanCats,
  ];

  const categoryQuery = categorySearch.trim().toLowerCase();
  const filteredCategories = categoryQuery
    ? displayCategories.filter((cat) => cat.name.toLowerCase().includes(categoryQuery))
    : displayCategories;

  const itemQuery = itemSearch.trim().toLowerCase();
  const filteredMenuItems = itemQuery
    ? menuItems.filter(
        (item) =>
          item.name.toLowerCase().includes(itemQuery) ||
          item.category.toLowerCase().includes(itemQuery) ||
          item.price.toLowerCase().includes(itemQuery) ||
          item.desc?.toLowerCase().includes(itemQuery)
      )
    : menuItems;

  const filteredGroupedMenu = filteredMenuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const showFlatItemResults = itemQuery.length > 0;

  if (loading) return <div className="text-white/50 animate-pulse">Loading menu...</div>;

  return (
    <div className="space-y-12">
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-serif text-white mb-1">Categories</h2>
            <p className="text-[10px] text-white/50 tracking-widest uppercase">Manage menu categories and images</p>
          </div>
          <button 
            onClick={() => openCatModal()}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors rounded-sm"
          >
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>

        <div className="relative mb-6 max-w-md">
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search categories..."
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            className="w-full bg-black border border-white/10 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:border-gold-500 outline-none rounded-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredCategories.map((cat, idx) => {
            const previewUrl = cat.id
              ? getCategoryImageUrl(cat.id, cat.imageUrl)
              : resolveImageUrl(cat.imageUrl);
            return (
            <div key={cat.id || `orphan-${idx}`} className="bg-black border border-white/10 rounded-sm overflow-hidden flex flex-col group relative">
              {previewUrl ? (
                <div className="h-32 w-full relative">
                  <img src={previewUrl} alt={cat.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50" />
                </div>
              ) : (
                <div className="h-32 w-full bg-white/5 flex flex-col items-center justify-center text-white/20">
                  <ImageIcon className="w-8 h-8 mb-2" />
                  <span className="text-[10px] uppercase tracking-widest">No Image</span>
                </div>
              )}
              <div className="p-4 absolute bottom-0 left-0 right-0 flex justify-between items-end bg-gradient-to-t from-black to-transparent pt-12">
                <h3 className="font-serif text-gold-500 text-lg uppercase tracking-widest">{cat.name}</h3>
                <div className="flex items-center gap-2">
                  <button onClick={() => openCatModal({ id: cat.id ?? '', name: cat.name, imageUrl: cat.imageUrl })} className="px-2 py-1 bg-white/10 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/20 rounded-sm transition-colors">
                    {cat.id ? 'Edit' : 'Add Image'}
                  </button>
                  {cat.id && (
                    <button onClick={() => handleCatDelete(cat.id!)} className="px-2 py-1 bg-red-500/20 text-[10px] font-bold uppercase tracking-widest text-red-400 hover:bg-red-500/40 rounded-sm transition-colors">
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
          })}
          {filteredCategories.length === 0 && (
            <div className="col-span-full p-8 text-center text-white/40 border border-white/10 rounded-sm text-sm">
              {categoryQuery ? `No categories match "${categorySearch}"` : 'No categories found. Create one first!'}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-white/10 pt-12">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-serif text-white mb-1">Menu Items</h2>
            <p className="text-[10px] text-white/50 tracking-widest uppercase">Update prices and dishes</p>
          </div>
          <button 
            onClick={() => openModal()}
            className="flex items-center gap-2 px-6 py-3 bg-gold-500 text-black text-[10px] font-bold uppercase tracking-widest hover:bg-gold-400 transition-colors rounded-sm"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>

        <div className="relative mb-6 max-w-md">
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search items by name, category, price..."
            value={itemSearch}
            onChange={(e) => setItemSearch(e.target.value)}
            className="w-full bg-black border border-white/10 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:border-gold-500 outline-none rounded-sm"
          />
        </div>

        <div className="space-y-8">
          {menuItems.length === 0 && (
            <div className="p-12 text-center text-white/40 border border-white/10 rounded-sm text-sm">
              No menu items found. Click "Add Item" to start.
            </div>
          )}

          {menuItems.length > 0 && filteredMenuItems.length === 0 && (
            <div className="p-12 text-center text-white/40 border border-white/10 rounded-sm text-sm">
              No menu items match "{itemSearch}"
            </div>
          )}

          {showFlatItemResults ? (
            <div className="bg-black border border-white/10 rounded-sm overflow-hidden">
              <div className="bg-white/5 px-6 py-4 border-b border-white/10">
                <h3 className="font-serif text-gold-500 text-lg uppercase tracking-widest">
                  Search results ({filteredMenuItems.length})
                </h3>
              </div>
              <div className="divide-y divide-white/5">
                {filteredMenuItems.map((item) => (
                  <div key={item.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/[0.02] transition-colors">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gold-500/70 mb-1">{item.category}</p>
                      <div className="flex items-baseline gap-4 mb-2">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-white">{item.name}</h4>
                        <span className="text-xs font-mono text-gold-500">{item.price}</span>
                      </div>
                      <p className="text-xs text-white/50 font-light max-w-2xl">{item.desc}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => openModal(item)} className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-400 hover:bg-blue-500/10 rounded-sm transition-colors">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-red-400 hover:bg-red-500/10 rounded-sm transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
          (Object.entries(filteredGroupedMenu) as [string, MenuItem[]][]).map(([category, items]) => (
            <div key={category} className="bg-black border border-white/10 rounded-sm overflow-hidden">
              <div className="bg-white/5 px-6 py-4 border-b border-white/10">
                <h3 className="font-serif text-gold-500 text-lg uppercase tracking-widest">{category}</h3>
              </div>
              <div className="divide-y divide-white/5">
                {items.map((item) => (
                  <div key={item.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/[0.02] transition-colors">
                    <div>
                      <div className="flex items-baseline gap-4 mb-2">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-white">{item.name}</h4>
                        <span className="text-xs font-mono text-gold-500">{item.price}</span>
                      </div>
                      <p className="text-xs text-white/50 font-light max-w-2xl">{item.desc}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => openModal(item)} className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-400 hover:bg-blue-500/10 rounded-sm transition-colors">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-red-400 hover:bg-red-500/10 rounded-sm transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-zinc-950 border border-white/10 p-6 w-full max-w-lg rounded-sm relative my-8">
            <h3 className="text-xl font-serif text-gold-500 mb-6">{editingId ? 'Edit Item' : 'Add New Item'}</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">Category</label>
                {displayCategories.length > 0 ? (
                  <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-black border border-white/10 py-3 px-4 text-white text-sm rounded-sm focus:border-gold-500 outline-none">
                    {displayCategories.map((cat, idx) => <option key={cat.id || `opt-${idx}`} value={cat.name}>{cat.name}</option>)}
                  </select>
                ) : (
                  <input required type="text" placeholder="Create a category first..." disabled className="w-full bg-black border border-white/10 py-3 px-4 text-white/50 text-sm rounded-sm cursor-not-allowed" />
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">Item Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black border border-white/10 py-3 px-4 text-white text-sm rounded-sm focus:border-gold-500 outline-none" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">Price (e.g. ₦15,000)</label>
                  <input required type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-black border border-white/10 py-3 px-4 text-white text-sm rounded-sm focus:border-gold-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">Description</label>
                <textarea rows={3} value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full bg-black border border-white/10 py-3 px-4 text-white text-sm rounded-sm focus:border-gold-500 outline-none resize-none"></textarea>
              </div>
              
              <div className="pt-4 flex gap-4">
                <button type="button" onClick={closeModal} className="flex-1 py-4 text-[10px] uppercase tracking-widest border border-white/10 hover:bg-white/5 text-white/60 transition-colors rounded-sm font-bold">Cancel</button>
                <button type="submit" disabled={isSubmitting || displayCategories.length === 0} className="flex-1 py-4 text-[10px] uppercase tracking-widest bg-gold-500 hover:bg-gold-400 text-black font-bold flex items-center justify-center gap-2 transition-colors rounded-sm disabled:opacity-50">
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingId ? 'Save Changes' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCatModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-zinc-950 border border-white/10 p-6 w-full max-w-sm rounded-sm relative my-8">
            <h3 className="text-xl font-serif text-gold-500 mb-6">{editingCatId ? 'Edit Category' : 'Add New Category'}</h3>
            
            <form onSubmit={handleCatSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">Category Name</label>
                <input required type="text" value={catFormData.name} onChange={e => setCatFormData({...catFormData, name: e.target.value})} className="w-full bg-black border border-white/10 py-3 px-4 text-white text-sm rounded-sm focus:border-gold-500 outline-none" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">Image URL (Optional)</label>
                <input
                  type="text"
                  placeholder="/img/img-19.jpg or https://..."
                  value={catFormData.imageUrl}
                  onChange={e => setCatFormData({...catFormData, imageUrl: e.target.value})}
                  className="w-full bg-black border border-white/10 py-3 px-4 text-white text-sm rounded-sm focus:border-gold-500 outline-none"
                />
                <p className="text-[10px] text-white/30 mt-1">Use a path like /img/... or a full https:// URL</p>
              </div>
              
              <div className="pt-4 flex gap-4">
                <button type="button" onClick={closeCatModal} className="flex-1 py-4 text-[10px] uppercase tracking-widest border border-white/10 hover:bg-white/5 text-white/60 transition-colors rounded-sm font-bold">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-4 text-[10px] uppercase tracking-widest bg-gold-500 hover:bg-gold-400 text-black font-bold flex items-center justify-center gap-2 transition-colors rounded-sm disabled:opacity-50">
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingCatId ? 'Save' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
