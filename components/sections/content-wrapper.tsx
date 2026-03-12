/**
 * Content Wrapper - Modelo 3D extendido a través de About y Services
 * 
 * Este wrapper permite que el modelo 3D (GoldenFlower3D) sea sticky
 * a través de las secciones About y Services, desapareciendo antes de Gallery
 */

'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';

gsap.registerPlugin(ScrollTrigger);

// Importar GoldenFlower3D dinámicamente para evitar SSR issues
const GoldenFlower3D = dynamic(
  () => import('@/components/3d/GoldenFlower3D').then((mod) => mod.GoldenFlower3D),
  { ssr: false, loading: () => <div className="w-full h-full bg-transparent" /> }
);

interface ContentWrapperProps {
  children: React.ReactNode;
}

export function ContentWrapper({ children }: ContentWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const flowerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Desvanecer el modelo 3D al llegar al final del wrapper
      if (flowerContainerRef.current) {
        gsap.to(flowerContainerRef.current, {
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'bottom-=300 bottom',
            end: 'bottom bottom',
            scrub: true,
          },
          opacity: 0,
          scale: 0.8,
          ease: 'power2.out',
        });
      }
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="relative bg-black">
      {/* ============================================ */}
      {/* FLOR DORADA 3D STICKY - DETRÁS DEL CONTENIDO */}
      {/* ============================================ */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div 
          ref={flowerContainerRef}
          className="sticky top-0 h-screen w-full pointer-events-none flex items-center justify-center"
        >
          {/* Glow de fondo para la flor */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-primary-500/10 rounded-full blur-3xl" />
            <div className="absolute w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 bg-white/5 rounded-full blur-3xl" />
          </div>
          
          {/* Canvas de Three.js - Golden Flower 3D */}
          <div className="relative w-[350px] h-[350px] md:w-[450px] md:h-[450px] lg:w-[550px] lg:h-[550px]">
            <GoldenFlower3D scrollContainerRef={wrapperRef} />
          </div>
        </div>
      </div>

      {/* Contenido (About + Services) - encima del modelo 3D */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
