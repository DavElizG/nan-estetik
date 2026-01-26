/**
 * Gallery Section
 * 
 * Efecto zoom-in que revela la galería completa
 */

'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function GalleryIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const { innerHeight } = window;

    const ctx = gsap.context(() => {
      // Timeline para sincronizar zoom y reveal - IGUAL que commit original
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          start: 'top top',
          end: `+=${innerHeight * 1.3}`,
          scrub: true,
        },
      });

      // Zoom del texto - scale 100 como el original
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
        0.3
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Placeholder images
  const galleryItems = [
    { id: 1, aspect: 'tall' },
    { id: 2, aspect: 'wide' },
    { id: 3, aspect: 'square' },
    { id: 4, aspect: 'square' },
    { id: 5, aspect: 'tall' },
    { id: 6, aspect: 'wide' },
  ];

  return (
    <section
      id="galeria"
      ref={sectionRef}
      className="h-screen relative flex items-center justify-center bg-secondary-900 overflow-hidden"
    >
      {/* Contenido completo de galería detrás del zoom */}
      <div
        ref={contentRef}
        className="absolute inset-0 flex flex-col items-center justify-start px-4 pt-24 pb-12 opacity-0 overflow-y-auto bg-white"
        style={{ zIndex: 1 }}
      >
        <div className="container-custom w-full">
          {/* Título */}
          <div className="text-center mb-8">
            <h3 className="text-3xl md:text-5xl font-heading font-bold text-secondary-900 mb-4">
              Nuestros Resultados
            </h3>
            <div className="w-24 h-1 bg-primary-500 mx-auto mb-4" />
            <p className="text-base md:text-lg text-secondary-600 max-w-2xl mx-auto">
              Descubre las transformaciones de nuestros pacientes.
            </p>
          </div>

          {/* Grid de galería */}
          <div
            ref={galleryRef}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8"
          >
            {galleryItems.map((item) => (
              <div
                key={item.id}
                className={`
                  relative overflow-hidden rounded-xl cursor-pointer group
                  ${item.aspect === 'tall' ? 'row-span-2' : ''}
                  ${item.aspect === 'wide' ? 'col-span-2' : ''}
                `}
              >
                <div className="aspect-square w-full bg-gradient-to-br from-secondary-200 via-secondary-300 to-primary-200 group-hover:scale-110 transition-transform duration-500" />
                
                <div className="absolute inset-0 bg-secondary-900/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    Ver detalles
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-secondary-600 mb-4">
              ¿Quieres ver más resultados?
            </p>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Visita nuestro Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Texto estilo Lenis - múltiples líneas con zoom */}
      <div
        ref={textRef}
        className="relative flex flex-col items-center justify-center text-center leading-none"
        style={{ 
          transformOrigin: 'center center',
          zIndex: 2,
        }}
      >
        <span className="text-xs uppercase tracking-[0.3em] text-secondary-400 mb-2">
          Descubre
        </span>
        <span className="text-3xl md:text-4xl font-heading font-bold text-white">
          Tu Belleza,
        </span>
        <span className="text-4xl md:text-5xl font-heading font-black text-primary-500">
          Nuestro Arte
        </span>
        <span className="text-xs uppercase tracking-[0.3em] text-secondary-400 mt-2">
          Ver Resultados
        </span>
      </div>
    </section>
  );
}
