import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useSiteData } from '../../context/DataContext';
import { ContactForm } from './ContactForm';
import { LocationMap } from './LocationMap';

export function ContactSection() {
  const { content } = useSiteData();

  const contactItems = [
    {
      icon: Phone,
      label: 'Phone',
      value: content.contact?.phone,
      href: `tel:${content.contact?.phone}`
    },
    {
      icon: Mail,
      label: 'Email',
      value: content.contact?.email,
      href: `mailto:${content.contact?.email}`
    },
    {
      icon: MapPin,
      label: 'Address',
      value: content.contact?.address
    },
    {
      icon: Clock,
      label: 'Working Hours',
      value: content.contact?.working_hours
    }
  ];

  return (
    <section id="contact" className="relative bg-navy-900">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-gold">
            Get In Touch
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold text-cream md:text-4xl lg:text-5xl">
            Let's Create Something <span className="text-gold">Unforgettable</span>
          </h2>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <ContactForm />
          </motion.div>

          {/* Right: Direct Info & Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              {contactItems.map((item) => {
                const IconComponent = item.icon;
                const body = (
                  <div className="group flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-navy-600 text-gold/75 transition-all duration-300 group-hover:border-gold group-hover:text-gold">
                      <IconComponent size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-[0.15em] uppercase text-gold/70">
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm text-cream/70 group-hover:text-cream transition-colors">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );

                return item.href ? (
                  <a key={item.label} href={item.href} className="block">
                    {body}
                  </a>
                ) : (
                  <div key={item.label}>{body}</div>
                );
              })}
            </div>

            <div className="mt-8 h-px bg-navy-700/50" />

            <LocationMap />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
