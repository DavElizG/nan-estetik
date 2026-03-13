/**
 * Dynamic Gallery - Estilo Lando Norris
 *
 * CLAVE: Imágenes hero grandes (28-32vw) + clusters de pequeñas (14-22vw).
 * Strip 500vw con 3-5 imágenes por viewport en clusters agrupados.
 * Balance entre espacio blanco y contenido como landonorris.com.
 */

'use client';

import { useEffect, useRef, useState } from 'react';
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
  label?: string;
}

// Layout template: posiciones fijas, las URLs vienen de Cloudinary
const layoutTemplate: Omit<ScatteredImage, 'src'>[] = [
  // Panel 1
  { alt: 'Tratamiento estético',     type: 'image', left: '8vw',   top: '10%', width: '14vw', height: '32%', label: 'FACIAL, 2026' },
  { alt: 'Procedimiento en video',   type: 'video', left: '32vw',  top: '20%', width: '32vw', height: '60%', label: 'TRATAMIENTO AVANZADO' },
  { alt: 'Resultado natural',        type: 'image', left: '72vw',  top: '8%',  width: '16vw', height: '36%', label: 'FEBRERO, 2026' },
  { alt: 'Antes y después',          type: 'image', left: '70vw',  top: '58%', width: '18vw', height: '38%', label: 'ANTES & DESPUÉS' },
  // Panel 2
  { alt: 'Resultado facial',         type: 'image', left: '110vw', top: '12%', width: '20vw', height: '42%', label: 'RELLENO LABIAL' },
  { alt: 'Transformación',           type: 'image', left: '140vw', top: '25%', width: '28vw', height: '52%', label: 'ENERO, 2026' },
  { alt: 'Belleza natural',          type: 'image', left: '108vw', top: '62%', width: '14vw', height: '30%', label: 'SKINCARE' },
  { alt: 'Proceso de tratamiento',   type: 'video', left: '175vw', top: '15%', width: '18vw', height: '40%', label: 'PROCESO' },
  // Panel 3
  { alt: 'Cuidado facial',           type: 'image', left: '205vw', top: '8%',  width: '15vw', height: '34%', label: 'DICIEMBRE, 2025' },
  { alt: 'Resultado premium',        type: 'image', left: '275vw', top: '58%', width: '16vw', height: '36%', label: 'REJUVENECIMIENTO' },
  // Panel 4
  { alt: 'Tratamiento profesional',  type: 'image', left: '310vw', top: '15%', width: '30vw', height: '58%', label: 'HARMONIZACIÓN FACIAL' },
  { alt: 'Resultado espectacular',   type: 'image', left: '352vw', top: '10%', width: '18vw', height: '38%', label: 'NOVIEMBRE, 2025' },
  { alt: 'Rejuvenecimiento',         type: 'image', left: '378vw', top: '60%', width: '14vw', height: '32%', label: 'BOTOX' },
  // Panel 5
  { alt: 'Sesión de tratamiento',    type: 'video', left: '415vw', top: '12%', width: '22vw', height: '46%', label: 'SESIÓN EN VIVO' },
  { alt: 'Belleza radiante',         type: 'image', left: '448vw', top: '22%', width: '26vw', height: '54%', label: 'OCTUBRE, 2025' },
  { alt: 'Transformación completa',  type: 'image', left: '420vw', top: '65%', width: '14vw', height: '30%', label: 'PEELING' },
  { alt: 'Arte estético',            type: 'image', left: '480vw', top: '10%', width: '16vw', height: '36%', label: 'RADIOFRECUENCIA' },
];

