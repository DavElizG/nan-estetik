/**
 * Página principal - Landing page informativa
 * 
 * Esta página presenta la información del centro estético con:
 * - Smooth scrolling mediante Lenis
 * - Animaciones con GSAP y ScrollTrigger
 * - Secciones: Hero, Servicios, Galería, Contacto
 */

import { Hero } from '@/components/sections/hero';
import { Services } from '@/components/sections/services';
import { About } from '@/components/sections/about';
import { Gallery } from '@/components/sections/gallery';
import { Contact } from '@/components/sections/contact';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
