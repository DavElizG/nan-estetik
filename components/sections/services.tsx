/**
 * Services Section
 * 
 * Sección de servicios con:
 * - Layered pinning - los paneles se apilan uno encima del otro
 * - Grid de servicios ofrecidos
 * - Animaciones interactivas con GSAP ScrollTrigger
 * - Datos consumidos desde API de PostgreSQL
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Droplet, Zap, Star, Sun, Check, X as CloseIcon } from 'lucide-react';
import type { Service as ServiceType } from '@/types/service';

gsap.registerPlugin(ScrollTrigger);

// Map de iconos disponibles
const iconMap: { [key: string]: any } = {
  Sparkles,
  Droplet,
  Zap,
  Star,
  Sun,
};

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [selectedTreatment, setSelectedTreatment] = useState<string | null>(null);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        if (!response.ok) throw new Error('Error al cargar servicios');
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    if (loading || services.length === 0) return;

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

      // Animación de entrada para cada servicio
      services.forEach((service, index) => {
        const serviceElement = document.querySelector(`[data-service="${service.title}"]`);
        if (serviceElement) {
          // Título con reveal
          gsap.from(serviceElement.querySelector('.service-title'), {
            scrollTrigger: {
              trigger: serviceElement,
              start: 'top 80%',
            },
            y: 100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
          });

          // Ícono con scale
          gsap.from(serviceElement.querySelector('.service-icon'), {
            scrollTrigger: {
              trigger: serviceElement,
              start: 'top 80%',
            },
            scale: 0,
            opacity: 0,
            duration: 0.8,
            ease: 'back.out(1.7)',
          });

          // Badges en stagger
          const badges = serviceElement.querySelectorAll('.treatment-badge');
          if (badges.length > 0) {
            gsap.set(badges, { opacity: 1, y: 0 });
            gsap.from(badges, {
              scrollTrigger: {
                trigger: serviceElement,
                start: 'top 70%',
              },
              y: 30,
              opacity: 0,
              duration: 0.6,
              stagger: 0.15,
              ease: 'power3.out',
            });
          }

          // Parallax sutil en elementos decorativos
          gsap.to(serviceElement.querySelectorAll('.decorative-element'), {
            scrollTrigger: {
              trigger: serviceElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
            y: 100,
            ease: 'none',
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, services]);

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
      // Abrir
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

  if (loading) {
    return (
      <section id="servicios" className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Cargando servicios...</p>
        </div>
      </section>
    );
  }

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

  return (
    <section
      id="servicios"
      ref={sectionRef}
      className="relative"
    >
      {/* Título principal - aparece primero */}
      <div className="h-screen flex items-center justify-center bg-black service-panel">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4">
            Nuestros Servicios
          </h2>
          <div className="w-24 h-1 bg-primary-500 mx-auto mb-4" />
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Ofrecemos una amplia gama de tratamientos estéticos diseñados para
            realzar tu belleza natural y mejorar tu confianza.
          </p>
        </div>
      </div>

      {/* Paneles de servicios - se apilan uno encima del otro */}
      {services.map((service, index) => {
        const Icon = iconMap[service.icon] || Sparkles;
        const bgColors = [
          'bg-gradient-to-br from-gray-900 via-black to-gray-800',
          'bg-gradient-to-br from-black via-gray-900 to-black',
          'bg-gradient-to-br from-gray-800 via-black to-gray-900',
          'bg-gradient-to-br from-black via-gray-800 to-gray-900'
        ];
        
        // Alternar posición del contenido: par = derecha, impar = izquierda
        const isContentRight = index % 2 === 0;
          
        return (
          <div
            key={service.id}
            data-service={service.title}
            className={`service-panel min-h-screen flex items-center justify-center ${bgColors[index % bgColors.length]} overflow-visible relative py-20`}
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
            <div className="container mx-auto max-w-7xl px-6 lg:px-8 w-full relative z-10">
              <div className={`w-full flex gap-8 ${isContentRight ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Contenido principal */}
                <div className="main-content transition-all duration-700 flex-shrink-0" style={{ width: '100%' }}>
                  <div className="max-w-2xl">
                    {/* Eyebrow text */}
                    <span className="service-icon text-xs uppercase tracking-[0.3em] text-primary-400 font-semibold mb-3 block">
                      {service.eyebrow}
                    </span>

                    {/* Título con tipografía elegante */}
                    <h3 className="service-title text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4 leading-tight">
                      {service.title}
                    </h3>

                    {/* Descripción */}
                    <p className="text-lg md:text-xl text-gray-300 mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Badge premium */}
                    {service.isPremium && (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-full text-sm font-semibold mb-4">
                        <Star size={16} className="animate-pulse" />
                        Tratamiento Premium
                      </span>
                    )}
                    
                    {/* Tratamientos clickeables con íconos SVG */}
                    <div className="space-y-4" style={{ opacity: 1, visibility: 'visible' }}>
                      {service.treatments.map((treatment) => {
                        const TreatmentIcon = iconMap[treatment.icon] || Sparkles;
                        return (
                          <button
                            key={treatment.id}
                            onClick={() => handleTreatmentClick(service.title, treatment.name)}
                            style={{ opacity: 1, visibility: 'visible' }}
                            className={`treatment-badge group relative w-full text-left px-8 py-6 rounded-2xl transition-all duration-500 overflow-hidden ${
                              selectedTreatment === treatment.name
                                ? 'bg-gradient-to-r from-primary-500 to-primary-600 border-2 border-primary-700 text-white shadow-2xl scale-[1.02]'
                                : 'bg-gradient-to-br from-white via-white to-primary-50/30 border-2 border-primary-400/40 text-secondary-900 hover:border-primary-500 hover:shadow-2xl hover:scale-[1.02] hover:from-primary-50 hover:to-white shadow-lg'
                            }`}
                          >
                            {/* Efecto de brillo sutil */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            
                            <div className="relative flex items-center gap-4">
                              <div className={`p-3 rounded-xl transition-all duration-300 ${
                                selectedTreatment === treatment.name 
                                  ? 'bg-white/20 shadow-lg' 
                                  : 'bg-gradient-to-br from-primary-100 to-primary-50 shadow-md group-hover:shadow-lg group-hover:scale-110'
                              }`}>
                                <TreatmentIcon 
                                  size={24} 
                                  className={`transition-all duration-300 ${
                                    selectedTreatment === treatment.name 
                                      ? 'text-white' 
                                      : 'text-primary-600 group-hover:text-primary-700'
                                  }`}
                                />
                              </div>
                              <div className="flex-1">
                                <span className="text-lg font-bold tracking-tight">{treatment.name}</span>
                                <div className={`h-0.5 w-0 group-hover:w-full transition-all duration-500 mt-1 ${
                                  selectedTreatment === treatment.name ? 'bg-white/40' : 'bg-primary-500/30'
                                }`} />
                              </div>
                              <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                                selectedTreatment === treatment.name 
                                  ? 'bg-white/20' 
                                  : 'bg-primary-100 group-hover:bg-primary-200'
                              }`}>
                                <span className="text-base font-bold group-hover:translate-x-1 transition-transform duration-300">→</span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Panel de detalles - aparece desde la derecha o izquierda según la posición */}
                <div 
                  className={`detail-panel fixed inset-y-0 ${isContentRight ? 'left-0' : 'right-0'} bg-gradient-to-br from-gray-900 via-black to-gray-800 shadow-2xl flex items-center overflow-y-auto z-50`}
                  style={{ 
                    transform: isContentRight ? 'translateX(-100%)' : 'translateX(100%)', 
                    opacity: 0,
                    width: '50%',
                    maxWidth: '600px'
                  }}
                >
                  {selectedTreatment && service.treatments.find(t => t.name === selectedTreatment) && (
                    <div className="w-full px-8 py-12 lg:px-12">
                      {/* Botón cerrar con ícono SVG */}
                      <button
                        onClick={() => handleTreatmentClick(service.title, selectedTreatment)}
                        className={`absolute top-8 ${isContentRight ? 'right-8' : 'left-8'} w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all hover:scale-110 group`}
                        aria-label="Cerrar panel"
                      >
                        <CloseIcon size={20} className="text-gray-300 group-hover:text-white" />
                      </button>

                      {(() => {
                        const treatment = service.treatments.find(t => t.name === selectedTreatment)!;
                        return (
                          <div className="max-w-lg mx-auto">
                            <h4 className="text-3xl lg:text-4xl font-heading font-bold text-white mb-4">
                              {treatment.name}
                            </h4>
                            <p className="text-base lg:text-lg text-gray-300 mb-8 leading-relaxed">
                              {treatment.description}
                            </p>

                            {/* Beneficios con íconos SVG */}
                            <h5 className="text-sm uppercase tracking-wider text-primary-400 font-semibold mb-4">
                              Beneficios
                            </h5>
                            <ul className="space-y-3 mb-8">
                              {treatment.benefits.map((benefit: string) => (
                                <li key={benefit} className="flex items-start gap-3 text-gray-300">
                                  <Check size={20} className="text-primary-400 flex-shrink-0 mt-0.5" />
                                  <span className="text-base">{benefit}</span>
                                </li>
                              ))}
                            </ul>

                            {/* Info adicional */}
                            <div className="flex gap-8 mb-8 pb-8 border-b border-white/10">
                              <div>
                                <p className="text-sm text-gray-400 mb-1">Duración</p>
                                <p className="font-semibold text-white">{treatment.duration}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-400 mb-1">Precio</p>
                                <p className="font-semibold text-primary-400">{treatment.price}</p>
                              </div>
                            </div>

                            {/* CTA */}
                            <button className="btn-primary w-full">
                              Reservar Tratamiento
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
