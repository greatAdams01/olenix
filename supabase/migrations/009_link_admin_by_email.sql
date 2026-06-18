-- Let super admin grant staff access by email (no SQL for existing Auth users)
-- Run after 003 / 008

create or replace function public.link_admin_by_email(p_email text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  user_id uuid;
begin
  if not public.is_super_admin() then
    return json_build_object('ok', false, 'error', 'unauthorized');
  end if;

  if p_email is null or trim(p_email) = '' then
    return json_build_object('ok', false, 'error', 'invalid_fields');
  end if;

  select id into user_id
  from auth.users
  where lower(email) = lower(trim(p_email))
  limit 1;

  if user_id is null then
    return json_build_object('ok', false, 'error', 'auth_user_not_found');
  end if;

  insert into public.admins (id, email, role)
  values (user_id, lower(trim(p_email)), 'admin')
  on conflict (id) do update
    set email = excluded.email,
        role = 'admin';

  return json_build_object('ok', true, 'id', user_id);
end;
$$;

grant execute on function public.link_admin_by_email(text) to authenticated;

notify pgrst, 'reload schema';
