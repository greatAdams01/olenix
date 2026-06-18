import { useState, type FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import { KeyRound, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function Settings() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setStatus({ type: 'error', message: 'Password must be at least 6 characters.' });
      return;
    }

    setLoading(true);
    setStatus(null);

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      console.error(error);
      const message =
        error.message.toLowerCase().includes('reauthenticate') ||
        error.message.toLowerCase().includes('recent')
          ? 'Please log out and log back in to update your password (security requirement).'
          : 'Failed to update password. Try again.';
      setStatus({ type: 'error', message });
    } else {
      setStatus({ type: 'success', message: 'Password updated successfully!' });
      setNewPassword('');
      setConfirmPassword('');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <h2 className="text-2xl font-serif text-white mb-1">Account Settings</h2>
        <p className="text-xs text-white/50 tracking-widest uppercase">Update your security credentials</p>
      </div>

      <div className="bg-black border border-white/10 p-6 md:p-8 rounded-sm shadow-[0_0_50px_rgba(212,175,55,0.02)]">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
          <KeyRound className="w-5 h-5 text-gold-500" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">Change Password</h3>
        </div>

        {status && (
          <div className={`mb-6 p-4 border flex items-start gap-3 rounded-sm ${status.type === 'error' ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
            {status.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
            )}
            <p className={`text-sm ${status.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>{status.message}</p>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/50 font-semibold ml-1">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-white/10 py-3 px-4 text-white placeholder:text-white/20 focus:border-gold-500 outline-none rounded-sm"
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/50 font-semibold ml-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-white/10 py-3 px-4 text-white placeholder:text-white/20 focus:border-gold-500 outline-none rounded-sm"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gold-500 text-black text-xs font-bold uppercase tracking-widest hover:bg-gold-400 transition-colors rounded-sm flex items-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
