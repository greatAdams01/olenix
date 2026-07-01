import { MapPin } from 'lucide-react';

export default function MapSection() {
  return (
    <section id="location" className="border-t border-warm section-light">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-0">
        <div className="px-6 sm:px-10 lg:px-16 py-16 md:py-24 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-warm">
          <p className="section-eyebrow mb-4">Find us</p>
          <h2 className="section-title text-3xl md:text-4xl mb-6">Visit Olenix</h2>
          <div className="flex items-start gap-4 mb-8">
            <MapPin className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-warm-900 font-medium leading-relaxed">
                KM 47, Lekki-Epe Express Way
                <br />
                Oko-Ado, Lagos, Nigeria
              </p>
            </div>
          </div>
          <div className="space-y-4 text-sm section-body font-light">
            <p>
              <span className="block text-[10px] uppercase tracking-widest text-gold-600 font-bold mb-1">Hours</span>
              Open 24 hours, 365 days a year
            </p>
            <p>
              <span className="block text-[10px] uppercase tracking-widest text-gold-600 font-bold mb-1">Contact</span>
              Reserve via WhatsApp, phone, or in person
            </p>
          </div>
        </div>
        <div className="min-h-[360px] lg:min-h-[480px] relative bg-cream-100">
          <iframe
            title="Olenix Lounge on Google Maps"
            src="https://maps.google.com/maps?q=Olenix+Lounge,+Lekki-Epe+Express+Way,+Lagos&t=m&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </div>
    </section>
  );
}
