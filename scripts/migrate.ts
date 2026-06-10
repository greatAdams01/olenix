import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCiIn3y-R-xDrDHhuXWXUVzrC2UPlaM3Sc",
  authDomain: "garet-2cc7a.firebaseapp.com",
  projectId: "garet-2cc7a",
  storageBucket: "garet-2cc7a.firebasestorage.app",
  messagingSenderId: "965906073525",
  appId: "1:965906073525:web:65cd23e8f5246af1e63bfc"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const fullMenu = [
  { category: "Signature Cocktails", name: "The Golden Hour", price: "₦15,000", desc: "Premium vodka, passion fruit, vanilla, topped with 24k gold leaf." },
  { category: "Signature Cocktails", name: "Olenix Special", price: "₦18,000", desc: "Aged rum, sweet vermouth, dark chocolate bitters, smoked cherry." },
  { category: "Signature Cocktails", name: "Midnight in Lagos", price: "₦16,000", desc: "Gin, blackberry, fresh lime, activated charcoal, glowing garnish." },
  { category: "Premium Spirits", name: "Don Julio 1942", price: "₦850,000", desc: "Served by the bottle with complimentary chasers and sparklers." },
  { category: "Premium Spirits", name: "Ace of Spades", price: "₦1,200,000", desc: "Armand de Brignac Brut Gold, served chilled." },
  { category: "Premium Spirits", name: "Hennessy Paradis", price: "₦2,500,000", desc: "The ultimate cognac experience, served with premium cigars." },
  { category: "Gourmet Bites", name: "Truffle Fries", price: "₦12,000", desc: "Crispy fries tossed in white truffle oil and parmesan." },
  { category: "Gourmet Bites", name: "Wagyu Sliders", price: "₦35,000", desc: "Three premium wagyu beef sliders with caramelized onions and gold sauce." },
  { category: "Gourmet Bites", name: "Spicy Tiger Prawns", price: "₦28,000", desc: "Jumbo prawns tossed in our signature spicy garlic butter." },
  { category: "Main Courses", name: "Grilled Salmon", price: "₦32,000", desc: "Atlantic salmon, asparagus, lemon butter sauce." },
  { category: "Main Courses", name: "Jollof Rice & Suya Chicken", price: "₦18,000", desc: "Authentic Nigerian party jollof with spicy grilled chicken." },
  { category: "Main Courses", name: "Ribeye Steak (8oz)", price: "₦45,000", desc: "Prime ribeye, garlic mash, peppercorn sauce." },
  { category: "Main Courses", name: "Seafood Pasta", price: "₦25,000", desc: "Linguine, prawns, calamari, rich tomato basil sauce." },
  { category: "Champagne & Wine", name: "Moët & Chandon Nectar Impérial", price: "₦150,000", desc: "By the bottle." },
  { category: "Champagne & Wine", name: "Dom Pérignon Vintage", price: "₦650,000", desc: "By the bottle." },
  { category: "Champagne & Wine", name: "Whispering Angel Rosé", price: "₦85,000", desc: "By the bottle." },
  { category: "Champagne & Wine", name: "Château Margaux", price: "₦2,100,000", desc: "Premier Grand Cru Classé." },
  { category: "Desserts", name: "Gold Leaf Cheesecake", price: "₦12,000", desc: "New York style cheesecake with edible 24k gold." },
  { category: "Desserts", name: "Molten Lava Cake", price: "₦10,000", desc: "Rich dark chocolate cake with vanilla bean ice cream." }
];

async function migrate() {
  console.log("Starting migration...");
  
  // 1. Create Super Admin
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, "admin@olenix.com", "OlenixAdmin2026!");
    const uid = userCredential.user.uid;
    await setDoc(doc(db, "admins", uid), {
      email: "admin@olenix.com",
      role: "super_admin"
    });
    console.log("Super Admin created successfully. Password: OlenixAdmin2026!");
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      console.log("Super Admin already exists.");
    } else {
      console.error("Error creating super admin:", error);
    }
  }

  // 2. Migrate Menu
  console.log("Migrating menu items...");
  const menuRef = collection(db, "menu");
  for (const item of fullMenu) {
    await addDoc(menuRef, item);
  }
  console.log("Menu items migrated.");
  process.exit(0);
}

migrate();
