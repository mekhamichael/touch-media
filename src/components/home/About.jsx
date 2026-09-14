import React, { useState, useRef, useEffect, memo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSiteData } from '../../context/DataContext';
import { Handshake, Zap, Star, DollarSign, Factory, Megaphone, PenTool } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const VALUE_ICONS = {
  handshake: Handshake,
  zap: Zap,
  star: Star,
  dollar: DollarSign
};

const CAPABILITY_ICONS = {
  factory: Factory,
  megaphone: Megaphone,
  'pen-tool': PenTool
};

const StatItem = memo(function StatItem({ value, label, suffix = '' }) {
  const numberRef = useRef(null);

  useEffect(() => {
    const el = numberRef.current;
    if (!el) return;

    const num = parseInt(value, 10);
    if (isNaN(num)) {
      el.textContent = value.replace(suffix, '');
      return;
    }

    gsap.fromTo(
      el,
      { textContent: 0 },
      {
        textContent: num,
        duration: 2.5,
        ease: 'power2.out',
        snap: { textContent: 1 },
        scrollTrigger: {
          trigger: el,
          start: 'top 95%',
          once: true
        }
      }
    );
  }, [value, suffix]);

  const cleanSuffix = suffix.trim();
  const isSingleChar = cleanSuffix.length <= 1;

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center md:p-8">
      <span className="inline-flex items-baseline justify-center gap-1 font-serif text-5xl font-bold text-gold drop-shadow-md md:text-6xl whitespace-nowrap">
        <span ref={numberRef} />
        {cleanSuffix && (
          <span className={isSingleChar ? '' : 'text-2xl font-semibold md:text-3xl'}>
            {cleanSuffix}
          </span>
        )}
      </span>
      <p className="mt-4 text-xs tracking-[0.2em] uppercase text-cream/70 drop-shadow">
        {label}
      </p>
    </div>
  );
});

