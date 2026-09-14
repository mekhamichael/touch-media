import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Logo } from '../common/Logo';
import { useSiteData } from '../../context/DataContext';

gsap.registerPlugin(ScrollTrigger);

export function Concepts() {
  const { content } = useSiteData();
  const concepts = content.concepts || [];

  const sectionRef = useRef(null);
  const cardRefs = useRef([]);
  const logoBoxRef = useRef(null);
  const logoInnerRef = useRef(null);
  const descRef = useRef(null);
  const lineHRef = useRef(null);
  const lineVRef = useRef(null);
  const spotlightRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (isReduced) return;

      const titleLines = gsap.utils.toArray('.title-line', sectionRef.current);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          end: 'center center',
          toggleActions: 'play none none reverse'
        }
      });

      gsap.set([titleLines, logoBoxRef.current, descRef.current, cardRefs.current], { opacity: 0 });
      gsap.set(titleLines, { yPercent: 100 });
      gsap.set(logoBoxRef.current, { y: 40 });
      gsap.set(descRef.current, { y: 20 });
      gsap.set(cardRefs.current, { x: 50 });

      tl.fromTo(
        titleLines,
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'expo.out' }
      )
        .fromTo(
          logoBoxRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out' },
          '-=0.7'
        )
        .fromTo(
          descRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out' },
          '-=0.5'
        )
        .fromTo(
          cardRefs.current,
          { x: 50, opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'expo.out' },
          '-=0.6'
        );

      // Logo floating sine animation
      if (logoInnerRef.current) {
        const floatAnim = gsap.to(logoInnerRef.current, {
          y: -10,
          duration: 4.2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1
        });
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => (self.isActive ? floatAnim.play() : floatAnim.pause())
        });
      }

      // Vertical line scrub
      if (lineVRef.current) {
        gsap.fromTo(
          lineVRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            transformOrigin: 'top',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              end: 'bottom bottom',
              scrub: 0.6
            }
          }
        );
      }

      // Horizontal line scrub
      if (lineHRef.current) {
        gsap.fromTo(
          lineHRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            transformOrigin: 'left',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              end: 'center center',
              scrub: 0.6
            }
          }
        );
      }

      // Mouse spotlight tracker
      const section = sectionRef.current;
      const spotlight = spotlightRef.current;
      if (section && spotlight && window.matchMedia('(pointer: fine)').matches) {
        const qX = gsap.quickTo(spotlight, 'x', { duration: 0.6, ease: 'power3.out' });
        const qY = gsap.quickTo(spotlight, 'y', { duration: 0.6, ease: 'power3.out' });

        const handleMove = (e) => {
          const rect = section.getBoundingClientRect();
          qX(e.clientX - rect.left - 192);
          qY(e.clientY - rect.top - 192);
        };
        const handleEnter = () => gsap.to(spotlight, { opacity: 1, duration: 0.4 });
        const handleLeave = () => gsap.to(spotlight, { opacity: 0, duration: 0.4 });

        section.addEventListener('mousemove', handleMove);
        section.addEventListener('mouseenter', handleEnter);
        section.addEventListener('mouseleave', handleLeave);

        return () => {
          section.removeEventListener('mousemove', handleMove);
          section.removeEventListener('mouseenter', handleEnter);
          section.removeEventListener('mouseleave', handleLeave);
        };
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-navy-900"
    >
      {/* Background ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-24 z-0 h-[32vw] w-[32vw] rounded-full bg-gold/10 blur-[110px]"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-32 md:py-48">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left Column: Headline & 3D Logo Box */}
          <div className="relative">
            <h2 className="font-serif text-5xl leading-tight text-cream md:text-7xl lg:text-7xl xl:text-8xl">
              <span className="block overflow-hidden">
                <span className="title-line inline-block pb-1 will-change-transform">
                  We Turn <span className="italic text-gold-light">Brands</span> Into
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="title-line inline-block bg-gradient-to-r from-gold via-gold-light to-amber-300 bg-clip-text pb-2 text-transparent will-change-transform">
                  Experiences
                </span>
              </span>
            </h2>

            {/* Floating Logo Badge Box */}
            <div ref={logoBoxRef} className="relative z-10 mt-12 w-56 will-change-transform md:w-64">
              <div ref={logoInnerRef} className="relative rounded-3xl p-px will-change-transform">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-3xl bg-gradient-to-r from-gold/50 via-gold-light/10 to-gold/50"
                />
                <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-navy-800/50 shadow-[0_0_50px_rgba(212,175,55,0.1)] backdrop-blur-xl">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-br from-gold/15 to-transparent"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute -inset-10 rounded-full bg-gold/10 opacity-40 blur-2xl"
                  />
                  <div className="relative flex aspect-square items-center justify-center text-gold">
                    <Logo size={220} className="h-auto w-2/5 opacity-80" />
                  </div>
                </div>
              </div>
            </div>

            <p
              ref={descRef}
              className="mt-8 max-w-md text-base leading-relaxed text-cream/65 md:text-lg"
            >
              Since 2006, we have been helping brands discover their voice and connect with audiences through bold creativity and flawless execution.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="block h-px w-16 overflow-hidden bg-cream/15"
              >
                <span
                  ref={lineHRef}
                  className="block h-full w-full origin-left scale-x-0 bg-gradient-to-r from-gold to-gold-light shadow-[0_0_8px_rgba(212,175,55,0.6)]"
                />
              </span>
              <span className="text-[10px] font-medium tracking-[0.35em] text-cream/60 uppercase">
                Est. 2006
              </span>
            </div>
          </div>

          {/* Right Column: Concept Cards */}
          <div className="relative flex flex-col gap-8 lg:gap-10 lg:pl-10">
            {/* Vertical Line */}
            <div
              aria-hidden="true"
              className="absolute top-2 bottom-2 left-0 hidden w-px bg-cream/10 lg:block"
            >
              <span
                ref={lineVRef}
                className="block h-full w-full origin-top scale-y-0 bg-gradient-to-b from-gold via-gold-light to-gold shadow-[0_0_12px_rgba(212,175,55,0.6)]"
              />
            </div>

            {concepts.map((concept, idx) => (
              <div
                key={concept.number}
                ref={(el) => (cardRefs.current[idx] = el)}
                className="group relative rounded-3xl border border-cream/10 bg-navy-800/40 p-7 backdrop-blur-md transition-all duration-400 ease-out hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-[0_20px_60px_-20px_rgba(212,175,55,0.25)] md:p-9"
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-4">
                      <span className="font-serif text-2xl text-gold/70 transition-colors duration-400 group-hover:text-gold">
                        {concept.number}
                      </span>
                      <span aria-hidden="true" className="h-6 w-px bg-gold/40" />
                      <span className="text-[10px] font-semibold tracking-[0.3em] text-gold/70 uppercase">
                        {concept.tag}
                      </span>
                    </div>
                    <h3 className="mt-5 font-serif text-2xl text-cream transition-colors duration-400 group-hover:text-gold-light md:text-3xl">
                      {concept.title}
                    </h3>
                    <p className="mt-3 max-w-md text-base leading-relaxed text-cream/70 md:text-lg">
                      {concept.description}
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="mt-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-cream/15 text-lg text-gold transition-all duration-400 ease-out group-hover:rotate-45 group-hover:border-gold group-hover:bg-gold/10"
                  >
                    →
                  </span>
                </div>

                <span
                  aria-hidden="true"
                  className="relative mt-8 block h-px w-full bg-cream/10"
                />
                <span
                  aria-hidden="true"
                  className="absolute right-7 bottom-0 left-7 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-gold via-gold-light to-amber-300 transition-transform duration-500 ease-out group-hover:scale-x-100 md:right-9 md:left-9"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Spotlight follower element */}
      <div
        ref={spotlightRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 z-[5] h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.14),transparent_60%)] opacity-0 mix-blend-screen"
      />

      {/* Top Divider */}
      <div className="absolute left-0 right-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </section>
  );
}
