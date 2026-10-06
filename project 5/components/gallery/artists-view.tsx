'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useGallery } from '@/lib/gallery-context';
import type { ArtworkWithRelations } from '@/lib/types';

interface ArtistsViewProps {
  onArtworkClick: (artwork: ArtworkWithRelations) => void;
}

export function ArtistsView({ onArtworkClick }: ArtistsViewProps) {
  const { artists, artworks, setView } = useGallery();
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);

  const selectedArtist = artists.find((a) => a.id === selectedArtistId);
  const artistArtworks = selectedArtistId
    ? artworks.filter((a) => a.artist_id === selectedArtistId)
    : [];

  if (selectedArtist) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-6 md:px-10">
        <div className="mx-auto max-w-5xl">
          <button
            onClick={() => setSelectedArtistId(null)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            All Artists
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {selectedArtist.portrait_url && (
              <div className="aspect-square rounded-sm overflow-hidden glass-light">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedArtist.portrait_url}
                  alt={selectedArtist.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="md:col-span-2">
              <h1 className="font-serif text-3xl md:text-5xl font-light text-foreground mb-3">
                {selectedArtist.name}
              </h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-6">
                {selectedArtist.nationality && (
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {selectedArtist.nationality}
                  </span>
                )}
                {selectedArtist.birth_year && (
                  <span>b. {selectedArtist.birth_year}</span>
                )}
              </div>
              {selectedArtist.bio && (
                <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                  {selectedArtist.bio}
                </p>
              )}
            </div>
          </div>

          <h2 className="font-serif text-2xl font-light text-foreground mb-6">
            Works in the Collection
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {artistArtworks.map((artwork, i) => (
              <motion.button
                key={artwork.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                onClick={() => onArtworkClick(artwork)}
                className="group text-left"
              >
                <div className="relative aspect-[3/4] rounded-sm overflow-hidden glass-light">
                  {artwork.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={artwork.image_url}
                      alt={artwork.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-xs font-medium text-foreground leading-tight">
                      {artwork.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {artwork.year}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-6 md:px-10">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1 className="font-serif text-4xl md:text-6xl font-light text-foreground mb-2">
            Artists
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Discover the artists whose works comprise the AETHER collection.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {artists.map((artist, i) => {
            const count = artworks.filter((a) => a.artist_id === artist.id).length;
            return (
              <motion.button
                key={artist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onClick={() => setSelectedArtistId(artist.id)}
                className="group text-left"
              >
                <div className="glass-light rounded-sm overflow-hidden p-5 flex gap-5 hover:border-accent/30 transition-all duration-500">
                  {artist.portrait_url && (
                    <div className="w-20 h-20 rounded-sm overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={artist.portrait_url}
                        alt={artist.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-xl font-light text-foreground mb-1 group-hover:text-accent transition-colors">
                      {artist.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      {artist.nationality && <span>{artist.nationality}</span>}
                      {artist.birth_year && <span>b. {artist.birth_year}</span>}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {artist.bio}
                    </p>
                    <p className="text-[10px] tracking-wide-luxe uppercase text-accent mt-3">
                      {count} {count === 1 ? 'work' : 'works'}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
