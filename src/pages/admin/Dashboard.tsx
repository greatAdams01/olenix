import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Calendar, Clock, User, Users, CheckCircle, XCircle, Edit, Trash2, Eye, X } from 'lucide-react';

export default function Dashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [viewingBooking, setViewingBooking] = useState<any>(null);
  const [editingBooking, setEditingBooking] = useState<any>(null);
  const [editForm, setEditForm] = useState({ date: '', time: '' });

  useEffect(() => {
    const q = query(collection(db, 'vip_bookings'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBookings(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'vip_bookings', id), { status: newStatus });
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking permanently?")) return;
    try {
      await deleteDoc(doc(db, 'vip_bookings', id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete booking");
    }
  };

  const saveEdit = async () => {
    if (!editingBooking) return;
    try {
      await updateDoc(doc(db, 'vip_bookings', editingBooking.id), {
        date: editForm.date,
        time: editForm.time
      });
      setEditingBooking(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update booking details");
    }
  };

  if (loading) return <div className="text-white/50 animate-pulse">Loading bookings...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-serif text-white mb-1">VIP Bookings</h2>
          <p className="text-xs text-white/50 tracking-widest uppercase">Manage reservations and payments</p>
        </div>
      </div>

      <div className="bg-black border border-white/10 rounded-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="p-4 text-[10px] uppercase tracking-widest text-white/50 font-semibold">Code / Date</th>
              <th className="p-4 text-[10px] uppercase tracking-widest text-white/50 font-semibold">Client Details</th>
              <th className="p-4 text-[10px] uppercase tracking-widest text-white/50 font-semibold">Status</th>
              <th className="p-4 text-[10px] uppercase tracking-widest text-white/50 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-white/40 text-sm">No bookings found.</td>
              </tr>
            ) : bookings.map((b) => (
              <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-gold-500 font-bold">{b.code}</span>
                    <span className="text-xs text-white/70 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {b.date}
                    </span>
                    <span className="text-xs text-white/70 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {b.time}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-white font-medium flex items-center gap-2">
                      <User className="w-3 h-3 text-white/40" /> {b.name}
                    </span>
                    <span className="text-xs text-white/60">{b.email}</span>
                    <span className="text-xs text-white/60">{b.phone}</span>
                    <span className="text-xs text-white/40 flex items-center gap-1 mt-1">
                      <Users className="w-3 h-3" /> {b.guests} Guests
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`inline-flex px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm ${
                    b.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                    b.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                  }`}>
                    {b.status || 'pending'}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2 whitespace-nowrap">
                  <button 
                    onClick={() => setViewingBooking(b)} 
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-sm transition-colors" title="View Full Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {b.status !== 'confirmed' && (
                    <button onClick={() => updateStatus(b.id, 'confirmed')} className="p-2 text-green-400 hover:bg-green-500/10 rounded-sm transition-colors" title="Confirm Payment">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  {b.status !== 'cancelled' && (
                    <button onClick={() => updateStatus(b.id, 'cancelled')} className="p-2 text-yellow-400 hover:bg-yellow-500/10 rounded-sm transition-colors" title="Cancel Booking">
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    onClick={() => { setEditingBooking(b); setEditForm({ date: b.date, time: b.time }); }} 
                    className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-sm transition-colors" title="Edit Date/Time"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteBooking(b.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-sm transition-colors" title="Delete Permanently">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Full Details Modal */}
      {viewingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-zinc-950 border border-white/10 p-8 w-full max-w-lg rounded-sm relative my-8">
            <button onClick={() => setViewingBooking(null)} className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-serif text-gold-500 mb-6 border-b border-white/10 pb-4">Booking Details</h3>
            
            <div className="space-y-6 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-white/50 block text-[10px] uppercase tracking-widest mb-1">Full Name</span><span className="text-white">{viewingBooking.name}</span></div>
                <div><span className="text-white/50 block text-[10px] uppercase tracking-widest mb-1">Booking Code</span><span className="text-gold-500 font-mono font-bold">{viewingBooking.code}</span></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-white/50 block text-[10px] uppercase tracking-widest mb-1">Email</span><span className="text-white">{viewingBooking.email}</span></div>
                <div><span className="text-white/50 block text-[10px] uppercase tracking-widest mb-1">Phone</span><span className="text-white">{viewingBooking.phone}</span></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-white/50 block text-[10px] uppercase tracking-widest mb-1">Date & Time</span><span className="text-white">{viewingBooking.date} at {viewingBooking.time}</span></div>
                <div><span className="text-white/50 block text-[10px] uppercase tracking-widest mb-1">Guests</span><span className="text-white">{viewingBooking.guests}</span></div>
              </div>
              
              <div className="pt-4 border-t border-white/10 space-y-4">
                <div>
                  <span className="text-white/50 block text-[10px] uppercase tracking-widest mb-2">Consumption Intentions</span>
                  <p className="text-white/80 bg-black p-4 border border-white/10 rounded-sm font-light leading-relaxed">
                    {viewingBooking.intentions || 'No consumption intentions provided.'}
                  </p>
                </div>
                <div>
                  <span className="text-white/50 block text-[10px] uppercase tracking-widest mb-2">Service Preferences</span>
                  <p className="text-white/80 bg-black p-4 border border-white/10 rounded-sm font-light leading-relaxed">
                    {viewingBooking.preferences || 'No special preferences provided.'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <button onClick={() => setViewingBooking(null)} className="w-full py-4 text-xs uppercase tracking-widest bg-gold-500 hover:bg-gold-400 text-black font-bold rounded-sm transition-colors">Close Details</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-white/10 p-6 w-full max-w-sm rounded-sm relative">
            <h3 className="text-lg font-serif text-gold-500 mb-4">Edit Booking Time</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">Date</label>
                <input 
                  type="date" 
                  value={editForm.date} 
                  onChange={e => setEditForm({...editForm, date: e.target.value})}
                  className="w-full bg-black border border-white/10 p-2 text-white text-sm rounded-sm [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">Time</label>
                <input 
                  type="time" 
                  value={editForm.time} 
                  onChange={e => setEditForm({...editForm, time: e.target.value})}
                  className="w-full bg-black border border-white/10 p-2 text-white text-sm rounded-sm [color-scheme:dark]"
                />
              </div>
              <div className="flex gap-2 mt-6">
                <button onClick={() => setEditingBooking(null)} className="flex-1 py-2 text-xs uppercase tracking-widest border border-white/10 hover:bg-white/5 text-white/60">Cancel</button>
                <button onClick={saveEdit} className="flex-1 py-2 text-xs uppercase tracking-widest bg-gold-500 hover:bg-gold-400 text-black font-bold">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
