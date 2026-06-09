import { motion } from 'motion/react';

const menuItems = [
  {
    category: "Signature Cocktails",
    items: [
      { name: "The Golden Hour", price: "₦15,000", desc: "Premium vodka, passion fruit, vanilla, topped with 24k gold leaf." },
      { name: "Olenix Special", price: "₦18,000", desc: "Aged rum, sweet vermouth, dark chocolate bitters, smoked cherry." },
      { name: "Midnight in Lagos", price: "₦16,000", desc: "Gin, blackberry, fresh lime, activated charcoal, glowing garnish." }
    ]
  },
  {
    category: "Premium Spirits",
    items: [
      { name: "Don Julio 1942", price: "₦850,000", desc: "Served by the bottle with complimentary chasers and sparklers." },
      { name: "Ace of Spades", price: "₦1,200,000", desc: "Armand de Brignac Brut Gold, served chilled." },
      { name: "Hennessy Paradis", price: "₦2,500,000", desc: "The ultimate cognac experience, served with premium cigars." }
    ]
  },
  {
    category: "Gourmet Bites",
    items: [
      { name: "Truffle Fries", price: "₦12,000", desc: "Crispy fries tossed in white truffle oil and parmesan." },
      { name: "Wagyu Sliders", price: "₦35,000", desc: "Three premium wagyu beef sliders with caramelized onions and gold sauce." },
      { name: "Spicy Tiger Prawns", price: "₦28,000", desc: "Jumbo prawns tossed in our signature spicy garlic butter." }
    ]
  }
];

export default function Menu() {
  return (
    <section id="menu" className="py-24 bg-black bg-gradient-to-tr from-gold-500/10 via-black to-white/5 text-gold-400 px-4 md:px-12 border-t border-white/10">
      <div className="max-w-[1280px] mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-16 md:mb-24"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] font-semibold text-gold-400/40">Taste of Luxury</span>
          <h2 className="text-4xl md:text-6xl font-serif text-white mt-4 mb-6">Our Menu</h2>
          <div className="w-12 h-[1px] bg-gold-500/50 mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-8">
          {menuItems.map((section, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col gap-8"
            >
              <h3 className="text-xl font-serif text-gold-500 uppercase tracking-widest border-b border-gold-500/20 pb-4">{section.category}</h3>
              <div className="flex flex-col gap-8">
                {section.items.map((item, i) => (
                  <div key={i} className="group">
                    <div className="flex justify-between items-baseline mb-2">
                      <h4 className="text-sm font-bold uppercase tracking-widest text-white group-hover:text-gold-400 transition-colors pr-4">{item.name}</h4>
                      <span className="text-xs font-mono text-gold-500 shrink-0">{item.price}</span>
                    </div>
                    <p className="text-xs text-gold-400/60 font-light leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
