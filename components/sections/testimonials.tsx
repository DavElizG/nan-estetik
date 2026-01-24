/**
 * Testimonials Section
 * 
 * Sección de testimonios con:
 * - Parallax vertical diferencial
 * - Cards de testimonios con efecto de profundidad
 * - Animaciones suaves con GSAP
 */

'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const decorativeRef1 = useRef<HTMLDivElement>(null);
  const decorativeRef2 = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.children;
      if (!cards) return;

      // Efecto zoom en el título al entrar
      gsap.fromTo(
        titleRef.current,
        {
          scale: 0.8,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Parallax diferencial para cada testimonio
      Array.from(cards).forEach((card, index) => {
        const speed = (index % 2 === 0 ? -20 : 20); // Alternar dirección
        
        gsap.to(card, {
          y: speed,
          ease: 'none',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });

      // Animación de entrada
      gsap.from(cards, {
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'back.out(1.7)',
      });

      // Parallax de elementos decorativos
      gsap.to(decorativeRef1.current, {
        yPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to(decorativeRef2.current, {
        yPercent: 50,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const testimonials = [
    {
      name: 'María González',
      treatment: 'Relleno Labial',
      rating: 5,
      text: 'Excelente atención y resultados increíbles. El equipo de Nan Estetik es muy profesional y me sentí en buenas manos todo el tiempo.',
      image: 1,
    },
    {
      name: 'Carmen Rodríguez',
      treatment: 'Limpieza Facial',
      rating: 5,
      text: 'Los tratamientos faciales son maravillosos. Mi piel nunca se había visto tan radiante. Totalmente recomendado.',
      image: 2,
    },
    {
      name: 'Ana López',
      treatment: 'Tratamiento Corporal',
      rating: 5,
      text: 'Después de varios tratamientos, puedo ver una gran diferencia. El personal es muy amable y profesional.',
      image: 3,
    },
  ];

  return (
    <section
      id="testimonios"
      ref={sectionRef}
      className="py-20 md:py-32 bg-white relative overflow-hidden"
    >
      {/* Elementos decorativos con parallax */}
      <div
        ref={decorativeRef1}
        className="absolute top-10 left-10 w-72 h-72 bg-accent-rose/20 rounded-full blur-3xl pointer-events-none"
      />
      <div
        ref={decorativeRef2}
        className="absolute bottom-10 right-10 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl pointer-events-none"
      />

      <div className="container-custom relative z-10">
        <div className="text-center mb-16" ref={titleRef}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-secondary-900 mb-6">
            Lo Que Dicen Nuestras Clientas
          </h2>
          <div className="w-24 h-1 bg-primary-500 mx-auto mb-8" />
          <p className="text-lg md:text-xl text-secondary-700 max-w-3xl mx-auto">
            La satisfacción de nuestras clientas es nuestra mejor carta de presentación.
          </p>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="card group hover:shadow-2xl transition-all duration-300"
            >
              {/* Quote icon */}
              <div className="flex items-center justify-between mb-4">
                <Quote className="text-primary-400 group-hover:text-primary-500 transition-colors" size={32} />
                <div className="flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="text-yellow-400 fill-yellow-400"
                      size={16}
                    />
                  ))}
                </div>
              </div>

              {/* Testimonial text */}
              <p className="text-secondary-700 mb-6 italic">
                "{testimonial.text}"
              </p>

              {/* Avatar and info */}
              <div className="flex items-center gap-4 pt-4 border-t border-secondary-200">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-accent-rose flex items-center justify-center text-white font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-secondary-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-secondary-600">
                    {testimonial.treatment}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
