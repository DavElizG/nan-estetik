/**
 * About Section - Experiencia Inmersiva
 * 
 * Sección extendida "Nosotros" con:
 * - Textos alternando izquierda/derecha
 * - Narrativa extensa (~450vh)
 * - GSAP ScrollTrigger para animaciones sincronizadas
 * - Layout responsive
 * Nota: El modelo 3D ahora está en ContentWrapper para extenderse a Services
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Users, Heart, Leaf, Shield, Star, Gem, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Datos de estadísticas con animación de conteo
const stats = [
  { icon: Award, value: 10, suffix: '+', label: 'Años de experiencia' },
  { icon: Users, value: 5000, suffix: '+', label: 'Pacientes satisfechos' },
  { icon: Heart, value: 100, suffix: '%', label: 'Compromiso con tu belleza' },
  { icon: Star, value: 50, suffix: '+', label: 'Tratamientos especializados' },
];

// Valores del spa
const values = [
  {
    icon: Leaf,
    title: 'Naturalidad',
    description: 'Realzamos tu belleza natural sin alterar tu esencia única.',
  },
  {
    icon: Shield,
    title: 'Seguridad',
    description: 'Protocolos estrictos y equipos certificados para tu tranquilidad.',
  },
  {
    icon: Gem,
    title: 'Excelencia',
    description: 'Productos premium y técnicas de vanguardia internacional.',
  },
  {
    icon: Sparkles,
    title: 'Innovación',
    description: 'Tecnología de última generación para resultados excepcionales.',
  },
];

/**
 * Componente de contador animado
 */
