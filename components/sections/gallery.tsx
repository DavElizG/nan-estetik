/**
 * Gallery Section
 * 
 * Galería con animación de entrada simple y efectiva
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
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // Animación de entrada para items de galería - scrub
      const items = galleryRef.current?.children;
      if (items) {
        gsap.from(items, {
          scrollTrigger: {
            trigger: galleryRef.current,
            start: 'top 85%',
            end: 'top 40%',
            scrub: true,
          },
          scale: 0.9,
          opacity: 0,
          stagger: 0.05,
        });

        // Parallax suave
        Array.from(items).forEach((item, index) => {
          const speed = (index % 3) * 0.05 - 0.05;
          
          gsap.to(item, {
            yPercent: speed * 20,
            ease: 'none',
            scrollTrigger: {
              trigger: galleryRef.current,
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
      className="py-12 md:py-16 bg-white relative overflow-hidden"
    >
      <div className="container-custom">

        {/* Grid de galería */}
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
              <div className="aspect-square w-full bg-gradient-to-br from-primary-200 via-primary-300 to-accent-rose group-hover:scale-110 transition-transform duration-500" />
              
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
