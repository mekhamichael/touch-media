import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, ChevronDown, X } from 'lucide-react';
import { useSiteData } from '../context/DataContext';
import { optimizeCloudinary } from '../data/siteData';
import { ContactForm } from '../components/home/ContactForm';
import { useSEO } from '../hooks/useSEO';

const cleanId = (id) => String(id ?? '').replace(/^0+/, '');

export function ServiceDetails({ serviceId }) {
  const { content } = useSiteData();
  const services = content.services || [];

  const service = services.find((s) => cleanId(s.id) === cleanId(serviceId)) || services[0];
  const details = service?.details;
  const manifesto = details?.manifesto || '';
  const gallery = (details?.gallery || []).filter(Boolean);
  const capabilities = details?.capabilities || [];
  const title = service?.title || '';

  const [expandedIndex, setExpandedIndex] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [scrollWidth, setScrollWidth] = useState(0);

  const horizontalSectionRef = useRef(null);
  const trackRef = useRef(null);

  useSEO({
    title: `${title} | TouchMedia`,
    description: manifesto || 'Explore TouchMedia services — from BTL campaigns to full-scale event production.',
    canonical: `https://touchmediaint.vercel.app/services/${service?.id}`
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [serviceId]);

  useEffect(() => {
    if (!modalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setModalOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalOpen]);

  // Measure horizontal scroll width
  useEffect(() => {
    const updateWidth = () => {
      const track = trackRef.current;
      if (!track || gallery.length === 0) {
        setScrollWidth(0);
        return;
      }
      const extra = Math.max(0, track.scrollWidth - window.innerWidth);
      setScrollWidth(extra);
    };

    if (gallery.length === 0) {
      setScrollWidth(0);
      return;
    }

    let isDone = false;
    const onImgLoad = () => {
      if (!isDone) {
        isDone = true;
        requestAnimationFrame(updateWidth);
      }
    };

    gallery.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = img.onerror = onImgLoad;
    });

    const timer = setTimeout(onImgLoad, 2000);
    window.addEventListener('resize', updateWidth);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateWidth);
    };
  }, [gallery]);

  const { scrollYProgress } = useScroll({
    target: horizontalSectionRef,
    offset: ['start start', 'end end']
  });

  const xTransform = useTransform(scrollYProgress, [0, 1], [0, scrollWidth > 0 ? -scrollWidth : 0]);

  const toggleAccordion = (idx) => {
    setExpandedIndex((prev) => (prev === idx ? null : idx));
  };

  if (!service) return null;

  return (
    <div className="bg-navy-900 min-h-screen text-cream selection:bg-gold selection:text-navy-900">
      {/* Hero Header */}
      <motion.div
        className="relative h-[80vh] w-full overflow-hidden flex items-end pb-20 px-6 lg:px-12"
      >
        <div className="absolute inset-0 h-full w-full overflow-hidden">
          <img
            src={optimizeCloudinary(service.image, 'w_1600,h_900,c_fill,g_auto,q_auto,f_webp')}
            alt={title}
            className="h-full w-full object-cover filter brightness-[0.35]"
          />
        </div>

        <div className="relative z-10 max-w-5xl">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-gold mb-8 hover:text-white transition-colors uppercase tracking-widest text-xs font-bold"
          >
            <ArrowLeft size={16} /> Back to Home
          </a>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-none drop-shadow-lg">
            {title}
          </h1>
        </div>
      </motion.div>

      {/* Manifesto Quote */}
      {manifesto && (
        <section className="py-24 lg:py-40 px-6 lg:px-12 max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-serif leading-tight text-cream/90">
            {manifesto}
          </h2>
        </section>
      )}

      {/* Horizontal Scroll Gallery */}
      {gallery.length > 0 && (
        <section
          ref={horizontalSectionRef}
          style={{
            height: scrollWidth > 0 ? `calc(100vh + ${scrollWidth}px)` : '100vh'
          }}
          className="relative w-full bg-navy-950"
        >
          <div className="sticky top-0 flex h-screen items-center overflow-hidden">
            <motion.div
              ref={trackRef}
              style={{ x: xTransform }}
              className="flex items-center gap-8 px-6 lg:px-12"
            >
              {gallery.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="relative w-[80vw] shrink-0 overflow-hidden rounded-2xl group md:w-[50vw] lg:w-[40vw] shadow-2xl"
                >
                  <img
                    src={optimizeCloudinary(imgUrl, 'w_1280,q_auto,f_webp')}
                    alt={`${title} project showcase ${idx + 1}`}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    className="h-[60vh] w-full object-cover transition-all duration-700 lg:grayscale lg:group-hover:grayscale-0 group-hover:scale-105"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Process Accordion */}
      {capabilities.length > 0 && (
        <section className="py-32 px-6 lg:px-12 max-w-4xl mx-auto">
          <div className="mb-16">
            <h3 className="text-gold text-sm font-bold uppercase tracking-widest mb-4">
              The Process
            </h3>
            <h2 className="text-4xl md:text-6xl font-black text-white">
              How We Execute
            </h2>
          </div>

          <div className="border-t border-cream/10">
            {capabilities.map((cap, idx) => {
              const isExpanded = expandedIndex === idx;
              return (
                <div key={idx} className="border-b border-cream/10">
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full py-8 flex justify-between items-center text-left focus:outline-none group cursor-pointer"
                  >
                    <span className="text-2xl md:text-3xl font-bold text-cream group-hover:text-gold transition-colors">
                      {cap.title}
                    </span>
                    <ChevronDown
                      size={28}
                      className={`text-cream/50 transition-transform duration-500 ${
                        isExpanded ? 'rotate-180 text-gold' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-8 text-lg text-cream/70 max-w-2xl leading-relaxed">
                          {cap.desc}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Giant Start Project Banner */}
      <section>
        <div
          onClick={() => setModalOpen(true)}
          className="py-40 px-6 flex flex-col items-center justify-center text-center group cursor-pointer bg-gold lg:px-12 transition-colors hover:bg-gold-light"
        >
          <h2 className="text-[clamp(2.5rem,10vw,8rem)] whitespace-nowrap font-black uppercase tracking-tighter text-navy-900 group-hover:scale-105 transition-transform duration-700">
            Start Project
          </h2>
          <p className="mt-6 text-navy-900/80 font-semibold uppercase tracking-widest text-sm md:text-base">
            Let's engineer your next big move
          </p>
        </div>
      </section>

      {/* Modal Popup Contact Form */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Dialog Content Box */}
            <motion.div
              key="modal"
              role="dialog"
              aria-modal="true"
              aria-label="Start a project"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative z-10 w-full max-w-xl rounded-2xl border border-navy-700 bg-navy-900 shadow-2xl my-auto overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="max-h-[85vh] overflow-y-auto">
                <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-navy-700 bg-navy-900/95 backdrop-blur px-6 py-5 sm:px-8">
                  <div>
                    <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-gold">
                      Start Your Project
                    </span>
                    <h3 className="mt-2 font-serif text-2xl font-bold text-cream sm:text-3xl">
                      Tell us about your <span className="text-gold">vision</span>
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    aria-label="Close contact form"
                    className="rounded-full border border-navy-600 p-2 text-cream/60 transition-colors hover:border-gold hover:text-gold cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="px-6 py-8 sm:px-8">
                  <ContactForm compact={true} />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
