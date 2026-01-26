/**
 * Services Section
 * 
 * Sección de servicios con:
 * - Layered pinning - los paneles se apilan uno encima del otro
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Layered pinning - cada panel se pega en la parte superior
      const panels = gsap.utils.toArray('.service-panel');
      
      panels.forEach((panel) => {
        ScrollTrigger.create({
          trigger: panel as Element,
          start: 'top top',
          pin: true,
          pinSpacing: false,
        });
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
      className="relative"
    >
      {/* Título principal - aparece primero */}
      <div className="h-screen flex items-center justify-center bg-white service-panel">
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

      {/* Paneles de servicios - se apilan uno encima del otro */}
      {services.map((service, index) => {
        const Icon = service.icon;
        const bgColors = ['bg-secondary-50', 'bg-white', 'bg-secondary-100', 'bg-white'];
        return (
          <div
            key={service.title}
            className={`service-panel h-screen flex items-center justify-center ${bgColors[index % bgColors.length]}`}
          >
            <div className="container-custom max-w-4xl px-4">
              <div className="card group hover:shadow-2xl transition-all duration-300 border border-secondary-200 hover:border-primary-400 bg-white">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary-100 rounded-full mb-6 group-hover:bg-primary-500 group-hover:scale-110 transition-all">
                  <Icon
                    className="text-primary-500 group-hover:text-secondary-900 transition-colors"
                    size={32}
                  />
                </div>
                <h3 className="text-3xl md:text-4xl font-heading font-bold text-secondary-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-lg text-secondary-600 mb-6">
                  {service.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="text-base text-secondary-700 flex items-center gap-3"
                    >
                      <span className="w-2 h-2 bg-primary-500 rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="btn-primary">
                  Más información
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
