import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "What are your dining hours?",
    answer: "We are open 24 hours."
  },
  {
    question: "Do you accept reservations?",
    answer: "Yes, we do. You can book via WhatsApp, phone call, or our authorized partners."
  },
  {
    question: "Do you host private events?",
    answer: "Yes, we accommodate private events. Please refer to our Event Booking Process for more details."
  },
  {
    question: "Is there a VIP section?",
    answer: "Yes, we have exclusive VIP sections that can be reserved through our VIP Booking Process."
  },
  {
    question: "Do you offer outdoor seating?",
    answer: "Yes, we offer elegant outdoor seating areas for a relaxed dining experience."
  },
  {
    question: "What kind of music/events do you host?",
    answer: "We host a variety of events including Premium Live band, Vibes and comedy night, music and vibes night, karaoke night, ladies night, and movie night."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-zinc-950 text-gold-400 px-4 border-t border-white/10">
      <div className="max-w-4xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
           className="mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-serif mb-4">FAQ</h2>
          <div className="w-16 h-[1px] bg-white/30" />
        </motion.div>

        <div className="border-t border-white/10">
          {faqs.map((faq, index) => (
             <motion.div
               initial={{ opacity: 0, y: 10 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.4, delay: index * 0.1 }}
               key={index} 
               className="border-b border-white/10 overflow-hidden"
             >
               <button
                 onClick={() => toggleFaq(index)}
                 className="w-full py-6 text-left flex justify-between items-center focus:outline-none group transition-colors"
               >
                 <span className="font-serif text-lg md:text-xl text-gold-400/90 group-hover:text-gold-400 group-hover:italic pr-8 transition-all">{faq.question}</span>
                 <ChevronDown 
                   className={`w-5 h-5 text-gold-400/40 transition-transform duration-300 flex-shrink-0 ${openIndex === index ? 'rotate-180' : ''}`} 
                 />
               </button>
               <AnimatePresence>
                 {openIndex === index && (
                   <motion.div
                     initial={{ height: 0, opacity: 0 }}
                     animate={{ height: 'auto', opacity: 1 }}
                     exit={{ height: 0, opacity: 0 }}
                     transition={{ duration: 0.3 }}
                   >
                     <div className="pb-8 text-gold-400/60 font-light leading-relaxed max-w-2xl">
                       {faq.answer}
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
             </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
