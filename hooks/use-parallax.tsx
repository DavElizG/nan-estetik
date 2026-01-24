/**
 * useParallax Hook
 * 
 * Hook personalizado para crear efectos parallax con GSAP
 * Soporta parallax vertical, horizontal y efectos de profundidad
 */

'use client';

import { useEffect, RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxOptions {
  speed?: number;
  direction?: 'vertical' | 'horizontal';
  start?: string;
  end?: string;
  scrub?: boolean | number;
  scale?: boolean;
  rotate?: boolean;
}

export function useParallax(
  ref: RefObject<HTMLElement>,
  options: ParallaxOptions = {}
) {
  const {
    speed = 1,
    direction = 'vertical',
    start = 'top bottom',
    end = 'bottom top',
    scrub = true,
    scale = false,
    rotate = false,
  } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      const animation: any = {};

      // Configurar movimiento parallax
      if (direction === 'vertical') {
        animation.y = `${speed * 100}%`;
      } else {
        animation.x = `${speed * 100}%`;
      }

      // Agregar escala si está habilitada
      if (scale) {
        animation.scale = 1 + speed * 0.2;
      }

      // Agregar rotación si está habilitada
      if (rotate) {
        animation.rotation = speed * 10;
      }

      gsap.to(element, {
        ...animation,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start,
          end,
          scrub,
          invalidateOnRefresh: true,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [ref, speed, direction, start, end, scrub, scale, rotate]);
}

export function useParallaxScroll(
  triggerRef: RefObject<HTMLElement | null>,
  targetRef: RefObject<HTMLElement | null>,
  options: ParallaxOptions = {}
) {
  const {
    speed = 0.5,
    direction = 'vertical',
    start = 'top bottom',
    end = 'bottom top',
    scrub = true,
  } = options;

  useEffect(() => {
    const trigger = triggerRef.current;
    const target = targetRef.current;
    if (!trigger || !target) return;

    const ctx = gsap.context(() => {
      const animation: any = {
        ease: 'none',
      };

      if (direction === 'vertical') {
        animation.y = `${speed * 100}vh`;
      } else {
        animation.x = `${speed * 100}vw`;
      }

      gsap.fromTo(
        target,
        direction === 'vertical' ? { y: 0 } : { x: 0 },
        {
          ...animation,
          scrollTrigger: {
            trigger,
            start,
            end,
            scrub,
            invalidateOnRefresh: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [triggerRef, targetRef, speed, direction, start, end, scrub]);
}
