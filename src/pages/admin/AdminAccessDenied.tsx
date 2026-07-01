import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { AlertCircle, LogOut } from 'lucide-react';

export default function AdminAccessDenied() {
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const linkSql = currentUser
    ? `insert into public.admins (id, email, role)
values (
  '${currentUser.id}',
  '${currentUser.email ?? 'your@email.com'}',
  'admin'
)
on conflict (id) do update
  set email = excluded.email,
      role = excluded.role;`
    : '';

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white border border-red-500/30 p-8 rounded-sm">
        <div className="flex items-start gap-3 mb-6">
          <AlertCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
          <div>
            <h1 className="text-xl font-serif text-stone-900 mb-2">Account not linked to admin access</h1>
            <p className="text-sm text-stone-500 leading-relaxed">
              You are signed in to Supabase Auth, but your user is not in the <code className="text-amber-600">admins</code> table.
              Row-level security blocks all menu and booking changes until this is fixed.
            </p>
          </div>
        </div>

        {currentUser && (
          <div className="space-y-4 mb-6 text-sm">
            <div className="bg-stone-50 border border-stone-200 p-4 rounded-sm">
              <p className="text-[10px] uppercase tracking-widest text-stone-900/40 mb-1">Your auth user ID</p>
              <p className="font-mono text-amber-600 text-xs break-all">{currentUser.id}</p>
            </div>
            <div className="bg-stone-50 border border-stone-200 p-4 rounded-sm">
              <p className="text-[10px] uppercase tracking-widest text-stone-900/40 mb-2">Super admin: run in Supabase SQL Editor</p>
              <pre className="text-[10px] text-stone-600 whitespace-pre-wrap break-all font-mono leading-relaxed">{linkSql}</pre>
            </div>
            <p className="text-xs text-stone-500">
              Also ensure <code className="text-stone-600">003_menu_and_staff_rpc.sql</code> has been run.
              Staff accounts must be added by a super admin from <code className="text-stone-600">/admin/staff</code>.
            </p>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-bold uppercase tracking-widest rounded-sm transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
