export type RpcPayload = { ok?: boolean; error?: string } | null;

export const RPC_MIGRATION_HINTS = {
  booking: 'supabase/migrations/002_fix_booking_rpc.sql',
  menuStaff: 'supabase/migrations/003_menu_and_staff_rpc.sql',
  adminRole: 'supabase/migrations/003_menu_and_staff_rpc.sql',
} as const;

export function isRlsDenied(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  if (error.code === '42501') return true;
  return (error.message ?? '').toLowerCase().includes('row-level security');
}

export function rlsDeniedMessage(): string {
  return 'Permission denied. Your account must be in the admins table — see Settings or contact a super admin.';
}

export function isRpcMissing(error: { code?: string } | null): boolean {
  return error?.code === 'PGRST202';
}

export function rpcMissingMessage(migration: keyof typeof RPC_MIGRATION_HINTS): string {
  return `Database function missing. Run ${RPC_MIGRATION_HINTS[migration]} in the Supabase SQL Editor.`;
}

export function parseRpcPayload(data: RpcPayload): { ok: true } | { ok: false; error: string } {
  if (data?.ok) return { ok: true };
  return { ok: false, error: data?.error ?? 'unknown' };
}

export function rpcErrorMessage(error: string): string {
  switch (error) {
    case 'unauthorized':
      return 'You do not have permission to perform this action.';
    case 'cannot_remove_super_admin':
      return 'You cannot remove the primary Super Admin account.';
    case 'not_found':
      return 'Record not found.';
    case 'invalid_role':
      return 'Invalid role selected.';
    case 'super_admin_via_supabase_only':
      return 'Super admin accounts are created in Supabase Auth only.';
    case 'auth_user_not_found':
      return 'No login exists for that email yet. Use "New staff" to create an account with a password.';
    case 'name_required':
    case 'invalid_fields':
      return 'Please fill in all required fields.';
    default:
      return 'Operation failed. Please try again.';
  }
}
