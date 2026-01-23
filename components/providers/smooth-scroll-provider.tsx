/**
 * Smooth Scroll Provider
 * 
 * Implementa Lenis para un scroll suave característico
 * Integración con GSAP ScrollTrigger para animaciones sincronizadas
 * 
 * Características:
 * - Scroll suave y fluido
 * - Sincronización con ScrollTrigger de GSAP
 * - Performance optimizado
 */

'use client';

import { ReactNode, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registrar plugin de GSAP
if (typeof globalThis.window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface SmoothScrollProviderProps {
  readonly children: ReactNode;
}

export function SmoothScrollProvider({ children }: Readonly<SmoothScrollProviderProps>) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Inicializar Lenis con configuración personalizada
    const lenis = new Lenis({
      duration: 1.2, // Duración de la animación de scroll
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Función de easing suave
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Función de animación para sincronizar con GSAP
    function raf(time: number) {
      lenis.raf(time);
      ScrollTrigger.update();
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Actualizar ScrollTrigger cuando Lenis hace scroll
    lenis.on('scroll', ScrollTrigger.update);

    // Cleanup
    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return <>{children}</>;
}

/**
 * Hook personalizado para usar Lenis en componentes
 */
export function useLenis() {
  return useRef<Lenis | null>(null);
}
