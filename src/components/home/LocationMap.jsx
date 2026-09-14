import React, { useEffect, useRef, useState, memo } from 'react';
import { MapPin } from 'lucide-react';
import { useSiteData } from '../../context/DataContext';

const CAIRO_COORDS = [30.0606, 31.3244];

function sanitizeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function MapSkeleton() {
  return (
    <div className="h-full w-full animate-pulse rounded-lg bg-navy-700/40">
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-navy-600/60" />
          <div className="h-3 w-40 rounded bg-navy-600/40" />
        </div>
      </div>
    </div>
  );
}

function LeafletMapInstance({ address, coordinates }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const coords = coordinates || CAIRO_COORDS;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current || mapInstanceRef.current) return;
      const L = await import('leaflet');

      if (!isMounted) return;

      const map = L.map(mapContainerRef.current, {
        center: coords,
        zoom: 16,
        zoomControl: true,
        scrollWheelZoom: false,
        dragging: true
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      const goldIcon = L.divIcon({
        html: `<svg viewBox="0 0 24 24" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="#D4AF37" stroke="#0B0F2E" stroke-width="1.5"/>
          <circle cx="12" cy="10" r="3" fill="#0B0F2E"/>
        </svg>`,
        className: '',
        iconSize: [32, 42],
        iconAnchor: [16, 42],
        popupAnchor: [0, -42]
      });

      const popupHtml = `
        <div style="font-family:Inter,sans-serif; background:#0B0F2E; color:#F5F3EC; padding:12px 14px; border-radius:8px; border:1px solid rgba(212,175,55,0.3); min-width:200px;">
          <p style="margin:0 0 4px; font-size:13px; font-weight:600; color:#D4AF37;">TouchMedia</p>
          <p style="margin:0 0 10px; font-size:12px; color:rgba(245,243,236,0.7); line-height:1.4;">${sanitizeHtml(address)}</p>
          <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; gap:6px; font-size:11px; font-weight:600; letter-spacing:0.05em; text-transform:uppercase; color:#D4AF37; text-decoration:none; border:1px solid rgba(212,175,55,0.4); border-radius:6px; padding:6px 12px; transition:all 0.2s;">
            Get Directions →
          </a>
        </div>
      `;

      L.marker(coords, { icon: goldIcon }).addTo(map).bindPopup(popupHtml);

      mapInstanceRef.current = map;
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [address, coords, directionsUrl]);

  return <div ref={mapContainerRef} className="h-full w-full rounded-lg z-0" />;
}

export const LocationMap = memo(function LocationMap() {
  const { content } = useSiteData();
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef(null);
  const address = content.contact?.address || '4 Mostafa Ragab, Ard Al Golf, Nasr City, Cairo, Egypt';

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '800px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="overflow-hidden rounded-xl border border-navy-700/50 bg-[#0d0f1f]"
    >
      <div className="flex items-center gap-3 border-b border-navy-700/30 px-5 py-4">
        <MapPin size={18} className="shrink-0 text-gold" />
        <span className="text-sm text-cream/70 leading-snug">{address}</span>
      </div>
      <div className="relative h-72 w-full md:h-80">
        {!shouldLoad ? (
          <MapSkeleton />
        ) : (
          <LeafletMapInstance
            address={address}
            coordinates={content.contact?.coordinates}
          />
        )}
      </div>
    </div>
  );
});
