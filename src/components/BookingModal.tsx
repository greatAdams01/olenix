import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Users, Calendar, Clock, Phone, Mail, ArrowRight, ExternalLink } from 'lucide-react';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function BookingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    guests: '',
    date: '',
    time: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setStep(1);
      setError('');
      setGeneratedCode('');
      setFormData({ name: '', guests: '', date: '', time: '', phone: '', email: '' });
    };
    window.addEventListener('open-booking-modal', handleOpen);
    return () => window.removeEventListener('open-booking-modal', handleOpen);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleCheckAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const targetDate = formData.date;
      
      const bookingsRef = collection(db, 'vip_bookings');
      const q = query(bookingsRef, where('date', '==', targetDate));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.size >= 3) {
        setError('Sorry, we are fully booked for VIP reservations on this date. Please select another date.');
        setIsSubmitting(false);
        return;
      }

      // If available, generate code and move to step 2
      const code = 'OLX-' + Math.random().toString(36).substring(2, 6).toUpperCase();
      setGeneratedCode(code);
      setStep(2);
    } catch (err) {
      console.error(err);
      setError('An error occurred while checking availability. We will bypass this for demo purposes.');
      // Fallback for demo without real firebase config
      const code = 'OLX-' + Math.random().toString(36).substring(2, 6).toUpperCase();
      setGeneratedCode(code);
      setStep(2);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptAndProceed = async () => {
    setIsSubmitting(true);
    try {
      // Save to Firebase (will fail gracefully if using dummy config, but we try anyway)
      try {
        await addDoc(collection(db, 'vip_bookings'), {
          ...formData,
          code: generatedCode,
          status: 'pending',
          createdAt: serverTimestamp()
        });
      } catch (fbErr) {
        console.warn('Firebase save failed (expected if using dummy config), proceeding to WhatsApp anyway:', fbErr);
      }

      // Construct WhatsApp Message
      const message = `Hello Olenix Lounge, I would like to confirm my VIP Reservation.

*Booking Code:* ${generatedCode}
*Full name:* ${formData.name}
*Number of guests:* ${formData.guests}
*Arrival date:* ${formData.date}
*Arrival time:* ${formData.time}
*Phone number:* ${formData.phone}
*Email:* ${formData.email}

Please let me know how to proceed with the deposit payment.`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/2348133853173?text=${encodedMessage}`;
      
      window.location.href = whatsappUrl;
      
      // Close modal after brief delay
      setTimeout(() => {
        setIsOpen(false);
        setIsSubmitting(false);
      }, 1000);

    } catch (err) {
      console.error(err);
      setError('Failed to create booking. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-zinc-950/80 backdrop-blur-xl border border-gold-500/20 shadow-[0_0_50px_rgba(212,175,55,0.1)] overflow-hidden rounded-sm"
          >
            {/* Top decorative gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-50" />
            
            <div className="p-6 md:p-10 max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gold-500/20 [&::-webkit-scrollbar-thumb]:rounded-full">
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 md:top-6 md:right-6 text-gold-400/50 hover:text-gold-400 transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-10 text-center mt-2">
                <h2 className="text-3xl md:text-4xl font-serif mb-3">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-500 to-gold-600">
                    VIP Reservation
                  </span>
                </h2>
                <p className="text-white/60 text-[10px] md:text-xs tracking-[0.3em] uppercase font-light">Secure your premium experience</p>
              </div>

              {step === 1 ? (
                <form className="space-y-6" onSubmit={handleCheckAvailability}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="space-y-2 relative group">
                      <label className="text-[10px] uppercase tracking-widest text-gold-400/80 font-semibold ml-1">Full name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className="w-4 h-4 text-gold-400/50 group-focus-within:text-gold-500 transition-colors" />
                        </div>
                        <input required name="name" value={formData.name} onChange={handleInputChange} type="text" placeholder="John Doe" className="w-full bg-black/50 border border-gold-500/20 py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-gold-500 focus:bg-gold-500/5 focus:ring-1 focus:ring-gold-500/50 outline-none transition-all rounded-sm" />
                      </div>
                    </div>
                    
                    {/* Guests */}
                    <div className="space-y-2 relative group">
                      <label className="text-[10px] uppercase tracking-widest text-gold-400/80 font-semibold ml-1">Number of guests</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Users className="w-4 h-4 text-gold-400/50 group-focus-within:text-gold-500 transition-colors" />
                        </div>
                        <input required name="guests" value={formData.guests} onChange={handleInputChange} type="number" min="1" placeholder="2" className="w-full bg-black/50 border border-gold-500/20 py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-gold-500 focus:bg-gold-500/5 focus:ring-1 focus:ring-gold-500/50 outline-none transition-all rounded-sm" />
                      </div>
                    </div>

                    {/* Arrival Date */}
                    <div className="space-y-2 relative group">
                      <label className="text-[10px] uppercase tracking-widest text-gold-400/80 font-semibold ml-1">Arrival date</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Calendar className="w-4 h-4 text-gold-400/50 group-focus-within:text-gold-500 transition-colors" />
                        </div>
                        <input required name="date" value={formData.date} onChange={handleInputChange} type="date" className="w-full bg-black/50 border border-gold-500/20 py-4 pl-12 pr-4 text-white focus:border-gold-500 focus:bg-gold-500/5 focus:ring-1 focus:ring-gold-500/50 outline-none transition-all rounded-sm [color-scheme:dark]" />
                      </div>
                    </div>

                    {/* Arrival Time */}
                    <div className="space-y-2 relative group">
                      <label className="text-[10px] uppercase tracking-widest text-gold-400/80 font-semibold ml-1">Arrival time</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Clock className="w-4 h-4 text-gold-400/50 group-focus-within:text-gold-500 transition-colors" />
                        </div>
                        <input required name="time" value={formData.time} onChange={handleInputChange} type="time" className="w-full bg-black/50 border border-gold-500/20 py-4 pl-12 pr-4 text-white focus:border-gold-500 focus:bg-gold-500/5 focus:ring-1 focus:ring-gold-500/50 outline-none transition-all rounded-sm [color-scheme:dark]" />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2 relative group">
                      <label className="text-[10px] uppercase tracking-widest text-gold-400/80 font-semibold ml-1">Phone number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Phone className="w-4 h-4 text-gold-400/50 group-focus-within:text-gold-500 transition-colors" />
                        </div>
                        <input required name="phone" value={formData.phone} onChange={handleInputChange} type="tel" placeholder="+234 800 000 0000" className="w-full bg-black/50 border border-gold-500/20 py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-gold-500 focus:bg-gold-500/5 focus:ring-1 focus:ring-gold-500/50 outline-none transition-all rounded-sm" />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2 relative group">
                      <label className="text-[10px] uppercase tracking-widest text-gold-400/80 font-semibold ml-1">Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="w-4 h-4 text-gold-400/50 group-focus-within:text-gold-500 transition-colors" />
                        </div>
                        <input required name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="john@example.com" className="w-full bg-black/50 border border-gold-500/20 py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-gold-500 focus:bg-gold-500/5 focus:ring-1 focus:ring-gold-500/50 outline-none transition-all rounded-sm" />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-sm">
                      {error}
                    </div>
                  )}

                  <div className="pt-6">
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full group relative flex items-center justify-center gap-3 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 text-black py-5 text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] rounded-sm overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                      <span className="relative z-10">{isSubmitting ? 'Checking Availability...' : 'Continue to Confirmation'}</span>
                      {!isSubmitting && <ArrowRight className="w-4 h-4 relative z-10" />}
                    </button>
                  </div>
                </form>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8 flex flex-col items-center py-8"
                >
                  <div className="text-center space-y-4">
                    <h3 className="text-xl text-gold-500 font-serif">Your VIP Booking Code</h3>
                    <div className="bg-black border border-gold-500/30 py-6 px-12 rounded-sm shadow-[0_0_30px_rgba(212,175,55,0.15)]">
                      <span className="text-4xl md:text-5xl font-mono text-gold-500 tracking-widest">{generatedCode}</span>
                    </div>
                    <p className="text-white/70 text-sm max-w-md mx-auto mt-4 font-light">
                      Please accept this code to secure your reservation. You will be redirected to our official WhatsApp to finalize your deposit.
                    </p>
                  </div>

                  {error && (
                    <div className="p-4 w-full bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-sm text-center">
                      {error}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <button 
                      onClick={() => setStep(1)}
                      disabled={isSubmitting}
                      className="flex-1 py-4 border border-white/20 text-white/60 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors rounded-sm"
                    >
                      Go Back
                    </button>
                    <button 
                      onClick={handleAcceptAndProceed}
                      disabled={isSubmitting}
                      className="flex-1 group relative flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 via-green-500 to-green-400 text-black py-4 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] rounded-sm overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                      <span className="relative z-10">{isSubmitting ? 'Proceeding...' : 'Accept & Proceed to WhatsApp'}</span>
                      {!isSubmitting && <ExternalLink className="w-4 h-4 relative z-10" />}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
