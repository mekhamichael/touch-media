import React, { useState } from 'react';
import { useSiteData } from '../../context/DataContext';
import { optimizeCloudinary } from '../../data/siteData';

const ROWS_COUNT = 3;

function MarqueeItem({ logo }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative flex h-16 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white p-2 shadow-md shadow-navy-950/25 md:h-20 md:w-36 md:p-2.5 transition-transform duration-300 hover:scale-105">
      {!loaded && (
        <span aria-hidden="true" className="absolute inset-0 animate-pulse bg-navy-900/5" />
      )}
      <img
        src={optimizeCloudinary(logo.src, 'w_150,q_auto,f_auto')}
        alt={`${logo.name} logo`}
        decoding="async"
        width="150"
        height="80"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={`relative h-full w-full object-contain transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}

export function MarqueeLogos() {
  const { content } = useSiteData();
  const logos = content.marqueeLogos || [];

  if (logos.length === 0) return null;

  // Distribute logos across 3 rows and duplicate for infinite scroll
  const rows = Array.from({ length: ROWS_COUNT }, (_, rowIndex) => {
    const rowLogos = logos.filter((_, idx) => idx % ROWS_COUNT === rowIndex);
    return [...rowLogos, ...rowLogos, ...rowLogos];
  });

  return (
    <section className="relative overflow-hidden bg-navy-900 py-8 md:py-12 border-y border-navy-800/40">
      <p className="mb-6 text-center text-[10px] font-semibold tracking-[0.25em] text-cream/60 uppercase md:mb-8 md:text-xs">
        {content.marqueeLabel || 'Trusted by leading brands'}
      </p>

      <div className="flex flex-col gap-4 md:gap-6">
        {rows.map((rowLogos, rowIndex) => (
          <div key={rowIndex} className="relative flex overflow-hidden">
            <div
              className={`flex shrink-0 items-center gap-3 pr-3 hover:[animation-play-state:paused] md:gap-5 md:pr-5 ${
                rowIndex === 1 ? 'animate-scroll-reverse' : 'animate-scroll-slow'
              }`}
            >
              {rowLogos.map((logo, idx) => (
                <MarqueeItem key={`${rowIndex}-${logo.name}-${idx}`} logo={logo} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Left/Right Fade Gradients */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-navy-900 to-transparent md:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-navy-900 to-transparent md:w-28" />
    </section>
  );
}
