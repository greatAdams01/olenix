-- Fix: count_vip_bookings_for_date RPC (PGRST202)
-- Run this in Supabase Dashboard → SQL Editor if booking availability fails.

-- Remove old signature if present
drop function if exists public.count_vip_bookings_for_date(date);

-- Use text param — PostgREST matches JSON string args reliably
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

-- Refresh PostgREST schema cache
notify pgrst, 'reload schema';
