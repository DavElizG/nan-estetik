/**
 * About Section
 * 
 * Sección "Nosotros" con:
 * - Información del centro estético
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
  const contentRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animación del contenido principal
      gsap.from(contentRef.current, {
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
        y: 80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      // Animación de estadísticas
      gsap.from(statsRef.current?.children || [], {
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
      });
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
      className="py-20 md:py-32 bg-secondary-50"
    >
      <div className="container-custom">
        <div ref={contentRef} className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-secondary-900 mb-6">
            Sobre Nosotros
          </h2>
          <div className="w-24 h-1 bg-primary-500 mx-auto mb-8" />
          <p className="text-lg md:text-xl text-secondary-700 mb-6">
            En Nan Estetik, nos dedicamos a realzar tu belleza natural a través
            de tratamientos estéticos de vanguardia. Nuestro equipo de
            profesionales certificados combina experiencia, tecnología avanzada
            y un enfoque personalizado para ofrecerte los mejores resultados.
          </p>
          <p className="text-lg md:text-xl text-secondary-700">
            Cada tratamiento es diseñado específicamente para ti, considerando
            tus necesidades únicas y objetivos de belleza. Tu satisfacción y
            bienestar son nuestra prioridad.
          </p>
        </div>

        {/* Estadísticas */}
        <div
          ref={statsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.value}
                className="card text-center transform hover:scale-105 transition-transform"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <Icon className="text-primary-600" size={32} />
                </div>
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-secondary-600 font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
