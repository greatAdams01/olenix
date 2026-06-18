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
              <h2 className="text-3xl md:text-5xl font-serif text-gold-500 mb-4">VIP Booking</h2>
              <div className="w-16 h-[1px] bg-white/30" />
            </div>

            <div className="space-y-12 shrink-0">
               <div className="space-y-6">
                  <h3 className="text-[10px] uppercase tracking-widest text-gold-500 mb-4">VIP Reservation</h3>
                  <p className="text-white/80 font-light leading-relaxed mb-6">
                    Experience our premium sections, bottle service, and exclusive treatment. Secure your spot now to skip the queue and guarantee your luxury experience.
                  </p>
                  <button 
                    onClick={() => window.dispatchEvent(new Event('open-booking-modal'))}
                    className="inline-block px-10 py-5 bg-gold-500 text-black text-sm font-bold uppercase tracking-widest hover:bg-gold-400 transition-colors shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                  >
                    Book Now
                  </button>
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
              <p className="text-[11px] text-gold-400/50 leading-relaxed">
                365 days a year. Experience luxury at any hour. Confirmed reservations require a deposit. Cancellations must be made at least 24 hours in advance.
              </p>
            </div>


            
            <div className="mt-8 pt-8 border-t border-white/10 flex gap-4">
               <button 
                 onClick={() => window.dispatchEvent(new Event('open-booking-modal'))}
                 className="flex-1 bg-gold-500 text-black px-6 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-gold-400 transition-colors shadow-[0_0_15px_rgba(212,175,55,0.3)]"
               >
                 Book Now
               </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
