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
import { Sparkles, Droplet, Zap, Star, Sun, Check, X as CloseIcon } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [selectedTreatment, setSelectedTreatment] = useState<string | null>(null);

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

      // Animación de entrada para el primer servicio (Tratamientos Faciales)
      const firstService = document.querySelector('[data-service="Tratamientos Faciales"]');
      if (firstService) {
        // Título con reveal
        gsap.from(firstService.querySelector('.service-title'), {
          scrollTrigger: {
            trigger: firstService,
            start: 'top 80%',
          },
          y: 100,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
        });

        // Ícono con scale
        gsap.from(firstService.querySelector('.service-icon'), {
          scrollTrigger: {
            trigger: firstService,
            start: 'top 80%',
          },
          scale: 0,
          opacity: 0,
          duration: 0.8,
          ease: 'back.out(1.7)',
        });

        // Badges en stagger
        gsap.from(firstService.querySelectorAll('.treatment-badge'), {
          scrollTrigger: {
            trigger: firstService,
            start: 'top 70%',
          },
          y: 50,
          opacity: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power3.out',
        });

        // Parallax sutil en elementos decorativos
        gsap.to(firstService.querySelectorAll('.decorative-element'), {
          scrollTrigger: {
            trigger: firstService,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
          y: 100,
          ease: 'none',
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleTreatmentClick = (serviceName: string, treatment: string) => {
    const serviceElement = document.querySelector(`[data-service="${serviceName}"]`);
    if (!serviceElement) return;

    if (selectedTreatment === treatment) {
      // Cerrar
      gsap.to(serviceElement.querySelector('.main-content'), {
        x: 0,
        width: '100%',
        duration: 0.7,
        ease: 'power3.out',
      });
      gsap.to(serviceElement.querySelector('.detail-panel'), {
        x: '100%',
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
      });
      setSelectedTreatment(null);
    } else {
      // Abrir - ajustado para mantener todo en viewport
      gsap.to(serviceElement.querySelector('.main-content'), {
        x: 0,
        width: '48%',
        duration: 0.7,
        ease: 'power3.out',
      });
      gsap.to(serviceElement.querySelector('.detail-panel'), {
        x: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power3.out',
      });
      setSelectedTreatment(treatment);
    }
  };

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
      eyebrow: 'Experiencia Premium',
      description:
        'Limpiezas profundas, peeling químico, microdermabrasión y más para renovar tu piel.',
      features: ['Limpieza profunda', 'Hidratación', 'Rejuvenecimiento'],
      premium: true,
      treatments: {
        'Limpieza profunda': {
          description: 'Limpieza facial profunda que elimina impurezas y células muertas, dejando tu piel radiante y renovada.',
          benefits: ['Elimina puntos negros', 'Destapa poros', 'Mejora textura de la piel', 'Preparación ideal para otros tratamientos'],
          duration: '60 minutos',
          price: 'Desde $80',
        },
        'Hidratación': {
          description: 'Tratamiento intensivo de hidratación que restaura la humedad natural de tu piel con ácido hialurónico y vitaminas.',
          benefits: ['Hidratación profunda', 'Reduce líneas finas', 'Mejora elasticidad', 'Brillo natural'],
          duration: '45 minutos',
          price: 'Desde $90',
        },
        'Rejuvenecimiento': {
          description: 'Tratamiento anti-edad que estimula la producción de colágeno y reduce los signos visibles del envejecimiento.',
          benefits: ['Reduce arrugas', 'Estimula colágeno', 'Tensado de piel', 'Efecto lifting natural'],
          duration: '90 minutos',
          price: 'Desde $150',
        },
      },
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
        const bgColors = ['bg-gradient-to-br from-[#f5e6d3] via-[#faf6f0] to-[#fff8f0]', 'bg-white', 'bg-secondary-100', 'bg-white'];
        
        // Diseño premium solo para Tratamientos Faciales
        if (service.title === 'Tratamientos Faciales') {
          // Íconos para cada tratamiento (NO emojis)
          const treatmentIcons = {
            'Limpieza profunda': Sparkles,
            'Hidratación intensiva': Droplet,
            'Rejuvenecimiento': Sun
          };
          
          return (
            <div
              key={service.title}
              data-service={service.title}
              className={`service-panel h-screen flex items-center justify-center ${bgColors[index % bgColors.length]} overflow-hidden relative`}
            >
              {/* Elementos decorativos */}
              <div className="absolute top-20 right-20 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl decorative-element" />
              <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary-300/10 rounded-full blur-3xl decorative-element" />
              
              {/* Curvas decorativas doradas */}
              <svg className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 1440 800">
                <path d="M0,300 Q400,200 800,300 T1440,300" fill="none" stroke="#d4af37" strokeWidth="2"/>
                <path d="M0,500 Q600,400 1200,500" fill="none" stroke="#d4af37" strokeWidth="1"/>
              </svg>

              {/* Contenedor con max-width para mantener todo en viewport */}
              <div className="container mx-auto max-w-7xl px-6 lg:px-8 w-full h-full relative z-10 flex items-center">
                <div className="w-full flex gap-8 items-center">
                  {/* Contenido principal - lado izquierdo */}
                  <div className="main-content transition-all duration-700 flex-shrink-0" style={{ width: '100%' }}>
                    <div className="max-w-2xl">
                      {/* Eyebrow text */}
                      <span className="service-icon text-xs uppercase tracking-[0.3em] text-primary-600 font-semibold mb-3 block">
                        {service.eyebrow}
                      </span>

                      {/* Título con tipografía elegante */}
                      <h3 className="service-title text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-secondary-900 mb-6 leading-tight">
                        {service.title}
                      </h3>

                      {/* Descripción */}
                      <p className="text-xl md:text-2xl text-secondary-600/90 mb-12 leading-relaxed">
                        {service.description}
                      </p>

                      {/* Badge premium */}
                      {service.premium && (
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-full text-sm font-semibold mb-8">
                          <Star size={16} className="animate-pulse" />
                          Tratamiento Premium
                        </span>
                      )}
                      
                      {/* Tratamientos clickeables con íconos SVG */}
                      <div className="space-y-4">
                        {service.features.map((feature) => {
                          const TreatmentIcon = treatmentIcons[feature as keyof typeof treatmentIcons] || Sparkles;
                          return (
                            <button
                              key={feature}
                              onClick={() => handleTreatmentClick(service.title, feature)}
                              className={`treatment-badge group w-full text-left px-8 py-5 rounded-2xl border-2 transition-all duration-300 ${
                                selectedTreatment === feature
                                  ? 'bg-primary-500 border-primary-500 text-white shadow-xl scale-105'
                                  : 'bg-white/80 backdrop-blur-sm border-primary-400/30 text-secondary-900 hover:border-primary-500 hover:shadow-lg hover:scale-[1.02]'
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg transition-all ${
                                  selectedTreatment === feature ? 'bg-white/20' : 'bg-primary-50'
                                }`}>
                                  <TreatmentIcon 
                                    size={24} 
                                    className={selectedTreatment === feature ? 'text-white' : 'text-primary-600'}
                                  />
                                </div>
                                <span className="text-lg font-semibold flex-1">{feature}</span>
                                <span className="text-sm opacity-70 group-hover:translate-x-1 transition-transform">→</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Panel de detalles - aparece desde la derecha */}
                  <div 
                    className="detail-panel absolute inset-y-0 right-0 bg-white shadow-2xl flex items-center overflow-y-auto"
                    style={{ 
                      transform: 'translateX(100%)', 
                      opacity: 0,
                      width: '50%',
                      maxWidth: '600px'
                    }}
                  >
                    {selectedTreatment && service.treatments?.[selectedTreatment as keyof typeof service.treatments] && (
                      <div className="w-full px-8 py-12 lg:px-12">
                        {/* Botón cerrar con ícono SVG */}
                        <button
                          onClick={() => handleTreatmentClick(service.title, selectedTreatment)}
                          className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center rounded-full bg-secondary-100 hover:bg-secondary-200 transition-all hover:scale-110 group"
                          aria-label="Cerrar panel"
                        >
                          <CloseIcon size={20} className="text-secondary-700 group-hover:text-secondary-900" />
                        </button>

                        <div className="max-w-lg mx-auto">
                          <h4 className="text-3xl lg:text-4xl font-heading font-bold text-secondary-900 mb-4">
                            {selectedTreatment}
                          </h4>
                          <p className="text-base lg:text-lg text-secondary-600 mb-8 leading-relaxed">
                            {service.treatments[selectedTreatment as keyof typeof service.treatments].description}
                          </p>

                          {/* Beneficios con íconos SVG */}
                          <h5 className="text-sm uppercase tracking-wider text-primary-600 font-semibold mb-4">
                            Beneficios
                          </h5>
                          <ul className="space-y-3 mb-8">
                            {service.treatments[selectedTreatment as keyof typeof service.treatments].benefits.map((benefit: string) => (
                              <li key={benefit} className="flex items-start gap-3 text-secondary-700">
                                <Check size={20} className="text-primary-500 flex-shrink-0 mt-0.5" />
                                <span className="text-base">{benefit}</span>
                              </li>
                            ))}
                          </ul>

                          {/* Info adicional */}
                          <div className="flex gap-8 mb-8 pb-8 border-b border-secondary-200">
                            <div>
                              <p className="text-sm text-secondary-500 mb-1">Duración</p>
                              <p className="font-semibold text-secondary-900">{service.treatments[selectedTreatment as keyof typeof service.treatments].duration}</p>
                            </div>
                            <div>
                              <p className="text-sm text-secondary-500 mb-1">Precio</p>
                              <p className="font-semibold text-primary-600">{service.treatments[selectedTreatment as keyof typeof service.treatments].price}</p>
                            </div>
                          </div>

                          {/* CTA */}
                          <button className="btn-primary w-full">
                            Reservar Tratamiento
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        }

        // Diseño estándar para otros servicios
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
