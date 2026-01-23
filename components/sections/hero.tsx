/**
 * Hero Section
 * 
 * Sección principal con:
 * - Video o imagen de fondo
 * - Título y CTA principal
 * - Animaciones con GSAP
 */

'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ChevronDown } from 'lucide-react';

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animaciones de entrada con GSAP
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1,
        delay: 0.5,
      })
        .from(
          subtitleRef.current,
          {
            y: 50,
            opacity: 0,
            duration: 0.8,
          },
          '-=0.5'
        )
        .from(
          ctaRef.current,
          {
            y: 30,
            opacity: 0,
            duration: 0.6,
          },
          '-=0.4'
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="inicio"
      ref={heroRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-accent-rose z-0">
        {/* Overlay oscuro para mejorar legibilidad */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 container-custom text-center text-white">
        <h1
          ref={titleRef}
          className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-6"
        >
          Nan Estetik
        </h1>
        <p
          ref={subtitleRef}
          className="text-xl md:text-2xl lg:text-3xl mb-8 max-w-3xl mx-auto text-white/90"
        >
          Realza tu belleza natural con nuestros tratamientos especializados
        </p>
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#servicios" className="btn-primary bg-white text-primary-600 hover:bg-white/90">
            Ver Servicios
          </a>
          <a href="#contacto" className="btn-outline border-white text-white hover:bg-white/10">
            Agendar Cita
          </a>
        </div>
      </div>

      {/* Indicador de scroll */}
      <a
        href="#nosotros"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white animate-bounce"
        aria-label="Scroll down"
      >
        <ChevronDown size={32} />
      </a>
    </section>
  );
}
