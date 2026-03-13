import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { ScrollProgress } from '@/components/ui/scroll-progress';

/**
 * Configuración de fuentes
 * Inter: Fuente sans-serif moderna para textos
 * Playfair Display: Fuente serif elegante para títulos
 */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '700', '900'],
});

/**
 * Metadata de la aplicación
 * Optimizado para SEO
 */
export const metadata: Metadata = {
  title: {
    default: 'Nan Estetik - Centro de Estética Avanzada',
    template: '%s | Nan Estetik',
  },
  description:
    'Centro de estética especializado en tratamientos faciales, corporales y rejuvenecimiento. Tecnología de vanguardia y profesionales certificados.',
  keywords: [
    'estética',
    'tratamientos faciales',
    'rejuvenecimiento',
    'botox',
    'rellenos',
    'centro estético',
  ],
  authors: [{ name: 'DavElizG' }],
  creator: 'DavElizG',
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    siteName: 'Nan Estetik',
    title: 'Nan Estetik - Centro de Estética Avanzada',
    description:
      'Centro de estética especializado en tratamientos faciales, corporales y rejuvenecimiento.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * Layout raíz de la aplicación
 * Incluye providers y configuración global
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <Providers>
          <ScrollProgress />
          {children}
        </Providers>
      </body>
    </html>
  );
}
