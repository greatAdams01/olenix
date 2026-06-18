-- Staff RPC: only allow creating standard admins (not super_admin)
-- Super admin is bootstrapped via Supabase Auth + 004_link_super_admin.sql

create or replace function public.add_admin_record(
  p_user_id text,
  p_email text,
  p_role text default 'admin'
)
returns json
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_super_admin() then
    return json_build_object('ok', false, 'error', 'unauthorized');
  end if;

  -- Only standard staff admins can be created from the app
  if p_role is distinct from 'admin' then
    return json_build_object('ok', false, 'error', 'super_admin_via_supabase_only');
  end if;

  insert into public.admins (id, email, role)
  values (p_user_id::uuid, lower(trim(p_email)), 'admin')
  on conflict (id) do update
    set email = excluded.email,
        role = 'admin';

  return json_build_object('ok', true, 'id', p_user_id);
end;
$$;

grant execute on function public.add_admin_record(text, text, text) to authenticated;

notify pgrst, 'reload schema';
