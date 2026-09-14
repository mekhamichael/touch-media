import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { optimizeCloudinary } from '../../data/siteData';

export function VideoModal({ project, onClose }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!project) return;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    const vid = videoRef.current;
    if (vid) {
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          if (err.name !== 'AbortError') console.error('Video play error:', err);
        });
      }
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative w-full max-w-5xl aspect-video overflow-hidden rounded-lg shadow-2xl bg-black"
          onClick={(e) => e.stopPropagation()}
        >
          <video
            ref={videoRef}
            src={optimizeCloudinary(project.video)}
            poster={project.poster}
            controls
            autoPlay
            playsInline
            className="h-full w-full object-cover"
          />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-navy-900/80 text-cream transition-colors hover:bg-gold hover:text-navy-900 cursor-pointer"
            aria-label="Close video"
          >
            <X size={20} />
          </button>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-12 pointer-events-none">
            <h3 className="font-serif text-xl font-bold text-white md:text-2xl">
              {project.title}
            </h3>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
