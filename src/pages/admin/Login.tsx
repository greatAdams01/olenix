import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { fetchAdminRole } from '../../lib/adminAuth';
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      console.error(signInError);
      setError('Invalid email or password.');
      setIsLoading(false);
      return;
    }

    const role = await fetchAdminRole();
    if (!role) {
      await supabase.auth.signOut();
      setError(
        'This account is not linked as an admin. A super admin must add you in Supabase, or run 004_link_super_admin.sql with your user ID.',
      );
      setIsLoading(false);
      return;
    }

    navigate(from, { replace: true });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-stone-200 p-8 rounded-sm shadow-[0_0_50px_rgba(212,175,55,0.05)]">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-amber-600 uppercase tracking-widest mb-2">Admin Portal</h1>
          <p className="text-xs text-stone-500 tracking-widest uppercase">Olenix Xclusive Lounge</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 flex items-start gap-3 rounded-sm">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold ml-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 py-3 pl-12 pr-4 text-stone-900 placeholder:text-stone-900/20 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50 outline-none transition-all rounded-sm"
                placeholder="admin@olenixlounge.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold ml-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 py-3 pl-12 pr-4 text-stone-900 placeholder:text-stone-900/20 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50 outline-none transition-all rounded-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-600 text-black py-4 text-sm font-bold uppercase tracking-widest hover:bg-gold-400 transition-colors rounded-sm flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
