/*
# Create Art Gallery Schema

## Overview
Creates the database schema for a premium 3D art gallery website. The gallery is a 
public, no-auth experience — all artwork, artist, and exhibition data is intentionally 
shared and publicly readable. No sign-in is required to browse.

## New Tables
1. `artists` — Information about artists featured in the gallery
   - id (uuid, PK)
   - name (text, not null)
   - bio (text)
   - nationality (text)
   - birth_year (int)
   - portrait_url (text) — URL to artist portrait image
   - created_at (timestamptz)

2. `exhibitions` — Exhibition spaces/rooms in the gallery
   - id (uuid, PK)
   - title (text, not null)
   - subtitle (text)
   - description (text)
   - room_identifier (text, unique) — e.g. "room-1", "room-2" used to map to 3D scene
   - theme_color (text) — hex color for UI theming per exhibition
   - curator (text)
   - start_date (date)
   - end_date (date)
   - created_at (timestamptz)

3. `artworks` — Individual artworks displayed in the gallery
   - id (uuid, PK)
   - title (text, not null)
   - artist_id (uuid, FK -> artists)
   - exhibition_id (uuid, FK -> exhibitions)
   - year (int)
   - medium (text) — e.g. "Oil on canvas", "Bronze sculpture"
   - dimensions (text) — e.g. "120 x 80 cm"
   - description (text)
   - image_url (text) — URL to artwork image (used for fullscreen viewer and textures)
   - artwork_type (text) — 'painting', 'sculpture', 'digital', 'installation'
   - position_x (float) — position in 3D space
   - position_y (float)
   - position_z (float)
   - rotation_y (float) — facing direction in 3D space
   - width (float) — physical width in 3D scene units
   - height (float) — physical height in 3D scene units
   - featured (boolean, default false) — show on landing page
   - created_at (timestamptz)

## Security
- RLS enabled on all three tables.
- All data is intentionally public (no-auth gallery). Policies use `TO anon, authenticated` 
  with `USING (true)` / `WITH CHECK (true)` because this is shared public content.
- No user_id columns — this is single-tenant public data.

## Notes
1. All tables use gen_random_uuid() for primary keys.
2. Foreign keys have ON DELETE SET NULL for artworks (deleting an artist/exhibition 
   shouldn't delete artworks).
3. Indexes added on foreign keys and frequently-filtered columns.
*/

CREATE TABLE IF NOT EXISTS artists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  bio text,
  nationality text,
  birth_year int,
  portrait_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS exhibitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  description text,
  room_identifier text UNIQUE NOT NULL,
  theme_color text DEFAULT '#c4a882',
  curator text,
  start_date date,
  end_date date,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS artworks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  artist_id uuid REFERENCES artists(id) ON DELETE SET NULL,
  exhibition_id uuid REFERENCES exhibitions(id) ON DELETE SET NULL,
  year int,
  medium text,
  dimensions text,
  description text,
  image_url text,
  artwork_type text DEFAULT 'painting',
  position_x float DEFAULT 0,
  position_y float DEFAULT 1.5,
  position_z float DEFAULT 0,
  rotation_y float DEFAULT 0,
  width float DEFAULT 2,
  height float DEFAULT 1.5,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_artworks_artist_id ON artworks(artist_id);
CREATE INDEX IF NOT EXISTS idx_artworks_exhibition_id ON artworks(exhibition_id);
CREATE INDEX IF NOT EXISTS idx_artworks_type ON artworks(artwork_type);
CREATE INDEX IF NOT EXISTS idx_artworks_featured ON artworks(featured);

-- Enable RLS on all tables
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;

-- Artists policies (public read, no write from frontend)
DROP POLICY IF EXISTS "public_read_artists" ON artists;
CREATE POLICY "public_read_artists" ON artists FOR SELECT
TO anon, authenticated USING (true);

-- Exhibitions policies (public read)
DROP POLICY IF EXISTS "public_read_exhibitions" ON exhibitions;
CREATE POLICY "public_read_exhibitions" ON exhibitions FOR SELECT
TO anon, authenticated USING (true);

-- Artworks policies (public read)
DROP POLICY IF EXISTS "public_read_artworks" ON artworks;
CREATE POLICY "public_read_artworks" ON artworks FOR SELECT
TO anon, authenticated USING (true);
