/**
 * Services Section
 * 
 * Sección de servicios con:
 * - Scroll horizontal parallax con pin
 * - Grid de servicios ofrecidos
 * - Animaciones interactivas con GSAP ScrollTrigger
 */

'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Droplet, Zap, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax horizontal para los cards
      if (cardsContainerRef.current && horizontalRef.current) {
        const cards = gsap.utils.toArray(cardsContainerRef.current.children);
        
        // Crear timeline para scroll horizontal - siguiendo el patrón del ejemplo
        gsap.to(cards, {
          xPercent: -100 * (cards.length - 1),
          ease: 'sine.out',
          scrollTrigger: {
            trigger: horizontalRef.current,
            pin: true,
            scrub: 3,
            snap: 1 / (cards.length - 1),
            start: 'top 20%',
            end: () => `+=${horizontalRef.current!.offsetWidth}`,
            invalidateOnRefresh: true,
          },
        });

        // Animación de entrada para cada card
        gsap.from(cards, {
          scrollTrigger: {
            trigger: horizontalRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
          scale: 0.9,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.7)',
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const services = [
    {
      icon: Sparkles,
      title: 'Tratamientos Faciales',
      description:
        'Limpiezas profundas, peeling químico, microdermabrasión y más para renovar tu piel.',
      features: ['Limpieza profunda', 'Hidratación', 'Rejuvenecimiento'],
    },
    {
      icon: Droplet,
      title: 'Rellenos y Botox',
      description:
        'Aplicación de ácido hialurónico y toxina botulínica para resultados naturales.',
      features: ['Rellenos labiales', 'Botox', 'Eliminación de arrugas'],
    },
    {
      icon: Zap,
      title: 'Tratamientos Corporales',
      description:
        'Procedimientos para moldear y tonificar tu figura con tecnología avanzada.',
      features: ['Reducción de grasa', 'Tonificación', 'Reafirmación'],
    },
    {
      icon: Star,
      title: 'Tratamientos Especiales',
      description:
        'Servicios personalizados y paquetes premium para ocasiones especiales.',
      features: ['Novias', 'Eventos', 'Tratamientos VIP'],
    },
  ];

  return (
    <section
      id="servicios"
      ref={sectionRef}
      className="bg-white overflow-hidden"
    >
      {/* Contenedor de scroll horizontal - incluye título */}
      <div ref={horizontalRef} className="relative min-h-screen flex flex-col justify-start pt-16 pb-16 bg-secondary-50">
        {/* Título dentro del contenedor pin */}
        <div className="container-custom mb-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-secondary-900 mb-4">
              Nuestros Servicios
            </h2>
            <div className="w-24 h-1 bg-primary-500 mx-auto mb-4" />
            <p className="text-lg md:text-xl text-secondary-600 max-w-3xl mx-auto">
              Ofrecemos una amplia gama de tratamientos estéticos diseñados para
              realzar tu belleza natural y mejorar tu confianza.
            </p>
          </div>
        </div>

        {/* Cards horizontales */}
        <div className="flex items-start flex-1 pt-4">
        <div
          ref={cardsContainerRef}
          className="flex gap-8 w-full"
          style={{ paddingLeft: 'max(2rem, 5vw)', paddingRight: 'max(2rem, 5vw)' }}
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="flex-shrink-0 w-[80vw] md:w-[35vw] lg:w-[26vw]"
              >
                <div className="card group hover:shadow-2xl transition-all duration-300 border border-secondary-200 hover:border-primary-400 h-full bg-white">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-secondary-100 rounded-full mb-4 group-hover:bg-primary-500 group-hover:scale-110 transition-all">
                    <Icon
                      className="text-primary-500 group-hover:text-secondary-900 transition-colors"
                      size={28}
                    />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-secondary-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-secondary-600 mb-4">
                    {service.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="text-sm text-secondary-700 flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="mt-auto text-primary-600 font-semibold hover:text-primary-500 transition-colors">
                    Más información →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </div>
    </section>
  );
}
