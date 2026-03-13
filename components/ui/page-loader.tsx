'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface PageLoaderProps {
  isLoading: boolean;
}

export function PageLoader({ isLoading }: PageLoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const hasAnimatedOut = useRef(false);
  const counterObj = useRef({ value: 0 });
  const [count, setCount] = useState(0);

  // Intro animations
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Stagger brand letters
    tl.from('.loader-letter', {
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.04,
    });

    // Tagline fade
    tl.from('.loader-tagline', {
      opacity: 0,
      y: 10,
      duration: 0.6,
    }, '-=0.3');

    // Corner accents
    tl.from('.loader-corner', {
      scaleX: 0,
      scaleY: 0,
      duration: 0.5,
    }, '-=0.5');

    // Line extends
    tl.from('.loader-line', {
      scaleX: 0,
      duration: 0.8,
      ease: 'power2.inOut',
    }, '-=0.4');

    // Counter starts
    tl.to(counterObj.current, {
      value: 40,
      duration: 1.2,
      ease: 'power1.inOut',
      onUpdate: () => setCount(Math.round(counterObj.current.value)),
    }, '-=0.6');
  }, []);

  // Progress counter reacts to loading
  useEffect(() => {
    if (!isLoading) {
      // Animate counter rapidly to 100
      gsap.to(counterObj.current, {
        value: 100,
        duration: 0.6,
        ease: 'power2.in',
        onUpdate: () => setCount(Math.round(counterObj.current.value)),
      });
    }
  }, [isLoading]);

  // Dismiss animation
  useEffect(() => {
    if (!isLoading && !hasAnimatedOut.current) {
      hasAnimatedOut.current = true;
      const el = loaderRef.current;
      if (!el) return;

      const tl = gsap.timeline({ delay: 0.7 });

      // Fade out content
      tl.to('.loader-content', {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: 'power2.in',
      });

      // Split screen reveal — two halves slide apart
      tl.to('.loader-panel-top', {
        yPercent: -100,
        duration: 0.8,
        ease: 'power3.inOut',
      });
      tl.to('.loader-panel-bottom', {
        yPercent: 100,
        duration: 0.8,
        ease: 'power3.inOut',
      }, '<');

      tl.call(() => {
        el.style.display = 'none';
        document.body.style.overflow = '';
      });
    }
  }, [isLoading]);

  const brandLetters = 'NAN ESTETIK'.split('');

  return (
    <div ref={loaderRef} className="fixed inset-0 z-[9999]">
      {/* Split panels */}
      <div className="loader-panel-top absolute inset-x-0 top-0 h-1/2 bg-secondary-950" />
      <div className="loader-panel-bottom absolute inset-x-0 bottom-0 h-1/2 bg-secondary-950" />

      {/* Content overlay */}
      <div className="loader-content absolute inset-0 flex flex-col items-center justify-center">

        {/* Corner accents — gold L-shapes */}
        <div className="loader-corner absolute top-8 left-8 origin-top-left">
          <div className="w-12 h-[1px] bg-primary-500/60" />
          <div className="w-[1px] h-12 bg-primary-500/60" />
        </div>
        <div className="loader-corner absolute top-8 right-8 origin-top-right">
          <div className="w-12 h-[1px] bg-primary-500/60 ml-auto" />
          <div className="w-[1px] h-12 bg-primary-500/60 ml-auto" />
        </div>
        <div className="loader-corner absolute bottom-8 left-8 origin-bottom-left">
          <div className="w-[1px] h-12 bg-primary-500/60" />
          <div className="w-12 h-[1px] bg-primary-500/60" />
        </div>
        <div className="loader-corner absolute bottom-8 right-8 origin-bottom-right">
          <div className="w-[1px] h-12 bg-primary-500/60 ml-auto" />
          <div className="w-12 h-[1px] bg-primary-500/60 ml-auto" />
        </div>

        {/* Brand name — letter stagger */}
        <div className="overflow-hidden">
          <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl text-primary-500 tracking-[0.25em] flex">
            {brandLetters.map((letter, i) => (
              <span
                key={i}
                className="loader-letter inline-block"
              >
                {letter === ' ' ? '\u00A0\u00A0' : letter}
              </span>
            ))}
          </h1>
        </div>

        {/* Tagline */}
        <p className="loader-tagline mt-4 text-xs md:text-sm tracking-[0.4em] uppercase text-secondary-400 font-sans font-light">
          Arte & Ciencia Estética
        </p>

        {/* Gold divider line */}
        <div className="loader-line mt-8 w-32 md:w-48 h-[1px] bg-gradient-to-r from-transparent via-primary-500 to-transparent origin-center" />

        {/* Counter — large typographic number */}
        <div className="absolute bottom-10 right-10 md:bottom-14 md:right-14 flex items-baseline gap-1">
          <span
            ref={counterRef}
            className="font-heading text-6xl md:text-8xl lg:text-9xl font-black text-primary-500/20 leading-none tabular-nums"
          >
            {String(count).padStart(3, '0')}
          </span>
          <span className="font-heading text-lg md:text-2xl text-primary-500/30 font-light">
            %
          </span>
        </div>

        {/* Year — top right accent */}
        <span className="absolute top-10 right-10 md:top-14 md:right-14 text-xs tracking-[0.3em] text-secondary-600 font-sans">
          2026
        </span>

        {/* Left accent text — vertical */}
        <span className="absolute bottom-10 left-10 md:bottom-14 md:left-14 text-[10px] tracking-[0.3em] text-secondary-700 font-sans uppercase origin-bottom-left -rotate-90 translate-y-0">
          Loading Experience
        </span>
      </div>
    </div>
  );
}
