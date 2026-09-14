import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from '../components/common/Logo';
import { useSEO } from '../hooks/useSEO';

export function NotFoundPage() {
  useSEO({
    title: 'Page Not Found | TouchMedia',
    description: 'The page you are looking for could not be found.',
    noindex: true
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex max-w-md flex-col items-center text-center"
      >
        <span className="font-serif text-8xl font-bold text-gold/30 md:text-9xl">
          404
        </span>
        <Logo size={48} className="mt-2 text-gold" />
        <h1 className="mt-6 font-serif text-2xl font-bold text-cream md:text-3xl">
          Page Not Found
        </h1>
        <p className="mt-3 text-base leading-relaxed text-cream/60">
          The page you are looking for doesn’t exist or has been moved.
        </p>
        <button
          onClick={() => {
            window.location.href = '/';
          }}
          className="mt-8 inline-flex items-center gap-2 rounded border border-gold/60 px-6 py-3 text-sm font-semibold tracking-[0.15em] uppercase text-gold transition-all duration-300 hover:bg-gold hover:text-navy-900 cursor-pointer shadow-sm hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
        >
          Back to Home
        </button>
      </motion.div>
    </div>
  );
}
