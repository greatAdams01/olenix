import { motion } from 'motion/react';
import { Phone, MessageCircle, Calendar } from 'lucide-react';

const vipSteps = [
  "Communicate for reservations.",
  "Outline booking details (guests, full name, arrival date/time, contact, consumption intentions, and service preferences).",
  "Payment of required deposit & confirmation.",
  "Arrival and check-in.",
  "Enjoy quality service time.",
  "Settle any outstanding balance before departure."
];

const eventSteps = [
  "Inquiry",
  "Check requirements (DJ, MC, Food, Photography)",
  "Pay deposit",
  "Receive confirmation",
  "Finalize details",
  "Final payment",
  "Host event",
  "Provide feedback"
];

export default function Reservations() {
  return (
    <section id="reservations" className="bg-black text-white px-4 md:px-12 border-t border-white/10">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row border-l border-r border-white/10">
        
        {/* Left Side: Info */}
        <div className="w-full md:w-3/5 md:border-r border-white/10">
          <motion.div
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             className="p-10 md:p-16 flex flex-col gap-12"
          >
            <div>
              <h2 className="text-3xl md:text-5xl font-serif mb-4">VIP Booking</h2>
              <div className="w-16 h-[1px] bg-white/30" />
            </div>

            <div className="space-y-12 shrink-0">
               <div className="space-y-4">
                 <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-4">Event Booking Process</h3>
                 <div className="flex flex-wrap gap-2 items-center text-[10px] font-mono tracking-widest uppercase text-white/60">
                   {eventSteps.map((step, idx) => (
                     <span key={idx} className="flex items-center gap-2">
                       <span>{step}</span>
                       {idx < eventSteps.length - 1 && <span className="text-white/20">/</span>}
                     </span>
                   ))}
                 </div>
               </div>
               
               <div className="space-y-6">
                  <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-4">VIP Process</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {vipSteps.map((step, index) => (
                      <div key={index} className="flex gap-4">
                        <span className="font-serif italic text-white/30">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="text-xs font-light text-white/70 leading-relaxed">
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Contact & Details */}
        <div className="w-full md:w-2/5 flex flex-col bg-zinc-950">
          <div className="flex-1 p-10 md:p-16 flex flex-col gap-8 justify-center">
            
            <div className="bg-white/5 p-8 rounded-sm border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                <span className="text-xs uppercase tracking-widest font-bold">Open 24 Hours</span>
              </div>
              <p className="text-[11px] text-white/50 leading-relaxed">
                365 days a year. Experience luxury at any hour. Confirmed reservations require a deposit. Cancellations must be made at least 24 hours in advance.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 p-4">
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-widest text-white/40 mb-2">WhatsApp</span>
                <a href="https://wa.me/2348133853173" className="text-sm font-mono text-white/80 hover:text-white transition-colors">0813 385 3173</a>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-widest text-white/40 mb-2">Reservations</span>
                <a href="tel:+2348133264841" className="text-sm font-mono text-white/80 hover:text-white transition-colors">0813 332 6484</a>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/10 flex gap-4">
               <button className="flex-1 bg-white text-black px-6 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors">
                 Book Now
               </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
