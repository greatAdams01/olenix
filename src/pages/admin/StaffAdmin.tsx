import { useState, useEffect, useCallback, type FormEvent } from 'react';
import { supabase } from '../../lib/supabase';
import { isRpcMissing, parseRpcPayload, rpcErrorMessage, rpcMissingMessage } from '../../lib/rpc';
import { buildStaffWelcomeMessage, generateStaffPassword, staffLoginUrl } from '../../lib/staffHelpers';
import type { Admin, AdminRow } from '../../types/database';
import { Shield, Plus, Loader2, X, CheckCircle2, Copy, UserPlus, Link2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

type StaffMode = 'new' | 'existing';

export default function StaffAdmin() {
  const { userRole } = useAuth();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<StaffMode>('new');
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchAdmins = useCallback(async () => {
    const { data, error: fetchError } = await supabase.rpc('list_admins');

    if (fetchError) {
      console.error(fetchError);
      if (isRpcMissing(fetchError)) {
        console.warn(rpcMissingMessage('menuStaff'));
      }
      setLoading(false);
      return;
    }

    setAdmins(
      ((data ?? []) as AdminRow[]).map((row) => ({
        id: row.id,
        email: row.email,
        role: row.role,
      })),
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAdmins();

    const channel = supabase
      .channel('admin-staff')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admins' }, fetchAdmins)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAdmins]);

  if (userRole !== 'super_admin') {
    return <Navigate to="/admin" replace />;
  }

  const openModal = (staffMode: StaffMode = 'new') => {
    setMode(staffMode);
    setError('');
    setWelcomeMessage('');
    setCopied(false);
    setFormData({ email: '', password: '', confirmPassword: '' });
    setIsModalOpen(true);
  };

  const copyWelcomeMessage = async () => {
    try {
      await navigator.clipboard.writeText(welcomeMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Could not copy. Select the text and copy manually.');
    }
  };

  const deleteAdmin = async (id: string, email: string, role: string) => {
    if (role === 'super_admin') {
      alert('Super admin accounts cannot be removed from this page.');
      return;
    }
    if (!confirm(`Remove admin access for ${email}? They will no longer be able to sign in.`)) return;

    const { data, error: deleteError } = await supabase.rpc('remove_admin_record', { p_id: id });
    if (deleteError) {
      console.error(deleteError);
      alert(isRpcMissing(deleteError) ? rpcMissingMessage('menuStaff') : 'Failed to remove staff access.');
      return;
    }
    const result = parseRpcPayload(data as { ok?: boolean; error?: string });
    if (result.ok === false) alert(rpcErrorMessage(result.error));
    else await fetchAdmins();
  };

  const handleLinkExisting = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setWelcomeMessage('');

    const email = formData.email.trim();
    const { data, error: linkError } = await supabase.rpc('link_admin_by_email', { p_email: email });

    if (linkError) {
      setError(
        isRpcMissing(linkError)
          ? 'Staff linking is not set up yet. Ask your developer to run migration 009_link_admin_by_email.sql once.'
          : 'Could not grant access. Try again.',
      );
      setIsSubmitting(false);
      return;
    }

    const result = parseRpcPayload(data as { ok?: boolean; error?: string });
    if (result.ok === false) {
      if (result.error === 'auth_user_not_found') {
        setError('No account exists for that email yet. Use "New staff member" to create one with a password.');
      } else {
        setError(rpcErrorMessage(result.error));
      }
      setIsSubmitting(false);
      return;
    }

    setWelcomeMessage(
      `${email} can now sign in at ${staffLoginUrl()} with their existing password.`,
    );
    setFormData({ email: '', password: '', confirmPassword: '' });
    setIsModalOpen(false);
    setIsSubmitting(false);
    await fetchAdmins();
  };

  const handleAddNewStaff = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setWelcomeMessage('');

    const email = formData.email.trim();

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      setIsSubmitting(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setIsSubmitting(false);
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setError('Your session expired. Please sign in again.');
      setIsSubmitting(false);
      return;
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password: formData.password,
    });

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        setError('That email is already registered. Switch to "Existing login" to grant admin access, or use a different email.');
      } else {
        setError(signUpError.message || 'Could not create the account. Try again.');
      }
      setIsSubmitting(false);
      return;
    }

    const newUserId = signUpData.user?.id;
    if (!newUserId) {
      setError('Account was not created. Ask your developer to turn off email confirmation in Supabase Auth settings.');
      setIsSubmitting(false);
      return;
    }

    const { data: insertData, error: insertError } = await supabase.rpc('add_admin_record', {
      p_user_id: newUserId,
      p_email: email,
      p_role: 'admin',
    });

    if (insertError) {
      setError(isRpcMissing(insertError) ? rpcMissingMessage('menuStaff') : 'Account created but admin access failed. Contact support.');
      setIsSubmitting(false);
      return;
    }

    const insertResult = parseRpcPayload(insertData as { ok?: boolean; error?: string });
    if (insertResult.ok === false) {
      setError(rpcErrorMessage(insertResult.error));
      setIsSubmitting(false);
      return;
    }

    await supabase.auth.signOut();
    await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });

    setWelcomeMessage(buildStaffWelcomeMessage(email, formData.password));
    setFormData({ email: '', password: '', confirmPassword: '' });
    setIsModalOpen(false);
    setIsSubmitting(false);
    await fetchAdmins();
  };

  if (loading) return <div className="text-white/50 animate-pulse">Loading staff...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-serif text-white mb-1">Staff</h2>
          <p className="text-xs text-white/50 tracking-widest uppercase">Add or remove team members who can manage the lounge</p>
        </div>
        <button
          onClick={() => openModal('new')}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gold-500 text-black text-xs font-bold uppercase tracking-widest hover:bg-gold-400 transition-colors rounded-sm shrink-0"
        >
          <Plus className="w-4 h-4" /> Add staff member
        </button>
      </div>

      <div className="bg-gold-500/5 border border-gold-500/20 rounded-sm p-5 space-y-3">
        <h3 className="text-sm font-semibold text-gold-500">How to add a new team member (no technical steps)</h3>
        <ol className="text-sm text-white/70 space-y-2 list-decimal list-inside">
          <li>Click <strong className="text-white">Add staff member</strong></li>
          <li>Enter their work email and choose a temporary password (or tap <strong className="text-white">Suggest password</strong>)</li>
          <li>Click <strong className="text-white">Create staff</strong>, then copy the welcome message and send it to them (WhatsApp, email, etc.)</li>
          <li>They sign in at <span className="text-gold-500 font-mono text-xs">{staffLoginUrl()}</span> and can change their password under Settings</li>
        </ol>
      </div>

      {welcomeMessage && (
        <div className="p-5 bg-green-500/10 border border-green-500/30 rounded-sm space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-green-400 font-medium mb-2">Staff ready — send this to your team member:</p>
              <pre className="text-xs text-white/80 whitespace-pre-wrap font-sans bg-black/40 p-4 rounded-sm border border-white/10">
                {welcomeMessage}
              </pre>
            </div>
          </div>
          <button
            type="button"
            onClick={copyWelcomeMessage}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-sm transition-colors"
          >
            <Copy className="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy message'}
          </button>
        </div>
      )}

      <div className="bg-black border border-white/10 rounded-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="p-4 text-[10px] uppercase tracking-widest text-white/50 font-semibold">Name / Email</th>
              <th className="p-4 text-[10px] uppercase tracking-widest text-white/50 font-semibold">Access level</th>
              <th className="p-4 text-[10px] uppercase tracking-widest text-white/50 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {admins.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-white/40 text-sm">
                  No staff yet. Click &quot;Add staff member&quot; to invite your first team member.
                </td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 text-sm text-white flex items-center gap-2">
                    <Shield className={`w-4 h-4 shrink-0 ${admin.role === 'super_admin' ? 'text-gold-500' : 'text-white/30'}`} />
                    {admin.email}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm ${
                        admin.role === 'super_admin'
                          ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
                          : 'bg-white/5 text-white/60 border border-white/10'
                      }`}
                    >
                      {admin.role === 'super_admin' ? 'Owner' : 'Staff'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {admin.role !== 'super_admin' && (
                      <button
                        onClick={() => deleteAdmin(admin.id, admin.email, admin.role)}
                        className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-red-400 hover:bg-red-500/10 rounded-sm transition-colors"
                      >
                        Remove access
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-zinc-950 border border-white/10 p-6 md:p-8 w-full max-w-md rounded-sm relative my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-serif text-gold-500 mb-4">Add staff member</h3>

            <div className="flex gap-2 mb-6 p-1 bg-black rounded-sm border border-white/10">
              <button
                type="button"
                onClick={() => { setMode('new'); setError(''); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-colors ${
                  mode === 'new' ? 'bg-gold-500 text-black' : 'text-white/50 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                New staff
              </button>
              <button
                type="button"
                onClick={() => { setMode('existing'); setError(''); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-colors ${
                  mode === 'existing' ? 'bg-gold-500 text-black' : 'text-white/50 hover:text-white'
                }`}
              >
                <Link2 className="w-3.5 h-3.5" />
                Existing login
              </button>
            </div>

            {mode === 'new' ? (
              <p className="text-xs text-white/50 mb-6">
                Creates a new login for someone who has never signed in before.
              </p>
            ) : (
              <p className="text-xs text-white/50 mb-6">
                Grants admin access to someone who already has an account (same email they use to sign in).
              </p>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-sm">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={mode === 'new' ? handleAddNewStaff : handleLinkExisting} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">Work email</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-black border border-white/10 py-3 px-4 text-white text-sm rounded-sm focus:border-gold-500 outline-none"
                  placeholder="manager@olenix.com"
                />
              </div>

              {mode === 'new' && (
                <>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] uppercase tracking-widest text-white/50">Temporary password</label>
                      <button
                        type="button"
                        onClick={() => {
                          const pwd = generateStaffPassword();
                          setFormData({ ...formData, password: pwd, confirmPassword: pwd });
                        }}
                        className="text-[10px] uppercase tracking-widest text-gold-500 hover:text-gold-400"
                      >
                        Suggest password
                      </button>
                    </div>
                    <input
                      required
                      type="text"
                      minLength={6}
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-black border border-white/10 py-3 px-4 text-white text-sm rounded-sm focus:border-gold-500 outline-none font-mono"
                      placeholder="At least 6 characters"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">Confirm password</label>
                    <input
                      required
                      type="text"
                      minLength={6}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full bg-black border border-white/10 py-3 px-4 text-white text-sm rounded-sm focus:border-gold-500 outline-none font-mono"
                    />
                  </div>
                </>
              )}

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 text-xs uppercase tracking-widest border border-white/10 hover:bg-white/5 text-white/60 transition-colors rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-4 text-xs uppercase tracking-widest bg-gold-500 hover:bg-gold-400 text-black font-bold flex items-center justify-center gap-2 transition-colors rounded-sm disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {mode === 'new' ? 'Create staff' : 'Grant access'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
