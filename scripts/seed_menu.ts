import { adminSupabase } from './supabaseAdmin';
import { categories, menuItems } from './menuData';

async function seedDatabase() {
  console.log('🚀 Seeding Olenix menu from printed menus...\n');

  console.log('🗑️  Clearing existing menu items...');
  const { error: clearMenuError } = await adminSupabase
    .from('menu')
    .delete()
    .gte('created_at', '1970-01-01');
  if (clearMenuError) throw clearMenuError;

  console.log('🗑️  Clearing existing categories...');
  const { error: clearCatError } = await adminSupabase
    .from('menu_categories')
    .delete()
    .gte('created_at', '1970-01-01');
  if (clearCatError) throw clearCatError;

  console.log(`📁 Upserting ${categories.length} categories...`);
  const { error: catError } = await adminSupabase
    .from('menu_categories')
    .upsert(categories.map((c) => ({ id: c.id, name: c.name, image_url: c.image_url })));
  if (catError) throw catError;
  console.log(`✅ ${categories.length} categories ready.\n`);

  const payload = menuItems.map((item) => ({
    category: item.category,
    name: item.name,
    price: item.price,
    description: item.description ?? '',
  }));

  console.log(`🍽️  Inserting ${payload.length} menu items...`);
  const batchSize = 100;
  for (let i = 0; i < payload.length; i += batchSize) {
    const batch = payload.slice(i, i + batchSize);
    const { error: itemError } = await adminSupabase.from('menu').insert(batch);
    if (itemError) throw itemError;
    console.log(`   ... ${Math.min(i + batch.length, payload.length)} / ${payload.length}`);
  }

  console.log(`\n🎉 Done — ${categories.length} categories, ${payload.length} items seeded.`);
  process.exit(0);
}

seedDatabase().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
