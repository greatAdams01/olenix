-- Olenix Xclusive Lounge — initial Supabase schema
-- Run in Supabase Dashboard → SQL Editor (or via Supabase CLI)

-- ─── Tables ───────────────────────────────────────────────────────────────────

create table if not exists public.admins (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  role text not null check (role in ('super_admin', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.menu_categories (
  id text primary key,
  name text not null,
  image_url text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.menu (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  name text not null,
  price text not null,
  description text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.vip_bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  guests text not null,
  date date not null,
  time text not null,
  code text not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  intentions text,
  preferences text,
  created_at timestamptz not null default now()
);

create index if not exists vip_bookings_date_idx on public.vip_bookings (date);
create index if not exists vip_bookings_created_at_idx on public.vip_bookings (created_at desc);
create index if not exists menu_category_idx on public.menu (category);

-- ─── Helpers ──────────────────────────────────────────────────────────────────

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

-- Public availability check without exposing booking rows
-- text param works reliably with PostgREST / Supabase JS RPC calls
create or replace function public.count_vip_bookings_for_date(booking_date text)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::integer
  from public.vip_bookings
  where date = booking_date::date
    and status != 'cancelled';
$$;

grant execute on function public.count_vip_bookings_for_date(text) to anon, authenticated;

-- Atomic booking insert with server-side capacity check
create or replace function public.submit_vip_booking(
  p_name text,
  p_email text,
  p_phone text,
  p_guests text,
  p_date text,
  p_time text,
  p_code text
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  booking_count integer;
begin
  select count(*)::integer into booking_count
  from public.vip_bookings
  where date = p_date::date and status != 'cancelled';

  if booking_count >= 3 then
    return json_build_object('ok', false, 'error', 'fully_booked');
  end if;

  insert into public.vip_bookings (name, email, phone, guests, date, time, code, status)
  values (p_name, p_email, p_phone, p_guests, p_date::date, p_time, p_code, 'pending');

  return json_build_object('ok', true);
end;
$$;

grant execute on function public.submit_vip_booking(text, text, text, text, text, text, text) to anon, authenticated;

-- (RLS + final notify pgrst at end of file)

alter table public.admins enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu enable row level security;
alter table public.vip_bookings enable row level security;

-- Admins: authenticated admins can read; super_admin manages rows
drop policy if exists "admins_select" on public.admins;
create policy "admins_select" on public.admins
  for select to authenticated
  using (public.is_admin());

drop policy if exists "admins_insert" on public.admins;
create policy "admins_insert" on public.admins
  for insert to authenticated
  with check (public.is_super_admin());

drop policy if exists "admins_delete" on public.admins;
create policy "admins_delete" on public.admins
  for delete to authenticated
  using (public.is_super_admin() and role != 'super_admin');

-- Menu categories: public read, admin write
drop policy if exists "menu_categories_select" on public.menu_categories;
create policy "menu_categories_select" on public.menu_categories
  for select to anon, authenticated
  using (true);

drop policy if exists "menu_categories_insert" on public.menu_categories;
create policy "menu_categories_insert" on public.menu_categories
  for insert to authenticated
  with check (public.is_admin());

drop policy if exists "menu_categories_update" on public.menu_categories;
create policy "menu_categories_update" on public.menu_categories
  for update to authenticated
  using (public.is_admin());

drop policy if exists "menu_categories_delete" on public.menu_categories;
create policy "menu_categories_delete" on public.menu_categories
  for delete to authenticated
  using (public.is_admin());

-- Menu items: public read, admin write
drop policy if exists "menu_select" on public.menu;
create policy "menu_select" on public.menu
  for select to anon, authenticated
  using (true);

drop policy if exists "menu_insert" on public.menu;
create policy "menu_insert" on public.menu
  for insert to authenticated
  with check (public.is_admin());

drop policy if exists "menu_update" on public.menu;
create policy "menu_update" on public.menu
  for update to authenticated
  using (public.is_admin());

drop policy if exists "menu_delete" on public.menu;
create policy "menu_delete" on public.menu
  for delete to authenticated
  using (public.is_admin());

-- VIP bookings: public create + availability RPC only; admins manage
drop policy if exists "vip_bookings_insert" on public.vip_bookings;
create policy "vip_bookings_insert" on public.vip_bookings
  for insert to anon, authenticated
  with check (true);

drop policy if exists "vip_bookings_select" on public.vip_bookings;
create policy "vip_bookings_select" on public.vip_bookings
  for select to authenticated
  using (public.is_admin());

drop policy if exists "vip_bookings_update" on public.vip_bookings;
create policy "vip_bookings_update" on public.vip_bookings
  for update to authenticated
  using (public.is_admin());

drop policy if exists "vip_bookings_delete" on public.vip_bookings;
create policy "vip_bookings_delete" on public.vip_bookings
  for delete to authenticated
  using (public.is_admin());

-- ─── Realtime (optional — enable in Dashboard if channels fail) ───────────────

alter table public.menu replica identity full;
alter table public.menu_categories replica identity full;
alter table public.vip_bookings replica identity full;

notify pgrst, 'reload schema';
