/**
 * Hero Section
 * 
 * Sección principal con:
 * - Parallax en múltiples capas
 * - Título y CTA principal
 * - Animaciones avanzadas con GSAP
 */

'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animaciones de entrada
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

      // Parallax en el background al hacer scroll
      gsap.to(bgRef.current, {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Parallax en el overlay
      gsap.to(overlayRef.current, {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Parallax del contenido (se mueve más rápido que el fondo)
      // Solo se aplica cuando se hace scroll hacia abajo
      const contentTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      contentTl.to([titleRef.current, subtitleRef.current, ctaRef.current], {
        yPercent: 50,
        opacity: 0,
        ease: 'none',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="inicio"
      ref={heroRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background con parallax - elegante negro con degradado dorado sutil */}
      <div 
        ref={bgRef}
        className="absolute inset-0 bg-black z-0 will-change-transform"
        style={{ height: '120vh', top: '-10vh' }}
      >
        {/* Overlay con detalles dorados sutiles */}
        <div 
          ref={overlayRef}
          className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-primary-500/10 will-change-transform" 
        />
      </div>

      {/* Contenido con parallax - capa más rápida */}
      <div className="relative z-10 container-custom text-center text-white px-4">
        <h1
          ref={titleRef}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-4 md:mb-6"
        >
          <span className="text-primary-500">Nan</span> Estetik
        </h1>
        <p
          ref={subtitleRef}
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-6 md:mb-8 max-w-3xl mx-auto text-white/90"
        >
          Realza tu belleza natural con nuestros tratamientos especializados
        </p>
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
          <a href="#servicios" className="btn bg-primary-500 text-secondary-900 hover:bg-primary-400 font-semibold">
            Ver Servicios
          </a>
          <a href="#contacto" className="btn border-2 border-white text-white hover:bg-white/10">
            Agendar Cita
          </a>
        </div>
      </div>

      {/* Indicador de scroll */}
      <a
        href="#nosotros"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white animate-bounce z-10"
        aria-label="Scroll down"
      >
        <ChevronDown size={32} />
      </a>
    </section>
  );
}
