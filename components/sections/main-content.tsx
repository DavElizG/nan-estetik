'use client';

import { useEffect, useState } from 'react';
import { Hero } from '@/components/sections/hero';
import { Services } from '@/components/sections/services';
import { About } from '@/components/sections/about';
import { GalleryIntro } from '@/components/sections/gallery-intro';
import { DynamicGallery } from '@/components/sections/dynamic-gallery';
import { EnhancedTestimonials } from '@/components/sections/enhanced-testimonials';
import { HorizontalText } from '@/components/sections/horizontal-text';
import { EnhancedContact } from '@/components/sections/enhanced-contact';
import { ContentWrapper } from '@/components/sections/content-wrapper';
import { CursorTrail } from '@/components/ui/cursor-trail';
import { BackgroundElements } from '@/components/ui/background-elements';
import { PageLoader } from '@/components/ui/page-loader';

interface MediaItem {
  url: string;
}

export function MainContent() {
  const [galleryImages, setGalleryImages] = useState<MediaItem[]>([]);
  const [galleryVideos, setGalleryVideos] = useState<MediaItem[]>([]);
  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    // Prevent scrolling while loader is visible
    document.body.style.overflow = 'hidden';

    async function loadData() {
      const [imgRes, vidRes] = await Promise.all([
        fetch('/api/gallery').then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/gallery?type=video').then(r => r.json()).catch(() => ({ data: [] })),
      ]);

      setGalleryImages(imgRes.data || []);
      setGalleryVideos(vidRes.data || []);
      setDataReady(true);
    }

    loadData();
  }, []);

  return (
    <>
      <PageLoader isLoading={!dataReady} />
      <BackgroundElements />
      <CursorTrail />
      {dataReady && (
        <main>
          <Hero />
          <ContentWrapper>
            <About />
            <Services />
          </ContentWrapper>
          <GalleryIntro />
          <DynamicGallery images={galleryImages} videos={galleryVideos} />
          <EnhancedTestimonials />
          <HorizontalText />
          <EnhancedContact />
        </main>
      )}
    </>
  );
}
