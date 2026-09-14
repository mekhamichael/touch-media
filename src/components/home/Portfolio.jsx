import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useSiteData } from '../../context/DataContext';
import { optimizeCloudinary, getVideoPoster } from '../../data/siteData';
import { VideoModal } from './VideoModal';

gsap.registerPlugin(ScrollTrigger);

function safePlay(video) {
  if (!video) return;
  const promise = video.play();
  if (promise !== undefined) {
    promise.catch((err) => {
      if (err.name !== 'AbortError') {
        // Silently catch autoplay restrictions
      }
    });
  }
}

// Mobile Project Card with In-View Autoplay
const MobileProjectCard = memo(function MobileProjectCard({ project, index, onPlay }) {
  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const poster = getVideoPoster(project.video);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const el = cardRef.current;
    if (!el) return;

    const playObserver = new IntersectionObserver(
      ([entry]) => {
        const vid = videoRef.current;
        if (!vid) return;
        if (entry.isIntersecting) {
          safePlay(vid);
        } else {
          vid.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.3, rootMargin: '50px 0px' }
    );

    playObserver.observe(el);
    return () => playObserver.disconnect();
  }, [inView]);

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="overflow-hidden rounded-lg bg-navy-800"
      style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 280px' }}
    >
      <button
        type="button"
        onClick={() => onPlay(project)}
        aria-label={`Play ${project.title}`}
        className="group block w-full cursor-pointer text-left"
      >
        <div className="relative aspect-video w-full overflow-hidden bg-navy-900">
          {poster && (
            <img
              src={poster}
              alt=""
              aria-hidden="true"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out ${
                isPlaying ? 'opacity-0' : 'opacity-100'
              }`}
            />
          )}

          {inView && (
            <video
              ref={videoRef}
              src={optimizeCloudinary(project.video)}
              muted
              loop
              playsInline
              preload="metadata"
              poster={poster}
              onPlaying={() => {
                setIsPlaying(true);
                setVideoLoaded(true);
              }}
              onPause={() => setIsPlaying(false)}
              className={`h-full w-full object-cover transition-opacity duration-500 ease-out ${
                videoLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-navy-900/30" />

          <span className="absolute left-3 top-3 font-serif text-xs tracking-[0.2em] text-cream/50">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="absolute right-3 top-3 rounded-full bg-black/50 px-3 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase text-gold/90">
            {project.category}
          </span>

          <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/90 bg-black/40 text-white transition-colors duration-300 group-hover:border-gold group-hover:bg-gold/20 group-hover:text-gold">
              <Play size={20} className="ml-0.5" />
            </span>
          </span>
        </div>

        <div className="px-4 pb-4 pt-3">
          <h3 className="font-serif text-lg font-bold leading-snug text-cream">
            {project.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/70">
            {project.description}
          </p>
          <span className="mt-3 inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.15em] uppercase text-gold">
            <span className="h-px w-4 bg-gold/60" />
            Watch Film
          </span>
        </div>
      </button>
    </motion.article>
  );
});

export function Portfolio() {
  const { content } = useSiteData();
  const portfolio = content.portfolio || [];
  const total = portfolio.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [modalProject, setModalProject] = useState(null);

  const sectionRef = useRef(null);
  const listRef = useRef(null);
  const wheelContainerRef = useRef(null);
  const buttonRefs = useRef([]);
  const videoRefs = useRef([]);
  const activeIndexRef = useRef(0);
  const isIntersectingRef = useRef(false);

  const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const syncVideos = useCallback(() => {
    const active = activeIndexRef.current;
    videoRefs.current.forEach((vid, idx) => {
      if (vid) {
        if (idx === active && isIntersectingRef.current) {
          safePlay(vid);
        } else {
          vid.pause();
        }
      }
    });
  }, []);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const timer = setTimeout(syncVideos, 120);
    return () => clearTimeout(timer);
  }, [activeIndex, syncVideos]);

  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersectingRef.current = entry.isIntersecting;
        syncVideos();
      },
      { threshold: 0.25 }
    );

    observer.observe(sec);
    return () => observer.disconnect();
  }, [syncVideos]);

  // GSAP 3D Cylinder List Wheel Animation
  useEffect(() => {
    if (total === 0 || isReduced) return;

    const ctx = gsap.context(() => {
      const isDesktop = window.matchMedia('(min-width: 768px)').matches;
      if (!isDesktop) return;

      const list = listRef.current;
      const container = wheelContainerRef.current;
      if (!list || !container) return;

      const itemHeight = list.querySelector('button')?.offsetHeight || 80;
      const containerHeight = container.getBoundingClientRect().height || 360;
      const startY = (containerHeight - itemHeight) / 2;
      const endY = startY - (total - 1) * itemHeight;

      const updateWheel = (currY) => {
        for (let i = 0; i < total; i++) {
          const btn = buttonRefs.current[i];
          if (!btn) continue;
          const dist = ((i + 0.5) * itemHeight - currY) / itemHeight;
          const absDist = Math.min(3.2, Math.abs(dist));
          gsap.set(btn, {
            rotateX: -dist * 22,
            z: -absDist * 34,
            scale: Math.max(0.84, 1 - 0.055 * absDist),
            opacity: 0.45 + 0.55 * Math.exp(-(dist * dist) / 2.4)
          });
        }
      };

      gsap.set(list, { y: startY });
      updateWheel(containerHeight / 2 - startY);

      const animObj = { y: startY };
      gsap.to(animObj, {
        y: endY,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${Math.round((total - 1) * itemHeight * 1.6)}px`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 2
        },
        onUpdate: () => {
          gsap.set(list, { y: animObj.y });
          updateWheel(containerHeight / 2 - animObj.y);
          const computedIdx = Math.round((containerHeight / 2 - animObj.y) / itemHeight - 0.5);
          const clamped = Math.min(total - 1, Math.max(0, computedIdx));
          if (clamped !== activeIndexRef.current) {
            setActiveIndex(clamped);
          }
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [total, isReduced]);

  const activeProject = portfolio[activeIndex] || portfolio[0];

  const handleOpenModal = (proj) => {
    setModalProject({
      ...proj,
      poster: getVideoPoster(proj.video)
    });
  };

  if (total === 0) return null;

  return (
    <section id="portfolio" ref={sectionRef} className="bg-navy-900">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-gold/40 md:w-16" />
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-gold">
              Selected Work
            </span>
            <span className="h-px w-12 bg-gold/40 md:w-16" />
          </div>
          <h2 className="mt-4 font-serif text-3xl font-bold text-cream md:text-4xl lg:text-5xl">
            Our <span className="text-gold">Portfolio</span>
          </h2>
        </motion.div>

        {/* Desktop 3D Interactive Wheel + Video Stage */}
        <div
          className={`mt-14 hidden gap-10 md:grid lg:mt-16 lg:gap-14 ${
            isReduced
              ? 'md:grid-cols-2 md:items-start'
              : 'md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-stretch'
          }`}
        >
          {/* Left Column: 3D List Wheel */}
          <div className="relative">
            <div
              ref={wheelContainerRef}
              className={`w-full overflow-hidden ${isReduced ? '' : 'md:absolute md:inset-0'}`}
            >
              <div
                ref={listRef}
                className={`relative flex flex-col will-change-transform transform-3d ${
                  isReduced ? '' : '[perspective:900px]'
                }`}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-0 left-[25px] top-0 w-px -translate-x-1/2 bg-cream/15"
                />

                {portfolio.map((proj, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={proj.title}
                      type="button"
                      ref={(el) => (buttonRefs.current[idx] = el)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onFocus={() => setActiveIndex(idx)}
                      onClick={() => handleOpenModal(proj)}
                      aria-current={isActive ? 'true' : undefined}
                      className={`group relative flex h-20 w-full cursor-pointer items-center gap-4 py-4 pl-5 pr-2 text-left transition-colors duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-gold/60 will-change-transform lg:h-24 lg:py-3 ${
                        isReduced && !isActive ? 'opacity-40' : ''
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`relative z-10 h-2.5 w-2.5 shrink-0 rounded-full border transition-all duration-300 ${
                          isActive
                            ? 'scale-125 border-gold bg-gold shadow-[0_0_12px_rgba(212,175,55,0.55)]'
                            : 'border-cream/30 bg-navy-900 group-hover:border-gold/60'
                        }`}
                      />
                      <span
                        className={`font-serif text-sm transition-colors duration-300 ${
                          isActive ? 'text-gold' : 'text-cream/80'
                        }`}
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block font-serif text-lg font-bold leading-snug transition-colors duration-300 md:text-xl md:line-clamp-1 lg:line-clamp-2 lg:text-xl ${
                            isActive ? 'text-gold' : 'text-cream/85'
                          }`}
                        >
                          {proj.title}
                        </span>
                        <span
                          className={`mt-0.5 block text-[10px] font-semibold leading-3 tracking-[0.2em] uppercase transition-colors duration-300 ${
                            isActive ? 'text-gold/70' : 'text-cream/75'
                          }`}
                        >
                          {proj.category}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Active Video Showcase Player */}
          <div
            className={`relative aspect-video w-full overflow-hidden rounded-lg bg-navy-800 ${
              isReduced ? 'md:sticky md:top-24 md:self-start' : ''
            }`}
          >
            <div className="absolute inset-0 [perspective:1000px]">
              {portfolio.map((proj, idx) => (
                <video
                  key={proj.title}
                  ref={(el) => (videoRefs.current[idx] = el)}
                  src={optimizeCloudinary(proj.video)}
                  muted
                  loop
                  playsInline
                  preload={idx === activeIndex ? 'metadata' : 'none'}
                  poster={idx === activeIndex ? getVideoPoster(proj.video) : undefined}
                  aria-hidden={idx !== activeIndex}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-in-out ${
                    idx === activeIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                />
              ))}
            </div>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-navy-900/30 to-transparent" />

            <div className="absolute bottom-0 left-0 w-full p-4 md:p-6">
              <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gold/80">
                {String(activeIndex + 1).padStart(2, '0')} — {activeProject?.category}
              </span>
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/75 md:text-sm lg:line-clamp-3">
                {activeProject?.description}
              </p>
              <button
                type="button"
                onClick={() => handleOpenModal(activeProject)}
                className="mt-3 inline-flex cursor-pointer items-center gap-2 text-[10px] font-semibold tracking-[0.15em] uppercase text-gold transition-colors duration-300 hover:text-gold-light md:mt-4 md:text-xs"
              >
                <span className="h-px w-5 bg-gold/60" />
                Watch Film
                <Play size={12} className="ml-1 fill-gold" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Video Feed Grid */}
        <div className="mt-12 flex flex-col gap-8 md:hidden">
          {portfolio.map((proj, idx) => (
            <MobileProjectCard
              key={proj.title}
              project={proj}
              index={idx}
              onPlay={handleOpenModal}
            />
          ))}
        </div>
      </div>

      {/* Video Lightbox Modal */}
      <VideoModal project={modalProject} onClose={() => setModalProject(null)} />
    </section>
  );
}
