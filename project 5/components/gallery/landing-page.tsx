'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useGallery } from '@/lib/gallery-context';
import type { ArtworkWithRelations } from '@/lib/types';

interface LandingPageProps {
  onEnterGallery: () => void;
  onArtworkClick: (artwork: ArtworkWithRelations) => void;
}

export function LandingPage({ onEnterGallery, onArtworkClick }: LandingPageProps) {
  const { artworks, exhibitions, loading } = useGallery();
  const [currentFeature, setCurrentFeature] = useState(0);

  const featuredArtworks = artworks.filter((a) => a.featured).slice(0, 4);

  useEffect(() => {
    if (featuredArtworks.length === 0) return;
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % featuredArtworks.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featuredArtworks.length]);

  const currentArt = featuredArtworks[currentFeature];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background - cycling featured artworks */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          {currentArt?.image_url && (
            <motion.div
              key={currentArt.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.25, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentArt.image_url}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fallback gradient if no images loaded yet */}
        {!currentArt?.image_url && (
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 70% 30%, rgba(196, 168, 130, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 30% 70%, rgba(139, 158, 176, 0.05) 0%, transparent 50%)',
            }}
          />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Hero section */}
        <div className="flex-1 flex flex-col justify-center px-6 md:px-10 lg:px-20 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl"
          >
            <p className="text-[10px] md:text-xs tracking-luxe uppercase text-accent mb-6 animate-fade-in">
              Contemporary Art Gallery — Est. 2026
            </p>

            <h1
              className="font-serif text-6xl md:text-8xl lg:text-9xl font-light text-foreground leading-[0.95] mb-6"
              style={{ letterSpacing: '-0.02em' }}
            >
              Where light
              <br />
              <em className="font-light text-accent/90">becomes</em> form.
            </h1>

            <p className="text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed mb-10 text-balance">
              An immersive digital museum exploring the boundaries of contemporary
              art — painting, sculpture, and digital installations across four
              interconnected exhibition spaces.
            </p>

            <button
              onClick={onEnterGallery}
              className="group inline-flex items-center gap-3 px-8 py-4 glass rounded-sm text-sm tracking-wide-luxe uppercase text-foreground hover:text-accent hover:border-accent/30 transition-all duration-500"
            >
              Enter Gallery
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </button>
          </motion.div>
        </div>

        {/* Featured exhibition info bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="px-6 md:px-10 lg:px-20 pb-8"
        >
          <div className="glass rounded-sm p-5 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-[10px] tracking-luxe uppercase text-muted-foreground mb-1">
                    Currently on view
                  </p>
                  <p className="text-sm text-foreground">
                    {exhibitions.length} exhibitions · {artworks.length} artworks
                  </p>
                </div>
                <div className="h-8 w-px bg-white/10 hidden md:block" />
                <div className="hidden md:block">
                  <p className="text-[10px] tracking-luxe uppercase text-muted-foreground mb-1">
                    Featured
                  </p>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={currentFeature}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="text-sm text-foreground"
                    >
                      {currentArt?.title || '—'}
                      {currentArt?.artist ? ` · ${currentArt.artist.name}` : ''}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>

              {/* Feature indicators */}
              {featuredArtworks.length > 0 && (
                <div className="flex gap-1.5">
                  {featuredArtworks.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentFeature(i)}
                      className={`h-1 rounded-full transition-all duration-500 ${
                        i === currentFeature ? 'w-8 bg-accent' : 'w-2 bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
