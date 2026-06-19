-- Premium spirits / beverages menu (missed from initial seed). Run after 006.
-- Safe to re-run: skips categories that exist and duplicate menu rows.

insert into public.menu_categories (id, name, image_url) values
  ('cognac', 'Cognac', ''),
  ('whiskey-brandy', 'Whiskey & Brandy', ''),
  ('wine', 'Wine', ''),
  ('tequila', 'Tequila', ''),
  ('champagne', 'Champagne', ''),
  ('premium-additions', 'Premium Additions', '')
on conflict (id) do nothing;

insert into public.menu (category, name, price, description)
select v.category, v.name, v.price, v.description
from (values
  ('Cognac', 'Martel Swift', '₦140,000', ''),
  ('Cognac', 'Martel VS', '₦90,000', ''),
  ('Cognac', 'Martel XO', '₦400,000', ''),
  ('Cognac', 'Hennessy VS', '₦90,000', ''),
  ('Cognac', 'Hennessy VSOP', '₦140,000', ''),
  ('Cognac', 'Hennessy XO', '₦400,000', ''),
  ('Cognac', 'Remy Martins', '₦150,000', ''),
  ('Cognac', 'Lise (B) VSOP', '₦100,000', ''),
  ('Cognac', 'Lise (B) Cocktail', '₦70,000', ''),
  ('Cognac', 'Lise (B) Fine Cognac', '₦85,000', ''),
  ('Whiskey & Brandy', 'Glenfiddich 18 Years', '₦180,000', ''),
  ('Whiskey & Brandy', 'Glenfiddich 12 Years', '₦90,000', ''),
  ('Whiskey & Brandy', 'Glenfiddich 15 Years', '₦140,000', ''),
  ('Whiskey & Brandy', 'Singleton 12 Years', '₦100,000', ''),
  ('Whiskey & Brandy', 'Singleton 15 Years', '₦145,000', ''),
  ('Whiskey & Brandy', 'Jameson Black', '₦70,000', ''),
  ('Whiskey & Brandy', 'Jameson Green', '₦45,000', ''),
  ('Whiskey & Brandy', 'Jack Daniel', '₦40,000', ''),
  ('Whiskey & Brandy', 'Observatory', '₦70,000', ''),
  ('Whiskey & Brandy', 'Monkey Shoulder', '₦80,000', ''),
  ('Whiskey & Brandy', 'Artesnes', '₦40,000', ''),
  ('Whiskey & Brandy', 'William Lawson', '₦35,000', ''),
  ('Whiskey & Brandy', 'William Lawson SM', '₦10,000', ''),
  ('Whiskey & Brandy', 'Red Label', '₦35,000', ''),
  ('Whiskey & Brandy', 'Tullamore', '₦45,000', ''),
  ('Whiskey & Brandy', 'Viecchia', '₦75,000', ''),
  ('Whiskey & Brandy', 'Grants', '₦40,000', ''),
  ('Whiskey & Brandy', 'Campari (B)', '₦35,000', ''),
  ('Whiskey & Brandy', 'Campari (M)', '₦25,000', ''),
  ('Whiskey & Brandy', 'Campari (S)', '₦10,000', ''),
  ('Wine', '4 Cousins', '₦20,000', ''),
  ('Wine', 'Carlo Rossi', '₦25,000', ''),
  ('Wine', 'Asconi Agor', '₦25,000', ''),
  ('Wine', 'Escudo Rojo', '₦35,000', ''),
  ('Wine', 'Expression', '₦35,000', ''),
  ('Wine', 'Fidossi Red Wine', '₦35,000', ''),
  ('Wine', 'Lambrusco', '₦35,000', ''),
  ('Wine', 'Castillo Grande', '₦20,000', ''),
  ('Wine', 'Sweet Kiss Red/Rose', '₦25,000', ''),
  ('Wine', 'Festa Wine Red/Rose', '₦25,000', ''),
  ('Wine', 'Declao 4th Street Wine', '₦25,000', ''),
  ('Wine', 'Henkel Piccolo', '₦30,000', ''),
  ('Wine', 'Schoenaich Wine', '₦30,000', ''),
  ('Wine', 'Le-Filou', '₦30,000', ''),
  ('Wine', 'Chewaraze Merlot', '₦30,000', ''),
  ('Wine', 'Les Vignerons', '₦30,000', ''),
  ('Wine', 'Cheval d''Elena Edward''s Wine', '₦30,000', ''),
  ('Wine', 'Wein', '₦30,000', ''),
  ('Wine', 'Rot Wein', '₦30,000', ''),
  ('Wine', 'Stettyn Red Wine', '₦25,000', ''),
  ('Wine', 'Stettyn Sweet Wine', '₦25,000', ''),
  ('Wine', 'Cartier Wine (S)', '₦6,000', ''),
  ('Wine', 'Babelki C', '₦30,000', ''),
  ('Tequila', 'Sierra White', '₦30,000', ''),
  ('Tequila', 'Casamigo', '₦200,000', ''),
  ('Tequila', 'Sierra Gold', '₦35,000', ''),
  ('Tequila', 'Sierra Tropical', '₦35,000', ''),
  ('Tequila', 'Olmeca', '₦45,000', ''),
  ('Tequila', 'Agavales', '₦30,000', ''),
  ('Tequila', 'Bacardi White/Gold', '₦30,000', ''),
  ('Champagne', 'Belaire Rose', '₦80,000', ''),
  ('Champagne', 'Moet Rose', '₦150,000', ''),
  ('Champagne', 'Moet Ice', '₦150,000', ''),
  ('Champagne', 'Martini Rose', '₦30,000', ''),
  ('Champagne', 'Mood', '₦65,000', ''),
  ('Champagne', 'Moet Chandon', '₦150,000', ''),
  ('Spirit & Vodka', 'Smirnoff 100 Quality', '₦10,000', ''),
  ('Premium Additions', '1960 Root', '₦15,000', ''),
  ('Premium Additions', 'American Honey', '₦40,000', ''),
  ('Premium Additions', 'Declan', '₦20,000', ''),
  ('Premium Additions', 'Cooper & Thief', '₦80,000', ''),
  ('Premium Additions', 'Remy Martins', '₦150,000', '')
) as v(category, name, price, description)
where not exists (
  select 1
  from public.menu m
  where m.category = v.category and m.name = v.name
);

notify pgrst, 'reload schema';
