import { collection, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '../src/lib/firebase';

const menuData = [
  // Food Menu 1
  { category: "Sides & Extras", name: "Tomato Sauce", price: "₦3,000", desc: "" },
  { category: "Sides & Extras", name: "Salad", price: "₦2,000", desc: "" },
  { category: "Sides & Extras", name: "Okra Special", price: "₦5,000", desc: "" },
  { category: "Special Soup", name: "Fisherman Soup", price: "₦30,000", desc: "" },
  { category: "Special Soup", name: "Seafood Okra", price: "₦30,000", desc: "" },
  { category: "Special Soup", name: "White Soup", price: "₦15,000", desc: "" },
  { category: "Rice", name: "Jollof Rice", price: "₦4,000", desc: "" },
  { category: "Rice", name: "Coconut Rice", price: "₦5,000", desc: "" },
  { category: "Rice", name: "White Rice", price: "₦3,000", desc: "" },
  { category: "Rice", name: "Fried Rice", price: "₦5,000", desc: "" },
  { category: "Special Rice", name: "Asun Rice", price: "₦10,000", desc: "" },
  { category: "Special Rice", name: "Chinese Rice", price: "₦10,000", desc: "" },
  { category: "Special Rice", name: "Pineapple Rice", price: "₦10,000", desc: "" },
  { category: "Special Rice", name: "Special Olenix Fried Rice", price: "₦15,000", desc: "" },
  { category: "Special Rice", name: "Native Rice", price: "₦7,000", desc: "" },
  { category: "Platters & Combos", name: "Special Olenix Sea Platter", price: "₦35,000", desc: "Prawns, Crab, Snail, Spring Rolls, Samosa, Puff Puff, Yam Chips, Potato Chips Sauce, Salad" },
  { category: "Platters & Combos", name: "Olenix Combo", price: "₦30,000", desc: "Gizzard, Spring Rolls, Samosa, Puff Puff, Yam Chips, Potato Chips, Chicken Wings, Sauce and Salad" },
  { category: "Platters & Combos", name: "Olenix Chops", price: "₦10,000", desc: "Springs Rolls, Samosa, Puff Puff" },
  { category: "Platters & Combos", name: "Olenix King Size Combo", price: "₦60,000", desc: "Prawns, Snail, Crab, Wings, Gizzard, Fried Rice, Samosa, Spring Rolls, Puff Puff, Yam Chips, Potato Chips, Salad, Sauce" },
  { category: "Platters & Combos", name: "Olenix Mini Combo", price: "₦18,000", desc: "Samosa, Spring Rolls, Puff Puff, Chicken" },

  // Food Menu 2
  { category: "Pasta Corner", name: "Jollof Spaghetti", price: "₦5,000", desc: "" },
  { category: "Pasta Corner", name: "Stir Fry Spaghetti", price: "₦5,000", desc: "" },
  { category: "Pasta Corner", name: "Spaghetti Bolognese", price: "₦10,000", desc: "" },
  { category: "Pasta Corner", name: "Spaghetti Carbonara", price: "₦10,000", desc: "" },
  { category: "Pasta Corner", name: "Indomie and Eggs", price: "₦4,000", desc: "" },
  { category: "Pasta Corner", name: "Singapore Noodle", price: "₦15,000", desc: "" },
  { category: "Sides & Extras", name: "Yam Porridge", price: "₦6,000", desc: "" },
  { category: "Sides & Extras", name: "Yam and Egg Sauce", price: "₦6,000", desc: "" },
  { category: "Sides & Extras", name: "Yam Chips", price: "₦3,000", desc: "" },
  { category: "Sides & Extras", name: "Potato Chips", price: "₦2,000", desc: "" },
  { category: "Sides & Extras", name: "Sausage", price: "₦1,000", desc: "" },
  { category: "Sides & Extras", name: "Gizdodo", price: "₦10,000", desc: "" },
  { category: "Sides & Extras", name: "Yamarita", price: "₦6,000", desc: "" },
  { category: "Sides & Extras", name: "Plantain", price: "₦2,000", desc: "" },
  { category: "Sides & Extras", name: "Plantain Porridge", price: "₦6,000", desc: "" },
  { category: "Swallows", name: "Poundo", price: "₦3,000", desc: "" },
  { category: "Swallows", name: "Semo", price: "₦2,000", desc: "" },
  { category: "Swallows", name: "Eba", price: "₦2,000", desc: "" },
  { category: "Swallows", name: "Starch", price: "₦3,000", desc: "" },
  { category: "Swallows", name: "Wheat", price: "₦2,000", desc: "" },
  { category: "Native Corner", name: "Isi Ewu", price: "₦15,000", desc: "" },
  { category: "Native Corner", name: "Nkwobi", price: "₦7,000", desc: "" },
  { category: "Native Corner", name: "Asun", price: "₦5,000", desc: "" },
  { category: "Bites Corner", name: "Shawarma (2 Sausage)", price: "₦5,000", desc: "" },
  { category: "Bites Corner", name: "Chicken and Chips (Potato)", price: "₦8,000", desc: "" },
  { category: "Bites Corner", name: "Chicken and Yam", price: "₦9,000", desc: "" },
  { category: "Bites Corner", name: "Spring Rolls", price: "₦3,500", desc: "" },
  { category: "Bites Corner", name: "Samosa", price: "₦3,500", desc: "" },
  { category: "Bites Corner", name: "Puff Puff", price: "₦3,000", desc: "" },
  { category: "Bites Corner", name: "Shrimps Spring Rolls", price: "₦5,000", desc: "" },
  { category: "Bites Corner", name: "Fish Sauce", price: "₦9,000", desc: "" },
  { category: "Bites Corner", name: "Vegetable Sauce", price: "₦3,000", desc: "" },
  { category: "Soups", name: "Afang Soup", price: "₦3,000", desc: "" },
  { category: "Soups", name: "Oha Soup", price: "₦3,000", desc: "" },
  { category: "Soups", name: "Okra Soup", price: "₦3,000", desc: "" },
  { category: "Soups", name: "Egusi Soup", price: "₦3,000", desc: "" },
  { category: "Soups", name: "Ogbono Soup", price: "₦3,000", desc: "" },
  { category: "Soups", name: "Vegetable Soup", price: "₦3,000", desc: "" },
  { category: "Soups", name: "Bitter Leaf Soup", price: "₦3,000", desc: "" },
  { category: "Soups", name: "Banga Soup", price: "₦4,000", desc: "" },
  { category: "Soups", name: "Stew", price: "₦3,000", desc: "" },
  { category: "Soups", name: "Pepper Soup", price: "₦3,000", desc: "" },
  { category: "Soups", name: "White Soup (Snela)", price: "₦8,000", desc: "" },

  // Beverage Menu 1
  { category: "Spirit & Vodka", name: "Belvedere Big", price: "₦90,000", desc: "" },
  { category: "Spirit & Vodka", name: "Belvedere Medium", price: "₦70,000", desc: "" },
  { category: "Spirit & Vodka", name: "Best Vodka Big", price: "₦15,000", desc: "" },
  { category: "Spirit & Vodka", name: "Best Vodka Small", price: "₦6,000", desc: "" },
  { category: "Spirit & Vodka", name: "Best VIP", price: "₦15,000", desc: "" },
  { category: "Spirit & Vodka", name: "Best VIP Small", price: "₦6,000", desc: "" },
  { category: "Spirit & Vodka", name: "Best Inferno Big", price: "₦15,000", desc: "" },
  { category: "Spirit & Vodka", name: "Best Inferno Small", price: "₦6,000", desc: "" },
  { category: "Spirit & Vodka", name: "Best Cream Big", price: "₦15,000", desc: "" },
  { category: "Spirit & Vodka", name: "Best Cream Small", price: "₦6,000", desc: "" },
  { category: "Spirit & Vodka", name: "Don Coco", price: "₦2,000", desc: "" },
  { category: "Spirit & Vodka", name: "Best Dry Gin-Big", price: "₦15,000", desc: "" },
  { category: "Spirit & Vodka", name: "Best Whisky Big", price: "₦15,000", desc: "" },
  { category: "Spirit & Vodka", name: "Best Whisky Small", price: "₦6,000", desc: "" },
  { category: "Spirit & Vodka", name: "Gordon's", price: "₦15,000", desc: "" },
  { category: "Spirit & Vodka", name: "Magic Moment", price: "₦6,000", desc: "" },
  { category: "Spirit & Vodka", name: "Smirnoff Vodka XI", price: "₦15,000", desc: "" },
  { category: "Spirit & Vodka", name: "Smirnoff Ice Gin Medium", price: "₦8,000", desc: "" },
  { category: "Spirit & Vodka", name: "Smirnoff Ice Gin Small", price: "₦6,000", desc: "" },
  { category: "Spirit & Vodka", name: "Jagermeister", price: "₦45,000", desc: "" },
  { category: "Spirit & Vodka", name: "Gordon's Small", price: "₦6,000", desc: "" },
  { category: "Spirit & Vodka", name: "Gordon's Medium", price: "₦8,000", desc: "" },
  
  { category: "Herbs Drinks", name: "Origin Plastic", price: "₦2,500", desc: "" },
  { category: "Herbs Drinks", name: "Actiona Bitter", price: "₦2,500", desc: "" },
  { category: "Herbs Drinks", name: "Odogwu Bitter", price: "₦2,000", desc: "" },
  { category: "Herbs Drinks", name: "De General", price: "₦2,000", desc: "" },
  { category: "Herbs Drinks", name: "Long Jack", price: "₦2,000", desc: "" },
  { category: "Herbs Drinks", name: "Ace Bitters", price: "₦2,000", desc: "" },
  
  { category: "Energy Drinks", name: "Amber", price: "₦2,000", desc: "" },
  { category: "Energy Drinks", name: "Fearless Pet", price: "₦1,000", desc: "" },
  { category: "Energy Drinks", name: "Fearless Can", price: "₦1,000", desc: "" },
  { category: "Energy Drinks", name: "Predator", price: "₦1,000", desc: "" },
  { category: "Energy Drinks", name: "Monster", price: "₦2,000", desc: "" },
  { category: "Energy Drinks", name: "Bullet", price: "₦3,000", desc: "" },
  { category: "Energy Drinks", name: "Red Bull", price: "₦3,000", desc: "" },
  { category: "Energy Drinks", name: "Power House", price: "₦3,000", desc: "" },
  
  { category: "Beer", name: "Big Heineken", price: "₦2,500", desc: "" },
  { category: "Beer", name: "Medium Heineken", price: "₦2,000", desc: "" },
  { category: "Beer", name: "Big Stout", price: "₦2,500", desc: "" },
  { category: "Beer", name: "Small Stout", price: "₦2,000", desc: "" },
  { category: "Beer", name: "Goldberg", price: "₦2,000", desc: "" },
  { category: "Beer", name: "Gulder", price: "₦2,500", desc: "" },
  { category: "Beer", name: "Life", price: "₦2,000", desc: "" },
  { category: "Beer", name: "33 Expert", price: "₦2,000", desc: "" },
  { category: "Beer", name: "Legend", price: "₦2,000", desc: "" },
  { category: "Beer", name: "Turbo King", price: "₦2,000", desc: "" },
  { category: "Beer", name: "Tiger", price: "₦1,500", desc: "" },
  { category: "Beer", name: "Despirado", price: "₦2,000", desc: "" },
  { category: "Beer", name: "Star", price: "₦2,000", desc: "" },
  { category: "Beer", name: "Castle Light Can", price: "₦2,000", desc: "" },
  { category: "Beer", name: "Goldeerg Black Big", price: "₦2,000", desc: "" },
  { category: "Beer", name: "Star Radler", price: "₦2,000", desc: "" },
  { category: "Beer", name: "Origin Beer", price: "₦2,000", desc: "" },
  { category: "Beer", name: "Trophy", price: "₦2,000", desc: "" },
  { category: "Beer", name: "Trophy Stout", price: "₦2,000", desc: "" },
  { category: "Beer", name: "Budweiser", price: "₦2,000", desc: "" },
  { category: "Beer", name: "Budweiser Royale", price: "₦2,500", desc: "" },
  { category: "Beer", name: "Castle Lite", price: "₦2,000", desc: "" },
  { category: "Beer", name: "Hero", price: "₦2,000", desc: "" },
  { category: "Beer", name: "Flying Fish", price: "₦2,000", desc: "" },
  { category: "Beer", name: "Double Black", price: "₦2,000", desc: "" },
  { category: "Beer", name: "Smirnoff Ice Bottle", price: "₦2,000", desc: "" },
  { category: "Beer", name: "Smirnoff Can", price: "₦2,000", desc: "" },
  { category: "Beer", name: "Smirnoff Souble Blk", price: "₦2,000", desc: "" },
  { category: "Beer", name: "Smirnoff Ice Big", price: "₦2,500", desc: "" },
  { category: "Beer", name: "Goldberg Black Small", price: "₦1,500", desc: "" },
  
  { category: "Cigarette", name: "Benson Brown", price: "₦2,500", desc: "" },
  { category: "Cigarette", name: "Benson Switch", price: "₦2,500", desc: "" },
  { category: "Cigarette", name: "Rothmas", price: "₦2,500", desc: "" },
  { category: "Cigarette", name: "Chesterfield", price: "₦2,500", desc: "" },
  { category: "Cigarette", name: "Dumhill", price: "₦2,500", desc: "" },
  { category: "Cigarette", name: "Esse Change", price: "₦2,500", desc: "" },
  { category: "Cigarette", name: "Bohem", price: "₦2,500", desc: "" },
  { category: "Cigarette", name: "Lighter", price: "₦500", desc: "" },

  // Beverage Menu 2
  { category: "Shorts Drinks", name: "Sierra Shots", price: "₦3,000", desc: "" },
  { category: "Shorts Drinks", name: "Olmeca Shot", price: "₦3,000", desc: "" },
  { category: "Shorts Drinks", name: "Agavales Shot", price: "₦3,000", desc: "" },
  { category: "Shorts Drinks", name: "Bacardi Shot", price: "₦3,000", desc: "" },
  { category: "Shorts Drinks", name: "Gordon's Shot", price: "₦2,000", desc: "" },
  
  { category: "Juice / Soft Drink", name: "Maltina Bottle", price: "₦1,500", desc: "" },
  { category: "Juice / Soft Drink", name: "Maltina Can", price: "₦1,500", desc: "" },
  { category: "Juice / Soft Drink", name: "Malta Guinness", price: "₦1,500", desc: "" },
  { category: "Juice / Soft Drink", name: "Vita Milk", price: "₦2,500", desc: "" },
  { category: "Juice / Soft Drink", name: "Fayrouz", price: "₦1,000", desc: "" },
  { category: "Juice / Soft Drink", name: "Coke", price: "₦1,000", desc: "" },
  { category: "Juice / Soft Drink", name: "Fanta", price: "₦1,000", desc: "" },
  { category: "Juice / Soft Drink", name: "Pepsi", price: "₦1,000", desc: "" },
  { category: "Juice / Soft Drink", name: "Sprite", price: "₦1,000", desc: "" },
  { category: "Juice / Soft Drink", name: "Water (Aquatina)", price: "₦500", desc: "" },
  { category: "Juice / Soft Drink", name: "Amstel Malt", price: "₦1,500", desc: "" },
  { category: "Juice / Soft Drink", name: "Water (Eva)", price: "₦500", desc: "" },
  { category: "Juice / Soft Drink", name: "Schweppes", price: "₦1,000", desc: "" },
  { category: "Juice / Soft Drink", name: "Teem", price: "₦1,000", desc: "" },
  { category: "Juice / Soft Drink", name: "7UP", price: "₦1,000", desc: "" },
  { category: "Juice / Soft Drink", name: "5 Alives Big", price: "₦3,000", desc: "" },
  { category: "Juice / Soft Drink", name: "5 Alives Small", price: "₦1,000", desc: "" },
  { category: "Juice / Soft Drink", name: "Hollandia", price: "₦3,000", desc: "" },
  { category: "Juice / Soft Drink", name: "Exotic", price: "₦3,000", desc: "" },
  { category: "Juice / Soft Drink", name: "Chivita", price: "₦3,500", desc: "" },
  
  { category: "Shisha", name: "Shisha", price: "₦10,000", desc: "" },
];

async function seedMenu() {
  try {
    console.log("Fetching existing menu items...");
    const snapshot = await getDocs(collection(db, 'menu'));
    
    console.log(`Found ${snapshot.docs.length} items. Deleting...`);
    for (const document of snapshot.docs) {
      await deleteDoc(doc(db, 'menu', document.id));
    }
    console.log("Deletion complete.");

    console.log(`Injecting ${menuData.length} new items...`);
    for (const item of menuData) {
      await addDoc(collection(db, 'menu'), {
        ...item,
        createdAt: Date.now()
      });
    }

    console.log("Successfully seeded the client menu!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding menu:", err);
    process.exit(1);
  }
}

seedMenu();
