/**
 * BackgroundElements - Elementos decorativos flotantes
 * 
 * Círculos y formas geométricas doradas sutiles que flotan
 * en el fondo para dar más identidad visual
 */

'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function BackgroundElements() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip animations on mobile for performance
    if (window.matchMedia('(max-width: 768px)').matches) return;

    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll('.float-element');

    elements.forEach((el, i) => {
      const tl = gsap.timeline({ repeat: -1, yoyo: true });
      
      tl.to(el, {
        y: gsap.utils.random(-30, 30),
        x: gsap.utils.random(-20, 20),
        rotation: gsap.utils.random(-15, 15),
        duration: gsap.utils.random(4, 7),
        ease: 'sine.inOut',
        delay: i * 0.2,
      });

      // Pulsación suave de opacidad
      gsap.to(el, {
        opacity: gsap.utils.random(0.3, 0.6),
        duration: gsap.utils.random(2, 4),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.3,
      });
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden hidden md:block"
      aria-hidden="true"
    >
      {/* Círculos grandes sutiles */}
      <div
        className="float-element absolute"
        style={{
          top: '10%',
          right: '5%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          border: '1px solid rgba(212,175,55,0.15)',
          opacity: 0.4,
        }}
      />
      <div
        className="float-element absolute"
        style={{
          bottom: '20%',
          left: '8%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          border: '1px solid rgba(212,175,55,0.12)',
          opacity: 0.3,
        }}
      />

      {/* Círculos pequeños con relleno */}
      <div
        className="float-element absolute"
        style={{
          top: '30%',
          left: '15%',
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,175,55,0.2), transparent)',
          opacity: 0.5,
        }}
      />
      <div
        className="float-element absolute"
        style={{
          top: '60%',
          right: '20%',
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,175,55,0.15), transparent)',
          opacity: 0.4,
        }}
      />

      {/* Líneas decorativas */}
      <div
        className="float-element absolute"
        style={{
          top: '25%',
          right: '30%',
          width: 120,
          height: 1,
          background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.3), transparent)',
          opacity: 0.5,
        }}
      />
      <div
        className="float-element absolute"
        style={{
          bottom: '40%',
          left: '25%',
          width: 1,
          height: 100,
          background: 'linear-gradient(to bottom, transparent, rgba(212,175,55,0.25), transparent)',
          opacity: 0.4,
        }}
      />

      {/* Formas geométricas pequeñas */}
      <div
        className="float-element absolute"
        style={{
          top: '50%',
          left: '5%',
          width: 40,
          height: 40,
          border: '1px solid rgba(212,175,55,0.2)',
          transform: 'rotate(45deg)',
          opacity: 0.3,
        }}
      />
      <div
        className="float-element absolute"
        style={{
          bottom: '15%',
          right: '10%',
          width: 30,
          height: 30,
          border: '1px solid rgba(212,175,55,0.18)',
          transform: 'rotate(30deg)',
          opacity: 0.35,
        }}
      />

      {/* Resplandor ambiental sutil */}
      <div
        className="float-element absolute"
        style={{
          top: '15%',
          left: '50%',
          width: 400,
          height: 400,
          marginLeft: -200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,175,55,0.08), transparent 70%)',
          opacity: 0.4,
          filter: 'blur(40px)',
        }}
      />
    </div>
  );
}
