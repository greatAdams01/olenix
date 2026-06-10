import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Plus, Edit2, Trash2, X, Loader2 } from 'lucide-react';

export default function MenuAdmin() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ category: '', name: '', price: '', desc: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'menu'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMenuItems(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const openModal = (item: any = null) => {
    if (item) {
      setEditingId(item.id);
      setFormData({ category: item.category, name: item.name, price: item.price, desc: item.desc || '' });
    } else {
      setEditingId(null);
      setFormData({ category: '', name: '', price: '', desc: '' });
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

  // Group items by category
  const groupedMenu = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  if (loading) return <div className="text-white/50 animate-pulse">Loading menu...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-white mb-1">Menu Management</h2>
          <p className="text-xs text-white/50 tracking-widest uppercase">Update prices and dishes</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 px-6 py-3 bg-gold-500 text-black text-xs font-bold uppercase tracking-widest hover:bg-gold-400 transition-colors rounded-sm"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      <div className="space-y-12">
        {Object.entries(groupedMenu).length === 0 && (
          <div className="p-12 text-center text-white/40 border border-white/10 rounded-sm">
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
                    <button onClick={() => openModal(item)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-sm transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-sm transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-zinc-950 border border-white/10 p-6 w-full max-w-lg rounded-sm relative my-8">
            <button onClick={closeModal} className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-serif text-gold-500 mb-6">{editingId ? 'Edit Item' : 'Add New Item'}</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">Category (e.g. Signature Cocktails, Desserts)</label>
                <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-black border border-white/10 py-3 px-4 text-white text-sm rounded-sm focus:border-gold-500 outline-none" />
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
                <button type="button" onClick={closeModal} className="flex-1 py-4 text-xs uppercase tracking-widest border border-white/10 hover:bg-white/5 text-white/60 transition-colors rounded-sm">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-4 text-xs uppercase tracking-widest bg-gold-500 hover:bg-gold-400 text-black font-bold flex items-center justify-center gap-2 transition-colors rounded-sm disabled:opacity-50">
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingId ? 'Save Changes' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
