/**
 * Gallery Section
 * 
 * Efecto zoom-in que revela la galería completa
 * Integrado con Cloudinary para imágenes
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CldImage } from 'next-cloudinary';

// Genera un path SVG con ola viajera
function wavePathD(
  width: number, baseY: number, amplitude: number,
  frequency: number, phase: number, segments = 60
): string {
  let d = '';
  for (let i = 0; i <= segments; i++) {
    const x = (i / segments) * width;
    const y = baseY + amplitude * Math.sin((i / segments) * Math.PI * 2 * frequency + phase);
    d += i === 0 ? `M${x.toFixed(1)},${y.toFixed(1)}` : ` L${x.toFixed(1)},${y.toFixed(1)}`;
  }
  return d;
}

const SPACER_THREADS = [
  { baseY: 100, amp: 12, freq: 3, speed: 0.5, sw: '0.5' },
  { baseY: 200, amp: 16, freq: 2.5, speed: -0.35, sw: '1' },
  { baseY: 300, amp: 10, freq: 3.5, speed: 0.45, sw: '0.5' },
];

gsap.registerPlugin(ScrollTrigger);

interface GalleryImage {
  id: string;
  publicId: string;
  url: string;
  width: number;
  height: number;
  alt: string;
  aspect: 'tall' | 'wide' | 'square';
  category?: string;
}

// Imágenes de respaldo cuando no hay conexión a Cloudinary
const fallbackImages: Omit<GalleryImage, 'url' | 'width' | 'height'>[] = [
  { id: '1', publicId: '', alt: 'Resultado de tratamiento', aspect: 'tall' },
  { id: '2', publicId: '', alt: 'Transformación facial', aspect: 'wide' },
  { id: '3', publicId: '', alt: 'Antes y después', aspect: 'square' },
  { id: '4', publicId: '', alt: 'Resultado natural', aspect: 'square' },
  { id: '5', publicId: '', alt: 'Tratamiento premium', aspect: 'tall' },
  { id: '6', publicId: '', alt: 'Belleza radiante', aspect: 'wide' },
];

// Componente placeholder para cuando no hay imagen
function GalleryPlaceholder({ aspect, isLoading }: { aspect: string; isLoading: boolean }) {
  const aspectClass = 
    aspect === 'tall' ? 'aspect-[3/4]' : 
    aspect === 'wide' ? 'aspect-[16/9]' : 
    'aspect-square';
  
  return (
    <div 
      className={`gallery-image w-full bg-gradient-to-br from-secondary-200 via-secondary-300 to-primary-200 will-change-transform ${isLoading ? 'animate-pulse' : ''} ${aspectClass}`}
    />
  );
}

export function GalleryIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const spacerSvgRef = useRef<SVGSVGElement>(null);
  
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch images from Cloudinary
  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await fetch('/api/gallery');
        const result = await response.json();
        
        if (result.success && result.data.length > 0) {
          setImages(result.data);
        } else {
          // Use fallback if no images from API
          setImages(fallbackImages as GalleryImage[]);
        }
      } catch (error) {
        console.error('Error fetching gallery images:', error);
        setImages(fallbackImages as GalleryImage[]);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchImages();
  }, []);

  useEffect(() => {
    if (typeof globalThis.window === 'undefined') return;

    const ctx = gsap.context(() => {
      // Refresh ScrollTrigger para recalcular posiciones
      ScrollTrigger.refresh();
      
      // Timeline para sincronizar zoom y reveal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          start: 'top top',
          end: '+=3000',
          scrub: 0.2,
          invalidateOnRefresh: true,
        },
      });

      // 1. El texto completo hace zoom (centrado en la "l")
      tl.to(textRef.current, {
        scale: 80,
        duration: 0.8,
        ease: 'power2.inOut',
      }, 0);

      // 2. El texto se desvanece cuando ya cubrió la pantalla
      tl.to(textRef.current, {
        opacity: 0,
        duration: 0.15,
      }, 0.75);

      // 3. El contenido aparece
      tl.fromTo(contentRef.current, 
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.15,
        }, 
        0.85
      );

      // 4. Efecto parallax en las imágenes de la galería (delayed parallax)
      const galleryCards = galleryRef.current?.querySelectorAll('.gallery-card');
      
      if (galleryCards) {
        galleryCards.forEach((card, index) => {
          const innerContainer = card.querySelector('.inner-container') as HTMLElement;
          const image = card.querySelector('.gallery-image') as HTMLElement;
          
          if (innerContainer && image) {
            // Diferentes velocidades de scrub para cada card
            const scrubValues = [0.5, 0.3, 0.7, 0.4, 0.6, 0.35];
            const scrubValue = scrubValues[index % scrubValues.length];
            
            // Animación de la imagen (se mueve hacia arriba)
            const imageAnim = gsap.to(image, {
              yPercent: -50,
              ease: 'none',
              paused: true
            });
            
            const progressTo = gsap.quickTo(imageAnim, 'progress', {
              ease: 'power3',
              duration: scrubValue
            });
            
            // Animación del contenedor (se mueve hacia abajo)
            gsap.to(innerContainer, {
              yPercent: 50,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                scrub: true,
                start: 'top bottom',
                end: 'bottom top',
                onUpdate: self => progressTo(self.progress)
              }
            });
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Animación de olas viajeras en los hilos del espaciador
  useEffect(() => {
    if (!spacerSvgRef.current) return;
    let rafId: number;
    const paths = spacerSvgRef.current.querySelectorAll('path');

    const animate = (time: number) => {
      const t = time * 0.001; // a segundos
      paths.forEach((path, i) => {
        const cfg = SPACER_THREADS[i];
        if (!cfg) return;
        path.setAttribute('d', wavePathD(1440, cfg.baseY, cfg.amp, cfg.freq, t * cfg.speed));
      });
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Items to display (use fetched images or show loading placeholders)
  const displayItems = images.length > 0 ? images : fallbackImages;

  return (
    <>
      {/* Espaciador con hilos dorados animados antes de gallery */}
      <div ref={spacerRef} className="h-[50vh] bg-black relative overflow-hidden z-30">
        {/* Hilos dorados — olas viajeras */}
        <svg ref={spacerSvgRef} className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1440 400">
          {SPACER_THREADS.map((cfg, i) => (
            <path key={i} fill="none" stroke="#d4af37" strokeWidth={cfg.sw} />
          ))}
        </svg>
      </div>
      
      {/* Sección del zoom */}
      <section
        id="galeria"
        ref={sectionRef}
        className="h-screen relative flex items-center justify-center bg-black overflow-hidden z-30"
      >
        {/* Texto que hace zoom completo */}
        <div
          ref={textRef}
          className="relative flex flex-col items-center justify-center text-center leading-none"
          style={{ 
            zIndex: 10,
            transformOrigin: 'center center',
          }}
        >
          <span className="text-[8px] uppercase tracking-[0.4em] text-secondary-500 mb-4">
            Descubre
          </span>
          <span className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white tracking-wide">
            Tu Belleza,
          </span>
          <span className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-primary-500 mt-2">
            Nuestro Arte
          </span>
          <span className="text-[8px] uppercase tracking-[0.4em] text-secondary-500 mt-4">
            Ver Resultados
          </span>
        </div>

        {/* Overlay blanco para transición */}
        <div
          ref={contentRef}
          className="absolute inset-0 opacity-0 bg-white"
          style={{ zIndex: 30 }}
        />
      </section>

      {/* Sección de galería separada - fluye normalmente */}
      <section className="bg-white py-24 min-h-screen overflow-hidden">
        <div className="container-custom w-full">
          {/* Título */}
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-5xl font-heading font-bold text-secondary-900 mb-4">
              Nuestros Resultados
            </h3>
            <div className="w-24 h-1 bg-primary-500 mx-auto mb-4" />
            <p className="text-base md:text-lg text-secondary-600 max-w-2xl mx-auto">
              Descubre las transformaciones de nuestros pacientes.
            </p>
          </div>

          {/* Grid de galería */}
          <div
            ref={galleryRef}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16"
          >
              {displayItems.map((item) => (
                <div
                  key={item.id}
                  className={`
                    gallery-card
                    relative overflow-hidden rounded-xl cursor-pointer group
                    ${item.aspect === 'tall' ? 'row-span-2' : ''}
                    ${item.aspect === 'wide' ? 'col-span-2' : ''}
                  `}
                >
                  {/* Inner container para el efecto parallax */}
                  <div className="inner-container w-full h-full overflow-hidden">
                    {item.publicId ? (
                      <CldImage
                        src={item.publicId}
                        alt={item.alt}
                        width={item.aspect === 'wide' ? 800 : 400}
                        height={item.aspect === 'tall' ? 800 : 400}
                        className="gallery-image w-full h-full object-cover will-change-transform"
                        sizes="(max-width: 768px) 50vw, 33vw"
                        loading="lazy"
                      />
                    ) : (
                      <GalleryPlaceholder aspect={item.aspect} isLoading={isLoading} />
                    )}
                  </div>
                  
                  <div className="absolute inset-0 bg-secondary-900/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <span className="text-white font-semibold text-lg">
                      {item.alt || 'Ver detalles'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center">
              <p className="text-secondary-600 mb-4">
                ¿Quieres ver más resultados?
              </p>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Visita nuestro Instagram
              </a>
            </div>
          </div>
      </section>
    </>
  );
}
