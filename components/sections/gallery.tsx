/**
 * Gallery Section
 * 
 * Galería de trabajos con:
 * - Grid masonry responsive
 * - Lightbox para imágenes
 * - Animaciones con ScrollTrigger
 */

'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(galleryRef.current?.children || [], {
        scrollTrigger: {
          trigger: galleryRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.2)',
      });
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
      className="py-20 md:py-32 bg-secondary-50"
    >
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-secondary-900 mb-6">
            Galería de Resultados
          </h2>
          <div className="w-24 h-1 bg-primary-500 mx-auto mb-8" />
          <p className="text-lg md:text-xl text-secondary-700 max-w-3xl mx-auto">
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
    </section>
  );
}
