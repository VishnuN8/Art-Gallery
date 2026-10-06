'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LoadingScreen } from '@/components/gallery/loading-screen';
import { Navbar } from '@/components/gallery/navbar';
import { LandingPage } from '@/components/gallery/landing-page';
import { ExhibitionBrowser } from '@/components/gallery/exhibition-browser';
import { ArtistsView } from '@/components/gallery/artists-view';
import { FullscreenViewer } from '@/components/gallery/fullscreen-viewer';
import { SettingsPanel } from '@/components/gallery/settings-panel';
import { AmbientSound } from '@/components/gallery/ambient-sound';
import { useGallery } from '@/lib/gallery-context';
import type { ArtworkWithRelations } from '@/lib/types';

export default function Home() {
  const { view, setView, loading, selectArtwork } = useGallery();

  const [loadingComplete, setLoadingComplete] = useState(false);

  const handleArtworkClick = (artwork: ArtworkWithRelations) => {
    selectArtwork(artwork);
  };

  return (
    <>
      <LoadingScreen onComplete={() => setLoadingComplete(true)} />

      {loadingComplete && !loading && (
        <>
          <AmbientSound />
          <Navbar />

          <AnimatePresence mode="wait">
            {view === 'landing' && (
              <motion.div
                key="landing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <LandingPage
                  onEnterGallery={() => setView('exhibitions')}
                  onArtworkClick={(art) => {
                    setView('exhibitions');
                    selectArtwork(art);
                  }}
                />
              </motion.div>
            )}

            {view === 'exhibitions' && (
              <motion.div
                key="exhibitions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <ExhibitionBrowser
                  onEnterGallery={() => setView('exhibitions')}
                  onArtworkClick={handleArtworkClick}
                />
              </motion.div>
            )}

            {view === 'artists' && (
              <motion.div
                key="artists"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <ArtistsView onArtworkClick={handleArtworkClick} />
              </motion.div>
            )}
          </AnimatePresence>

          <FullscreenViewer />
          <SettingsPanel />
        </>
      )}
    </>
  );
}
