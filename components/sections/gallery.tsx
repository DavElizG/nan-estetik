/**
 * Gallery Section
 * 
 * Galería con efecto zoom integrado:
 * - Zoom text reveal que transiciona a la galería
 * - Grid masonry responsive
 * - Parallax de profundidad en imágenes
 * - Todo en una sola sección fluida
 */

'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const zoomTextRef = useRef<HTMLDivElement>(null);
  const galleryContentRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      const { innerHeight } = window;

      // Zoom-in effect: el texto hace zoom y revela la galería
      const zoomTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          start: 'top top',
          end: () => `+=${innerHeight * 2.5}`,
          scrub: 2,
        },
      });

      // Zoom del texto
      zoomTimeline.to(zoomTextRef.current, {
        scale: 80,
        opacity: 0,
        duration: 1,
        ease: 'power2.in',
      });

      // Revelar galería mientras el texto desaparece
      zoomTimeline.fromTo(
        galleryContentRef.current,
        {
          opacity: 0,
          scale: 0.8,
          y: 100,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
        },
        '-=0.3'
      );

      // Parallax de profundidad para cada item de galería
      const items = galleryRef.current?.children;
      if (items) {
        Array.from(items).forEach((item, index) => {
          const speed = (index % 3) * 0.1 - 0.1;
          
          gsap.to(item, {
            yPercent: speed * 20,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.5,
            },
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Placeholder images - reemplazar con imágenes reales
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
      className="min-h-screen bg-white relative overflow-hidden"
    >
      {/* Texto con zoom - Visible inicialmente */}
      <div 
        ref={zoomTextRef}
        className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
        style={{ transformOrigin: 'center center' }}
      >
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-heading font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-500 to-accent-rose">
          Galería
        </h2>
      </div>

      {/* Contenido de la galería - Se revela con el zoom */}
      <div 
        ref={galleryContentRef}
        className="min-h-screen flex flex-col justify-center py-20"
        style={{ opacity: 0 }}
      >
        <div className="container-custom">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-secondary-900 mb-4">
              Nuestros Resultados
            </h3>
            <div className="w-24 h-1 bg-primary-500 mx-auto mb-6" />
            <p className="text-lg text-secondary-700 max-w-2xl mx-auto">
              Descubre las transformaciones de nuestros pacientes y la calidad de
              nuestros tratamientos.
            </p>
          </div>

          <div
            ref={galleryRef}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
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
                {/* Placeholder gradient */}
                <div className="aspect-square w-full bg-gradient-to-br from-primary-200 via-primary-300 to-accent-rose group-hover:scale-110 transition-transform duration-500" />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    Ver detalles
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
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
    </section>
  );
}
