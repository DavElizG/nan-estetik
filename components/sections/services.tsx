/**
 * Services Section
 * 
 * Sección de servicios con:
 * - Layered pinning - los paneles se apilan uno encima del otro
 * - Grid de servicios ofrecidos
 * - Animaciones interactivas con GSAP ScrollTrigger
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Droplet, Zap, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const [expandedService, setExpandedService] = useState<string | null>(null);

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

  const handleMoreInfo = (serviceTitle: string) => {
    const serviceElement = document.querySelector(`[data-service="${serviceTitle}"]`);
    if (!serviceElement) return;

    if (expandedService === serviceTitle) {
      // Cerrar
      gsap.to(serviceElement.querySelector('.extra-content'), {
        height: 0,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.inOut',
      });
      setExpandedService(null);
    } else {
      // Abrir
      gsap.to(serviceElement.querySelector('.extra-content'), {
        height: 'auto',
        opacity: 1,
        duration: 0.5,
        ease: 'power3.inOut',
      });
      setExpandedService(serviceTitle);
    }
  };

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
            data-service={service.title}
            className={`service-panel h-screen flex items-center justify-center ${bgColors[index % bgColors.length]} overflow-hidden`}
          >
            <div className="container-custom max-w-6xl px-8 w-full">
              {/* Contenido principal - centrado */}
              <div className="main-content w-full text-center">
                {/* Icono grande centrado */}
                <div className="flex justify-center mb-8">
                  <div className="w-28 h-28 md:w-36 md:h-36 bg-primary-500 rounded-full flex items-center justify-center shadow-lg">
                    <Icon className="text-white" size={64} />
                  </div>
                </div>

                {/* Título y descripción */}
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-secondary-900 mb-6">
                  {service.title}
                </h3>
                <p className="text-xl md:text-2xl text-secondary-600 mb-10 max-w-3xl mx-auto">
                  {service.description}
                </p>
                
                {/* Features como badges centrados */}
                <div className="flex flex-wrap gap-4 mb-10 justify-center">
                  {service.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-6 py-3 bg-white border-2 border-primary-500 text-secondary-900 rounded-full text-base font-medium shadow-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Botón */}
                <button
                  onClick={() => handleMoreInfo(service.title)}
                  className="group inline-flex items-center gap-2 text-primary-600 font-bold text-lg hover:text-primary-500 transition-colors"
                >
                  {expandedService === service.title ? 'Ocultar detalles' : 'Ver detalles'}
                  <span className="group-hover:scale-110 transition-transform">
                    {expandedService === service.title ? '↑' : '↓'}
                  </span>
                </button>
              </div>

              {/* Contenido extra - se expande debajo */}
              <div 
                className="extra-content overflow-hidden text-center mt-8"
                style={{ height: 0, opacity: 0 }}
              >
                <div className="border-t-2 border-primary-500 pt-8 max-w-4xl mx-auto">
                  <h4 className="text-2xl md:text-3xl font-heading font-bold text-secondary-900 mb-6">
                    Detalles del Tratamiento
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6 text-left">
                    <div className="flex items-start gap-3">
                      <span className="text-primary-500 text-xl">✓</span>
                      <p className="text-secondary-700 text-lg">Procedimiento personalizado según tus necesidades</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-primary-500 text-xl">✓</span>
                      <p className="text-secondary-700 text-lg">Realizado por profesionales certificados</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-primary-500 text-xl">✓</span>
                      <p className="text-secondary-700 text-lg">Tecnología de última generación</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-primary-500 text-xl">✓</span>
                      <p className="text-secondary-700 text-lg">Resultados visibles desde la primera sesión</p>
                    </div>
                  </div>
                  <button className="btn-primary mt-8">
                    Agendar Cita
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
