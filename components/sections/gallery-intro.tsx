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
  const textRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const { innerHeight } = window;

    const ctx = gsap.context(() => {
      // Timeline parallax (mismo patrón que about.tsx)
      const timeline = gsap.timeline({ paused: true });
      
      // Zoom del texto - reducido para mejor rendimiento
      timeline.to(textRef.current, {
        scale: 30,
        opacity: 0,
        ease: 'none',
      }, 0);

      // Reveal del contenido detrás
      timeline.fromTo(contentRef.current, 
        {
          opacity: 0,
          scale: 0.95,
        },
        {
          opacity: 1,
          scale: 1,
          ease: 'none',
        }, 
        0.4
      );

      // ScrollTrigger separado - optimizado para fluidez
      ScrollTrigger.create({
        animation: timeline,
        trigger: sectionRef.current,
        pin: true,
        start: 'top top',
        end: `+=${innerHeight * 3}`,
        scrub: 0.3, // Más responsive
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });
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
      className="h-screen relative flex items-center justify-center bg-white overflow-hidden"
    >
      {/* Contenido completo de galería detrás del zoom */}
      <div
        ref={contentRef}
        className="absolute inset-0 flex flex-col items-center justify-start px-4 py-12 opacity-0 overflow-y-auto"
        style={{ zIndex: 1 }}
      >
        <div className="container-custom w-full">
          {/* Título */}
          <div className="text-center mb-8">
            <h3 className="text-3xl md:text-4xl font-heading font-bold text-secondary-900 mb-4">
              Nuestros Resultados
            </h3>
            <div className="w-24 h-1 bg-primary-500 mx-auto mb-4" />
            <p className="text-base md:text-lg text-secondary-700 max-w-2xl mx-auto">
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
                <div className="aspect-square w-full bg-gradient-to-br from-primary-200 via-primary-300 to-accent-rose group-hover:scale-110 transition-transform duration-500" />
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
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

      {/* Texto que hace zoom - optimizado para GPU */}
      <h2
        ref={textRef}
        className="relative text-6xl md:text-8xl lg:text-9xl font-heading font-black text-center text-primary-500"
        style={{ 
          transformOrigin: 'center center',
          zIndex: 2,
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden',
        }}
      >
        Galería
      </h2>
    </section>
  );
}
