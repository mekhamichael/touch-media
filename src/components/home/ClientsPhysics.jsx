import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSiteData } from '../../context/DataContext';
import { optimizeCloudinary } from '../../data/siteData';

const BASE_RADIUS = 220;
const DAMPING = 0.45;
const SPRING_SPEED = 0.14;
const IDLE_SPEED = 0.01;
const IDLE_DELAY = 2600;
const PADDING = 12;
const GAP = 26;
const GLOW_COLOR = '201, 162, 39';

function generateGrid(count, cols, rows) {
  if (count === 0) return [];
  const colWidth = 100 / cols;
  const rowHeight = 100 / rows;
  const jitterX = colWidth * 0.22;
  const jitterY = rowHeight * 0.22;

  return Array.from({ length: count }, (_, idx) => {
    const c = idx % cols;
    const r = Math.floor(idx / cols);
    const baseX = colWidth * (c + 0.5);
    const baseY = rowHeight * (r + 0.5);
    const offsetX = Math.sin(idx * 12.9898) * jitterX;
    const offsetY = Math.cos(idx * 78.233) * jitterY;
    return {
      xPct: Math.min(97, Math.max(3, baseX + offsetX)),
      yPct: Math.min(96, Math.max(4, baseY + offsetY))
    };
  });
}

const BREAKPOINTS = {
  mobile: { radius: 120, diameter: 64 },
  tablet: { radius: 160, diameter: 92 },
  desktop: { radius: BASE_RADIUS, diameter: 112 }
};

function useResponsiveRadius() {
  const [cfg, setCfg] = useState(BREAKPOINTS.desktop);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 639px)');
    const tabletQuery = window.matchMedia('(min-width: 640px) and (max-width: 1023px)');

    const update = () => {
      if (mobileQuery.matches) setCfg(BREAKPOINTS.mobile);
      else if (tabletQuery.matches) setCfg(BREAKPOINTS.tablet);
      else setCfg(BREAKPOINTS.desktop);
    };

    update();
    mobileQuery.addEventListener('change', update);
    tabletQuery.addEventListener('change', update);

    return () => {
      mobileQuery.removeEventListener('change', update);
      tabletQuery.removeEventListener('change', update);
    };
  }, []);

  return cfg;
}

