'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import type {
  ArtworkWithRelations,
  GallerySettings,
  GalleryView,
  RoomInfo,
} from './types';
import { DEFAULT_SETTINGS, ROOM_LAYOUT } from './types';
import {
  fetchArtworks,
  fetchArtists,
  fetchExhibitions,
} from './gallery-data';
import type { Artist, Exhibition } from './types';

interface GalleryContextValue {
  view: GalleryView;
  setView: (view: GalleryView) => void;

  artworks: ArtworkWithRelations[];
  artists: Artist[];
  exhibitions: Exhibition[];
  loading: boolean;

  selectedArtwork: ArtworkWithRelations | null;
  selectArtwork: (artwork: ArtworkWithRelations | null) => void;

  fullscreenArtwork: ArtworkWithRelations | null;
  openFullscreen: (artwork: ArtworkWithRelations) => void;
  closeFullscreen: () => void;

  settings: GallerySettings;
  updateSettings: (partial: Partial<GallerySettings>) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  filterType: string;
  setFilterType: (type: string) => void;

  filterExhibition: string;
  setFilterExhibition: (exhibitionId: string) => void;

  rooms: RoomInfo[];

  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
}

const GalleryContext = createContext<GalleryContextValue | null>(null);

export function GalleryProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<GalleryView>('landing');
  const [artworks, setArtworks] = useState<ArtworkWithRelations[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedArtwork, selectArtwork] = useState<ArtworkWithRelations | null>(null);
  const [fullscreenArtwork, setFullscreenArtwork] = useState<ArtworkWithRelations | null>(null);

  const [settings, setSettings] = useState<GallerySettings>(DEFAULT_SETTINGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterExhibition, setFilterExhibition] = useState('all');

  const [showSettings, setShowSettings] = useState(false);

  const [rooms, setRooms] = useState<RoomInfo[]>(ROOM_LAYOUT);

  const updateSettings = useCallback((partial: Partial<GallerySettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const openFullscreen = useCallback((artwork: ArtworkWithRelations) => {
    setFullscreenArtwork(artwork);
  }, []);

  const closeFullscreen = useCallback(() => {
    setFullscreenArtwork(null);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      const [artworkData, artistData, exhibitionData] = await Promise.all([
        fetchArtworks(),
        fetchArtists(),
        fetchExhibitions(),
      ]);

      if (!mounted) return;

      setArtworks(artworkData);
      setArtists(artistData);
      setExhibitions(exhibitionData);

      setRooms((prevRooms) =>
        prevRooms.map((room) => {
          const exhibition = exhibitionData.find((e) => e.room_identifier === room.id);
          return {
            ...room,
            name: exhibition?.title || room.name,
            subtitle: exhibition?.subtitle || room.subtitle,
            themeColor: exhibition?.theme_color || room.themeColor,
            exhibitionId: exhibition?.id || '',
          };
        }),
      );

      setLoading(false);
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <GalleryContext.Provider
      value={{
        view,
        setView,
        artworks,
        artists,
        exhibitions,
        loading,
        selectedArtwork,
        selectArtwork,
        fullscreenArtwork,
        openFullscreen,
        closeFullscreen,
        settings,
        updateSettings,
        searchQuery,
        setSearchQuery,
        filterType,
        setFilterType,
        filterExhibition,
        setFilterExhibition,
        rooms,
        showSettings,
        setShowSettings,
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
}

export function useGallery() {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error('useGallery must be used within GalleryProvider');
  }
  return context;
}
