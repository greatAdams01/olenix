import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Plus, Loader2, Image as ImageIcon } from 'lucide-react';

export default function MenuAdmin() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ category: '', name: '', price: '', desc: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Category Form State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catFormData, setCatFormData] = useState({ name: '', imageUrl: '' });

  useEffect(() => {
    const qItems = query(collection(db, 'menu'));
    const unsubItems = onSnapshot(qItems, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMenuItems(data);
    });

    const qCats = query(collection(db, 'menu_categories'));
    const unsubCats = onSnapshot(qCats, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCategories(data);
      setLoading(false);
    });

    return () => { unsubItems(); unsubCats(); };
  }, []);

  const openModal = (item: any = null) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, 'menu', editingId), formData);
      } else {
        await addDoc(collection(db, 'menu'), formData);
      }
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Failed to save menu item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteDoc(doc(db, 'menu', id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete menu item.");
    }
  };

  const openCatModal = (cat: any = null) => {
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

  const handleCatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingCatId) {
        await updateDoc(doc(db, 'menu_categories', editingCatId), catFormData);
      } else {
        await addDoc(collection(db, 'menu_categories'), catFormData);
      }
      closeCatModal();
    } catch (err) {
      console.error(err);
      alert("Failed to save category.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCatDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? (Menu items will still exist but might not have a matching category block)")) return;
    try {
      await deleteDoc(doc(db, 'menu_categories', id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete category.");
    }
  };

  // Group items by category from menu items, but try to match order with categories collection
  const groupedMenu = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  if (loading) return <div className="text-white/50 animate-pulse">Loading menu...</div>;

  return (
    <div className="space-y-12">
      {/* CATEGORIES SECTION */}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-black border border-white/10 rounded-sm overflow-hidden flex flex-col group relative">
              {cat.imageUrl ? (
                <div className="h-32 w-full relative">
                  <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
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
                  <button onClick={() => openCatModal(cat)} className="px-2 py-1 bg-white/10 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/20 rounded-sm transition-colors">
                    Edit
                  </button>
                  <button onClick={() => handleCatDelete(cat.id)} className="px-2 py-1 bg-red-500/20 text-[10px] font-bold uppercase tracking-widest text-red-400 hover:bg-red-500/40 rounded-sm transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="col-span-full p-8 text-center text-white/40 border border-white/10 rounded-sm text-sm">
              No categories found. Create one first!
            </div>
          )}
        </div>
      </div>

      {/* ITEMS SECTION */}
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

        <div className="space-y-8">
          {Object.entries(groupedMenu).length === 0 && (
            <div className="p-12 text-center text-white/40 border border-white/10 rounded-sm text-sm">
              No menu items found. Click "Add Item" to start.
            </div>
          )}

          {Object.entries(groupedMenu).map(([category, items]) => (
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
          ))}
        </div>
      </div>

      {/* Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-zinc-950 border border-white/10 p-6 w-full max-w-lg rounded-sm relative my-8">
            <h3 className="text-xl font-serif text-gold-500 mb-6">{editingId ? 'Edit Item' : 'Add New Item'}</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">Category</label>
                {categories.length > 0 ? (
                  <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-black border border-white/10 py-3 px-4 text-white text-sm rounded-sm focus:border-gold-500 outline-none">
                    {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
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
                <button type="submit" disabled={isSubmitting || categories.length === 0} className="flex-1 py-4 text-[10px] uppercase tracking-widest bg-gold-500 hover:bg-gold-400 text-black font-bold flex items-center justify-center gap-2 transition-colors rounded-sm disabled:opacity-50">
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingId ? 'Save Changes' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
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
                <input type="url" placeholder="https://..." value={catFormData.imageUrl} onChange={e => setCatFormData({...catFormData, imageUrl: e.target.value})} className="w-full bg-black border border-white/10 py-3 px-4 text-white text-sm rounded-sm focus:border-gold-500 outline-none" />
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
