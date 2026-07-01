import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const links = [
  { label: 'Reservations', href: '#reservations' },
  { label: 'Drinks & Food', href: '/menu', isRoute: true },
  { label: 'Weekly Nights', href: '#entertainment' },
  { label: 'Gallery', href: '#gallery' },
];

export default function QuickLinks() {
  return (
    <section className="section-dark border-b border-warm-dark" aria-label="Quick links">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gold-500/20">
        {links.map((link) => {
          const className =
            'group flex items-center justify-between gap-2 px-5 sm:px-8 py-5 md:py-7 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.22em] text-cream-50/90 hover:bg-gold-500/10 hover:text-gold-300 transition-colors';
          const content = (
            <>
              <span>{link.label}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-gold-400 opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
            </>
          );

          if (link.isRoute) {
            return (
              <Link key={link.label} to={link.href} className={className}>
                {content}
              </Link>
            );
          }

          return (
            <a key={link.label} href={link.href} className={className}>
              {content}
            </a>
          );
        })}
      </div>
    </section>
  );
}
