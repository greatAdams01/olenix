import { supabase } from './supabase';
import { isRpcMissing } from './rpc';
import type { AdminRole } from '../types/database';

/**
 * Resolve admin role for the current session.
 * RPC (003) is preferred; table read works for linked admins once RLS sees them in `admins`.
 */
export async function fetchAdminRole(): Promise<AdminRole | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: role, error } = await supabase.rpc('get_admin_role');
  if (!error && (role === 'admin' || role === 'super_admin')) {
    return role;
  }

  if (error && !isRpcMissing(error)) {
    console.error('get_admin_role failed:', error);
  }

  const { data, error: tableError } = await supabase
    .from('admins')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (!tableError && data?.role) {
    return data.role as AdminRole;
  }

  return null;
}
