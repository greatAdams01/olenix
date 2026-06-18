import { supabase } from './supabase';
import { isRpcMissing, isRlsDenied, rlsDeniedMessage } from './rpc';
import type { MenuCategoryRow, MenuItemRow } from '../types/database';

function mapError(error: { message?: string; code?: string }): string {
  if (isRlsDenied(error)) return rlsDeniedMessage();
  return error.message ?? 'Operation failed';
}

function slugifyCategory(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export async function listMenuItems(): Promise<{ data: MenuItemRow[] | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('menu')
    .select('*')
    .order('category')
    .order('name');

  return { data: data as MenuItemRow[] | null, error };
}

export async function listMenuCategories(): Promise<{ data: MenuCategoryRow[] | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('menu_categories')
    .select('*')
    .order('name');

  return { data: data as MenuCategoryRow[] | null, error };
}

export async function saveMenuItem(params: {
  id?: string;
  category: string;
  name: string;
  price: string;
  description: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const { data, error } = await supabase.rpc('save_menu_item', {
    p_id: params.id ?? '',
    p_category: params.category,
    p_name: params.name,
    p_price: params.price,
    p_description: params.description,
  });

  if (!error && data?.ok) return { ok: true };
  if (error && !isRpcMissing(error)) return { ok: false, error: mapError(error) };
  if (data && !data.ok) return { ok: false, error: rlsDeniedMessage() };

  if (params.id) {
    const { error: updateError } = await supabase
      .from('menu')
      .update({
        category: params.category.trim(),
        name: params.name.trim(),
        price: params.price.trim(),
        description: params.description,
      })
      .eq('id', params.id);
    if (updateError) return { ok: false, error: mapError(updateError) };
    return { ok: true };
  }

  const { error: insertError } = await supabase.from('menu').insert({
    category: params.category.trim(),
    name: params.name.trim(),
    price: params.price.trim(),
    description: params.description,
  });
  if (insertError) return { ok: false, error: mapError(insertError) };
  return { ok: true };
}

export async function deleteMenuItem(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const { data, error } = await supabase.rpc('delete_menu_item', { p_id: id });
  if (!error && data?.ok) return { ok: true };
  if (error && !isRpcMissing(error)) return { ok: false, error: mapError(error) };
  if (data && !data.ok) return { ok: false, error: rlsDeniedMessage() };

  const { error: deleteError } = await supabase.from('menu').delete().eq('id', id);
  if (deleteError) return { ok: false, error: mapError(deleteError) };
  return { ok: true };
}

export async function saveMenuCategory(params: {
  id?: string;
  name: string;
  imageUrl: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const categoryId = params.id?.trim() || slugifyCategory(params.name);

  const { data, error } = await supabase.rpc('save_menu_category', {
    p_id: categoryId,
    p_name: params.name,
    p_image_url: params.imageUrl,
  });
  if (!error && data?.ok) return { ok: true };
  if (error && !isRpcMissing(error)) return { ok: false, error: mapError(error) };
  if (data && !data.ok) return { ok: false, error: rlsDeniedMessage() };

  const { error: upsertError } = await supabase.from('menu_categories').upsert({
    id: categoryId,
    name: params.name.trim(),
    image_url: params.imageUrl,
  });
  if (upsertError) return { ok: false, error: mapError(upsertError) };
  return { ok: true };
}

export async function deleteMenuCategory(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const { data, error } = await supabase.rpc('delete_menu_category', { p_id: id });
  if (!error && data?.ok) return { ok: true };
  if (error && !isRpcMissing(error)) return { ok: false, error: mapError(error) };
  if (data && !data.ok) return { ok: false, error: rlsDeniedMessage() };

  const { error: deleteError } = await supabase.from('menu_categories').delete().eq('id', id);
  if (deleteError) return { ok: false, error: mapError(deleteError) };
  return { ok: true };
}
