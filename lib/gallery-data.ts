import { supabase } from './supabase';
import type { ArtworkWithRelations, Artist, Exhibition } from './types';

export async function fetchArtworks(): Promise<ArtworkWithRelations[]> {
  const { data, error } = await supabase
    .from('artworks')
    .select(
      `
      *,
      artist:artists(*),
      exhibition:exhibitions(*)
    `,
    )
    .order('created_at');

  if (error) {
    console.error('Error fetching artworks:', error);
    return [];
  }

  return (data || []) as ArtworkWithRelations[];
}

export async function fetchArtists(): Promise<Artist[]> {
  const { data, error } = await supabase.from('artists').select('*').order('name');

  if (error) {
    console.error('Error fetching artists:', error);
    return [];
  }

  return data || [];
}

export async function fetchExhibitions(): Promise<Exhibition[]> {
  const { data, error } = await supabase
    .from('exhibitions')
    .select('*')
    .order('start_date');

  if (error) {
    console.error('Error fetching exhibitions:', error);
    return [];
  }

  return data || [];
}

export async function fetchFeaturedArtworks(): Promise<ArtworkWithRelations[]> {
  const { data, error } = await supabase
    .from('artworks')
    .select(
      `
      *,
      artist:artists(*),
      exhibition:exhibitions(*)
    `,
    )
    .eq('featured', true)
    .order('created_at');

  if (error) {
    console.error('Error fetching featured artworks:', error);
    return [];
  }

  return (data || []) as ArtworkWithRelations[];
}

export async function fetchArtworksByExhibition(
  exhibitionId: string,
): Promise<ArtworkWithRelations[]> {
  const { data, error } = await supabase
    .from('artworks')
    .select(
      `
      *,
      artist:artists(*),
      exhibition:exhibitions(*)
    `,
    )
    .eq('exhibition_id', exhibitionId)
    .order('created_at');

  if (error) {
    console.error('Error fetching artworks by exhibition:', error);
    return [];
  }

  return (data || []) as ArtworkWithRelations[];
}

export async function fetchArtistById(id: string): Promise<Artist | null> {
  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching artist:', error);
    return null;
  }

  return data;
}

export async function fetchArtworksByArtist(
  artistId: string,
): Promise<ArtworkWithRelations[]> {
  const { data, error } = await supabase
    .from('artworks')
    .select(
      `
      *,
      artist:artists(*),
      exhibition:exhibitions(*)
    `,
    )
    .eq('artist_id', artistId)
    .order('year', { ascending: false });

  if (error) {
    console.error('Error fetching artworks by artist:', error);
    return [];
  }

  return (data || []) as ArtworkWithRelations[];
}
