import React from 'react';
import { motion } from 'framer-motion';
import { useSiteData } from '../../context/DataContext';
import { optimizeCloudinary } from '../../data/siteData';

const IMAGE_PARAMS = 'w_700,h_525,c_fill,g_auto,q_auto,f_webp,dpr_auto';

export function ServicesGrid() {
  const { content } = useSiteData();
  const services = content.services || [];

  return (
    <section id="services" className="bg-navy-950">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="font-black tracking-[0.2em] uppercase text-white text-3xl md:text-4xl lg:text-5xl">
            Our <span className="text-gold">Services</span>
          </h2>
          <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-gold md:text-base">
            Fold the Logic, Shape the Magic
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
          {services.map((service, idx) => (
            <a
              key={service.id}
              href={`/services/${String(service.id)}`}
              className="block group cursor-pointer"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: 'easeOut' }}
              >
                <div className="relative aspect-4/3 overflow-hidden bg-navy-800 rounded-lg">
                  <span aria-hidden="true" className="absolute inset-0 animate-pulse bg-navy-700/60" />
                  <div className="absolute inset-0 h-full w-full overflow-hidden">
                    <img
                      src={optimizeCloudinary(service.image, IMAGE_PARAMS)}
                      alt={service.title}
                      loading={idx === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="h-full w-full object-cover contrast-125 transition-all duration-500 group-hover:scale-105 lg:grayscale lg:group-hover:grayscale-0"
                    />
                  </div>

                  {/* Gold Corner Hover Accents */}
                  <span className="pointer-events-none absolute left-0 top-0 h-10 w-10 border-l-[6px] border-t-[6px] border-gold opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="pointer-events-none absolute bottom-0 right-0 h-10 w-10 border-b-[6px] border-r-[6px] border-gold opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>

                <h3 className="mt-5 text-center font-black text-lg uppercase tracking-wider text-white transition-colors duration-300 group-hover:text-gold md:text-xl">
                  {service.title}
                </h3>
              </motion.div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
