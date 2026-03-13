/**
 * Testimonials Section
 * 
 * Sección de testimonios con:
 * - Parallax vertical diferencial
 * - Cards de testimonios con efecto de profundidad
 * - Animaciones suaves con GSAP
 */

'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const decorativeRef1 = useRef<HTMLDivElement>(null);
  const decorativeRef2 = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.children;
      if (!cards) return;

      // Efecto zoom en el título al entrar
      gsap.fromTo(
        titleRef.current,
        {
          scale: 0.8,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Parallax diferencial para cada testimonio
      Array.from(cards).forEach((card, index) => {
        const speed = (index % 2 === 0 ? -20 : 20); // Alternar dirección
        
        gsap.to(card, {
          y: speed,
          ease: 'none',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });

      // Animación de entrada
      gsap.from(cards, {
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'back.out(1.7)',
      });

      // Parallax de elementos decorativos
      gsap.to(decorativeRef1.current, {
        yPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to(decorativeRef2.current, {
        yPercent: 50,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Efecto tilt con pointer move
  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current?.children as HTMLCollectionOf<HTMLElement> | undefined;
    
    if (!section || !cards) return;

    // Crear quickTo animators para cada card
    const animators = Array.from(cards).map((card) => ({
      card,
      rotateX: gsap.quickTo(card, 'rotateX', { ease: 'power3', duration: 0.5 }),
      rotateY: gsap.quickTo(card, 'rotateY', { ease: 'power3', duration: 0.5 }),
      z: gsap.quickTo(card, 'z', { ease: 'power3', duration: 0.5 }),
    }));

    const resetAnimators = () => {
      animators.forEach(({ rotateX, rotateY, z }) => {
        rotateX(0);
        rotateY(0);
        z(0);
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      animators.forEach(({ card, rotateX, rotateY, z }) => {
        const rect = card.getBoundingClientRect();
        
        // Verificar si la card está visible en el viewport
        if (rect.right < 0 || rect.left > window.innerWidth || rect.bottom < 0 || rect.top > window.innerHeight) {
          rotateX(0);
          rotateY(0);
          z(0);
          return;
        }
        
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;
        
        // Posición normalizada del mouse respecto al viewport (-1 a 1)
        const normalizedX = (e.clientX - cardCenterX) / (rect.width / 2);
        const normalizedY = (e.clientY - cardCenterY) / (rect.height / 2);
        
        // Clampear entre -1 y 1
        const clampedX = Math.max(-1, Math.min(1, normalizedX));
        const clampedY = Math.max(-1, Math.min(1, normalizedY));
        
        // Distancia del mouse al centro (0 a ~1.41)
        const distance = Math.hypot(clampedX, clampedY);
        
        // Radio de efecto: si está dentro de 2.5 veces el tamaño de la card
        if (distance < 2.5) {
          // Interpolación suave de intensidad
          const intensity = Math.max(0, 1 - (distance / 2.5));
          
          // Rotaciones muy pronunciadas: ±28 grados
          const newRotateX = gsap.utils.interpolate(28, -28, 0.5 + (clampedY * 0.5)) * intensity;
          const newRotateY = gsap.utils.interpolate(-28, 28, 0.5 + (clampedX * 0.5)) * intensity;
          
          // Elevación en perspectiva 3D más pronunciada
          const translateZ = 50 * intensity;
          
          rotateX(newRotateX);
          rotateY(newRotateY);
          z(translateZ);
        } else {
          // Resetear si está fuera de rango
          rotateX(0);
          rotateY(0);
          z(0);
        }
      });
    };

    section.addEventListener('mousemove', handleMouseMove);
    section.addEventListener('mouseleave', resetAnimators);

    return () => {
      section.removeEventListener('mousemove', handleMouseMove);
      section.removeEventListener('mouseleave', resetAnimators);
    };
  }, []);

  const testimonials = [
    {
      name: 'María González',
      treatment: 'Relleno Labial',
      rating: 5,
      text: 'Excelente atención y resultados increíbles. El equipo de Nan Estetik es muy profesional y me sentí en buenas manos todo el tiempo.',
      image: 1,
    },
    {
      name: 'Carmen Rodríguez',
      treatment: 'Limpieza Facial',
      rating: 5,
      text: 'Los tratamientos faciales son maravillosos. Mi piel nunca se había visto tan radiante. Totalmente recomendado.',
      image: 2,
    },
    {
      name: 'Ana López',
      treatment: 'Tratamiento Corporal',
      rating: 5,
      text: 'Después de varios tratamientos, puedo ver una gran diferencia. El personal es muy amable y profesional.',
      image: 3,
    },
  ];

  return (
    <section
      id="testimonios"
      ref={sectionRef}
      className="py-20 md:py-32 bg-secondary-900 relative overflow-hidden"
      style={{ perspective: '1200px' }}
    >
      {/* Elementos decorativos con parallax */}
      <div
        ref={decorativeRef1}
        className="absolute top-10 left-0 md:left-10 w-40 md:w-72 h-40 md:h-72 bg-primary-500/10 rounded-full blur-3xl pointer-events-none"
      />
      <div
        ref={decorativeRef2}
        className="absolute bottom-10 right-0 md:right-10 w-48 md:w-96 h-48 md:h-96 bg-accent-rose/10 rounded-full blur-3xl pointer-events-none"
      />

      <div className="container-custom relative z-10">
        <div className="text-center mb-20" ref={titleRef}>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-8">
            Lo Que Dicen Nuestras Clientas
          </h2>
          <div className="w-24 h-1 bg-primary-500 mx-auto mb-8" />
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            La satisfacción de nuestras clientas es nuestra mejor carta de presentación.
          </p>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto"
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="card group bg-secondary-800 hover:bg-secondary-750 transition-all duration-300 cursor-pointer"
              style={{ 
                transformStyle: 'preserve-3d',
                willChange: 'transform',
                padding: '2rem',
              }}
            >
              {/* Quote icon */}
              <div className="flex items-center justify-between mb-6">
                <Quote className="text-primary-400 group-hover:text-primary-300 transition-colors" size={40} />
                <div className="flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={`${testimonial.name}-star-${i}`}
                      className="text-yellow-400 fill-yellow-400"
                      size={18}
                    />
                  ))}
                </div>
              </div>

              {/* Testimonial text */}
              <p className="text-gray-200 mb-8 italic text-lg">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Avatar and info */}
              <div className="flex items-center gap-4 pt-6 border-t border-secondary-700">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-accent-rose flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-white text-lg">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-primary-300">
                    {testimonial.treatment}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
