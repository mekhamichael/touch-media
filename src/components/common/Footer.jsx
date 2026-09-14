import React, { memo } from 'react';
import { Logo } from './Logo';
import { useSiteData } from '../../context/DataContext';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export const Footer = memo(function Footer() {
  const { content } = useSiteData();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      href: content.social?.facebook,
      label: 'Facebook',
      icon: ({ size = 18 }) => (
        <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      )
    },
    {
      href: content.social?.instagram,
      label: 'Instagram',
      icon: ({ size = 18 }) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      )
    },
    {
      href: content.social?.linkedin,
      label: 'LinkedIn',
      icon: ({ size = 18 }) => (
        <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      )
    }
  ];

  const handleQuickLink = (e, targetId) => {
    e.preventDefault();
    const lenis = window.__lenis;
    const el = document.querySelector(targetId);
    if (el) {
      if (lenis) {
        lenis.scrollTo(el);
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="relative border-t border-navy-700/50 bg-navy-950">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Brand */}
          <div>
            <Logo size={44} className="text-gold mb-4" />
            <p className="mt-4 text-sm leading-relaxed text-cream/65">
              {content.description}
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="mb-4 text-xs font-semibold tracking-[0.2em] uppercase text-gold">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {['About', 'Services', 'Portfolio', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    onClick={(e) => handleQuickLink(e, `#${item.toLowerCase()}`)}
                    className="text-sm text-cream/65 transition-colors hover:text-gold"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact Details */}
          <div>
            <h3 className="mb-4 text-xs font-semibold tracking-[0.2em] uppercase text-gold">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-cream/65">
              <li className="flex items-start gap-2">
                <Phone size={14} className="mt-0.5 shrink-0 text-gold/75" />
                <a href={`tel:${content.contact?.phone}`} className="hover:text-gold transition-colors">
                  {content.contact?.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={14} className="mt-0.5 shrink-0 text-gold/75" />
                <a href={`mailto:${content.contact?.email}`} className="hover:text-gold transition-colors break-all">
                  {content.contact?.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0 text-gold/75" />
                <span>{content.contact?.address}</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock size={14} className="mt-0.5 shrink-0 text-gold/75" />
                <span>{content.contact?.working_hours}</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Follow Us */}
          <div>
            <h3 className="mb-4 text-xs font-semibold tracking-[0.2em] uppercase text-gold">
              Follow Us
            </h3>
            <div className="flex gap-4">
              {socialLinks.map((item) => {
                const href = item.href?.startsWith('http') ? item.href : '#';
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-navy-600 text-cream/65 transition-all duration-300 hover:border-gold hover:bg-gold hover:text-navy-900"
                    aria-label={item.label}
                  >
                    <IconComponent size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-navy-700/30 pt-8 md:flex-row">
          <p className="text-xs text-cream/60">
            © {currentYear} TouchMedia. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="/privacy-policy" className="text-xs text-gold hover:text-cream/60 transition-colors">
              Privacy Policy
            </a>
            <span className="text-cream/30">|</span>
            <a href="/terms-of-service" className="text-xs text-gold hover:text-cream/60 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
});
