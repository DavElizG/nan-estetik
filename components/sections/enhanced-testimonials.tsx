/**
 * Enhanced Testimonials - Floating Cards
 * 
 * Tarjetas pequeñas flotando alrededor de un título central grande
 * Estilo "Skills for the Future" - cards dispersas con parallax
 */

'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Testimonial {
  name: string;
  treatment: string;
  rating: number;
  text: string;
  // Posición relativa al contenedor (%)
  x: string;
  y: string;
  rotation: number;
}

const testimonials: Testimonial[] = [
  // Fila 1 — arriba
  {
    name: 'María G.',
    treatment: 'Relleno Labial',
    rating: 5,
    text: 'Resultados increíbles y muy naturales. Me sentí en buenas manos.',
    x: '8%', y: '12%', rotation: -3,
  },
  {
    name: 'Carmen R.',
    treatment: 'Limpieza Facial',
    rating: 5,
    text: 'Mi piel nunca se había visto tan radiante. Excelente servicio.',
    x: '65%', y: '5%', rotation: 2,
  },
  // Fila 2 — medio
  {
    name: 'Ana M.',
    treatment: 'Armonización',
    rating: 5,
    text: 'Cambio sutil pero impactante. Me siento más segura y bella.',
    x: '3%', y: '48%', rotation: 4,
  },
  {
    name: 'Laura S.',
    treatment: 'Ojeras',
    rating: 5,
    text: 'Después de años luchando con ojeras, encontré la solución perfecta.',
    x: '76%', y: '35%', rotation: -2,
  },
  // Fila 3 — abajo
  {
    name: 'Sofía P.',
    treatment: 'Botox',
    rating: 5,
    text: 'Procedimiento rápido y sin dolor. Los resultados son espectaculares.',
    x: '32%', y: '76%', rotation: 3,
  },
  {
    name: 'Elena V.',
    treatment: 'Ácido Hialurónico',
    rating: 5,
    text: 'La doctora es una artista. Resultado natural y rejuvenecido.',
    x: '70%', y: '70%', rotation: -4,
  },
];

export function EnhancedTestimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    const ctx = gsap.context(() => {
      // Título central - fade in
      gsap.from('.testimonials-title', {
        opacity: 0,
        y: 60,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          once: true,
        },
      });

      // Cards flotan hacia dentro desde direcciones diferentes
      const cards = container.querySelectorAll('.floating-card');
      cards.forEach((card, index) => {
        const fromLeft = index % 2 === 0;
        gsap.from(card, {
          opacity: 0,
          x: fromLeft ? -60 : 60,
          y: 40,
          scale: 0.8,
          rotation: gsap.utils.random(-15, 15),
          duration: 1,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            once: true,
          },
          delay: 0.2 + index * 0.12,
        });

        // Parallax flotante en scroll
        const speed = index % 2 === 0 ? -30 : 30;
        gsap.to(card, {
          y: `+=${speed}`,
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Pointer-driven tilt — posición relativa a la SECCIÓN completa (igual que el ejemplo del logo)
  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    gsap.set(container, { perspective: 650 });

    const cards = Array.from(container.querySelectorAll<HTMLElement>('.floating-card'));

    // quickTo por card, duración corta para respuesta ágil
    const animators = cards.map((card) => ({
      rotX: gsap.quickTo(card, 'rotationX', { ease: 'power3', duration: 0.6 }),
      rotY: gsap.quickTo(card, 'rotationY', { ease: 'power3', duration: 0.6 }),
    }));

    const onPointerMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();

      // Posición normalizada del cursor dentro de la sección (0 → 1)
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;

      animators.forEach(({ rotX, rotY }) => {
        // Igual que el ejemplo: interpolate sobre el ancho/alto de la sección
        rotX(gsap.utils.interpolate(15, -15, py));
        rotY(gsap.utils.interpolate(-15, 15, px));
      });
    };

    const onPointerLeave = () => {
      animators.forEach(({ rotX, rotY }) => { rotX(0); rotY(0); });
    };

    section.addEventListener('pointermove', onPointerMove);
    section.addEventListener('pointerleave', onPointerLeave);

    return () => {
      section.removeEventListener('pointermove', onPointerMove);
      section.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="testimonios"
      className="relative bg-secondary-900 overflow-visible"
      style={{ minHeight: '140vh' }}
    >
      {/* Background sutil */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_40%,_rgba(212,175,55,0.06),_transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_70%,_rgba(212,175,55,0.04),_transparent_50%)]" />
      </div>

      {/* Contenedor con título central y cards flotantes */}
      <div
        ref={containerRef}
        className="relative mx-auto max-w-[1400px] px-4"
        style={{ minHeight: '140vh' }}
      >
        {/* Título central gigante */}
        <div className="testimonials-title absolute inset-0 flex items-center justify-center pointer-events-none z-[1]">
          <div className="text-center px-4">
            <span className="text-xs uppercase tracking-[0.4em] text-primary-400/60 font-semibold mb-4 block">
              Testimonios
            </span>
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-heading font-black leading-[0.9]">
              <span className="block text-white/10">Lo Que</span>
              <span className="block text-primary-500/20">Dicen</span>
              <span className="block text-white/10">De Nosotros</span>
            </h2>
          </div>
        </div>

        {/* Cards flotantes - posicionamiento absoluto */}
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="floating-card absolute z-[2]"
            style={{
              left: t.x,
              top: t.y,
              transform: `rotate(${t.rotation}deg)`,
              maxWidth: '280px',
              transformStyle: 'preserve-3d',
              willChange: 'transform',
            }}
          >
            <div className="bg-white/[0.06] backdrop-blur-md border border-primary-500/15 rounded-2xl p-4 md:p-5 hover:bg-white/[0.1] hover:border-primary-500/30 transition-all duration-500 group cursor-default">
              {/* Stars */}
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: t.rating }, (_, i) => (
                  <Star
                    key={`star-${t.name}-${i}`}
                    className="w-3 h-3 text-primary-400 fill-primary-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-white/80 text-xs md:text-sm leading-relaxed mb-3">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-xs font-semibold">{t.name}</p>
                  <p className="text-primary-400/70 text-[10px]">{t.treatment}</p>
                </div>
                <div className="w-6 h-6 rounded-full bg-primary-500/20 border border-primary-400/30 flex items-center justify-center">
                  <span className="text-primary-400 text-[8px] font-bold">
                    {t.name.charAt(0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Líneas decorativas sutiles */}
      <div className="absolute top-1/4 left-0 w-32 h-px bg-gradient-to-r from-transparent to-primary-500/10 pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-40 h-px bg-gradient-to-l from-transparent to-primary-500/10 pointer-events-none" />
    </section>
  );
}
