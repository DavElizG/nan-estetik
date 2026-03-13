/**
 * Gallery Intro Section
 *
 * Transición tipo zoom ("Tu Belleza, Nuestro Arte")
 * Hilos dorados animados en espaciador
 * Zoom centra en texto blanco → fondo transiciona black→cream → galería
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

const CREAM = '#fdfbf3';
const WHITE = '#ffffff';

gsap.registerPlugin(ScrollTrigger);

export function GalleryIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
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
          scrub: 0.3,
          invalidateOnRefresh: true,
        },
      });

      // 1) Zoom — transformOrigin apunta a la "B" de "Belleza"
      tl.to(textRef.current, {
        scale: 900,
        duration: 1,
        ease: 'power2.in',
      }, 0);

      // 2) Fondo pasa a blanco puro desde el inicio del zoom
      //    Así los huecos internos de la "B" y el campo de abajo se ven blancos
      tl.to(sectionRef.current, {
        backgroundColor: WHITE,
        duration: 0.3,
        ease: 'none',
      }, 0.05);

      // 3) Todo el texto se vuelve blanco para fundirse con el fondo
      tl.to(textRef.current, {
        color: '#ffffff',
        duration: 0.2,
      }, 0.25);

      // 4) Texto desaparece y fondo pasa de blanco a cream — empalma con la galería
      tl.to(textRef.current, {
        opacity: 0,
        duration: 0.1,
      }, 0.55);

      tl.to(sectionRef.current, {
        backgroundColor: CREAM,
        duration: 0.15,
      }, 0.6);

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
          style={{ zIndex: 10, transformOrigin: '46% 30%' }}
        >
          <span className="text-[8px] uppercase tracking-[0.4em] text-secondary-500 mb-4">
            Descubre
          </span>
          <span className="font-heading font-bold text-white tracking-wide" style={{ fontSize: 'clamp(2rem, 5vw, 5rem)' }}>
            Tu Belleza,
          </span>
          <span className="font-heading font-black text-primary-500 mt-2" style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)' }}>
            Nuestro Arte
          </span>
          <span className="text-[8px] uppercase tracking-[0.4em] text-secondary-500 mt-4">
            Ver Resultados
          </span>
        </div>
      </section>
    </>
  );
}
