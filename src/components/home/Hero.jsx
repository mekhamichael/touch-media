import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Logo } from '../common/Logo';
import { CustomCursor } from '../common/CustomCursor';
import { useSiteData } from '../../context/DataContext';

const HERO_TITLE = 'WE CREATE EXPERIENCES';

function useTypewriter(text, { start = true, speed = 55 } = {}) {
  const [displayedCount, setDisplayedCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    setDisplayedCount(0);
    let count = 0;
    const interval = setInterval(() => {
      count += 1;
      setDisplayedCount(count);
      if (count >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [start, text, speed]);

  return text.slice(0, displayedCount);
}

export function Hero() {
  const { content } = useSiteData();
  const videos = content.heroVideos || [];
  
  const containerRef = useRef(null);
  const growRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const isReduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );
  const isTouch = useMemo(
    () => typeof window !== 'undefined' && (window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0),
    []
  );

  useEffect(() => {
    if (isReduced) {
      setMounted(true);
      return;
    }
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setMounted(true));
    });
    return () => cancelAnimationFrame(frame);
  }, [isReduced]);

  const handleVideoEnded = useCallback(() => {
    if (videos.length > 0) {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    }
  }, [videos.length]);

  const setGrow = useCallback((val) => {
    growRef.current = val;
  }, []);

  const typedText = useTypewriter(HERO_TITLE, { start: mounted, speed: isReduced ? 0 : 55 });
  const isComplete = typedText.length === HERO_TITLE.length;

  const scrollTo = (selector) => {
    const target = document.querySelector(selector);
    const lenis = window.__lenis;
    if (target) {
      if (lenis) {
        lenis.scrollTo(target);
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      id="Hero"
      ref={containerRef}
      className="relative flex h-fill items-center overflow-hidden bg-navy-950"
    >
      {/* Background Video or Gradient Fallback */}
      {isReduced || videos.length === 0 ? (
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800" />
      ) : (
        <video
          key={currentVideoIndex}
          className="absolute inset-0 h-full w-full object-cover"
          src={videos[currentVideoIndex]}
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={handleVideoEnded}
        />
      )}

      {/* Dark overlay gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/60 via-navy-950/55 to-navy-950/85" />

      {/* Interactive Cursor */}
      {!isTouch && <CustomCursor containerRef={containerRef} growRef={growRef} />}

      {/* Hero Content */}
      <div className="relative z-10 flex w-full flex-col items-center px-6 text-center">
        {/* Brand Tagline */}
        <div
          className="mb-6 flex flex-col items-center gap-2 transition-all duration-700"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(10px)'
          }}
        >
          <div className="flex items-center gap-2">
            <Logo size={56} className="h-10 w-auto sm:h-12 md:h-14" />
            <span className="font-sans text-2xl tracking-wide text-cream sm:text-3xl md:text-4xl">
              <span className="font-normal">TOUCH</span>
              <span className="font-bold">MEDIA</span>
            </span>
          </div>
          <span className="text-[11px] tracking-[0.3em] text-cream/70 uppercase sm:text-xs">
            Marketing & Advertising Agency
          </span>
        </div>

        {/* Animated Typewriter Title */}
        <h1 className="text-center font-serif text-[clamp(1.5rem,6vw,5rem)] font-black uppercase leading-[0.95] tracking-tight text-gold [text-shadow:0_6px_40px_rgba(8,11,38,0.65)] whitespace-nowrap">
          {typedText}
          <span
            aria-hidden="true"
            className={`ml-1 inline-block h-[0.8em] w-0.5 bg-gold align-middle md:w-1 ${
              isComplete ? 'animate-pulse' : 'opacity-100'
            }`}
          />
        </h1>

        {/* Subtitle */}
        <p
          className="mt-5 max-w-md text-xs text-cream/70 transition-all duration-700 sm:text-sm"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(10px)',
            transitionDelay: '420ms'
          }}
        >
          Turning ambitious brands into experiences people remember since 2006.
        </p>

        {/* Action Buttons */}
        <div
          className="mt-8 flex flex-col gap-3 transition-all duration-700 sm:flex-row sm:gap-4"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(10px)',
            transitionDelay: '520ms'
          }}
        >
          <a
            href="#portfolio"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('#portfolio');
            }}
            onMouseEnter={() => setGrow(true)}
            onMouseLeave={() => setGrow(false)}
            className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-gold/60 px-7 py-2.5 text-[11px] font-semibold tracking-[0.15em] text-gold uppercase transition-all duration-300 hover:bg-gold hover:text-navy-900 sm:px-8 sm:py-3 sm:text-xs shadow-sm hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
          >
            Our Portfolio
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('#contact');
            }}
            onMouseEnter={() => setGrow(true)}
            onMouseLeave={() => setGrow(false)}
            className="group inline-flex items-center justify-center rounded-2xl border border-cream/20 px-7 py-2.5 text-[11px] font-semibold tracking-[0.15em] text-cream/70 uppercase transition-all duration-300 hover:border-gold/40 hover:text-gold sm:px-8 sm:py-3 sm:text-xs"
          >
            Start Your Project
          </a>
        </div>
      </div>
    </section>
  );
}