export function DynamicGallery() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [scatteredImages, setScatteredImages] = useState<ScatteredImage[]>([]);

  // Carga imágenes y videos desde Cloudinary
  useEffect(() => {
    async function loadMedia() {
      const [imgRes, vidRes] = await Promise.all([
        fetch('/api/gallery').then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/gallery?type=video').then(r => r.json()).catch(() => ({ data: [] })),
      ]);

      const cloudImages: { url: string }[] = imgRes.data || [];
      const cloudVideos: { url: string }[] = vidRes.data || [];

      let imgIdx = 0;
      let vidIdx = 0;

      const mapped = layoutTemplate.map(item => {
        if (item.type === 'video') {
          const src = cloudVideos[vidIdx]?.url || '';
          vidIdx++;
          return { ...item, src };
        } else {
          const src = cloudImages[imgIdx]?.url || '';
          imgIdx++;
          return { ...item, src };
        }
      });

      setScatteredImages(mapped);
    }

    loadMedia();
  }, []);

  useEffect(() => {
    if (scatteredImages.length === 0) return;
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

      // Parallax — 1 ScrollTrigger shared por todas las imágenes (antes: 18 separados)
      const items = strip.querySelectorAll('.scattered-img');
      const speeds = [-20, 30, -15, 25, -35, 18, -22, 28, -12, 32, -25, 20, -18, 35, -28, 15, -30];
      const parallaxTl = gsap.timeline();
      items.forEach((item, i) => {
        parallaxTl.to(item, { y: speeds[i % speeds.length], ease: 'none' }, 0);
      });
      ScrollTrigger.create({
        animation: parallaxTl,
        trigger: wrapper,
        start: 'top top',
        end: getEndValue,
        scrub: 2,
        invalidateOnRefresh: true,
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

    // Batch all getBoundingClientRect reads inside a single rAF tick
    // to avoid 18 forced reflows per mousemove event.
    let lastMouseX = 0;
    let lastMouseY = 0;
    let tiltRafId: number | null = null;

    const applyTilt = () => {
      tiltRafId = null;
      animators.forEach(({ img, rotateX, rotateY, z }) => {
        const rect = img.getBoundingClientRect();

        if (rect.right < 0 || rect.left > window.innerWidth) {
          rotateX(0); rotateY(0); z(0);
          return;
        }

        const imgCenterX = rect.left + rect.width / 2;
        const imgCenterY = rect.top + rect.height / 2;
        const normalizedX = (lastMouseX - imgCenterX) / (rect.width / 2);
        const normalizedY = (lastMouseY - imgCenterY) / (rect.height / 2);
        const clampedX = Math.max(-1, Math.min(1, normalizedX));
        const clampedY = Math.max(-1, Math.min(1, normalizedY));
        const distance = Math.sqrt(clampedX ** 2 + clampedY ** 2);

        if (distance < 2.5) {
          const intensity = Math.max(0, 1 - (distance / 2.5));
          const newRotateX = gsap.utils.interpolate(28, -28, 0.5 + (clampedY * 0.5)) * intensity;
          const newRotateY = gsap.utils.interpolate(-28, 28, 0.5 + (clampedX * 0.5)) * intensity;
          rotateX(newRotateX);
          rotateY(newRotateY);
          z(50 * intensity);
        } else {
          rotateX(0); rotateY(0); z(0);
        }
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      if (tiltRafId === null) {
        tiltRafId = requestAnimationFrame(applyTilt);
      }
    };

    // Control play/pause per video based on horizontal scroll position.
    // IntersectionObserver cannot detect off-screen due to CSS transforms,
    // so we use ScrollTrigger progress to calculate which videos are in view.
    const videoEls = Array.from(strip.querySelectorAll<HTMLVideoElement>('video'));
    let videoST: ReturnType<typeof ScrollTrigger.create> | null = null;

    if (videoEls.length > 0) {
      videoST = ScrollTrigger.create({
        trigger: wrapper,
        start: 'top top',
        end: getEndValue,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const maxTranslate = Math.max(1, strip.offsetWidth - window.innerWidth);
          const currentX = self.progress * maxTranslate;
          const viewEnd = currentX + window.innerWidth;
          videoEls.forEach((video) => {
            const card = video.closest<HTMLElement>('.scattered-img');
            if (!card) return;
            const vLeft = card.offsetLeft;
            const vRight = vLeft + card.offsetWidth;
            const visible = vLeft < viewEnd && vRight > currentX;
            if (visible && video.paused) video.play().catch(() => {});
            else if (!visible && !video.paused) video.pause();
          });
        },
        onLeave: () => videoEls.forEach((v) => v.pause()),
        onLeaveBack: () => videoEls.forEach((v) => v.pause()),
      });
    }

    wrapper.addEventListener('mousemove', handleMouseMove);
    wrapper.addEventListener('mouseleave', resetAnimators);

    return () => {
      ctx.revert();
      if (tiltRafId !== null) cancelAnimationFrame(tiltRafId);
      videoST?.kill();
      wrapper.removeEventListener('mousemove', handleMouseMove);
      wrapper.removeEventListener('mouseleave', resetAnimators);
    };
  }, [scatteredImages]);

  return (
    <div
      ref={wrapperRef}
      className="relative overflow-hidden"
      style={{ perspective: '1200px', backgroundColor: '#fdfbf3' }}
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
                  muted
                  loop
                  playsInline
                  preload="none"
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
