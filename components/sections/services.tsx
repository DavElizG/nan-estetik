/**
 * Services Section
 * 
 * Sección de servicios con:
 * - Grid de servicios ofrecidos
 * - Animaciones horizontales con ScrollTrigger
 * - Cards interactivas
 */

'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Droplet, Zap, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animación de cards con efecto horizontal
      gsap.from(cardsRef.current?.children || [], {
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 75%',
          end: 'bottom 25%',
          toggleActions: 'play none none reverse',
        },
        x: -100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      });
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
      className="py-20 md:py-32 bg-white"
    >
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-secondary-900 mb-6">
            Nuestros Servicios
          </h2>
          <div className="w-24 h-1 bg-primary-500 mx-auto mb-8" />
          <p className="text-lg md:text-xl text-secondary-700 max-w-3xl mx-auto">
            Ofrecemos una amplia gama de tratamientos estéticos diseñados para
            realzar tu belleza natural y mejorar tu confianza.
          </p>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="card group hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary-200"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-full mb-4 group-hover:bg-primary-500 group-hover:scale-110 transition-all">
                  <Icon
                    className="text-primary-600 group-hover:text-white transition-colors"
                    size={28}
                  />
                </div>
                <h3 className="text-xl font-heading font-bold text-secondary-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-secondary-600 mb-4">
                  {service.description}
                </p>
                <ul className="space-y-2">
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
                <button className="mt-6 text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                  Más información →
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
