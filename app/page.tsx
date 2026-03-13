/**
 * Página principal - Landing page informativa
 * 
 * Secciones: Hero, About, Services, GalleryIntro (zoom), DynamicGallery (scattered), Testimonials (floating), Contact
 */

import { Hero } from '@/components/sections/hero';
import { Services } from '@/components/sections/services';
import { About } from '@/components/sections/about';
import { GalleryIntro } from '@/components/sections/gallery-intro';
import { DynamicGallery } from '@/components/sections/dynamic-gallery';
import { EnhancedTestimonials } from '@/components/sections/enhanced-testimonials';
import { HorizontalText } from '@/components/sections/horizontal-text';
import { EnhancedContact } from '@/components/sections/enhanced-contact';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ContentWrapper } from '@/components/sections/content-wrapper';
import { CursorTrail } from '@/components/ui/cursor-trail';
import { BackgroundElements } from '@/components/ui/background-elements';
import FluidBackground from '@/components/ui/fluid-background';

export default function HomePage() {
  return (
    <>
      {/* Fixed fluid ripple background — covers entire viewport, behind everything */}
      <div className="fixed inset-0 z-0">
        <FluidBackground />
      </div>
      <BackgroundElements />
      <CursorTrail />
      <Navbar />
      <main>
        <Hero />
        <ContentWrapper>
          <About />
          <Services />
        </ContentWrapper>
        <GalleryIntro />
        <DynamicGallery />
        <EnhancedTestimonials />
        <HorizontalText />
        <EnhancedContact />
      </main>
      <Footer />
    </>
  );
}