export function ClientsPhysics() {
  const { content } = useSiteData();
  const { radius, diameter } = useResponsiveRadius();

  const clients = content.clients || [];
  const total = clients.length;

  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(() => (typeof window !== 'undefined' ? window.innerHeight : 800));

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect?.width;
      if (w) setContainerWidth(w);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { cols, rows, containerHeight } = useMemo(() => {
    const itemSpace = diameter * 1.2 + PADDING * 2 + GAP;
    const minHeight = windowHeight * 0.65;
    if (total === 0 || containerWidth === 0) {
      return { cols: 1, rows: Math.max(1, total), containerHeight: minHeight };
    }
    const computedCols = Math.max(1, Math.floor(containerWidth / itemSpace));
    const computedRows = Math.max(1, Math.ceil(total / computedCols));
    return {
      cols: computedCols,
      rows: computedRows,
      containerHeight: Math.max(minHeight, computedRows * itemSpace)
    };
  }, [total, containerWidth, windowHeight, diameter]);

  const gridPoints = useMemo(() => generateGrid(total, cols, rows), [total, cols, rows]);

  const glowRef = useRef(null);
  const nodeRefs = useRef([]);
  const animFrameRef = useRef(null);
  const idleTimerRef = useRef(null);

  const targetPos = useRef({ x: 0.5, y: 0.5 });
  const currentPos = useRef({ x: 0.5, y: 0.5 });
  const isIdle = useRef(false);
  const idleTarget = useRef(null);

  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [focusedIdx, setFocusedIdx] = useState(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isReduced, setIsReduced] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const q = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReduced(q.matches);
    const handler = (e) => setIsReduced(e.matches);
    q.addEventListener('change', handler);
    return () => q.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const f = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(f);
  }, []);

  const resetIdle = useCallback(() => {
    clearTimeout(idleTimerRef.current);
    isIdle.current = false;
    idleTimerRef.current = setTimeout(() => {
      isIdle.current = true;
      if (gridPoints.length > 0) {
        idleTarget.current = gridPoints[Math.floor(Math.random() * total)];
      }
    }, IDLE_DELAY);
  }, [gridPoints, total]);

  const handlePointer = useCallback(
    (clientX, clientY) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      targetPos.current = {
        x: (clientX - rect.left) / rect.width,
        y: (clientY - rect.top) / rect.height
      };
      isIdle.current = false;
      setIsInteracting(true);
      resetIdle();
    },
    [resetIdle]
  );

  const handleMouseMove = useCallback((e) => handlePointer(e.clientX, e.clientY), [handlePointer]);
  const handleTouchMove = useCallback((e) => {
    const touch = e.touches[0];
    if (touch) handlePointer(touch.clientX, touch.clientY);
  }, [handlePointer]);

  // Main physics loop
  useEffect(() => {
    if (isReduced || total === 0) return;
    const container = containerRef.current;
    if (!container) return;

    const animate = () => {
      const rect = container.getBoundingClientRect();
      const target = isIdle.current && idleTarget.current
        ? { x: idleTarget.current.xPct / 100, y: idleTarget.current.yPct / 100 }
        : targetPos.current;

      const speed = isIdle.current ? IDLE_SPEED : SPRING_SPEED;
      currentPos.current.x += (target.x - currentPos.current.x) * speed;
      currentPos.current.y += (target.y - currentPos.current.y) * speed;

      const mouseX = currentPos.current.x * rect.width;
      const mouseY = currentPos.current.y * rect.height;
      const time = performance.now() * 0.0015;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      let closestIdx = null;
      let minDistance = Infinity;

      nodeRefs.current.forEach((el, idx) => {
        if (!el || !gridPoints[idx]) return;

        const floatX = Math.sin(time + idx * 1.5) * 12;
        const floatY = Math.cos(time + idx * 1.5) * 12;

        const basePosX = (gridPoints[idx].xPct / 100) * rect.width;
        const basePosY = (gridPoints[idx].yPct / 100) * rect.height;

        const posX = basePosX + floatX;
        const posY = basePosY + floatY;

        const deltaX = mouseX - posX;
        const deltaY = mouseY - posY;
        const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const influence = Math.max(0, 1 - dist / radius);

        if (influence > 0 && dist < minDistance) {
          minDistance = dist;
          closestIdx = idx;
        }

        const pushX = influence ? deltaX * DAMPING * influence : 0;
        const pushY = influence ? deltaY * DAMPING * influence : 0;

        el.style.transform = `translate3d(${floatX + pushX}px, ${floatY + pushY}px, 0) scale(${
          1 + influence * 0.2
        })`;
        el.style.opacity = (0.2 + influence * 0.8).toFixed(2);
        el.style.filter = `grayscale(${((1 - influence) * 100).toFixed(0)}%)`;
      });

      setHoveredIdx((prev) => (prev === closestIdx ? prev : closestIdx));
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [gridPoints, total, isReduced, radius]);

  useEffect(() => {
    resetIdle();
    return () => clearTimeout(idleTimerRef.current);
  }, [resetIdle]);

  if (total === 0) return null;

  const activeIdx = focusedIdx ?? hoveredIdx;
  const activeClient = activeIdx !== null && activeIdx !== undefined ? clients[activeIdx] : null;

  return (
    <section
      id="ourclients"
      className={`relative w-full bg-navy-900 py-24 md:py-32 px-6 overflow-hidden transition-opacity duration-700 ${
        ready ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="max-w-4xl mx-auto text-center mb-4">
        <h2 className="font-serif text-gold text-4xl md:text-5xl lg:text-6xl mb-3">
          Our Clients
        </h2>
        <p className="text-cream/60 text-base md:text-lg max-w-2xl mx-auto min-h-[1.75em]">
          {isInteracting && activeClient ? (
            <>
              You're exploring <span className="text-cream font-semibold">{activeClient.name}</span>
              {activeClient.since ? ` (Partner since ${activeClient.since})` : ''}
            </>
          ) : (
            'Move your cursor to explore our clients'
          )}
        </p>
      </div>

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchMove}
        style={{ height: containerHeight }}
        className="relative w-full min-h-[380px] max-w-5xl mx-auto"
      >
        {/* Glow halo */}
        {!isReduced && (
          <div
            ref={glowRef}
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 w-52 h-52 -ml-26 -mt-26 sm:w-72 sm:h-72 sm:-ml-36 sm:-mt-36 md:w-80 md:h-80 md:-ml-40 md:-mt-40 rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(${GLOW_COLOR},0.22) 0%, rgba(${GLOW_COLOR},0.07) 45%, transparent 70%)`,
              mixBlendMode: 'screen'
            }}
          />
        )}

        {clients.map((client, idx) => {
          const pt = gridPoints[idx];
          if (!pt) return null;
          return (
            <button
              key={client.name}
              ref={(el) => (nodeRefs.current[idx] = el)}
              type="button"
              onFocus={() => setFocusedIdx(idx)}
              onBlur={() => setFocusedIdx(null)}
              aria-label={`${client.name} — Trusted Partner`}
              className={`absolute flex items-center justify-center w-14 h-14 -ml-7 -mt-7 sm:w-16 sm:h-16 sm:-ml-8 sm:-mt-8 md:w-20 md:h-20 md:-ml-10 md:-mt-10 lg:w-24 lg:h-24 lg:-ml-12 lg:-mt-12 rounded-full focus:outline-none focus-visible:ring-1 focus-visible:ring-gold/70 cursor-pointer ${
                isReduced ? 'opacity-100' : 'opacity-[0.15] grayscale'
              }`}
              style={{
                left: `${pt.xPct}%`,
                top: `${pt.yPct}%`,
                willChange: isReduced ? undefined : 'transform, opacity, filter'
              }}
            >
              <img
                src={optimizeCloudinary(client.src, 'w_300,q_auto,f_auto')}
                alt={client.name}
                loading="lazy"
                decoding="async"
                width="300"
                height="300"
                className="relative max-w-full max-h-full object-contain filter drop-shadow-md"
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
