-- Menu, menu categories & staff RPCs (PostgREST-friendly)
-- Run in Supabase Dashboard → SQL Editor after 001 / 002 migrations.

-- ─── Ensure helper functions exist ───────────────────────────────────────────

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where id = auth.uid());
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins where id = auth.uid() and role = 'super_admin'
  );
$$;

grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_super_admin() to authenticated;

-- ─── Auth: resolve role for logged-in user ───────────────────────────────────

create or replace function public.get_admin_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.admins where id = auth.uid() limit 1;
$$;

grant execute on function public.get_admin_role() to authenticated;

-- ─── Public menu reads ───────────────────────────────────────────────────────

create or replace function public.list_menu_categories()
returns setof public.menu_categories
language sql
stable
security definer
set search_path = public
as $$
  select * from public.menu_categories order by name;
$$;

create or replace function public.list_menu_items()
returns setof public.menu
language sql
stable
security definer
set search_path = public
as $$
  select * from public.menu order by category, name;
$$;

grant execute on function public.list_menu_categories() to anon, authenticated;
grant execute on function public.list_menu_items() to anon, authenticated;

-- ─── Admin: menu categories ──────────────────────────────────────────────────

create or replace function public.save_menu_category(
  p_id text,
  p_name text,
  p_image_url text default ''
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  category_id text;
begin
  if not public.is_admin() then
    return json_build_object('ok', false, 'error', 'unauthorized');
  end if;

  if p_name is null or trim(p_name) = '' then
    return json_build_object('ok', false, 'error', 'name_required');
  end if;

  category_id := coalesce(
    nullif(trim(p_id), ''),
    lower(regexp_replace(trim(p_name), '[^a-zA-Z0-9]+', '-', 'g'))
  );

  insert into public.menu_categories (id, name, image_url)
  values (category_id, trim(p_name), coalesce(p_image_url, ''))
  on conflict (id) do update
    set name = excluded.name,
        image_url = excluded.image_url;

  return json_build_object('ok', true, 'id', category_id);
end;
$$;

create or replace function public.delete_menu_category(p_id text)
returns json
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    return json_build_object('ok', false, 'error', 'unauthorized');
  end if;

  delete from public.menu_categories where id = p_id;
  return json_build_object('ok', true);
end;
$$;

grant execute on function public.save_menu_category(text, text, text) to authenticated;
grant execute on function public.delete_menu_category(text) to authenticated;

-- ─── Admin: menu items ───────────────────────────────────────────────────────

create or replace function public.save_menu_item(
  p_id text,
  p_category text,
  p_name text,
  p_price text,
  p_description text default ''
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  item_id uuid;
begin
  if not public.is_admin() then
    return json_build_object('ok', false, 'error', 'unauthorized');
  end if;

  if p_category is null or trim(p_category) = '' or p_name is null or trim(p_name) = '' then
    return json_build_object('ok', false, 'error', 'invalid_fields');
  end if;

  if p_id is null or trim(p_id) = '' then
    insert into public.menu (category, name, price, description)
    values (trim(p_category), trim(p_name), trim(p_price), coalesce(p_description, ''))
    returning id into item_id;
  else
    update public.menu
    set category = trim(p_category),
        name = trim(p_name),
        price = trim(p_price),
        description = coalesce(p_description, '')
    where id = p_id::uuid
    returning id into item_id;

    if item_id is null then
      return json_build_object('ok', false, 'error', 'not_found');
    end if;
  end if;

  return json_build_object('ok', true, 'id', item_id);
end;
$$;

create or replace function public.delete_menu_item(p_id text)
returns json
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    return json_build_object('ok', false, 'error', 'unauthorized');
  end if;

  delete from public.menu where id = p_id::uuid;
  return json_build_object('ok', true);
end;
$$;

grant execute on function public.save_menu_item(text, text, text, text, text) to authenticated;
grant execute on function public.delete_menu_item(text) to authenticated;

-- ─── Super admin: staff ──────────────────────────────────────────────────────

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
    select * from public.admins order by created_at;
end;
$$;

create or replace function public.add_admin_record(
  p_user_id text,
  p_email text,
  p_role text
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

  if p_role not in ('admin', 'super_admin') then
    return json_build_object('ok', false, 'error', 'invalid_role');
  end if;

  insert into public.admins (id, email, role)
  values (p_user_id::uuid, lower(trim(p_email)), p_role)
  on conflict (id) do update
    set email = excluded.email,
        role = excluded.role;

  return json_build_object('ok', true, 'id', p_user_id);
end;
$$;

create or replace function public.remove_admin_record(p_id text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  target_role text;
  target_email text;
begin
  if not public.is_super_admin() then
    return json_build_object('ok', false, 'error', 'unauthorized');
  end if;

  select role, email into target_role, target_email
  from public.admins
  where id = p_id::uuid;

  if target_role is null then
    return json_build_object('ok', false, 'error', 'not_found');
  end if;

  if target_role = 'super_admin' or target_email = 'admin@olenixlounge.com' then
    return json_build_object('ok', false, 'error', 'cannot_remove_super_admin');
  end if;

  delete from public.admins where id = p_id::uuid;
  return json_build_object('ok', true);
end;
$$;

grant execute on function public.list_admins() to authenticated;
grant execute on function public.add_admin_record(text, text, text) to authenticated;
grant execute on function public.remove_admin_record(text) to authenticated;

notify pgrst, 'reload schema';
