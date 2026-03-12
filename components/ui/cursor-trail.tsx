'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function CursorTrail() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const glow = glowRef.current;
    if (!dot || !ring || !glow) return;

    const pos = { x: 0, y: 0 };

    const onMouseMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;

      gsap.set(dot, { x: pos.x, y: pos.y });

      gsap.to(ring, {
        x: pos.x,
        y: pos.y,
        duration: 0.15,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      gsap.to(glow, {
        x: pos.x,
        y: pos.y,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    const onEnterInteractive = () => {
      gsap.to(ring, { scale: 1.8, borderColor: '#d4af37', duration: 0.3, ease: 'power2.out' });
      gsap.to(dot, { scale: 0.5, opacity: 0.7, duration: 0.3 });
      gsap.to(glow, { scale: 1.4, opacity: 0.18, duration: 0.3 });
    };

    const onLeaveInteractive = () => {
      gsap.to(ring, { scale: 1, borderColor: 'rgba(212,175,55,0.45)', duration: 0.3, ease: 'power2.out' });
      gsap.to(dot, { scale: 1, opacity: 1, duration: 0.3 });
      gsap.to(glow, { scale: 1, opacity: 0.1, duration: 0.3 });
    };

    const onMouseDown = () => {
      gsap.to(ring, { scale: 0.8, duration: 0.1 });
      gsap.to(dot, { scale: 1.5, duration: 0.1 });
      gsap.to(glow, { scale: 0.7, opacity: 0.2, duration: 0.1 });
    };
    const onMouseUp = () => {
      gsap.to(ring, { scale: 1, duration: 0.2, ease: 'elastic.out(1, 0.4)' });
      gsap.to(dot, { scale: 1, duration: 0.2, ease: 'elastic.out(1, 0.4)' });
      gsap.to(glow, { scale: 1, opacity: 0.1, duration: 0.3 });
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    const interactives = document.querySelectorAll('a, button, [role="button"], input, textarea, select, [data-cursor-hover]');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', onEnterInteractive);
      el.addEventListener('mouseleave', onLeaveInteractive);
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', onEnterInteractive);
        el.removeEventListener('mouseleave', onLeaveInteractive);
      });
    };
  }, []);

  return (
    <>
      {/* Resplandor suave — luz que ilumina el fondo */}
      <div
        ref={glowRef}
        className="pointer-events-none fixed top-0 left-0 z-[99997] hidden md:block"
        style={{
          width: 200,
          height: 200,
          marginLeft: -100,
          marginTop: -100,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,175,55,0.10) 0%, rgba(212,175,55,0.04) 40%, transparent 70%)',
          opacity: 0.1,
        }}
        aria-hidden="true"
      />
      {/* Crosshair dorado — centro del cursor */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[99999] hidden md:block"
        style={{
          width: 22,
          height: 22,
          marginLeft: -11,
          marginTop: -11,
        }}
        aria-hidden="true"
      >
        {/* Línea vertical */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: 2,
          width: 1.5,
          height: 18,
          marginLeft: -0.75,
          background: 'linear-gradient(to bottom, transparent, #d4af37 30%, #f5eac5 50%, #d4af37 70%, transparent)',
          borderRadius: 1,
        }} />
        {/* Línea horizontal */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 2,
          width: 18,
          height: 1.5,
          marginTop: -0.75,
          background: 'linear-gradient(to right, transparent, #d4af37 30%, #f5eac5 50%, #d4af37 70%, transparent)',
          borderRadius: 1,
        }} />
        {/* Punto central pequeño */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 3,
          height: 3,
          marginLeft: -1.5,
          marginTop: -1.5,
          borderRadius: '50%',
          backgroundColor: '#f5eac5',
          boxShadow: '0 0 4px rgba(212,175,55,0.6)',
        }} />
      </div>
      {/* Anillo exterior metálico */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[99998] hidden md:block"
        style={{
          width: 38,
          height: 38,
          marginLeft: -19,
          marginTop: -19,
          borderRadius: '50%',
          border: '1.5px solid rgba(212,175,55,0.45)',
          backgroundColor: 'transparent',
          boxShadow: '0 0 8px rgba(212,175,55,0.12), inset 0 0 8px rgba(212,175,55,0.06)',
        }}
        aria-hidden="true"
      />
    </>
  );
}
