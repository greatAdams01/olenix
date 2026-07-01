import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Users, Calendar, Clock, Phone, Mail, ArrowRight, ExternalLink, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { isRpcMissing, rpcMissingMessage } from '../lib/rpc';

export default function BookingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleCheckAvailability = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const { data: count, error: countError } = await supabase.rpc('count_vip_bookings_for_date', {
        booking_date: formData.date,
      });

      if (countError) {
        if (isRpcMissing(countError)) {
          throw new Error('RPC_MISSING');
        }
        throw countError;
      }

      if ((count ?? 0) >= 3) {
        setError('Sorry, we are fully booked for VIP reservations on this date. Please select another date.');
        setIsSubmitting(false);
        return;
      }

      const code = 'OLX-' + Math.random().toString(36).substring(2, 6).toUpperCase();
      setGeneratedCode(code);
      setStep(2);
    } catch (err) {
      console.error(err);
      if (err instanceof Error && err.message === 'RPC_MISSING') {
        setError(rpcMissingMessage('booking'));
      } else {
        setError('An error occurred while checking availability. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const buildWhatsAppUrl = () => {
    const message = `Hello Olenix Lounge, I would like to confirm my VIP Reservation.

*Booking Code:* ${generatedCode}
*Full name:* ${formData.name}
*Number of guests:* ${formData.guests}
*Arrival date:* ${formData.date}
*Arrival time:* ${formData.time}
*Phone number:* ${formData.phone}
*Email:* ${formData.email}

Please let me know how to proceed with the deposit payment.`;
    return `https://wa.me/2348133853173?text=${encodeURIComponent(message)}`;
  };

  const openWhatsApp = () => {
    window.open(buildWhatsAppUrl(), '_blank', 'noopener,noreferrer');
  };

  const handleAcceptAndProceed = async () => {
    setIsSubmitting(true);
    try {
      const { data: result, error: submitError } = await supabase.rpc('submit_vip_booking', {
        p_name: formData.name,
        p_email: formData.email,
        p_phone: formData.phone,
        p_guests: formData.guests,
        p_date: formData.date,
        p_time: formData.time,
        p_code: generatedCode,
      });

      if (submitError) {
        if (isRpcMissing(submitError)) {
          throw new Error('RPC_MISSING');
        }
        throw submitError;
      }

      const payload = result as { ok?: boolean; error?: string } | null;
      if (!payload?.ok) {
        if (payload?.error === 'fully_booked') {
          setError('Sorry, we are fully booked for VIP reservations on this date. Please select another date.');
          setStep(1);
          setIsSubmitting(false);
          return;
        }
        throw new Error('Booking failed');
      }

      window.open(buildWhatsAppUrl(), '_blank', 'noopener,noreferrer');

      setStep(3);
      setIsSubmitting(false);

    } catch (err) {
      console.error(err);
      if (err instanceof Error && err.message === 'RPC_MISSING') {
        setError(rpcMissingMessage('booking'));
      } else {
        setError('Failed to create booking. Please try again.');
      }
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
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl section-dark border border-gold-500/30 shadow-[0_0_60px_rgba(212,175,55,0.12)] overflow-hidden rounded-sm"
          >
            {/* Top decorative gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-50" />
            
            <div className="p-6 md:p-10 max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gold-500/30 [&::-webkit-scrollbar-thumb]:rounded-full">
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 md:top-6 md:right-6 text-cream-50/50 hover:text-gold-400 transition-colors bg-lounge-800/80 p-2 rounded-full hover:bg-gold-500/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-10 text-center mt-2">
                <h2 className="text-3xl md:text-4xl font-serif mb-3">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-500 to-gold-600">
                    VIP Reservation
                  </span>
                </h2>
                <p className="text-cream-50/50 text-[10px] md:text-xs tracking-[0.3em] uppercase font-light">Secure your premium experience</p>
              </div>

              {step === 1 ? (
                <form className="space-y-6" onSubmit={handleCheckAvailability}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="space-y-2 relative group">
                      <label className="text-[10px] uppercase tracking-widest text-amber-500/80 font-semibold ml-1">Full name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className="w-4 h-4 text-amber-500/50 group-focus-within:text-amber-600 transition-colors" />
                        </div>
                        <input required name="name" value={formData.name} onChange={handleInputChange} type="text" placeholder="John Doe" className="w-full bg-lounge-800/60 border border-gold-500/25 py-4 pl-12 pr-4 text-cream-50 placeholder:text-cream-50/35 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 outline-none transition-all rounded-sm" />
                      </div>
                    </div>
                    
                    {/* Guests */}
                    <div className="space-y-2 relative group">
                      <label className="text-[10px] uppercase tracking-widest text-amber-500/80 font-semibold ml-1">Number of guests</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Users className="w-4 h-4 text-amber-500/50 group-focus-within:text-amber-600 transition-colors" />
                        </div>
                        <input required name="guests" value={formData.guests} onChange={handleInputChange} type="number" min="1" placeholder="2" className="w-full bg-lounge-800/60 border border-gold-500/25 py-4 pl-12 pr-4 text-cream-50 placeholder:text-cream-50/35 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 outline-none transition-all rounded-sm" />
                      </div>
                    </div>

                    {/* Arrival Date */}
                    <div className="space-y-2 relative group">
                      <label className="text-[10px] uppercase tracking-widest text-amber-500/80 font-semibold ml-1">Arrival date</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Calendar className="w-4 h-4 text-amber-500/50 group-focus-within:text-amber-600 transition-colors" />
                        </div>
                        <input required name="date" value={formData.date} onChange={handleInputChange} type="date" min={new Date().toISOString().split('T')[0]} className="w-full bg-lounge-800/60 border border-gold-500/25 py-4 pl-12 pr-4 text-cream-50 focus:border-gold-500 outline-none transition-all rounded-sm" />
                      </div>
                    </div>

                    {/* Arrival Time */}
                    <div className="space-y-2 relative group">
                      <label className="text-[10px] uppercase tracking-widest text-amber-500/80 font-semibold ml-1">Arrival time</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Clock className="w-4 h-4 text-amber-500/50 group-focus-within:text-amber-600 transition-colors" />
                        </div>
                        <input required name="time" value={formData.time} onChange={handleInputChange} type="time" className="w-full bg-lounge-800/60 border border-gold-500/25 py-4 pl-12 pr-4 text-cream-50 focus:border-gold-500 outline-none transition-all rounded-sm" />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2 relative group">
                      <label className="text-[10px] uppercase tracking-widest text-amber-500/80 font-semibold ml-1">Phone number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Phone className="w-4 h-4 text-amber-500/50 group-focus-within:text-amber-600 transition-colors" />
                        </div>
                        <input required name="phone" value={formData.phone} onChange={handleInputChange} type="tel" placeholder="+234 800 000 0000" className="w-full bg-lounge-800/60 border border-gold-500/25 py-4 pl-12 pr-4 text-cream-50 placeholder:text-cream-50/35 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 outline-none transition-all rounded-sm" />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2 relative group">
                      <label className="text-[10px] uppercase tracking-widest text-amber-500/80 font-semibold ml-1">Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="w-4 h-4 text-amber-500/50 group-focus-within:text-amber-600 transition-colors" />
                        </div>
                        <input required name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="john@example.com" className="w-full bg-lounge-800/60 border border-gold-500/25 py-4 pl-12 pr-4 text-cream-50 placeholder:text-cream-50/35 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 outline-none transition-all rounded-sm" />
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
              ) : step === 2 ? (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8 flex flex-col items-center py-8"
                >
                  <div className="text-center space-y-4">
                    <h3 className="text-xl text-amber-600 font-serif">Your VIP Booking Code</h3>
                    <div className="lounge-card-dark py-6 px-12 rounded-sm">
                      <span className="text-4xl md:text-5xl font-mono text-gold-600 tracking-widest">{generatedCode}</span>
                    </div>
                    <p className="section-body text-sm max-w-md mx-auto mt-4 font-light">
                      Please accept this code to secure your reservation. WhatsApp will open in a new tab to finalize your deposit.
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
                      className="flex-1 py-4 border border-gold-500/30 text-cream-50/70 text-xs font-bold uppercase tracking-widest hover:bg-gold-500/10 transition-colors rounded-sm"
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
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8 flex flex-col items-center py-10 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                  </div>
                  <div className="space-y-3 max-w-md">
                    <h3 className="text-2xl font-serif text-amber-600">Reservation Submitted</h3>
                    <p className="section-body text-sm leading-relaxed">
                      Your booking code <span className="font-mono text-amber-600 font-bold">{generatedCode}</span> has been saved.
                    </p>
                    <p className="text-cream-50/50 text-sm leading-relaxed">
                      Expect feedback and make payments on WhatsApp. If a new tab did not open, check your pop-up blocker or tap the button below.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={openWhatsApp}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold uppercase tracking-widest hover:bg-green-500/20 transition-colors rounded-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open WhatsApp again
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-4 border border-gold-500/30 text-cream-50/70 text-xs font-bold uppercase tracking-widest hover:bg-gold-500/10 transition-colors rounded-sm"
                  >
                    Close
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
