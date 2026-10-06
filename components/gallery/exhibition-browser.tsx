'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useGallery } from '@/lib/gallery-context';
import { cn } from '@/lib/utils';
import type { ArtworkWithRelations } from '@/lib/types';

interface ExhibitionBrowserProps {
  onEnterGallery: (exhibitionId?: string) => void;
  onArtworkClick: (artwork: ArtworkWithRelations) => void;
}

export function ExhibitionBrowser({
  onArtworkClick,
}: ExhibitionBrowserProps) {
  const {
    artworks,
    exhibitions,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    filterExhibition,
    setFilterExhibition,
  } = useGallery();

  const [selectedExhibitionId, setSelectedExhibitionId] = useState<string | null>(
    null,
  );

  const filteredArtworks = useMemo(() => {
    return artworks.filter((artwork) => {
      if (selectedExhibitionId && artwork.exhibition_id !== selectedExhibitionId)
        return false;
      if (filterType !== 'all' && artwork.artwork_type !== filterType) return false;
      if (filterExhibition !== 'all' && artwork.exhibition_id !== filterExhibition)
        return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = artwork.title.toLowerCase().includes(query);
        const matchesArtist = artwork.artist?.name.toLowerCase().includes(query);
        const matchesMedium = artwork.medium?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesArtist && !matchesMedium) return false;
      }
      return true;
    });
  }, [artworks, filterType, filterExhibition, searchQuery, selectedExhibitionId]);

  const selectedExhibition = selectedExhibitionId
    ? exhibitions.find((e) => e.id === selectedExhibitionId)
    : null;

  const handleExhibitionClick = (exhibitionId: string) => {
    setSelectedExhibitionId(
      exhibitionId === selectedExhibitionId ? null : exhibitionId,
    );
  };

  return (
    <div className="min-h-screen pt-20 pb-20">
      {/* Exhibition hero sections */}
      <div className="mb-16">
        {exhibitions.map((exhibition, i) => {
          const exhibitionArtworks = artworks.filter(
            (a) => a.exhibition_id === exhibition.id,
          );
          const isSelected = selectedExhibitionId === exhibition.id;
          const reversed = i % 2 === 1;

          return (
            <motion.section
              key={exhibition.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="relative mb-16"
            >
              {/* Exhibition banner */}
              <div
                className={cn(
                  'relative h-[60vh] min-h-[400px] overflow-hidden cursor-pointer group',
                )}
                onClick={() => handleExhibitionClick(exhibition.id)}
              >
                {/* Featured artwork as background */}
                {exhibitionArtworks[0]?.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={exhibitionArtworks[0].image_url}
                    alt={exhibition.title}
                    className={cn(
                      'absolute inset-0 w-full h-full object-cover transition-all duration-[1.2s]',
                      'group-hover:scale-105',
                      isSelected ? 'scale-105' : '',
                    )}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: `linear-gradient(${reversed ? '225deg' : '135deg'}, ${exhibition.theme_color}30 0%, transparent 60%)`,
                  }}
                />

                {/* Content */}
                <div
                  className={cn(
                    'relative h-full flex flex-col justify-end p-8 md:p-16 max-w-3xl',
                    reversed ? 'ml-auto text-right items-end' : '',
                  )}
                >
                  <p
                    className="text-[10px] md:text-xs tracking-luxe uppercase mb-4"
                    style={{ color: exhibition.theme_color || undefined }}
                  >
                    Exhibition {String(i + 1).padStart(2, '0')}
                  </p>
                  <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light text-foreground leading-[0.95] mb-3">
                    {exhibition.title}
                  </h2>
                  <p className="text-sm md:text-base text-muted-foreground mb-4 max-w-lg">
                    {exhibition.description}
                  </p>
                  <div className="flex items-center gap-4 text-[10px] tracking-wide-luxe uppercase text-muted-foreground">
                    {exhibition.curator && <span>Curated by {exhibition.curator}</span>}
                    <span>{exhibitionArtworks.length} works</span>
                  </div>
                </div>

                {/* Expand indicator */}
                <div
                  className={cn(
                    'absolute top-8 right-8 text-muted-foreground transition-all duration-500',
                    isSelected ? 'rotate-45 text-accent' : 'opacity-0 group-hover:opacity-100',
                  )}
                >
                  <X size={20} />
                </div>
              </div>

              {/* Expanded artworks for this exhibition */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 md:px-10 py-10">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {exhibitionArtworks.map((artwork, idx) => (
                          <motion.button
                            key={artwork.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: idx * 0.06 }}
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
                                <p className="text-xs font-medium text-foreground leading-tight mb-0.5">
                                  {artwork.title}
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                  {artwork.artist?.name}
                                  {artwork.year ? `, ${artwork.year}` : ''}
                                </p>
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          );
        })}
      </div>

      {/* Browse all artworks section */}
      <div className="px-6 md:px-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-2">
            Browse the Collection
          </h2>
          <p className="text-sm text-muted-foreground">
            {filteredArtworks.length} of {artworks.length} works
          </p>
        </motion.div>

        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search artworks, artists, mediums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass-light rounded-sm pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/30 transition-colors"
            />
          </div>
          <FilterGroup
            label="Type"
            options={[
              { value: 'all', label: 'All' },
              { value: 'painting', label: 'Paintings' },
              { value: 'sculpture', label: 'Sculpture' },
              { value: 'digital', label: 'Digital' },
            ]}
            current={filterType}
            onChange={setFilterType}
          />
        </div>

        {/* Artwork grid */}
        {filteredArtworks.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredArtworks.map((artwork, i) => (
              <motion.button
                key={artwork.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.4) }}
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
                    <p className="text-xs font-medium text-foreground leading-tight mb-0.5">
                      {artwork.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {artwork.artist?.name}
                      {artwork.year ? `, ${artwork.year}` : ''}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-sm text-muted-foreground">
              No artworks match your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  options,
  current,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  current: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[10px] tracking-wide-luxe uppercase text-muted-foreground">
        {label}:
      </span>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            'px-3 py-1 text-xs rounded-sm transition-all',
            current === opt.value
              ? 'bg-accent/20 text-accent'
              : 'glass-light text-muted-foreground hover:text-foreground',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
