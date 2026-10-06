'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGallery } from '@/lib/gallery-context';

export function FullscreenViewer() {
  const {
    fullscreenArtwork,
    closeFullscreen,
    artworks,
    openFullscreen,
  } = useGallery();

  // Navigation between artworks
  const currentIndex = fullscreenArtwork
    ? artworks.findIndex((a) => a.id === fullscreenArtwork.id)
    : -1;

  const goToArtwork = (direction: number) => {
    if (currentIndex < 0) return;
    const newIndex =
      (currentIndex + direction + artworks.length) % artworks.length;
    openFullscreen(artworks[newIndex]);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!fullscreenArtwork) return;
      if (e.key === 'Escape') closeFullscreen();
      if (e.key === 'ArrowRight') goToArtwork(1);
      if (e.key === 'ArrowLeft') goToArtwork(-1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [fullscreenArtwork, currentIndex, artworks.length]);

  return (
    <AnimatePresence>
      {fullscreenArtwork && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[80] flex items-center justify-center"
          style={{ backgroundColor: 'rgba(8, 7, 6, 0.97)' }}
          onClick={closeFullscreen}
        >
          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeFullscreen();
            }}
            className="absolute top-6 right-6 z-10 text-muted-foreground hover:text-foreground transition-colors p-2"
          >
            <X size={24} />
          </button>

          {/* Previous button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToArtwork(-1);
            }}
            className="absolute left-4 md:left-8 z-10 text-muted-foreground hover:text-accent transition-colors p-2"
          >
            <ChevronLeft size={32} />
          </button>

          {/* Next button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToArtwork(1);
            }}
            className="absolute right-4 md:right-8 z-10 text-muted-foreground hover:text-accent transition-colors p-2"
          >
            <ChevronRight size={32} />
          </button>

          {/* Artwork display */}
          <motion.div
            key={fullscreenArtwork.id}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {fullscreenArtwork.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={fullscreenArtwork.image_url}
                alt={fullscreenArtwork.title}
                className="max-w-full max-h-[75vh] object-contain shadow-2xl"
                style={{
                  boxShadow: '0 20px 80px rgba(0,0,0,0.5)',
                }}
              />
            )}

            {/* Caption */}
            <div className="mt-6 text-center">
              <h2 className="font-serif text-xl md:text-2xl font-light text-foreground mb-1">
                {fullscreenArtwork.title}
              </h2>
              {fullscreenArtwork.artist && (
                <p className="text-sm text-muted-foreground">
                  {fullscreenArtwork.artist.name}
                  {fullscreenArtwork.year ? `, ${fullscreenArtwork.year}` : ''}
                </p>
              )}
              {fullscreenArtwork.medium && (
                <p className="text-xs text-muted-foreground/70 mt-1">
                  {fullscreenArtwork.medium}
                  {fullscreenArtwork.dimensions ? ` · ${fullscreenArtwork.dimensions}` : ''}
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
