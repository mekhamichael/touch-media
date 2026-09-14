import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { useSiteData } from '../context/DataContext';
import { useSEO } from '../hooks/useSEO';

function formatDate(val) {
  if (!val) return '';
  const date = typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val)
    ? new Date(`${val}T00:00:00`)
    : new Date(val);
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function LegalPage({ slug }) {
  const { content } = useSiteData();
  const pageData = content.legal?.[slug];

  useSEO({
    title: pageData ? `${pageData.title} | TouchMedia` : 'Legal | TouchMedia',
    description: `TouchMedia ${pageData?.title || 'Legal Document'}`,
    canonical: `https://touchmediaint.vercel.app/${slug}`
  });

  if (!pageData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-950 text-cream">
        <p>Document not found.</p>
      </div>
    );
  }

  const { title, last_updated, sections } = pageData;

  return (
    <div className="min-h-screen bg-navy-950">
      <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={() => {
              window.location.href = '/';
            }}
            className="group mb-12 inline-flex items-center gap-2 text-sm tracking-wider text-cream/60 transition-colors hover:text-gold cursor-pointer"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Back to Home
          </button>

          <div className="mb-14">
            <Logo size={40} className="mb-6 text-gold" />
            <h1 className="font-serif text-3xl font-bold text-cream md:text-4xl lg:text-5xl">
              {title}
            </h1>
            {last_updated && (
              <p className="mt-3 text-sm text-cream/50">
                Last updated: {formatDate(last_updated)}
              </p>
            )}
          </div>

          <div className="space-y-12">
            {(sections || []).map((sec, idx) => (
              <section key={idx}>
                <h2 className="mb-4 font-serif text-xl font-semibold text-gold md:text-2xl">
                  {sec.title}
                </h2>
                <p className="text-base leading-relaxed text-cream/70 md:text-lg md:leading-relaxed">
                  {sec.content}
                </p>
              </section>
            ))}
          </div>

          <div className="mt-16 border-t border-navy-700/40 pt-8">
            <p className="text-sm text-cream/40">
              Touch Media — Media Production, Marketing & Digital Agency. Cairo, Egypt.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
