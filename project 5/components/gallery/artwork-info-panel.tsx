'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, User } from 'lucide-react';
import { useGallery } from '@/lib/gallery-context';

export function ArtworkInfoPanel() {
  const {
    selectedArtwork,
    selectArtwork,
    openFullscreen,
    setView,
  } = useGallery();

  return (
    <AnimatePresence mode="wait">
      {selectedArtwork && (
        <motion.div
          key={selectedArtwork.id}
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 40, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-20 right-0 md:right-6 bottom-6 z-40 w-full md:w-[380px] max-w-md"
        >
          <div className="glass h-full rounded-sm overflow-hidden flex flex-col">
            {/* Close button */}
            <div className="flex justify-between items-center p-4 border-b border-white/5">
              <span className="text-[10px] tracking-luxe uppercase text-muted-foreground">
                Artwork Detail
              </span>
              <button
                onClick={() => selectArtwork(null)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              {/* Thumbnail */}
              {selectedArtwork.image_url && (
                <div className="relative w-full aspect-[4/3] mb-6 overflow-hidden rounded-sm bg-black/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedArtwork.image_url}
                    alt={selectedArtwork.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Title */}
              <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground mb-1 leading-tight">
                {selectedArtwork.title}
              </h2>

              {/* Artist */}
              {selectedArtwork.artist && (
                <button
                  onClick={() => {
                    setView('artists');
                    selectArtwork(null);
                  }}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors mb-4"
                >
                  <User size={12} />
                  {selectedArtwork.artist.name}
                </button>
              )}

              {/* Metadata */}
              <div className="space-y-3 mb-6">
                <MetadataRow label="Year" value={selectedArtwork.year?.toString()} />
                <MetadataRow label="Medium" value={selectedArtwork.medium} />
                <MetadataRow label="Dimensions" value={selectedArtwork.dimensions} />
                {selectedArtwork.exhibition && (
                  <MetadataRow
                    label="Exhibition"
                    value={selectedArtwork.exhibition.title}
                  />
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-white/5 mb-4" />

              {/* Description */}
              {selectedArtwork.description && (
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {selectedArtwork.description}
                </p>
              )}

              {/* Fullscreen button */}
              <button
                onClick={() => openFullscreen(selectedArtwork)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 glass-light rounded-sm text-xs tracking-wide-luxe uppercase text-foreground hover:text-accent hover:border-accent/30 transition-all duration-300 group"
              >
                <Maximize2 size={14} className="group-hover:scale-110 transition-transform" />
                Fullscreen View
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MetadataRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-baseline gap-4">
      <span className="text-[10px] tracking-wide-luxe uppercase text-muted-foreground shrink-0">
        {label}
      </span>
      <span className="text-sm text-foreground/90 text-right">{value}</span>
    </div>
  );
}
