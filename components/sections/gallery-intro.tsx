/**
 * Gallery Intro Section
 * 
 * Transición tipo zoom ("Tu Belleza, Nuestro Arte")
 * Hilos dorados animados en espaciador
 * Solo zoom + transición a blanco — la galería está en DynamicGallery
 */

'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Genera un path SVG con ola viajera
function wavePathD(
  width: number, baseY: number, amplitude: number,
  frequency: number, phase: number, segments = 60
): string {
  let d = '';
  for (let i = 0; i <= segments; i++) {
    const x = (i / segments) * width;
    const y = baseY + amplitude * Math.sin((i / segments) * Math.PI * 2 * frequency + phase);
    d += i === 0 ? `M${x.toFixed(1)},${y.toFixed(1)}` : ` L${x.toFixed(1)},${y.toFixed(1)}`;
  }
  return d;
}

const SPACER_THREADS = [
  { baseY: 100, amp: 12, freq: 3, speed: 0.5, sw: '0.5' },
  { baseY: 200, amp: 16, freq: 2.5, speed: -0.35, sw: '1' },
  { baseY: 300, amp: 10, freq: 3.5, speed: 0.45, sw: '0.5' },
];

gsap.registerPlugin(ScrollTrigger);

export function GalleryIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const spacerSvgRef = useRef<SVGSVGElement>(null);

  // Zoom timeline
  useEffect(() => {
    if (globalThis.window === undefined) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.refresh();

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          start: 'top top',
          end: '+=3000',
          scrub: 0.2,
          invalidateOnRefresh: true,
        },
      });

      tl.to(textRef.current, {
        scale: 80,
        duration: 0.8,
        ease: 'power2.inOut',
      }, 0);

      tl.to(textRef.current, {
        opacity: 0,
        duration: 0.15,
      }, 0.75);

      tl.fromTo(contentRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.15 },
        0.85
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Animated wave threads
  useEffect(() => {
    if (!spacerSvgRef.current) return;
    let rafId: number;
    const paths = spacerSvgRef.current.querySelectorAll('path');

    const animate = (time: number) => {
      const t = time * 0.001;
      paths.forEach((path, i) => {
        const cfg = SPACER_THREADS[i];
        if (!cfg) return;
        path.setAttribute('d', wavePathD(1440, cfg.baseY, cfg.amp, cfg.freq, t * cfg.speed));
      });
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <>
      {/* Espaciador con hilos dorados */}
      <div className="h-[50vh] bg-black relative overflow-hidden z-30">
        <svg ref={spacerSvgRef} className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1440 400">
          {SPACER_THREADS.map((cfg) => (
            <path key={`thread-${cfg.baseY}`} fill="none" stroke="#d4af37" strokeWidth={cfg.sw} />
          ))}
        </svg>
      </div>

      {/* Zoom section */}
      <section
        id="galeria"
        ref={sectionRef}
        className="h-screen relative flex items-center justify-center bg-black overflow-hidden z-30"
      >
        <div
          ref={textRef}
          className="relative flex flex-col items-center justify-center text-center leading-none"
          style={{ zIndex: 10, transformOrigin: 'center center' }}
        >
          <span className="text-[8px] uppercase tracking-[0.4em] text-secondary-500 mb-4">
            Descubre
          </span>
          <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white tracking-wide">
            Tu Belleza,
          </span>
          <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black text-primary-500 mt-2">
            Nuestro Arte
          </span>
          <span className="text-[8px] uppercase tracking-[0.4em] text-secondary-500 mt-4">
            Ver Resultados
          </span>
        </div>

        {/* White overlay for transition */}
        <div
          ref={contentRef}
          className="absolute inset-0 opacity-0 bg-cream-50"
          style={{ zIndex: 30 }}
        />
      </section>
    </>
  );
}
