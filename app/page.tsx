/**
 * Página principal - Landing page informativa
 * 
 * Esta página presenta la información del centro estético con:
 * - Smooth scrolling mediante Lenis
 * - Animaciones parallax con GSAP y ScrollTrigger
 * - Secciones: Hero, About (vertical parallax), Services (horizontal), Gallery (zoom reveal), Testimonials, Contacto
 */

import { Hero } from '@/components/sections/hero';
import { Services } from '@/components/sections/services';
import { About } from '@/components/sections/about';
import { GalleryIntro } from '@/components/sections/gallery-intro';
import { Testimonials } from '@/components/sections/testimonials';
import { Contact } from '@/components/sections/contact';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ContentWrapper } from '@/components/sections/content-wrapper';
import { CursorTrail } from '@/components/ui/cursor-trail';

export default function HomePage() {
  return (
    <>
      <CursorTrail />
      <Navbar />
      <main>
        <Hero />
        <ContentWrapper>
          <About />
          <Services />
        </ContentWrapper>
        <GalleryIntro />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
