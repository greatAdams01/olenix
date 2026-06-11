import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db, firebaseConfig } from '../../lib/firebase';
import { Shield, Trash2, Plus, Loader2, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

// Create a secondary app instance to register users without logging out the super admin
const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
const secondaryAuth = getAuth(secondaryApp);

export default function StaffAdmin() {
  const { userRole } = useAuth();
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', role: 'admin' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'admins'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // If admin@olenix.com isn't in the DB yet (due to migration failure), dynamically inject it so the super admin can see themselves
      const hasSuper = data.some(a => a.email === 'admin@olenix.com');
      if (!hasSuper) {
         data.unshift({ id: 'hardcoded-super', email: 'admin@olenix.com', role: 'super_admin' });
      }
      
      setAdmins(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (userRole !== 'super_admin') {
    return <Navigate to="/admin" replace />;
  }

  const deleteAdmin = async (id: string, email: string) => {
    if (email === 'admin@olenix.com') {
      alert("You cannot remove the primary Super Admin account.");
      return;
    }
    if (!confirm("Remove this admin's access?")) return;
    try {
      await deleteDoc(doc(db, 'admins', id));
    } catch (err) {
      console.error(err);
      alert("Failed to remove admin access");
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // 1. Create the user in Firebase Auth using the secondary app (so we don't log out)
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, formData.email, formData.password);
      const uid = userCredential.user.uid;

      // 2. Add them to the admins collection
      await setDoc(doc(db, 'admins', uid), {
        email: formData.email,
        role: formData.role
      });

      // Reset & Close
      setFormData({ email: '', password: '', role: 'admin' });
      setIsModalOpen(false);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError('Failed to create admin account. Check console.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-white/50 animate-pulse">Loading staff...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-serif text-white mb-1">Staff Management</h2>
          <p className="text-xs text-white/50 tracking-widest uppercase">Super Admin Only</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gold-500 text-black text-xs font-bold uppercase tracking-widest hover:bg-gold-400 transition-colors rounded-sm"
        >
          <Plus className="w-4 h-4" /> Add Admin
        </button>
      </div>

      <div className="bg-black border border-white/10 rounded-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="p-4 text-[10px] uppercase tracking-widest text-white/50 font-semibold">Email</th>
              <th className="p-4 text-[10px] uppercase tracking-widest text-white/50 font-semibold">Role</th>
              <th className="p-4 text-[10px] uppercase tracking-widest text-white/50 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {admins.map((admin) => (
              <tr key={admin.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4 text-sm text-white flex items-center gap-2">
                  <Shield className={`w-4 h-4 ${admin.role === 'super_admin' ? 'text-gold-500' : 'text-white/30'}`} />
                  {admin.email}
                </td>
                <td className="p-4">
                  <span className={`inline-flex px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm ${
                    admin.role === 'super_admin' ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20' : 'bg-white/5 text-white/60 border border-white/10'
                  }`}>
                    {admin.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {admin.role !== 'super_admin' && (
                    <button onClick={() => deleteAdmin(admin.id, admin.email)} className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-red-400 hover:bg-red-500/10 rounded-sm transition-colors">
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-white/10 p-8 w-full max-w-md rounded-sm relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-serif text-gold-500 mb-6">Add New Admin</h3>
            
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-sm">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">Email Address</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black border border-white/10 py-3 px-4 text-white text-sm rounded-sm focus:border-gold-500 outline-none" placeholder="manager@olenix.com" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">Password</label>
                <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-black border border-white/10 py-3 px-4 text-white text-sm rounded-sm focus:border-gold-500 outline-none" placeholder="••••••••" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">Role</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-black border border-white/10 py-3 px-4 text-white text-sm rounded-sm focus:border-gold-500 outline-none">
                  <option value="admin">Standard Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              
              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-xs uppercase tracking-widest border border-white/10 hover:bg-white/5 text-white/60 transition-colors rounded-sm">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-4 text-xs uppercase tracking-widest bg-gold-500 hover:bg-gold-400 text-black font-bold flex items-center justify-center gap-2 transition-colors rounded-sm disabled:opacity-50">
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