function AnimatedCounter({ 
  value, 
  suffix = '', 
  isVisible 
}: Readonly<{ 
  value: number; 
  suffix?: string; 
  isVisible: boolean;
}>) {
  const [count, setCount] = useState(0);
  const countRef = useRef({ value: 0 });

  useEffect(() => {
    if (!isVisible) return;

    gsap.to(countRef.current, {
      value,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => {
        setCount(Math.round(countRef.current.value));
      },
    });
  }, [isVisible, value]);

  return (
    <span className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ============================================
      // ANIMACIONES DE CONTENIDO
      // ============================================
      const contentSections = contentRef.current?.querySelectorAll('.about-content-section');
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

        // Elementos decorativos
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

      // Trigger para estadísticas
      const statsSection = document.querySelector('.stats-section');
      if (statsSection) {
        ScrollTrigger.create({
          trigger: statsSection,
          start: 'top 80%',
          onEnter: () => setStatsVisible(true),
        });
      }

      // Parallax sutil en elementos decorativos de fondo
      gsap.to('.parallax-bg-element', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
        y: 200,
        ease: 'none',
      });

      // Línea de progreso
      gsap.to('.about-progress-line', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
        scaleY: 1,
        transformOrigin: 'top',
        ease: 'none',
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="nosotros"
      ref={sectionRef}
      className="relative bg-transparent py-20"
    >
      {/* ============================================ */}
      {/* ELEMENTOS DECORATIVOS DE FONDO */}
      {/* ============================================ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden max-w-full">
        <div className="parallax-bg-element absolute top-[10%] right-[10%] w-48 md:w-96 h-48 md:h-96 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="parallax-bg-element absolute top-[40%] left-[5%] w-32 md:w-64 h-32 md:h-64 bg-primary-400/5 rounded-full blur-3xl" />
        <div className="parallax-bg-element absolute top-[70%] right-[20%] w-40 md:w-80 h-40 md:h-80 bg-primary-300/5 rounded-full blur-3xl" />
      </div>

      {/* ============================================ */}
      {/* LÍNEA DE PROGRESO LATERAL */}
      {/* ============================================ */}
      <div className="hidden lg:block fixed left-8 top-1/2 -translate-y-1/2 h-48 w-px bg-white/10 z-50">
        <div 
          className="about-progress-line absolute top-0 left-0 w-full bg-gradient-to-b from-primary-400 to-primary-600"
          style={{ height: '100%', transform: 'scaleY(0)' }}
        />
      </div>

      {/* ============================================ */}
      {/* CONTENIDO PRINCIPAL - ALTERNANDO IZQ/DER */}
      {/* ============================================ */}
      <div className="relative z-10">
        <div className="container-custom">
          <div ref={contentRef} className="py-16 lg:py-32">
            
            {/* SECCIÓN 1: Hero About / Introducción - IZQUIERDA */}
            <div className="about-content-section min-h-screen flex items-center pb-32">
              <div className="w-full lg:w-[45%] lg:pr-8">
                <div className="mb-6">
                  <span className="text-xs uppercase tracking-[0.3em] text-primary-400 font-semibold">
                    Nuestra Esencia
                  </span>
                </div>
                
                <h2 className="section-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-white leading-tight mb-6 md:mb-8">
                  Donde la{' '}
                  <span className="block text-primary-500">Belleza</span>{' '}
                  Florece
                </h2>
                
                <div className="space-y-4 md:space-y-6 max-w-xl">
                  <p className="animate-paragraph text-base md:text-lg text-gray-300 leading-relaxed">
                    En{' '}
                    <span className="text-primary-400 font-semibold">Nan Estetik</span>, 
                    creemos que cada persona posee una belleza única que merece ser 
                    cuidada y realzada con dedicación, ciencia y arte.
                  </p>
                  <p className="animate-paragraph text-gray-400 leading-relaxed">
                    Más que un centro estético, somos un santuario donde la transformación 
                    exterior se encuentra con el bienestar interior. Cada tratamiento es 
                    una experiencia diseñada para ti.
                  </p>
                </div>

                {/* Indicador de scroll */}
                <div className="mt-16 flex items-center gap-4 text-gray-500">
                  <div className="w-8 h-12 border-2 border-gray-600 rounded-full flex items-start justify-center p-2">
                    <div className="w-1 h-3 bg-primary-500 rounded-full animate-bounce" />
                  </div>
                  <span className="text-sm">Desliza para descubrir nuestra historia</span>
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: Nuestra Historia - DERECHA */}
            <div className="about-content-section min-h-[70vh] md:min-h-[80vh] lg:min-h-screen flex items-center justify-end pb-12 md:pb-20 lg:pb-32">
              <div className="w-full px-4 sm:px-6 lg:w-[45%] lg:pl-8 lg:text-right">
                <div className="mb-4 md:mb-6">
                  <span className="text-xs uppercase tracking-[0.3em] text-primary-400/70 font-semibold">
                    Capítulo I
                  </span>
                </div>
                
                <h3 className="section-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-6 md:mb-8">
                  Nuestra Historia
                </h3>
                
                <div className="space-y-4 md:space-y-6 max-w-xl lg:ml-auto">
                  <p className="animate-paragraph text-sm sm:text-base text-gray-300 leading-relaxed">
                    <span className="text-primary-400 font-semibold">Nan Estetik</span> nació 
                    de un sueño compartido: crear un espacio donde la ciencia de la estética 
                    se fusionara con el arte del cuidado personal. Fundado hace más de una 
                    década, nuestro centro ha sido testigo de miles de transformaciones.
                  </p>
                  <p className="animate-paragraph text-gray-400 leading-relaxed">
                    Comenzamos en un pequeño estudio con una visión clara: democratizar 
                    la estética de alta calidad sin comprometer los estándares de excelencia. 
                    Cada año, esa visión se ha fortalecido mientras crecíamos junto a 
                    nuestra comunidad.
                  </p>
                  <p className="animate-paragraph text-gray-400 leading-relaxed">
                    Hoy, somos referentes en tratamientos faciales y corporales, pero nuestra 
                    esencia permanece intacta: el compromiso genuino con el bienestar de cada 
                    persona que cruza nuestras puertas.
                  </p>
                </div>

                {/* Timeline decorativo */}
                <div className="mt-12 flex items-center gap-4 lg:justify-end">
                  <div className="decor-element flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary-500 rounded-full" />
                    <span className="text-sm text-primary-400">2014</span>
                  </div>
                  <div className="flex-1 max-w-32 h-px bg-gradient-to-r from-primary-500 to-transparent lg:bg-gradient-to-l" />
                  <div className="decor-element flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary-400 rounded-full" />
                    <span className="text-sm text-primary-400">Hoy</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN 3: Filosofía y Valores - IZQUIERDA */}
            <div className="about-content-section min-h-screen flex items-center pb-32">
              <div className="w-full lg:w-[45%] lg:pr-8">
                <div className="mb-6">
                  <span className="text-xs uppercase tracking-[0.3em] text-primary-400/70 font-semibold">
                    Capítulo II
                  </span>
                </div>
                
                <h3 className="section-title text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-8">
                  Filosofía & Valores
                </h3>
                
                <p className="animate-paragraph text-gray-300 leading-relaxed mb-10 max-w-xl">
                  Nuestra filosofía se fundamenta en el respeto por la individualidad. 
                  No buscamos transformarte en alguien más, sino revelar la mejor versión 
                  de ti mismo, con tratamientos que honran tu esencia natural.
                </p>

                {/* Grid de valores */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 max-w-lg">
                  {values.map((val) => {
                    const Icon = val.icon;
                    return (
                      <div 
                        key={val.title}
                        className="decor-element group p-4 md:p-5 bg-white/5 backdrop-blur-sm rounded-xl md:rounded-2xl border border-primary-500/20 hover:border-primary-500/40 transition-all duration-500 hover:bg-white/10"
                      >
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-500/20 rounded-lg md:rounded-xl flex items-center justify-center mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300">
                          <Icon className="text-primary-400" size={18} />
                        </div>
                        <h4 className="text-sm md:text-base font-bold text-white mb-1">{val.title}</h4>
                        <p className="text-xs text-gray-400">{val.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* SECCIÓN 4: Nuestro Enfoque - DERECHA */}
            <div className="about-content-section min-h-screen flex items-center justify-end pb-32">
              <div className="w-full lg:w-[45%] lg:pl-8 lg:text-right">
                <div className="mb-6">
                  <span className="text-xs uppercase tracking-[0.3em] text-primary-400/70 font-semibold">
                    Capítulo III
                  </span>
                </div>
                
                <h3 className="section-title text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-8">
                  Nuestro Enfoque
                </h3>
                
                <div className="space-y-6 max-w-xl lg:ml-auto">
                  <p className="animate-paragraph text-gray-300 leading-relaxed">
                    Cada tratamiento en{' '}
                    <span className="text-primary-400 font-semibold">Nan Estetik</span>{' '}
                    comienza con una consulta personalizada. Escuchamos tus inquietudes, 
                    analizamos tu piel y diseñamos un plan único que se adapta a tus 
                    necesidades específicas.
                  </p>
                  <p className="animate-paragraph text-gray-400 leading-relaxed">
                    Combinamos técnicas tradicionales probadas con innovaciones de 
                    vanguardia. Nuestros especialistas se capacitan constantemente en 
                    las últimas tendencias y tecnologías del sector estético internacional.
                  </p>
                  <p className="animate-paragraph text-gray-400 leading-relaxed">
                    El resultado: tratamientos que no solo embellecen, sino que cuidan 
                    tu salud cutánea a largo plazo, utilizando productos de las mejores 
                    casas dermatológicas del mundo.
                  </p>
                </div>

                {/* Quote inspiracional */}
                <blockquote className="mt-12 pl-6 border-l-4 border-primary-500/50 max-w-lg lg:ml-auto lg:border-l-0 lg:border-r-4 lg:pr-6 lg:pl-0">
                  <p className="animate-paragraph text-xl italic text-primary-300/80 font-heading">
                    &ldquo;La verdadera belleza florece cuando nos sentimos bien en nuestra propia piel.&rdquo;
                  </p>
                  <cite className="mt-4 block text-sm text-gray-500 not-italic">
                    — Filosofía Nan Estetik
                  </cite>
                </blockquote>
              </div>
            </div>

            {/* SECCIÓN 5: Experiencia del Cliente - IZQUIERDA */}
            <div className="about-content-section min-h-screen flex items-center pb-32">
              <div className="w-full lg:w-[45%] lg:pr-8">
                <div className="mb-6">
                  <span className="text-xs uppercase tracking-[0.3em] text-primary-400/70 font-semibold">
                    Capítulo IV
                  </span>
                </div>
                
                <h3 className="section-title text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-8">
                  Tu Experiencia
                </h3>
                
                <div className="space-y-6 max-w-xl">
                  <p className="animate-paragraph text-gray-300 leading-relaxed">
                    Desde el momento en que cruzas nuestras puertas, te envuelve un 
                    ambiente de serenidad diseñado para tu relajación. Cada detalle, 
                    desde la iluminación hasta los aromas, está pensado para que tu 
                    visita sea una experiencia sensorial completa.
                  </p>
                  <p className="animate-paragraph text-gray-400 leading-relaxed">
                    Nuestro equipo te acompaña en cada paso: consulta inicial, 
                    tratamiento personalizado, seguimiento post-procedimiento y 
                    recomendaciones de cuidado en casa. Tu bienestar no termina 
                    cuando sales de nuestro centro.
                  </p>
                </div>

                {/* Pasos del journey */}
                <div className="mt-12 space-y-3 max-w-md">
                  {['Bienvenida personalizada', 'Diagnóstico experto', 'Tratamiento a medida', 'Seguimiento continuo'].map((step, idx) => (
                    <div 
                      key={step}
                      className="decor-element flex items-center gap-4 p-3 bg-gradient-to-r from-white/5 to-transparent rounded-xl"
                    >
                      <div className="w-8 h-8 bg-primary-500/30 rounded-full flex items-center justify-center text-primary-400 font-bold text-sm">
                        {idx + 1}
                      </div>
                      <span className="text-white text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECCIÓN 6: Estadísticas - DERECHA */}
            <div className="about-content-section stats-section min-h-screen flex items-center justify-end pb-32">
              <div className="w-full lg:w-[45%] lg:pl-8 lg:text-right">
                <div className="mb-6">
                  <span className="text-xs uppercase tracking-[0.3em] text-primary-400/70 font-semibold">
                    Capítulo V
                  </span>
                </div>
                
                <h3 className="section-title text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-8">
                  Números que Hablan
                </h3>
                
                <p className="animate-paragraph text-gray-300 leading-relaxed mb-12 max-w-xl lg:ml-auto">
                  Más de una década dedicados a la excelencia estética nos respalda. 
                  Estos números reflejan miles de historias de confianza y transformación.
                </p>

                {/* Grid de estadísticas */}
                <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-md lg:ml-auto">
                  {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div 
                        key={stat.label}
                        className="decor-element text-center p-4 md:p-5 bg-white/5 backdrop-blur-sm rounded-xl md:rounded-2xl border border-primary-500/20"
                      >
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                          <Icon className="text-primary-400" size={18} />
                        </div>
                        <div className="text-xl md:text-2xl lg:text-3xl font-bold text-primary-400 mb-1">
                          <AnimatedCounter 
                            value={stat.value} 
                            suffix={stat.suffix} 
                            isVisible={statsVisible}
                          />
                        </div>
                        <p className="text-xs text-gray-400">{stat.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* SECCIÓN 7: Compromiso Final - IZQUIERDA */}
            <div className="about-content-section min-h-screen flex items-center pb-16">
              <div className="w-full lg:w-[45%] lg:pr-8">
                <div className="mb-6">
                  <span className="text-xs uppercase tracking-[0.3em] text-primary-400/70 font-semibold">
                    Nuestro Compromiso
                  </span>
                </div>
                
                <h3 className="section-title text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-8">
                  Excelencia en{' '}
                  <span className="text-primary-500">Cada Detalle</span>
                </h3>
                
                <div className="space-y-6 max-w-xl">
                  <p className="animate-paragraph text-gray-300 leading-relaxed">
                    Utilizamos exclusivamente productos de casas dermatológicas líderes 
                    a nivel mundial: formulaciones clínicas, ingredientes activos de 
                    máxima pureza y tecnologías probadas científicamente.
                  </p>
                  <p className="animate-paragraph text-gray-400 leading-relaxed">
                    Nuestro equipo participa regularmente en congresos internacionales 
                    y programas de certificación avanzada. La formación continua es 
                    parte integral de nuestro ADN.
                  </p>
                  <p className="animate-paragraph text-gray-400 leading-relaxed">
                    Cada protocolo sigue estándares de higiene y seguridad que superan 
                    las normativas del sector. Tu confianza es nuestro mayor activo.
                  </p>
                </div>

                {/* CTA Final */}
                <div className="mt-12 flex flex-col sm:flex-row gap-4 max-w-lg">
                  <a 
                    href="#servicios"
                    className="btn-primary text-center justify-center"
                  >
                    Explorar Servicios
                  </a>
                  <a 
                    href="#contacto"
                    className="btn-secondary text-center justify-center"
                  >
                    Agendar Consulta
                  </a>
                </div>

                {/* Certificaciones/badges decorativos */}
                <div className="mt-12 flex flex-wrap gap-3">
                  {['Productos Premium', 'Equipo Certificado', 'Protocolos Seguros'].map((badge) => (
                    <span 
                      key={badge}
                      className="decor-element px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full text-sm text-primary-400"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