function TiltCard({ children, onEnter, onLeave }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;

    const rotY = gsap.quickTo(card, 'rotationY', { ease: 'power3', duration: 0.6 });
    const rotX = gsap.quickTo(card, 'rotationX', { ease: 'power3', duration: 0.6 });
    const glowX = gsap.quickTo(glow, 'xPercent', { ease: 'power3', duration: 0.6 });
    const glowY = gsap.quickTo(glow, 'yPercent', { ease: 'power3', duration: 0.6 });

    const handleMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = -(e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      rotY(x * 10);
      rotX(y * 10);
      glowX(x * -100);
      glowY(y * 100);
    };

    const handleLeave = () => {
      rotY(0);
      rotX(0);
      glowX(0);
      glowY(0);
      gsap.to(card, {
        scale: 1,
        duration: 0.4,
        ease: 'power2.out',
        borderColor: 'rgba(255, 246, 224, 0.1)'
      });
      onLeave?.();
    };

    const handleEnter = () => {
      gsap.to(card, {
        scale: 1.02,
        duration: 0.4,
        ease: 'power2.out',
        borderColor: 'rgba(201, 162, 39, 0.4)'
      });
      onEnter?.();
    };

    card.addEventListener('mousemove', handleMove);
    card.addEventListener('mouseleave', handleLeave);
    card.addEventListener('mouseenter', handleEnter);

    return () => {
      card.removeEventListener('mousemove', handleMove);
      card.removeEventListener('mouseleave', handleLeave);
      card.removeEventListener('mouseenter', handleEnter);
    };
  }, [onEnter, onLeave]);

  return (
    <div className="w-full [perspective:1000px]">
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl border border-cream/10 bg-navy-900/70 p-8 backdrop-blur-lg transition-colors duration-300 transform-gpu md:p-10"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          ref={glowRef}
          className="pointer-events-none absolute -inset-full z-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_50%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        <div className="relative z-10 transform-gpu" style={{ transform: 'translateZ(40px)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function About() {
  const { content } = useSiteData();
  const [activeBg, setActiveBg] = useState('default');

  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const cardsContainerRef = useRef(null);

  const capabilities = content.capabilities || [];
  const coreValues = content.coreValues || [];
  const statsEntries = Object.entries(content.stats || {});
  const statsLabels = content.stats_labels || {};
  const capabilityImages = content.capabilityImages || {};

  const words = ["We've", 'Been', 'Crafting', 'Brand', 'Experiences', 'Since', '2006'];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (isReduced) return;

      const revealWords = gsap.utils.toArray('.reveal-word', headlineRef.current);
      gsap.fromTo(
        revealWords,
        { yPercent: 120, opacity: 0, rotate: 5 },
        {
          yPercent: 0,
          opacity: 1,
          rotate: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: headlineRef.current,
            start: 'top 85%'
          }
        }
      );

      const staggerCards = gsap.utils.toArray('.stagger-card', cardsContainerRef.current);
      gsap.fromTo(
        staggerCards,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardsContainerRef.current,
            start: 'top 75%'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative w-full bg-navy-900 min-h-screen pb-12">
      {/* Dynamic Background Image Swapper */}
      <div className="absolute inset-0 z-0">
        <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none">
          {Object.entries(capabilityImages).map(([key, imgUrl]) => (
            <div
              key={key}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out ${
                activeBg === key ? 'opacity-30' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url(${imgUrl})` }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-900/80 to-navy-900" />
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
        {/* Top Animated Word Headline */}
        <div ref={headlineRef} className="w-full max-w-4xl mx-auto text-center mb-20 lg:mb-28">
          <span className="mb-6 block text-sm font-bold tracking-[0.25em] uppercase text-gold">
            Who We Are
          </span>
          <h2 className="font-serif text-4xl leading-tight text-cream md:text-5xl lg:text-7xl flex flex-wrap justify-center gap-x-4 gap-y-2">
            {words.map((word, idx) => (
              <span key={idx} className="inline-block overflow-hidden pb-2">
                <span className="reveal-word inline-block origin-bottom-left text-cream">
                  {word === 'Experiences' ? <span className="text-gold">{word}</span> : word}
                </span>
              </span>
            ))}
          </h2>
        </div>

        {/* Content Columns */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 mb-24 lg:mb-32">
          {/* Left Column: Sticky Core of Craft */}
          <div className="lg:w-1/3">
            <div className="sticky top-32">
              <h3 className="text-2xl font-serif text-cream mb-6">The Core of Our Craft</h3>
              <p className="text-cream/70 leading-relaxed mb-10">
                We blend creativity with flawless physical execution. Our infrastructure and dedicated teams ensure every campaign leaves a lasting impact.
              </p>

              <div className="flex flex-col gap-4">
                {coreValues.map((val, idx) => {
                  const Icon = VALUE_ICONS[val.icon] || Star;
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-4 border-b border-cream/10 pb-4 last:border-0"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-cream/5 text-gold">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-cream tracking-wide">{val.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Capabilities 3D Cards */}
          <div ref={cardsContainerRef} className="lg:w-2/3">
            <div className="flex flex-col gap-10">
              {capabilities.map((cap, idx) => {
                const Icon = CAPABILITY_ICONS[cap.icon] || Factory;
                return (
                  <div key={idx} className="stagger-card group">
                    <TiltCard
                      onEnter={() => setActiveBg(cap.icon)}
                      onLeave={() => setActiveBg('default')}
                    >
                      <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gold/10 border border-gold/20 text-gold transition-all duration-300 group-hover:bg-gold group-hover:text-navy-900 group-hover:scale-110">
                          <Icon className="h-7 w-7" />
                        </div>
                        <div>
                          <h3 className="mb-3 text-2xl font-bold text-cream group-hover:text-gold transition-colors">
                            {cap.title}
                          </h3>
                          <p className="text-base leading-relaxed text-cream/70 group-hover:text-cream/90 transition-colors">
                            {cap.description}
                          </p>
                        </div>
                      </div>
                    </TiltCard>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Animated Stats Bar */}
        <div className="w-full rounded-3xl border border-cream/10 bg-navy-900/60 backdrop-blur-md overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-gold/5 pointer-events-none" />
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-cream/10 relative z-10">
            {statsEntries.map(([key, val]) => {
              const suffix = key === 'years_of_excellence' ? '+' : key === 'factory_space' ? ' Sqm' : '+';
              return (
                <StatItem
                  key={key}
                  value={val}
                  label={statsLabels[key] || key}
                  suffix={suffix}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
