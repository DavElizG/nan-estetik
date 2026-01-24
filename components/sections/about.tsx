/**
 * About Section
 * 
 * Sección "Nosotros" estilo vertical parallax como webdevpie:
 * - Dos columnas: título izquierda (con parallax) y contenido derecha
 * - Animaciones con ScrollTrigger
 * - Diseño responsive
 */

'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Users, Heart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const colLeftRef = useRef<HTMLDivElement>(null);
  const colRightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline parallax para columna izquierda (como ejemplo webdevpie)
      const timeline = gsap.timeline({ paused: true });
      timeline.fromTo(
        colLeftRef.current,
        { y: 0 },
        { y: '170vh', duration: 1, ease: 'none' },
        0
      );

      ScrollTrigger.create({
        animation: timeline,
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom center',
        scrub: true,
      });

      // Animación de entrada para items de la derecha
      const rightItems = colRightRef.current?.children;
      if (rightItems) {
        gsap.from(rightItems, {
          scrollTrigger: {
            trigger: colRightRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          y: 60,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    {
      icon: Award,
      value: '10+',
      label: 'Años de experiencia',
    },
    {
      icon: Users,
      value: '5000+',
      label: 'Pacientes satisfechos',
    },
    {
      icon: Heart,
      value: '100%',
      label: 'Compromiso con tu belleza',
    },
  ];

  return (
    <section
      id="nosotros"
      ref={sectionRef}
      className="min-h-[200vh] w-full bg-secondary-50 relative overflow-hidden"
    >
      <div className="container-custom py-12">
        <div className="flex flex-col md:flex-row justify-center items-start gap-8 md:gap-16">
          {/* Columna izquierda - Título con parallax */}
          <div 
            ref={colLeftRef} 
            className="w-full md:w-1/2 md:sticky md:top-20"
          >
            <div className="border-l-4 border-primary-500 pl-6 py-4">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading font-black text-secondary-900 leading-[0.85]">
                <span className="block">Sobre</span>
                <span className="block text-primary-600">Nan</span>
                <span className="block">Estetik</span>
              </h2>
            </div>
            
            {/* Stats debajo del título */}
            <div className="mt-12 grid grid-cols-1 gap-6">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.value}
                    className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <Icon className="text-primary-600" size={24} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary-600">
                        {stat.value}
                      </div>
                      <div className="text-sm text-secondary-600">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Columna derecha - Contenido */}
          <div 
            ref={colRightRef} 
            className="w-full md:w-[45%] space-y-48 md:space-y-64 pt-8 md:pt-0"
          >
            <div className="vertical-item">
              <h3 className="text-xl font-bold text-primary-600 uppercase tracking-wide mb-4">
                Nuestra Misión
              </h3>
              <p className="text-lg text-secondary-700 leading-relaxed">
                En Nan Estetik, nos dedicamos a realzar tu belleza natural a través
                de tratamientos estéticos de vanguardia. Nuestro equipo de
                profesionales certificados combina experiencia, tecnología avanzada
                y un enfoque personalizado para ofrecerte los mejores resultados.
              </p>
            </div>

            <div className="vertical-item">
              <h3 className="text-xl font-bold text-primary-600 uppercase tracking-wide mb-4">
                Experiencia Personalizada
              </h3>
              <p className="text-lg text-secondary-700 leading-relaxed">
                Cada tratamiento es diseñado específicamente para ti, considerando
                tus necesidades únicas y objetivos de belleza. Tu satisfacción y
                bienestar son nuestra prioridad absoluta.
              </p>
            </div>

            <div className="vertical-item">
              <h3 className="text-xl font-bold text-primary-600 uppercase tracking-wide mb-4">
                Tecnología Avanzada
              </h3>
              <p className="text-lg text-secondary-700 leading-relaxed">
                Utilizamos los equipos más modernos y técnicas innovadoras del mercado
                para garantizar resultados excepcionales con la máxima seguridad y
                confort durante cada procedimiento.
              </p>
            </div>

            <div className="vertical-item">
              <h3 className="text-xl font-bold text-primary-600 uppercase tracking-wide mb-4">
                Compromiso Total
              </h3>
              <p className="text-lg text-secondary-700 leading-relaxed">
                Desde tu primera consulta hasta el seguimiento post-tratamiento,
                estamos comprometidos con tu bienestar. Nuestro equipo está siempre
                disponible para resolver tus dudas y acompañarte en tu transformación.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
