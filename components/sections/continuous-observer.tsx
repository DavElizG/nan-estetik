/**
 * Animated Continuous Sections with GSAP Observer
 * Seccion intermedia con transiciones continuas entre slides a scroll
 */

'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(Observer, ScrollTrigger);

type Slide = {
  heading: string;
  subtitle: string;
  bgClass: string;
};

const slides: Slide[] = [
  {
    heading: 'Resultados Reales',
    subtitle: 'Cada tratamiento se adapta a tu rostro y objetivos.',
    bgClass: 'bg-[radial-gradient(circle_at_25%_30%,rgba(212,175,55,0.24),rgba(10,10,10,0.9)_60%)]',
  },
  {
    heading: 'Tecnica Precisa',
    subtitle: 'Protocolo profesional con enfoque natural y armonico.',
    bgClass: 'bg-[radial-gradient(circle_at_75%_30%,rgba(185,122,43,0.26),rgba(8,8,8,0.92)_58%)]',
  },
  {
    heading: 'Confianza Total',
    subtitle: 'Acompanamiento cercano de principio a fin.',
    bgClass: 'bg-[radial-gradient(circle_at_50%_70%,rgba(212,175,55,0.22),rgba(5,5,5,0.94)_62%)]',
  },
];

export function ContinuousObserver() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>('.observer-slide');
      const images = gsap.utils.toArray<HTMLElement>('.observer-bg');
      const headings = gsap.utils.toArray<HTMLElement>('.section-heading');
      const outerWrappers = gsap.utils.toArray<HTMLElement>('.observer-outer');
      const innerWrappers = gsap.utils.toArray<HTMLElement>('.observer-inner');
      const wrapIndex = gsap.utils.wrap(0, sections.length);
      const splitChars = headings.map((heading) => {
        const words = heading.textContent?.split(' ') ?? [];
        heading.innerHTML = words
          .map(
            (word) =>
              `<span class="clip-text inline-block overflow-hidden align-top">${[...word]
                .map((char) => `<span class="word-char inline-block">${char}</span>`)
                .join('')}</span>`
          )
          .join('<span class="inline-block w-3"></span>');
        return gsap.utils.toArray<HTMLElement>(heading.querySelectorAll('.word-char'));
      });

      let currentIndex = -1;
      let animating = false;

      gsap.set(outerWrappers, { yPercent: 100 });
      gsap.set(innerWrappers, { yPercent: -100 });

      const gotoSection = (index: number, direction: 1 | -1): boolean => {
        if (!sections.length) return false;

        const targetIndex = wrapIndex(index);

        animating = true;
        const fromTop = direction === -1;
        const dFactor = fromTop ? -1 : 1;

        const tl = gsap.timeline({
          defaults: { duration: 1.1, ease: 'power1.inOut' },
          onComplete: () => {
            animating = false;
          },
        });

        if (currentIndex >= 0) {
          gsap.set(sections[currentIndex], { zIndex: 0 });
          tl.to(images[currentIndex], { yPercent: -16 * dFactor }, 0).set(sections[currentIndex], { autoAlpha: 0 });
        }

        gsap.set(sections[targetIndex], { autoAlpha: 1, zIndex: 1, visibility: 'visible' });

        tl.fromTo(
          [outerWrappers[targetIndex], innerWrappers[targetIndex]],
          {
            yPercent: (i: number) => (i ? -100 * dFactor : 100 * dFactor),
          },
          {
            yPercent: 0,
          },
          0
        )
          .fromTo(images[targetIndex], { yPercent: 16 * dFactor }, { yPercent: 0 }, 0)
          .fromTo(
            splitChars[targetIndex],
            {
              autoAlpha: 0,
              yPercent: 140 * dFactor,
            },
            {
              autoAlpha: 1,
              yPercent: 0,
              duration: 0.9,
              ease: 'power2.out',
              stagger: {
                each: 0.012,
                from: 'random',
              },
            },
            0.2
          );

        currentIndex = targetIndex;
        return true;
      };

      const observer = Observer.create({
        target: section,
        type: 'wheel,touch,pointer',
        wheelSpeed: -1,
        tolerance: 10,
        preventDefault: true,
        onDown: () => {
          if (animating) return;
          gotoSection(currentIndex - 1, -1);
        },
        onUp: () => {
          if (animating) return;
          gotoSection(currentIndex + 1, 1);
        },
      });

      observer.disable();

      const gate = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: `+=${Math.max(1, slides.length - 1) * 50}%`,
        pin: true,
        anticipatePin: 1,
        onEnter: () => {
          observer.enable();
          if (currentIndex === -1) {
            gotoSection(0, 1);
          }
        },
        onEnterBack: () => {
          observer.enable();
          if (currentIndex === -1) {
            gotoSection(0, 1);
          }
        },
        onLeave: () => {
          observer.disable();
        },
        onLeaveBack: () => {
          observer.disable();
        },
      });

      // Estado inicial oculto
      gsap.set(sections, { autoAlpha: 0, visibility: 'hidden' });
      if (sections[0]) {
        gsap.set(sections[0], { autoAlpha: 1, zIndex: 1, visibility: 'visible' });
        gsap.set([outerWrappers[0], innerWrappers[0]], { yPercent: 0 });
      }

      return () => {
        gate.kill();
        observer.kill();
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-black"
      aria-label="Seccion de transiciones animadas"
    >
      {slides.map((slide) => (
        <div key={slide.heading} className="observer-slide absolute inset-0">
          <div className="observer-outer h-full w-full overflow-hidden">
            <div className="observer-inner h-full w-full overflow-hidden">
              <div className={`observer-bg absolute inset-0 ${slide.bgClass}`}>
                <div className="absolute inset-0 bg-gradient-to-b from-black/35 to-black/65" />
                <div className="relative z-10 h-full w-full flex flex-col items-center justify-center px-6 text-center">
                  <span className="mb-5 text-[10px] uppercase tracking-[0.45em] text-primary-400/80">
                    Nan Estetik
                  </span>
                  <h2 className="section-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white leading-[1.05]">
                    {slide.heading}
                  </h2>
                  <p className="mt-5 max-w-2xl text-sm sm:text-base md:text-lg text-white/80">
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
