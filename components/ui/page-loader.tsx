'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface PageLoaderProps {
  isLoading: boolean;
}

export function PageLoader({ isLoading }: PageLoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const hasAnimatedOut = useRef(false);

  // Intro animation
  useEffect(() => {
    const tl = gsap.timeline();
    tl.from('.loader-brand', {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
    });
    tl.from('.loader-bar-fill', {
      scaleX: 0,
      duration: 1.2,
      ease: 'power2.inOut',
    }, '-=0.3');
  }, []);

  // Dismiss animation
  useEffect(() => {
    if (!isLoading && !hasAnimatedOut.current) {
      hasAnimatedOut.current = true;
      const el = loaderRef.current;
      if (!el) return;

      gsap.to('.loader-bar-fill', {
        scaleX: 1,
        duration: 0.3,
        ease: 'power1.in',
        onComplete: () => {
          gsap.to(el, {
            yPercent: -100,
            duration: 0.8,
            ease: 'power3.inOut',
            onComplete: () => {
              el.style.display = 'none';
              document.body.style.overflow = '';
            },
          });
        },
      });
    }
  }, [isLoading]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-secondary-950"
    >
      <h1 className="loader-brand font-heading text-4xl md:text-6xl text-primary-500 tracking-[0.2em]">
        NAN ESTETIK
      </h1>
      <div className="mt-8 w-48 h-[1px] bg-secondary-800 overflow-hidden">
        <div className="loader-bar-fill w-full h-full bg-primary-500 origin-left" />
      </div>
    </div>
  );
}
