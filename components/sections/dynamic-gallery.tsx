/**
 * Dynamic Gallery - Estilo Lando Norris
 *
 * CLAVE: Imágenes hero grandes (28-32vw) + clusters de pequeñas (14-22vw).
 * Strip 500vw con 3-5 imágenes por viewport en clusters agrupados.
 * Balance entre espacio blanco y contenido como landonorris.com.
 */

'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

interface ScatteredImage {
  src: string;
  alt: string;
  type: 'image' | 'video';
  left: string;
  top: string;
  width: string;
  height: string;
  label?: string; // Etiqueta pequeña tipo "MARZO 2024"
}

// Layout estilo Lando Norris: imágenes hero grandes + clusters de pequeñas
// Strip 500vw de ancho → ~5 "pantallas" con 3-5 imágenes cada una en clusters
const scatteredImages: ScatteredImage[] = [
  // Panel 1 (0-100vw) - Cluster inicial
  // Imagen pequeña arriba-izquierda
  {
    src: '/images/WhatsApp Image 2026-02-22 at 3.20.37 PM.jpeg',
    alt: 'Tratamiento estético', type: 'image',
    left: '8vw', top: '10%', width: '14vw', height: '32%',
    label: 'FACIAL, 2026',
  },
  // Imagen HERO grande centro
  {
    src: '/images/WhatsApp Video 2026-02-22 at 3.20.38 PM.mp4',
    alt: 'Procedimiento en video', type: 'video',
    left: '32vw', top: '20%', width: '32vw', height: '60%',
    label: 'TRATAMIENTO AVANZADO',
  },
  // Imagen pequeña arriba-derecha
  {
    src: '/images/WhatsApp Image 2026-02-22 at 3.22.17 PM.jpeg',
    alt: 'Resultado natural', type: 'image',
    left: '72vw', top: '8%', width: '16vw', height: '36%',
    label: 'FEBRERO, 2026',
  },
  // Imagen mediana abajo-derecha
  {
    src: '/images/WhatsApp Image 2026-02-22 at 3.20.37 PM (1).jpeg',
    alt: 'Antes y después', type: 'image',
    left: '70vw', top: '58%', width: '18vw', height: '38%',
    label: 'ANTES & DESPUÉS',
  },

  // Panel 2 (100-200vw) - Cluster medio
  // Imagen mediana arriba
  {
    src: '/images/WhatsApp Image 2026-02-22 at 3.20.38 PM.jpeg',
    alt: 'Resultado facial', type: 'image',
    left: '110vw', top: '12%', width: '20vw', height: '42%',
    label: 'RELLENO LABIAL',
  },
  // Imagen grande centro-derecha
  {
    src: '/images/WhatsApp Image 2026-02-22 at 3.22.18 PM.jpeg',
    alt: 'Transformación', type: 'image',
    left: '140vw', top: '25%', width: '28vw', height: '52%',
    label: 'ENERO, 2026',
  },
  // Imagen pequeña abajo-izquierda
  {
    src: '/images/WhatsApp Image 2026-02-22 at 3.20.37 PM (2).jpeg',
    alt: 'Belleza natural', type: 'image',
    left: '108vw', top: '62%', width: '14vw', height: '30%',
    label: 'SKINCARE',
  },
  // Imagen mediana derecha
  {
    src: '/images/WhatsApp Video 2026-02-22 at 3.20.41 PM.mp4',
    alt: 'Proceso de tratamiento', type: 'video',
    left: '175vw', top: '15%', width: '18vw', height: '40%',
    label: 'PROCESO',
  },

  // Panel 3 (200-300vw) - Con el título + imágenes
  // Imagen pequeña arriba-izquierda
  {
    src: '/images/WhatsApp Image 2026-02-22 at 3.20.38 PM (1).jpeg',
    alt: 'Cuidado facial', type: 'image',
    left: '205vw', top: '8%', width: '15vw', height: '34%',
    label: 'DICIEMBRE, 2025',
  },
  // Imagen pequeña abajo-derecha del título
  {
    src: '/images/WhatsApp Image 2026-02-22 at 3.22.17 PM (1).jpeg',
    alt: 'Resultado premium', type: 'image',
    left: '275vw', top: '58%', width: '16vw', height: '36%',
    label: 'REJUVENECIMIENTO',
  },

  // Panel 4 (300-400vw) - Cluster post-título
  // Imagen HERO grande izquierda
  {
    src: '/images/WhatsApp Image 2026-02-22 at 3.20.37 PM (3).jpeg',
    alt: 'Tratamiento profesional', type: 'image',
    left: '310vw', top: '15%', width: '30vw', height: '58%',
    label: 'HARMONIZACIÓN FACIAL',
  },
  // Imagen mediana arriba-derecha
  {
    src: '/images/WhatsApp Image 2026-02-22 at 3.22.18 PM (1).jpeg',
    alt: 'Resultado espectacular', type: 'image',
    left: '352vw', top: '10%', width: '18vw', height: '38%',
    label: 'NOVIEMBRE, 2025',
  },
  // Imagen pequeña abajo-derecha
  {
    src: '/images/WhatsApp Image 2026-02-22 at 3.20.38 PM (2).jpeg',
    alt: 'Rejuvenecimiento', type: 'image',
    left: '378vw', top: '60%', width: '14vw', height: '32%',
    label: 'BOTOX',
  },

  // Panel 5 (400-500vw) - Cluster final
  // Imagen mediana arriba-izquierda
  {
    src: '/images/WhatsApp Video 2026-02-22 at 3.20.42 PM.mp4',
    alt: 'Sesión de tratamiento', type: 'video',
    left: '415vw', top: '12%', width: '22vw', height: '46%',
    label: 'SESIÓN EN VIVO',
  },
  // Imagen grande centro-derecha
  {
    src: '/images/WhatsApp Image 2026-02-22 at 3.20.37 PM (4).jpeg',
    alt: 'Belleza radiante', type: 'image',
    left: '448vw', top: '22%', width: '26vw', height: '54%',
    label: 'OCTUBRE, 2025',
  },
  // Imagen pequeña abajo
  {
    src: '/images/WhatsApp Image 2026-02-22 at 3.22.18 PM (2).jpeg',
    alt: 'Transformación completa', type: 'image',
    left: '420vw', top: '65%', width: '14vw', height: '30%',
    label: 'PEELING',
  },
  // Imagen mediana derecha
  {
    src: '/images/WhatsApp Image 2026-02-22 at 3.20.38 PM (3).jpeg',
    alt: 'Arte estético', type: 'image',
    left: '480vw', top: '10%', width: '16vw', height: '36%',
    label: 'RADIOFRECUENCIA',
  },
];

