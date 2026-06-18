import { writeFileSync } from 'node:fs';
import { categories, menuItems } from './menuData';

function esc(s: string): string {
  return s.replace(/'/g, "''");
}

const lines: string[] = [
  '-- Olenix menu seed — generated from printed menus. Run after 001–005.',
  'delete from public.menu;',
  'delete from public.menu_categories;',
  '',
  'insert into public.menu_categories (id, name, image_url) values',
  categories.map((c) => `  ('${c.id}', '${esc(c.name)}', '')`).join(',\n') + ';',
  '',
  'insert into public.menu (category, name, price, description) values',
  menuItems
    .map(
      (item) =>
        `  ('${esc(item.category)}', '${esc(item.name)}', '${esc(item.price)}', '${esc(item.description ?? '')}')`,
    )
    .join(',\n') + ';',
  '',
  "notify pgrst, 'reload schema';",
  '',
];

const out = 'supabase/migrations/006_seed_menu.sql';
writeFileSync(out, lines.join('\n'));
console.log(`Wrote ${out} (${categories.length} categories, ${menuItems.length} items)`);
