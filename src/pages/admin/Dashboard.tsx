import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { isRlsDenied, rlsDeniedMessage } from '../../lib/rpc';
import { mapBooking, type VipBooking } from '../../types/database';
import { Calendar, Clock, User, Users, X } from 'lucide-react';

export default function Dashboard() {
  const [bookings, setBookings] = useState<VipBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingBooking, setViewingBooking] = useState<VipBooking | null>(null);
  const [editingBooking, setEditingBooking] = useState<VipBooking | null>(null);
  const [editForm, setEditForm] = useState({ date: '', time: '' });

  const fetchBookings = useCallback(async () => {
    const { data, error } = await supabase
      .from('vip_bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
    } else if (data) {
      setBookings(data.map(mapBooking));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBookings();

    const channel = supabase
      .channel('admin-bookings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vip_bookings' }, fetchBookings)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchBookings]);

  const updateStatus = async (id: string, newStatus: string) => {
    // Optimistic update
    setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus as any } : b));

    const { error } = await supabase
      .from('vip_bookings')
      .update({ status: newStatus as 'pending' | 'confirmed' | 'cancelled' })
      .eq('id', id);

    if (error) {
      console.error(error);
      alert(isRlsDenied(error) ? rlsDeniedMessage() : 'Failed to update status');
      fetchBookings(); // Revert on error
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking permanently?')) return;
    
    // Optimistic update
    setBookings(bookings.filter(b => b.id !== id));

    const { error } = await supabase.from('vip_bookings').delete().eq('id', id);
    if (error) {
      console.error(error);
      alert(isRlsDenied(error) ? rlsDeniedMessage() : 'Failed to delete booking');
      fetchBookings(); // Revert on error
    }
  };

  const saveEdit = async () => {
    if (!editingBooking) return;

    // Optimistic update
    setBookings(bookings.map(b => b.id === editingBooking.id ? { ...b, date: editForm.date, time: editForm.time } : b));

    const { error } = await supabase
      .from('vip_bookings')
      .update({ date: editForm.date, time: editForm.time })
      .eq('id', editingBooking.id);

    if (error) {
      console.error(error);
      alert(isRlsDenied(error) ? rlsDeniedMessage() : 'Failed to update booking details');
      fetchBookings(); // Revert on error
      return;
    }
    setEditingBooking(null);
  };

  if (loading) return <div className="text-stone-500 animate-pulse">Loading bookings...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-serif text-stone-900 mb-1">VIP Bookings</h2>
          <p className="text-xs text-stone-500 tracking-widest uppercase">Manage reservations and payments</p>
        </div>
      </div>

      <div className="bg-stone-50 border border-stone-200 rounded-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-100">
              <th className="p-4 text-[10px] uppercase tracking-widest text-stone-500 font-semibold">Code / Date</th>
              <th className="p-4 text-[10px] uppercase tracking-widest text-stone-500 font-semibold">Client Details</th>
              <th className="p-4 text-[10px] uppercase tracking-widest text-stone-500 font-semibold">Status</th>
              <th className="p-4 text-[10px] uppercase tracking-widest text-stone-500 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-stone-900/40 text-sm">No bookings found.</td>
              </tr>
            ) : bookings.map((b) => (
              <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-amber-600 font-bold">{b.code}</span>
                    <span className="text-xs text-stone-600 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {b.date}
                    </span>
                    <span className="text-xs text-stone-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {b.time}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-stone-900 font-medium flex items-center gap-2">
                      <User className="w-3 h-3 text-stone-900/40" /> {b.name}
                    </span>
                    <span className="text-xs text-stone-500">{b.email}</span>
                    <span className="text-xs text-stone-500">{b.phone}</span>
                    <span className="text-xs text-stone-900/40 flex items-center gap-1 mt-1">
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
                    className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-sm transition-colors"
                  >
                    View
                  </button>
                  {b.status !== 'confirmed' && (
                    <button onClick={() => updateStatus(b.id, 'confirmed')} className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-green-400 hover:bg-green-500/10 rounded-sm transition-colors">
                      Confirm
                    </button>
                  )}
                  {b.status !== 'cancelled' && (
                    <button onClick={() => updateStatus(b.id, 'cancelled')} className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-yellow-400 hover:bg-yellow-500/10 rounded-sm transition-colors">
                      Cancel
                    </button>
                  )}
                  <button 
                    onClick={() => { setEditingBooking(b); setEditForm({ date: b.date, time: b.time }); }} 
                    className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-400 hover:bg-blue-500/10 rounded-sm transition-colors"
                  >
                    Edit
                  </button>
                  <button onClick={() => deleteBooking(b.id)} className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-red-400 hover:bg-red-500/10 rounded-sm transition-colors">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-50/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-stone-200 p-8 w-full max-w-lg rounded-sm relative my-8">
            <button onClick={() => setViewingBooking(null)} className="absolute top-4 right-4 p-2 text-stone-900/40 hover:text-stone-900 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-serif text-amber-600 mb-6 border-b border-stone-200 pb-4">Booking Details</h3>
            
            <div className="space-y-6 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-stone-500 block text-[10px] uppercase tracking-widest mb-1">Full Name</span><span className="text-stone-900">{viewingBooking.name}</span></div>
                <div><span className="text-stone-500 block text-[10px] uppercase tracking-widest mb-1">Booking Code</span><span className="text-amber-600 font-mono font-bold">{viewingBooking.code}</span></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-stone-500 block text-[10px] uppercase tracking-widest mb-1">Email</span><span className="text-stone-900">{viewingBooking.email}</span></div>
                <div><span className="text-stone-500 block text-[10px] uppercase tracking-widest mb-1">Phone</span><span className="text-stone-900">{viewingBooking.phone}</span></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-stone-500 block text-[10px] uppercase tracking-widest mb-1">Date & Time</span><span className="text-stone-900">{viewingBooking.date} at {viewingBooking.time}</span></div>
                <div><span className="text-stone-500 block text-[10px] uppercase tracking-widest mb-1">Guests</span><span className="text-stone-900">{viewingBooking.guests}</span></div>
              </div>
              
              <div className="pt-4 border-t border-stone-200 space-y-4">
                <div>
                  <span className="text-stone-500 block text-[10px] uppercase tracking-widest mb-2">Consumption Intentions</span>
                  <p className="text-stone-700 bg-stone-50 p-4 border border-stone-200 rounded-sm font-light leading-relaxed">
                    {viewingBooking.intentions || 'No consumption intentions provided.'}
                  </p>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px] uppercase tracking-widest mb-2">Service Preferences</span>
                  <p className="text-stone-700 bg-stone-50 p-4 border border-stone-200 rounded-sm font-light leading-relaxed">
                    {viewingBooking.preferences || 'No special preferences provided.'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <button onClick={() => setViewingBooking(null)} className="w-full py-4 text-xs uppercase tracking-widest bg-amber-600 hover:bg-gold-400 text-black font-bold rounded-sm transition-colors">Close Details</button>
            </div>
          </div>
        </div>
      )}

      {editingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-50/80 backdrop-blur-sm">
          <div className="bg-white border border-stone-200 p-6 w-full max-w-sm rounded-sm relative">
            <h3 className="text-lg font-serif text-amber-600 mb-4">Edit Booking Time</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-stone-500 block mb-1">Date</label>
                <input 
                  type="date" 
                  min={new Date().toISOString().split('T')[0]}
                  value={editForm.date} 
                  onChange={e => setEditForm({...editForm, date: e.target.value})}
                  className="w-full bg-stone-50 border border-stone-200 p-2 text-stone-900 text-sm rounded-sm [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-stone-500 block mb-1">Time</label>
                <input 
                  type="time" 
                  value={editForm.time} 
                  onChange={e => setEditForm({...editForm, time: e.target.value})}
                  className="w-full bg-stone-50 border border-stone-200 p-2 text-stone-900 text-sm rounded-sm [color-scheme:dark]"
                />
              </div>
              <div className="flex gap-2 mt-6">
                <button onClick={() => setEditingBooking(null)} className="flex-1 py-2 text-xs uppercase tracking-widest border border-stone-200 hover:bg-stone-100 text-stone-500">Cancel</button>
                <button onClick={saveEdit} className="flex-1 py-2 text-xs uppercase tracking-widest bg-amber-600 hover:bg-gold-400 text-black font-bold">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
