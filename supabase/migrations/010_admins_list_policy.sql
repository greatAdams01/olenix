-- Super admin must see every row in admins; staff only see themselves.
-- Also harden list_admins() so RLS cannot hide rows from super admins.

drop policy if exists "admins_select" on public.admins;
create policy "admins_select" on public.admins
  for select to authenticated
  using (public.is_super_admin() or id = auth.uid());

create or replace function public.list_admins()
returns setof public.admins
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_super_admin() then
    raise exception 'unauthorized' using errcode = '42501';
  end if;

  return query
    select a.*
    from public.admins a
    order by a.created_at;
end;
$$;

grant execute on function public.list_admins() to authenticated;

notify pgrst, 'reload schema';
