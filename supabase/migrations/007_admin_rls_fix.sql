-- Fix update policies for upsert + ensure WITH CHECK on admin writes
-- Run after 001–003

drop policy if exists "menu_categories_update" on public.menu_categories;
create policy "menu_categories_update" on public.menu_categories
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "menu_update" on public.menu;
create policy "menu_update" on public.menu
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "vip_bookings_update" on public.vip_bookings;
create policy "vip_bookings_update" on public.vip_bookings
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

notify pgrst, 'reload schema';
