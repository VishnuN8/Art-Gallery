import './globals.css';
import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import { GalleryProvider } from '@/lib/gallery-context';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://aether-gallery.vercel.app'),
  title: 'AETHER — Contemporary Art Gallery',
  description:
    'An immersive 3D contemporary art gallery. Explore paintings, sculptures, and digital installations in a cinematic digital museum experience.',
  openGraph: {
    title: 'AETHER — Contemporary Art Gallery',
    description:
      'An immersive 3D contemporary art gallery experience. Explore curated exhibitions in a cinematic digital museum.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body
        className="font-sans antialiased"
        style={{
          backgroundColor: 'hsl(30 8% 7%)',
        }}
      >
        <GalleryProvider>{children}</GalleryProvider>
      </body>
    </html>
  );
}