export function DynamicGallery() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const strip = stripRef.current;
    if (!wrapper || !strip) return;

    const getScrollDistance = () => strip.offsetWidth - window.innerWidth;
    const getEndValue = () => `+=${strip.offsetWidth}`;

    const ctx = gsap.context(() => {
      gsap.to(strip, {
        x: () => -getScrollDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: getEndValue,
          invalidateOnRefresh: true,
        },
      });

      // Parallax sutil en cada imagen
      const items = strip.querySelectorAll('.scattered-img');
      items.forEach((item, i) => {
        const speeds = [-20, 30, -15, 25, -35, 18, -22, 28, -12, 32, -25, 20, -18, 35, -28, 15, -30];
        gsap.to(item, {
          y: speeds[i % speeds.length],
          ease: 'none',
          scrollTrigger: {
            trigger: wrapper,
            start: 'top top',
            end: getEndValue,
            scrub: 2,
          },
        });
      });
    }, wrapperRef);

    // Cursor-driven perspective tilt - Efecto fluido con gsap.quickTo para mejor rendimiento
    const images = strip.querySelectorAll('.tilt-card') as NodeListOf<HTMLElement>;
    
    // Crear quickTo animators para cada imagen - mucho más eficiente
    const animators = Array.from(images).map((img) => ({
      img,
      rotateX: gsap.quickTo(img, 'rotateX', { ease: 'power3', duration: 0.5 }),
      rotateY: gsap.quickTo(img, 'rotateY', { ease: 'power3', duration: 0.5 }),
      z: gsap.quickTo(img, 'z', { ease: 'power3', duration: 0.5 }),
    }));

    const resetAnimators = () => {
      animators.forEach(({ rotateX, rotateY, z }) => {
        rotateX(0);
        rotateY(0);
        z(0);
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      animators.forEach(({ img, rotateX, rotateY, z }) => {
        const rect = img.getBoundingClientRect();
        
        // Verificar si la imagen está visible en el viewport
        if (rect.right < 0 || rect.left > window.innerWidth) {
          rotateX(0);
          rotateY(0);
          z(0);
          return;
        }
        
        const imgCenterX = rect.left + rect.width / 2;
        const imgCenterY = rect.top + rect.height / 2;
        
        // Posición normalizada del mouse respecto al viewport (-1 a 1)
        const normalizedX = (e.clientX - imgCenterX) / (rect.width / 2);
        const normalizedY = (e.clientY - imgCenterY) / (rect.height / 2);
        
        // Clampear entre -1 y 1
        const clampedX = Math.max(-1, Math.min(1, normalizedX));
        const clampedY = Math.max(-1, Math.min(1, normalizedY));
        
        // Distancia del mouse al centro (0 a ~1.41)
        const distance = Math.sqrt(clampedX ** 2 + clampedY ** 2);
        
        // Radio de efecto: si está dentro de 2.5 veces el tamaño de la imagen
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

    wrapper.addEventListener('mousemove', handleMouseMove);
    wrapper.addEventListener('mouseleave', resetAnimators);

    return () => {
      ctx.revert();
      wrapper.removeEventListener('mousemove', handleMouseMove);
      wrapper.removeEventListener('mouseleave', resetAnimators);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative bg-cream-50 overflow-hidden"
      style={{ perspective: '1200px' }}
    >
      {/* Strip con posicionamiento absoluto */}
      <div
        ref={stripRef}
        className="relative"
        style={{ width: '500vw', height: '100vh', transformStyle: 'preserve-3d' }}
      >
        {/* Texto de fondo - POSICIONADOS EN ESPACIOS BLANCOS */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
          {/* Panel 1: Espacios blancos: 0-8vw, 22-32vw (arriba), 66-72vw centro */}
          <div
            className="absolute font-heading font-black text-secondary-900/[0.12] tracking-tight leading-none select-none"
            style={{ left: '24vw', top: '82%', fontSize: 'clamp(4rem, 7vw, 9rem)' }}
          >
            BELLEZA
          </div>
          <div
            className="absolute font-sans font-light italic text-secondary-900/[0.08] tracking-wide leading-none select-none"
            style={{ left: '2vw', top: '48%', fontSize: 'clamp(2rem, 3.5vw, 4rem)' }}
          >
            Tu Mejor Versión
          </div>
          
          {/* Panel 2 (100-200vw): Espacios: 95-108vw, 130-140vw abajo */}
          <div
            className="absolute font-heading font-black text-secondary-900/[0.12] tracking-tight leading-none select-none"
            style={{ left: '92vw', top: '58%', fontSize: 'clamp(5rem, 9vw, 11rem)' }}
          >
            ARTE
          </div>
          <div
            className="absolute font-sans font-light italic text-secondary-900/[0.08] tracking-wide leading-none select-none"
            style={{ left: '133vw', top: '82%', fontSize: 'clamp(2rem, 3.5vw, 4rem)' }}
          >
            Cada Detalle
          </div>
          
          {/* Panel 3 (200-300vw): Más espacio alrededor del título */}
          <div
            className="absolute font-heading font-black text-secondary-900/[0.12] tracking-tight leading-none select-none"
            style={{ left: '232vw', top: '48%', fontSize: 'clamp(3rem, 5vw, 7rem)' }}
          >
            NATURAL
          </div>
          
          {/* Panel 4 (300-400vw): Espacios: debajo de imagen grande, derecha */}
          <div
            className="absolute font-heading font-black text-secondary-900/[0.12] tracking-tight leading-none select-none"
            style={{ left: '345vw', top: '78%', fontSize: 'clamp(4rem, 7vw, 10rem)' }}
          >
            ELEGANCIA
          </div>
          <div
            className="absolute font-sans font-light italic text-secondary-900/[0.08] tracking-wide leading-none select-none"
            style={{ left: '300vw', top: '8%', fontSize: 'clamp(2.5rem, 4vw, 5rem)' }}
          >
            Sofisticación
          </div>
          
          {/* Panel 5 (400-500vw): Espacios entre imágenes */}
          <div
            className="absolute font-heading font-black text-secondary-900/[0.12] tracking-tight leading-none select-none"
            style={{ left: '440vw', top: '82%', fontSize: 'clamp(5rem, 8vw, 10rem)' }}
          >
            PREMIUM
          </div>
          <div
            className="absolute font-sans font-light italic text-secondary-900/[0.08] tracking-wide leading-none select-none"
            style={{ left: '400vw', top: '5%', fontSize: 'clamp(2rem, 3.5vw, 4.5rem)' }}
          >
            Experiencia Única
          </div>

          {/* Marca NAN ESTETIK en espacios */}
          <div
            className="absolute font-heading font-black text-primary-500/[0.10] tracking-tight leading-none select-none"
            style={{ left: '65vw', top: '48%', fontSize: 'clamp(3rem, 5vw, 6rem)' }}
          >
            NAN
          </div>
          <div
            className="absolute font-heading font-black text-primary-500/[0.10] tracking-tight leading-none select-none"
            style={{ left: '170vw', top: '62%', fontSize: 'clamp(3rem, 5vw, 6rem)' }}
          >
            ESTETIK
          </div>
          <div
            className="absolute font-heading font-black text-primary-500/[0.08] tracking-tight leading-none select-none"
            style={{ left: '285vw', top: '5%', fontSize: 'clamp(2.5rem, 4vw, 5rem)' }}
          >
            STUDIO
          </div>

          {/* Frases adicionales en espacios */}
          <div
            className="absolute font-sans font-light italic text-secondary-900/[0.06] tracking-wide leading-none select-none"
            style={{ left: '55vw', top: '85%', fontSize: 'clamp(1.5rem, 2.5vw, 3rem)' }}
          >
            Transformamos Vidas
          </div>
          <div
            className="absolute font-sans font-light italic text-secondary-900/[0.06] tracking-wide leading-none select-none"
            style={{ left: '195vw', top: '90%', fontSize: 'clamp(1.5rem, 2.5vw, 3rem)' }}
          >
            Confianza & Belleza
          </div>
          <div
            className="absolute font-sans font-light italic text-secondary-900/[0.06] tracking-wide leading-none select-none"
            style={{ left: '375vw', top: '48%', fontSize: 'clamp(1.5rem, 2.5vw, 3rem)' }}
          >
            Resultados Reales
          </div>

          {/* Líneas doradas decorativas */}
          <div
            className="absolute h-[1px] bg-gradient-to-r from-transparent via-primary-500/25 to-transparent"
            style={{ left: '0', top: '50%', width: '500vw' }}
          />
          <div
            className="absolute h-[1px] bg-gradient-to-r from-transparent via-primary-500/15 to-transparent"
            style={{ left: '0', top: '25%', width: '500vw' }}
          />
          <div
            className="absolute h-[1px] bg-gradient-to-r from-transparent via-primary-500/15 to-transparent"
            style={{ left: '0', top: '75%', width: '500vw' }}
          />
          
          {/* Círculos decorativos dorados en espacios */}
          <div
            className="absolute w-24 h-24 rounded-full border-2 border-primary-500/15"
            style={{ left: '3vw', top: '75%' }}
          />
          <div
            className="absolute w-20 h-20 rounded-full border border-primary-500/20"
            style={{ left: '96vw', top: '38%' }}
          />
          <div
            className="absolute w-32 h-32 rounded-full border border-primary-500/15"
            style={{ left: '290vw', top: '70%' }}
          />
          <div
            className="absolute w-16 h-16 rounded-full border-2 border-primary-500/20"
            style={{ left: '395vw', top: '35%' }}
          />

          {/* Cruces decorativas estilo premium */}
          <div className="absolute" style={{ left: '28vw', top: '5%' }}>
            <div className="w-8 h-[1px] bg-primary-500/30" />
            <div className="w-[1px] h-8 bg-primary-500/30 absolute top-[-15px] left-[15px]" />
          </div>
          <div className="absolute" style={{ left: '158vw', top: '88%' }}>
            <div className="w-8 h-[1px] bg-primary-500/30" />
            <div className="w-[1px] h-8 bg-primary-500/30 absolute top-[-15px] left-[15px]" />
          </div>
          <div className="absolute" style={{ left: '365vw', top: '5%' }}>
            <div className="w-8 h-[1px] bg-primary-500/30" />
            <div className="w-[1px] h-8 bg-primary-500/30 absolute top-[-15px] left-[15px]" />
          </div>
        </div>

        {/* Imágenes dispersas con efecto 3D tilt */}
        {scatteredImages.map((img, i) => (
          <div
            key={`scattered-${i}`}
            className="scattered-img tilt-card absolute"
            style={{
              left: img.left,
              top: img.top,
              width: img.width,
              height: img.height,
              transformStyle: 'preserve-3d',
              zIndex: 10,
            }}
          >
            {/* Etiqueta pequeña arriba - estilo Lando Norris */}
            {img.label && (
              <div
                className="absolute -top-6 left-0 text-[10px] tracking-[0.15em] text-secondary-900/60 font-medium uppercase"
                style={{ letterSpacing: '0.15em' }}
              >
                {img.label}
              </div>
            )}

            <div 
              className="relative w-full h-full overflow-hidden rounded shadow-lg group cursor-pointer"
              style={{ 
                willChange: 'transform',
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
              }}
            >
              {img.type === 'image' ? (
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                  sizes="32vw"
                  loading="lazy"
                />
              ) : (
                <video
                  src={img.src}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              )}

              {/* Video indicator - más sutil */}
              {img.type === 'video' && (
                <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-white/70 flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[5px] border-l-secondary-900 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent ml-0.5" />
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Título central — estilo Lando Norris */}
        <div
          className="absolute flex items-center justify-center pointer-events-none"
          style={{ left: '190vw', top: '30%', width: '60vw', height: '40%' }}
        >
          <h2
            className="font-heading font-black text-secondary-900 tracking-tight leading-[0.95] text-center whitespace-nowrap"
            style={{ fontSize: 'clamp(3.5rem, 7vw, 8rem)' }}
          >
            Resultados Reales{' '}
            <sup
              className="font-heading font-semibold text-secondary-900/50 align-super"
              style={{ fontSize: 'clamp(1rem, 2vw, 2.5rem)' }}
            >
              (27)
            </sup>
          </h2>
        </div>

        {/* Botones debajo del título */}
        <div
          className="absolute flex items-start justify-center gap-3"
          style={{ left: '205vw', top: '72%', width: '30vw' }}
        >
          <a
            href="#contacto"
            className="px-5 py-2.5 bg-secondary-900 text-white text-sm font-medium rounded-full hover:bg-secondary-800 transition-colors duration-300"
          >
            Ver Todo
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-secondary-900 text-white text-sm font-medium rounded-full hover:bg-secondary-800 transition-colors duration-300"
          >
            Descubre +
          </a>
        </div>
      </div>
    </div>
  );
}
