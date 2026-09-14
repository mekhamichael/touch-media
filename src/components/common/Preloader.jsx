import React, { useEffect, useRef } from 'react';
import { Logo } from './Logo';

export function Preloader({ onFinish }) {
  const barRef = useRef(null);

  useEffect(() => {
    let animationFrame;
    let timeout;
    const start = performance.now();
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const complete = () => {
      timeout = setTimeout(() => {
        onFinish?.();
      }, 100);
    };

    if (isReduced) {
      if (barRef.current) barRef.current.style.width = '100%';
      complete();
      return () => clearTimeout(timeout);
    }

    const update = (time) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / 450, 1);
      if (barRef.current) {
        barRef.current.style.width = `${progress * 100}%`;
      }
      if (progress < 1) {
        animationFrame = requestAnimationFrame(update);
      } else {
        complete();
      }
    };

    animationFrame = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationFrame);
      clearTimeout(timeout);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-navy-950">
      <div className="flex flex-col items-center gap-8 animate-fade-in">
        <Logo size={64} className="text-gold animate-pulse" />
        <div className="flex flex-col items-center gap-3">
          <span className="font-serif text-lg font-semibold tracking-wider text-cream/80">
            TouchMedia
          </span>
          <div className="relative h-0.5 w-48 overflow-hidden rounded-full bg-navy-700">
            <div
              ref={barRef}
              className="absolute inset-y-0 left-0 bg-gold transition-[width] duration-75"
              style={{ width: '0%' }}
            />
          </div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-cream/40">
            Loading
          </span>
        </div>
      </div>
    </div>
  );
}
