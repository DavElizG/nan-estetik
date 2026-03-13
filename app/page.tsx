/**
 * Página principal - Landing page informativa
 *
 * Secciones: Hero, About, Services, GalleryIntro (zoom), DynamicGallery (scattered), Testimonials (floating), Contact
 * MainContent maneja el preloader y la carga de datos de la galería.
 */

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { MainContent } from '@/components/sections/main-content';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <MainContent />
      <Footer />
    </>
  );
}
