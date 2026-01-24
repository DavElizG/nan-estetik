/**
 * Gallery Intro Section
 * 
 * Efecto zoom-in con contenido revelado detrás
 */

'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function GalleryIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const { innerHeight } = window;

    const ctx = gsap.context(() => {
      // Timeline para sincronizar zoom y reveal del contenido
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          start: 'top top',
          end: `+=${innerHeight * 1.3}`,
          scrub: true,
        },
      });

      // Zoom del texto
      tl.to(textRef.current, {
        scale: 100,
        opacity: 0,
      }, 0);

      // Reveal del contenido detrás
      tl.fromTo(contentRef.current, 
        {
          opacity: 0,
          scale: 0.8,
        },
        {
          opacity: 1,
          scale: 1,
        }, 
        0.3 // Empieza un poco después del zoom
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="h-screen relative flex items-center justify-center bg-white overflow-hidden"
    >
      {/* Contenido de galería detrás del zoom */}
      <div
        ref={contentRef}
        className="absolute inset-0 flex flex-col items-center justify-center px-4 opacity-0"
        style={{ zIndex: 1 }}
      >
        <h3 className="text-3xl md:text-4xl font-heading font-bold text-secondary-900 mb-4">
          Nuestros Resultados
        </h3>
        <div className="w-24 h-1 bg-primary-500 mx-auto mb-4" />
        <p className="text-base md:text-lg text-secondary-700 max-w-2xl text-center">
          Descubre las transformaciones de nuestros pacientes.
        </p>
      </div>

      {/* Texto que hace zoom */}
      <h2
        ref={textRef}
        className="relative text-xl font-heading font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-500 to-accent-rose"
        style={{ 
          transformOrigin: 'center center',
          zIndex: 2,
        }}
      >
        Galería
      </h2>
    </section>
  );
}
