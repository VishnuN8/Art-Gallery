export type ArtworkType = 'painting' | 'sculpture' | 'digital' | 'installation';

export interface Artist {
  id: string;
  name: string;
  bio: string | null;
  nationality: string | null;
  birth_year: number | null;
  portrait_url: string | null;
  created_at: string;
}

export interface Exhibition {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  room_identifier: string;
  theme_color: string | null;
  curator: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

export interface Artwork {
  id: string;
  title: string;
  artist_id: string | null;
  exhibition_id: string | null;
  year: number | null;
  medium: string | null;
  dimensions: string | null;
  description: string | null;
  image_url: string | null;
  artwork_type: ArtworkType;
  position_x: number;
  position_y: number;
  position_z: number;
  rotation_y: number;
  width: number;
  height: number;
  featured: boolean;
  created_at: string;
  artist?: Artist;
  exhibition?: Exhibition;
}

export interface ArtworkWithRelations extends Omit<Artwork, 'artist' | 'exhibition'> {
  artist: Artist | null;
  exhibition: Exhibition | null;
}

export interface RoomInfo {
  id: string;
  name: string;
  subtitle: string;
  centerZ: number;
  themeColor: string;
  exhibitionId: string;
}

export type GalleryView = 'landing' | 'exhibitions' | 'artists';

export interface GallerySettings {
  ambientSound: boolean;
  soundVolume: number;
  reducedMotion: boolean;
}

export const DEFAULT_SETTINGS: GallerySettings = {
  ambientSound: false,
  soundVolume: 0.4,
  reducedMotion: false,
};

export const ROOM_LAYOUT: RoomInfo[] = [
  {
    id: 'room-1',
    name: 'Chromatic Resonance',
    subtitle: 'Abstract Expressionism Reimagined',
    centerZ: 0,
    themeColor: '#c4a882',
    exhibitionId: '',
  },
  {
    id: 'room-2',
    name: 'Faces of Tomorrow',
    subtitle: 'Portraiture in the Digital Age',
    centerZ: -12,
    themeColor: '#8b9eb0',
    exhibitionId: '',
  },
  {
    id: 'room-3',
    name: 'Luminous Forms',
    subtitle: 'Digital Art & Light Installations',
    centerZ: -24,
    themeColor: '#d4a574',
    exhibitionId: '',
  },
  {
    id: 'room-4',
    name: 'Form & Shadow',
    subtitle: 'Contemporary Sculpture',
    centerZ: -37,
    themeColor: '#9a8c7a',
    exhibitionId: '',
  },
];
