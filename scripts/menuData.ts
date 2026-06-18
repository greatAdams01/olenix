/** Menu extracted from Olenix Xclusive Lounge printed menus (Jun 2026). */

export function naira(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`;
}

type MenuEntry = { category: string; name: string; price: string; description?: string };

export const categories = [
  { id: 'spirit-vodka', name: 'Spirit & Vodka', image_url: '' },
  { id: 'herbs-drinks', name: 'Herbs Drinks', image_url: '' },
  { id: 'energy', name: 'Energy', image_url: '' },
  { id: 'beer', name: 'Beer', image_url: '' },
  { id: 'cigarette', name: 'Cigarette', image_url: '' },
  { id: 'shorts-drinks', name: 'Shorts Drinks', image_url: '' },
  { id: 'juice-soft-drink', name: 'Juice / Soft Drink', image_url: '' },
  { id: 'shisha', name: 'Shisha', image_url: '' },
  { id: 'sides', name: 'Sides', image_url: '' },
  { id: 'special-soup', name: 'Special Soup', image_url: '' },
  { id: 'rice', name: 'Rice', image_url: '' },
  { id: 'special-rice', name: 'Special Rice', image_url: '' },
  { id: 'platter', name: 'Platter', image_url: '' },
  { id: 'olenix-combo', name: 'Olenix Combo', image_url: '' },
  { id: 'olenix-chops', name: 'Olenix Chops', image_url: '' },
  { id: 'olenix-mini-combo', name: 'Olenix Mini Combo', image_url: '' },
  { id: 'olenix-king-size-combo', name: 'Olenix King Size Combo', image_url: '' },
  { id: 'pasta-corner', name: 'Pasta Corner', image_url: '' },
  { id: 'swallows', name: 'Swallows', image_url: '' },
  { id: 'native-corner', name: 'Native Corner', image_url: '' },
  { id: 'bites-corners', name: 'Bites Corners', image_url: '' },
  { id: 'soups', name: 'Soups', image_url: '' },
  { id: 'fish-seafood', name: 'Fish & Seafood', image_url: '' },
  { id: 'jumbo-prawns', name: 'Jumbo Prawns', image_url: '' },
  { id: 'olenix-creamy-pasta', name: 'Olenix Creamy Pasta', image_url: '' },
  { id: 'grills', name: 'Grills', image_url: '' },
  { id: 'pepper-soups', name: 'Pepper Soups', image_url: '' },
  { id: 'seafood-corner', name: 'Sea Food Corner', image_url: '' },
] as const;

export const menuItems: MenuEntry[] = [
  // ── SPIRIT & VODKA ──
  { category: 'Spirit & Vodka', name: 'Belvedere Big', price: naira(90000) },
  { category: 'Spirit & Vodka', name: 'Belvedere Medium', price: naira(70000) },
  { category: 'Spirit & Vodka', name: 'Best Vodka Big', price: naira(15000) },
  { category: 'Spirit & Vodka', name: 'Best Vodka Small', price: naira(6000) },
  { category: 'Spirit & Vodka', name: 'Best VIP', price: naira(15000) },
  { category: 'Spirit & Vodka', name: 'Best VIP Small', price: naira(6000) },
  { category: 'Spirit & Vodka', name: 'Best Inferno Big', price: naira(15000) },
  { category: 'Spirit & Vodka', name: 'Best Inferno Small', price: naira(6000) },
  { category: 'Spirit & Vodka', name: 'Best Cream Big', price: naira(15000) },
  { category: 'Spirit & Vodka', name: 'Best Cream Small', price: naira(6000) },
  { category: 'Spirit & Vodka', name: 'Don Coco', price: naira(2000) },
  { category: 'Spirit & Vodka', name: 'Best Dry Gin Big', price: naira(15000) },
  { category: 'Spirit & Vodka', name: 'Best Whisky Big', price: naira(15000) },
  { category: 'Spirit & Vodka', name: 'Best Whisky Small', price: naira(6000) },
  { category: 'Spirit & Vodka', name: "Gordon's", price: naira(15000) },
  { category: 'Spirit & Vodka', name: 'Magic Moment', price: naira(6000) },
  { category: 'Spirit & Vodka', name: 'Smirnoff Vodka X1', price: naira(15000) },
  { category: 'Spirit & Vodka', name: 'Smirnoff Ice Gin Medium', price: naira(8000) },
  { category: 'Spirit & Vodka', name: 'Smirnoff Ice Gin Small', price: naira(6000) },
  { category: 'Spirit & Vodka', name: 'Jagermeister', price: naira(45000) },
  { category: 'Spirit & Vodka', name: "Gordon's Small", price: naira(6000) },
  { category: 'Spirit & Vodka', name: "Gordon's Medium", price: naira(8000) },

  // ── HERBS DRINKS ──
  { category: 'Herbs Drinks', name: 'Origin Plastic', price: naira(2500) },
  { category: 'Herbs Drinks', name: 'Actiona Bitter', price: naira(2500) },
  { category: 'Herbs Drinks', name: 'Odogwu Bitter', price: naira(2000) },
  { category: 'Herbs Drinks', name: 'De General', price: naira(2000) },
  { category: 'Herbs Drinks', name: 'Long Jack', price: naira(2000) },
  { category: 'Herbs Drinks', name: 'Ace Bitters', price: naira(2000) },

  // ── ENERGY ──
  { category: 'Energy', name: 'Amber', price: naira(2000) },
  { category: 'Energy', name: 'Fearless Pet', price: naira(1000) },
  { category: 'Energy', name: 'Fearless Can', price: naira(1000) },
  { category: 'Energy', name: 'Predator', price: naira(1000) },
  { category: 'Energy', name: 'Monster', price: naira(2000) },
  { category: 'Energy', name: 'Bullet', price: naira(3000) },
  { category: 'Energy', name: 'Red Bull', price: naira(3000) },
  { category: 'Energy', name: 'Power House', price: naira(3000) },

  // ── BEER ──
  { category: 'Beer', name: 'Big Heineken', price: naira(2500) },
  { category: 'Beer', name: 'Medium Heineken', price: naira(2000) },
  { category: 'Beer', name: 'Big Stout', price: naira(2500) },
  { category: 'Beer', name: 'Small Stout', price: naira(2000) },
  { category: 'Beer', name: 'Goldberg', price: naira(2000) },
  { category: 'Beer', name: 'Gulder', price: naira(2500) },
  { category: 'Beer', name: 'Life', price: naira(2000) },
  { category: 'Beer', name: '33 Expert', price: naira(2000) },
  { category: 'Beer', name: 'Legend', price: naira(2000) },
  { category: 'Beer', name: 'Turbo King', price: naira(2000) },
  { category: 'Beer', name: 'Tiger', price: naira(1500) },
  { category: 'Beer', name: 'Despirado', price: naira(2000) },
  { category: 'Beer', name: 'Star', price: naira(2000) },
  { category: 'Beer', name: 'Castle Light Can', price: naira(2000) },
  { category: 'Beer', name: 'Goldberg Black Big', price: naira(2000) },
  { category: 'Beer', name: 'Star Radler', price: naira(2000) },
  { category: 'Beer', name: 'Origin Beer', price: naira(2000) },
  { category: 'Beer', name: 'Trophy', price: naira(2000) },
  { category: 'Beer', name: 'Trophy Stout', price: naira(2000) },
  { category: 'Beer', name: 'Budweiser', price: naira(2000) },
  { category: 'Beer', name: 'Budweiser Royale', price: naira(2500) },
  { category: 'Beer', name: 'Castle Lite', price: naira(2000) },
  { category: 'Beer', name: 'Hero', price: naira(2000) },
  { category: 'Beer', name: 'Flying Fish', price: naira(2000) },
  { category: 'Beer', name: 'Double Black', price: naira(2000) },
  { category: 'Beer', name: 'Smirnoff Ice Bottle', price: naira(2000) },
  { category: 'Beer', name: 'Smirnoff Can', price: naira(2000) },
  { category: 'Beer', name: 'Smirnoff Double Blk', price: naira(2000) },
  { category: 'Beer', name: 'Smirnoff Ice Big', price: naira(2500) },
  { category: 'Beer', name: 'Goldberg Black Small', price: naira(1500) },

  // ── CIGARETTE ──
  { category: 'Cigarette', name: 'Benson Brown', price: naira(2500) },
  { category: 'Cigarette', name: 'Benson Switch', price: naira(2500) },
  { category: 'Cigarette', name: 'Rothmans', price: naira(2500) },
  { category: 'Cigarette', name: 'Chesterfield', price: naira(2500) },
  { category: 'Cigarette', name: 'Dunhill', price: naira(2500) },
  { category: 'Cigarette', name: 'Esse Change', price: naira(2500) },
  { category: 'Cigarette', name: 'Bohem', price: naira(2500) },
  { category: 'Cigarette', name: 'Lighter', price: naira(500) },

  // ── SHORTS DRINKS ──
  { category: 'Shorts Drinks', name: 'Sierra Shots', price: naira(3000) },
  { category: 'Shorts Drinks', name: 'Olmeca Shot', price: naira(3000) },
  { category: 'Shorts Drinks', name: 'Agavales Shot', price: naira(3000) },
  { category: 'Shorts Drinks', name: 'Bacardi Shot', price: naira(3000) },
  { category: 'Shorts Drinks', name: "Gordon's Shot", price: naira(2000) },

  // ── JUICE / SOFT DRINK ──
  { category: 'Juice / Soft Drink', name: 'Maltina Bottle', price: naira(1500) },
  { category: 'Juice / Soft Drink', name: 'Maltina Can', price: naira(1500) },
  { category: 'Juice / Soft Drink', name: 'Malta Guinness', price: naira(1500) },
  { category: 'Juice / Soft Drink', name: 'Vita Milk', price: naira(2500) },
  { category: 'Juice / Soft Drink', name: 'Fayrouz', price: naira(1000) },
  { category: 'Juice / Soft Drink', name: 'Coke', price: naira(1000) },
  { category: 'Juice / Soft Drink', name: 'Fanta', price: naira(1000) },
  { category: 'Juice / Soft Drink', name: 'Pepsi', price: naira(1000) },
  { category: 'Juice / Soft Drink', name: 'Sprite', price: naira(1000) },
  { category: 'Juice / Soft Drink', name: 'Water (Aquatina)', price: naira(500) },
  { category: 'Juice / Soft Drink', name: 'Amstel Malt', price: naira(1500) },
  { category: 'Juice / Soft Drink', name: 'Water (Eva)', price: naira(500) },
  { category: 'Juice / Soft Drink', name: 'Schweppes', price: naira(1000) },
  { category: 'Juice / Soft Drink', name: 'Teem', price: naira(1000) },
  { category: 'Juice / Soft Drink', name: '7UP', price: naira(1000) },
  { category: 'Juice / Soft Drink', name: '5 Alives Big', price: naira(3000) },
  { category: 'Juice / Soft Drink', name: '5 Alives Small', price: naira(1000) },
  { category: 'Juice / Soft Drink', name: 'Hollandia', price: naira(3000) },
  { category: 'Juice / Soft Drink', name: 'Exotic', price: naira(3000) },
  { category: 'Juice / Soft Drink', name: 'Chivita', price: naira(3500) },

  // ── SHISHA ──
  { category: 'Shisha', name: 'Shisha', price: naira(10000) },

  // ── SIDES ──
  { category: 'Sides', name: 'Tomato Sauce', price: naira(3000) },
  { category: 'Sides', name: 'Salad', price: naira(2000) },
  { category: 'Sides', name: 'Okra Special', price: naira(5000) },

  // ── SPECIAL SOUP ──
  { category: 'Special Soup', name: 'Fisherman Soup', price: naira(30000) },
  { category: 'Special Soup', name: 'Seafood Okra', price: naira(30000) },
  { category: 'Special Soup', name: 'White Soup', price: naira(15000) },

  // ── RICE ──
  { category: 'Rice', name: 'Jollof Rice', price: naira(4000) },
  { category: 'Rice', name: 'Coconut Rice', price: naira(5000) },
  { category: 'Rice', name: 'White Rice', price: naira(3000) },
  { category: 'Rice', name: 'Fried Rice', price: naira(5000) },

  // ── SPECIAL RICE ──
  { category: 'Special Rice', name: 'Asun Rice', price: naira(10000) },
  { category: 'Special Rice', name: 'Chinese Rice', price: naira(10000) },
  { category: 'Special Rice', name: 'Pineapple Rice', price: naira(10000) },
  { category: 'Special Rice', name: 'Special Olenix Fried Rice', price: naira(15000) },
  { category: 'Special Rice', name: 'Native Rice', price: naira(7000) },

  // ── PLATTER ──
  {
    category: 'Platter',
    name: 'Spacial Olenix Sea Platter',
    price: naira(35000),
    description: 'Prawns, crab, snail, spring rolls, samosa, puff puff, yam chips, potato chips, sauce, salad',
  },

  // ── OLENIX COMBO ──
  {
    category: 'Olenix Combo',
    name: 'Olenix Combo',
    price: naira(30000),
    description: 'Gizzard, spring rolls, samosa, puff puff, yam chips, potato chips, chicken wings, sauce and salad',
  },

  // ── OLENIX CHOPS ──
  {
    category: 'Olenix Chops',
    name: 'Olenix Chops',
    price: naira(10000),
    description: 'Spring rolls, samosa, puff puff',
  },

  // ── OLENIX MINI COMBO ──
  {
    category: 'Olenix Mini Combo',
    name: 'Olenix Mini Combo',
    price: naira(18000),
    description: 'Samosa, spring rolls, puff puff, chicken',
  },

  // ── OLENIX KING SIZE COMBO ──
  {
    category: 'Olenix King Size Combo',
    name: 'Olenix King Size Combo',
    price: naira(60000),
    description: 'Prawns, snail, crab, wings, gizzard, fried rice, samosa, spring rolls, puff puff, yam chips, potato chips, salad, sauce',
  },

  // ── PASTA CORNER ──
  { category: 'Pasta Corner', name: 'Jollof Spaghetti', price: naira(5000) },
  { category: 'Pasta Corner', name: 'Stir Fry Spaghetti', price: naira(5000) },
  { category: 'Pasta Corner', name: 'Spaghetti Bolongese', price: naira(10000) },
  { category: 'Pasta Corner', name: 'Spaghetti Cabonara', price: naira(10000) },
  { category: 'Pasta Corner', name: 'Indomie and Eggs', price: naira(4000) },
  { category: 'Pasta Corner', name: 'Singapore Noodle', price: naira(15000) },
  { category: 'Pasta Corner', name: 'Yam Porridge', price: naira(6000) },
  { category: 'Pasta Corner', name: 'Yam and Egg Sauce', price: naira(6000) },
  { category: 'Pasta Corner', name: 'Yam Chips', price: naira(3000) },
  { category: 'Pasta Corner', name: 'Potato Chips', price: naira(2000) },
  { category: 'Pasta Corner', name: 'Sausage', price: naira(1000) },
  { category: 'Pasta Corner', name: 'Gizdodo', price: naira(10000) },
  { category: 'Pasta Corner', name: 'Yamarita', price: naira(6000) },
  { category: 'Pasta Corner', name: 'Plantain', price: naira(2000) },
  { category: 'Pasta Corner', name: 'Plantain Porridge', price: naira(6000) },

  // ── SWALLOWS ──
  { category: 'Swallows', name: 'Poundo', price: naira(3000) },
  { category: 'Swallows', name: 'Semo', price: naira(2000) },
  { category: 'Swallows', name: 'Eba', price: naira(2000) },
  { category: 'Swallows', name: 'Starch', price: naira(3000) },
  { category: 'Swallows', name: 'Wheat', price: naira(2000) },

  // ── NATIVE CORNER ──
  { category: 'Native Corner', name: 'Isi Ewu', price: naira(15000) },
  { category: 'Native Corner', name: 'Nkwobi', price: naira(7000) },
  { category: 'Native Corner', name: 'Asun', price: naira(5000) },

  // ── BITES CORNERS ──
  { category: 'Bites Corners', name: 'Shawarma (2 Sauage)', price: naira(5000) },
  { category: 'Bites Corners', name: 'Chicken and Chips (Potato)', price: naira(8000) },
  { category: 'Bites Corners', name: 'Chicken and Yam', price: naira(9000) },
  { category: 'Bites Corners', name: 'Spring Rolls', price: naira(3500) },
  { category: 'Bites Corners', name: 'Samosa', price: naira(3500) },
  { category: 'Bites Corners', name: 'Puff Puff', price: naira(3000) },
  { category: 'Bites Corners', name: 'Shrimps Spring Rolls', price: naira(5000) },
  { category: 'Bites Corners', name: 'Fish Sauce', price: naira(9000) },
  { category: 'Bites Corners', name: 'Vegetable Sauce', price: naira(3000) },

  // ── SOUPS ──
  { category: 'Soups', name: 'Afang Soup', price: naira(3000) },
  { category: 'Soups', name: 'Oha Soup', price: naira(3000) },
  { category: 'Soups', name: 'Okra Soup', price: naira(3000) },
  { category: 'Soups', name: 'Egusi Soup', price: naira(3000) },
  { category: 'Soups', name: 'Ogbono Soup', price: naira(3000) },
  { category: 'Soups', name: 'Vegetable Soup', price: naira(3000) },
  { category: 'Soups', name: 'Bitter Leaf Soup', price: naira(3000) },
  { category: 'Soups', name: 'Banga Soup', price: naira(4000) },
  { category: 'Soups', name: 'Stew', price: naira(3000) },
  { category: 'Soups', name: 'Pepper Soup', price: naira(3000) },
  { category: 'Soups', name: 'White Soup (Snela)', price: naira(5000) },

  // ── FISH & SEAFOOD ──
  { category: 'Fish & Seafood', name: 'Assorted', price: naira(5000) },
  { category: 'Fish & Seafood', name: 'Dried Catfish', price: naira(5000) },
  { category: 'Fish & Seafood', name: 'Big Dried Catfish', price: naira(10000) },
  { category: 'Fish & Seafood', name: 'Turkey', price: naira(9000) },
  { category: 'Fish & Seafood', name: 'Prawns', price: naira(10000) },
  { category: 'Fish & Seafood', name: 'Croacker (₦25,000)', price: naira(25000) },
  { category: 'Fish & Seafood', name: 'Croacker (₦22,000)', price: naira(22000) },
  { category: 'Fish & Seafood', name: 'Croacker (₦18,000)', price: naira(18000) },
  { category: 'Fish & Seafood', name: 'Croacker (₦15,000)', price: naira(15000) },

  // ── JUMBO PRAWNS ──
  {
    category: 'Jumbo Prawns',
    name: 'White — Choice of Chips / Jollof Rice / Fried Rice',
    price: naira(15000),
  },

  // ── OLENIX CREAMY PASTA ──
  { category: 'Olenix Creamy Pasta', name: 'Shrimps / Chicken', price: naira(15000) },

  // ── GRILLS ──
  { category: 'Grills', name: 'Big Barbecue Fish', price: naira(25000) },
  { category: 'Grills', name: 'Medium Barbecue', price: naira(22000) },
  { category: 'Grills', name: 'Roasted Plantain', price: naira(3000) },

  // ── PEPPER SOUPS ──
  { category: 'Pepper Soups', name: 'Goat Meat Pepper Soup', price: naira(6000) },
  { category: 'Pepper Soups', name: 'Chicken Pepper Soup', price: naira(7000) },
  { category: 'Pepper Soups', name: 'Turkey Pepper Soup', price: naira(9000) },
  { category: 'Pepper Soups', name: 'Assorted Pepper Soup', price: naira(5000) },
  { category: 'Pepper Soups', name: 'Full Catfish Pepper Soup (Big)', price: naira(25000) },
  { category: 'Pepper Soups', name: 'Full Catfish Pepper Soup (Medium)', price: naira(22000) },
  { category: 'Pepper Soups', name: 'Cut Fish', price: naira(6000) },
  { category: 'Pepper Soups', name: 'Beef Pepper Soup', price: naira(6000) },
  { category: 'Pepper Soups', name: 'Cut Croacker Fish', price: naira(7000) },

  // ── SEA FOOD CORNER ──
  { category: 'Sea Food Corner', name: 'Snail Jumbo Size', price: naira(9000) },
  { category: 'Sea Food Corner', name: 'Crab', price: naira(2000) },
  { category: 'Sea Food Corner', name: 'Big Prawns', price: naira(10000) },
  { category: 'Sea Food Corner', name: 'Small Prawns', price: naira(7000) },
  { category: 'Sea Food Corner', name: 'Shrimps', price: naira(10000) },
  { category: 'Sea Food Corner', name: 'Prawns Pepper Soup', price: naira(15000) },
];
