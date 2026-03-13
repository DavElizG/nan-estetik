/**
 * Horizontal Text scroll section inspired by GSAP containerAnimation example.
 * Replaces swipe slider to avoid navigation bugs.
 */

'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const message =
  'La belleza consciente se mueve contigo — Experiencia Nan Estetik — Tecnología, precisión y cuidado personalizado.';

const chars = message.split('').map((char, idx) => ({
  key: idx,
  value: char === ' ' ? '\u00A0' : char,
}));

export function HorizontalText() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const text = textRef.current;
    if (!section || !text) return;

    const ctx = gsap.context(() => {
      const scrollTween = gsap.to(text, {
        xPercent: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          end: '+=5000',
          scrub: true,
          anticipatePin: 1,
        },
      });

      const charSpans = gsap.utils.toArray<HTMLElement>('.char-span');

      charSpans.forEach((charEl) => {
        gsap.from(charEl, {
          yPercent: gsap.utils.random(-200, 200),
          rotation: gsap.utils.random(-20, 20),
          opacity: 0,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: charEl,
            containerAnimation: scrollTween,
            start: 'left 100%',
            end: 'left 30%',
            scrub: 1,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-primary-50 text-secondary-900"
      aria-label="Mensaje horizontal animado"
    >
      <div className="flex h-full items-center">
        <div
          ref={textRef}
          className="Horizontal__text flex whitespace-nowrap gap-[4vw] pl-[100vw] px-6 text-balance"
        >
          {chars.map((c) => (
            <span
              key={c.key}
              className="char-span inline-block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-semibold leading-tight"
            >
              {c.value}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
