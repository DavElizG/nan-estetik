/**
 * useScrollReveal - Hook para animaciones de reveal al hacer scroll
 * 
 * Detecta cuando elementos entran al viewport y ejecuta animaciones GSAP
 */

'use client';

import { useEffect, RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollRevealOptions {
  trigger: RefObject<HTMLElement>;
  targets?: string | RefObject<HTMLElement> | HTMLElement[];
  animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale' | 'clip' | 'custom';
  stagger?: number;
  duration?: number;
  ease?: string;
  start?: string;
  customAnimation?: () => gsap.core.Timeline | gsap.core.Tween;
}

export function useScrollReveal({
  trigger,
  targets,
  animation = 'fade-up',
  stagger = 0.1,
  duration = 0.8,
  ease = 'power3.out',
  start = 'top 80%',
  customAnimation,
}: ScrollRevealOptions) {
  useEffect(() => {
    const triggerEl = trigger.current;
    if (!triggerEl) return;

    let animTargets: string | HTMLElement | HTMLElement[];
    
    if (typeof targets === 'string') {
      animTargets = targets;
    } else if (targets && 'current' in targets) {
      animTargets = targets.current as HTMLElement;
    } else if (Array.isArray(targets)) {
      animTargets = targets;
    } else {
      animTargets = triggerEl;
    }

    const ctx = gsap.context(() => {
      if (customAnimation) {
        const anim = customAnimation();
        ScrollTrigger.create({
          trigger: triggerEl,
          start,
          animation: anim as gsap.core.Animation,
          once: true,
        });
        return;
      }

      let fromVars: gsap.TweenVars = {};
      
      switch (animation) {
        case 'fade-up':
          fromVars = { y: 60, opacity: 0 };
          break;
        case 'fade-down':
          fromVars = { y: -60, opacity: 0 };
          break;
        case 'fade-left':
          fromVars = { x: 60, opacity: 0 };
          break;
        case 'fade-right':
          fromVars = { x: -60, opacity: 0 };
          break;
        case 'scale':
          fromVars = { scale: 0.8, opacity: 0 };
          break;
        case 'clip':
          fromVars = { clipPath: 'inset(0 100% 0 0)', opacity: 0 };
          break;
      }

      gsap.from(animTargets, {
        ...fromVars,
        duration,
        ease,
        stagger,
        scrollTrigger: {
          trigger: triggerEl,
          start,
          once: true,
        },
      });
    }, triggerEl);

    return () => ctx.revert();
  }, [trigger, targets, animation, stagger, duration, ease, start, customAnimation]);
}
