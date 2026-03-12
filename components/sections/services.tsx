/**
 * Services Section
 * 
 * Sección de servicios con:
 * - Mismo estilo que About (alternando izquierda/derecha)
 * - Scroll reveal animations
 * - Animaciones interactivas con GSAP ScrollTrigger
 * - Datos consumidos desde API de PostgreSQL
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Droplet, Zap, Star, Sun, type LucideIcon } from 'lucide-react';
import type { Service as ServiceType } from '@/types/service';

gsap.registerPlugin(ScrollTrigger);

// Map de iconos disponibles
const iconMap: { [key: string]: LucideIcon } = {
  Sparkles,
  Droplet,
  Zap,
  Star,
  Sun,
};

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
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
        
        // Refrescar ScrollTrigger después de cargar datos dinámicos
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 100);
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
      // Animaciones idénticas a About
      const contentSections = contentRef.current?.querySelectorAll('.service-content-section');
      contentSections?.forEach((section) => {
        // Título de sección
        const title = section.querySelector('.section-title');
        if (title) {
          gsap.from(title, {
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
            y: 60,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
          });
        }

        // Párrafos con stagger
        const paragraphs = section.querySelectorAll('.animate-paragraph');
        if (paragraphs.length > 0) {
          gsap.from(paragraphs, {
            scrollTrigger: {
              trigger: section,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
            y: 40,
            opacity: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power3.out',
          });
        }

        // Elementos decorativos (tratamientos)
        const decorElements = section.querySelectorAll('.decor-element');
        if (decorElements.length > 0) {
          gsap.from(decorElements, {
            scrollTrigger: {
              trigger: section,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
            scale: 0.8,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'back.out(1.7)',
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, services]);

  if (loading) {
    return (
      <section id="servicios" className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Cargando servicios...</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="servicios"
      ref={sectionRef}
      className="relative bg-transparent py-20"
    >
      <div className="container-custom">
        <div ref={contentRef} className="py-16 lg:py-32">
          
          {/* Título principal de Servicios - IZQUIERDA */}
          <div className="service-content-section min-h-[60vh] md:min-h-[70vh] flex items-center pb-12 md:pb-20 lg:pb-24">
            <div className="w-full px-4 sm:px-6 lg:w-[45%] lg:pr-8">
              <div className="mb-4 md:mb-6">
                <span className="text-xs uppercase tracking-[0.3em] text-primary-400 font-semibold">
                  Nuestros Servicios
                </span>
              </div>
              
              <h2 className="section-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-white leading-tight mb-6 md:mb-8">
                Tratamientos{' '}
                <span className="block text-primary-500">Especializados</span>
              </h2>
              
              <p className="animate-paragraph text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl">
                Ofrecemos una amplia gama de tratamientos estéticos diseñados para
                realzar tu belleza natural y mejorar tu confianza. Cada servicio
                está personalizado para tus necesidades únicas.
              </p>
            </div>
          </div>

          {/* Servicios dinámicos - Alternando IZQ/DER */}
          {services.map((service, index) => {
            const isRight = index % 2 !== 0;
            const chapterNumber = ['I', 'II', 'III', 'IV', 'V'][index] || `${index + 1}`;
            
            return (
              <div 
                key={service.id}
                data-service={service.title}
                className={`service-content-section min-h-[70vh] md:min-h-[80vh] lg:min-h-screen flex items-center ${isRight ? 'justify-end' : ''} pb-12 md:pb-20 lg:pb-32`}
              >
                <div className={`w-full px-4 sm:px-6 lg:w-[45%] ${isRight ? 'lg:pl-8 lg:text-right' : 'lg:pr-8'}`}>
                  <div className="mb-6">
                    <span className="text-xs uppercase tracking-[0.3em] text-primary-400/70 font-semibold">
                      Servicio {chapterNumber}
                    </span>
                  </div>
                  
                  <h3 className="section-title text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-6">
                    {service.title}
                  </h3>
                  
                  <p className={`animate-paragraph text-sm sm:text-base text-gray-300 leading-relaxed mb-4 md:mb-6 lg:mb-8 max-w-xl ${isRight ? 'lg:ml-auto' : ''}`}>
                    {service.description}
                  </p>

                  {/* Badge premium */}
                  {service.isPremium && (
                    <div className={`mb-4 md:mb-6 ${isRight ? 'lg:flex lg:justify-end' : ''}`}>
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/20 border border-primary-500/40 text-primary-400 rounded-full text-sm font-semibold">
                        <Star size={16} />
                        Tratamiento Premium
                      </span>
                    </div>
                  )}

                  {/* Grid de tratamientos - estilo idéntico a About values */}
                  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 ${isRight ? 'max-w-lg lg:ml-auto' : 'max-w-lg'}`}>
                    {service.treatments.map((treatment) => {
                      const TreatmentIcon = iconMap[treatment.icon] || Sparkles;
                      return (
                        <div 
                          key={treatment.id}
                          className="decor-element group p-4 md:p-5 bg-white/5 backdrop-blur-sm rounded-xl md:rounded-2xl border border-primary-500/20 hover:border-primary-500/40 transition-all duration-500 hover:bg-white/10 cursor-pointer"
                        >
                          <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-500/20 rounded-lg md:rounded-xl flex items-center justify-center mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300">
                            <TreatmentIcon className="text-primary-400" size={18} />
                          </div>
                          <h4 className="text-sm md:text-base font-bold text-white mb-1">{treatment.name}</h4>
                          <p className="text-xs text-gray-400">{treatment.duration} • {treatment.price}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
