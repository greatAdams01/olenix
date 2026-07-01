import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { question: 'What are your hours?', answer: 'We are open 24 hours, 365 days a year.' },
  { question: 'Do you accept reservations?', answer: 'Yes — book via WhatsApp, phone, or our VIP booking form.' },
  { question: 'Do you host private events?', answer: 'Yes. Contact us for private events and group bookings.' },
  { question: 'Is there a VIP section?', answer: 'Yes. VIP sections can be reserved through our booking process.' },
  { question: 'Do you offer outdoor seating?', answer: 'Yes, including elegant outdoor areas for a relaxed experience.' },
  {
    question: 'What events do you host?',
    answer: 'Live band nights, comedy, karaoke, ladies night, movie night, and music & vibes every week.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="border-t border-warm section-warm">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 px-6 sm:px-10 lg:px-16 py-16 md:py-24">
        <div className="lg:col-span-4">
          <p className="section-eyebrow mb-3">Good to know</p>
          <h2 className="section-title text-3xl md:text-4xl leading-tight">Questions &amp; answers</h2>
        </div>

        <div className="lg:col-span-8 border-t border-gold-500/20 bg-cream-50/60 rounded-sm px-2">
          {faqs.map((faq, index) => (
            <div key={faq.question} className="border-b border-gold-500/15 last:border-0">
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full py-5 px-4 text-left flex justify-between items-start gap-4 group"
              >
                <span className="font-serif text-base md:text-lg text-warm-900 group-hover:text-gold-600 transition-colors">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gold-600 shrink-0 mt-1 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-5 text-sm section-body font-light leading-relaxed max-w-2xl">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
