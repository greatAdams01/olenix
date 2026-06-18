-- Link your Supabase Auth user to the admins table (REQUIRED for admin access).
--
-- IMPORTANT:
-- • Create the user in Authentication FIRST (with email + password).
-- • admins.id = that user's UUID from auth.users — NEVER autogenerate id.
-- • Passwords live in auth.users only; the admins table has no password column.
--
-- Steps:
-- 1. Dashboard → Authentication → Users → Add user (email + password) OR use /admin/staff
-- 2. Copy the user's UUID
-- 3. Replace placeholders below and run in SQL Editor

insert into public.admins (id, email, role)
values (
  'YOUR-AUTH-USER-UUID-HERE',
  'your-email@example.com',
  'super_admin'
)
on conflict (id) do update
  set email = excluded.email,
      role = excluded.role;

-- Verify:
-- select a.id, a.email, a.role from public.admins a join auth.users u on u.id = a.id;
