/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useRef } from 'react';

const RIPPLE_TEXTURE = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
    <defs>
      <radialGradient id="g" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stop-color="#1b1406"/>
        <stop offset="38%" stop-color="#141005"/>
        <stop offset="60%" stop-color="#0f0b04"/>
        <stop offset="100%" stop-color="#070707"/>
      </radialGradient>
    </defs>
    <rect width="256" height="256" fill="url(#g)"/>
  </svg>`
)}`;

const FluidBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let destroyed = false;
    let resizeObserver: ResizeObserver | null = null;
    let pointerTarget: HTMLElement | null = null;
    let pointerX = 0;
    let pointerY = 0;
    let hasPointer = false;
    let lastPointerTs = 0;
    let jq: any = null;
    let ambientDropTimer: ReturnType<typeof setInterval> | null = null;

    const setup = async () => {
      if (!containerRef.current) return;
      const container = containerRef.current;

      const jqueryMod: any = await import('jquery');
      jq = jqueryMod.default ?? jqueryMod;
      (globalThis as any).jQuery = jq;
      (globalThis as any).$ = jq;
      await import('jquery.ripples');

      if (destroyed || !containerRef.current) return;

      const $container = jq(container);
      $container.ripples({
        imageUrl: RIPPLE_TEXTURE,
        resolution: 384,
        dropRadius: 20,
        perturbance: 0.018,
        interactive: false,
        crossOrigin: '',
      });

      const styleRippleCanvas = () => {
        const rippleCanvas = container.querySelector('canvas');
        if (!rippleCanvas) return;
        rippleCanvas.style.filter = 'sepia(1) hue-rotate(338deg) saturate(2.2) brightness(0.82) contrast(1.08)';
        rippleCanvas.style.opacity = '0.95';
      };
      styleRippleCanvas();

      // Seed a subtle initial wave so the surface does not feel static.
      const initialRect = container.getBoundingClientRect();
      $container.ripples('drop', initialRect.width * 0.55, initialRect.height * 0.62, 26, 0.012);

      const handlePointerMove = (event: PointerEvent) => {
        const now = performance.now();
        if (now - lastPointerTs < 30) return;
        lastPointerTs = now;

        const rect = container.getBoundingClientRect();
        const localX = event.clientX - rect.left;
        const localY = event.clientY - rect.top;

        const inside = localX >= 0 && localX <= rect.width && localY >= 0 && localY <= rect.height;
        if (!inside) {
          hasPointer = false;
          return;
        }

        if (!hasPointer) {
          pointerX = localX;
          pointerY = localY;
          hasPointer = true;
          return;
        }

        const dx = localX - pointerX;
        const dy = localY - pointerY;
        pointerX = localX;
        pointerY = localY;

        const speed = Math.hypot(dx, dy);
        if (speed < 2.2) return;

        const radius = Math.min(28, Math.max(12, 12 + speed * 0.12));
        const strength = Math.min(0.014, Math.max(0.0035, 0.0035 + speed * 0.00014));
        $container.ripples('drop', localX, localY, radius, strength);
      };

      const handlePointerLeave = () => {
        hasPointer = false;
      };

      pointerTarget = document.documentElement;
      pointerTarget.addEventListener('pointermove', handlePointerMove, { passive: true });
      pointerTarget.addEventListener('pointerleave', handlePointerLeave);

      (container as any).__pointerMove = handlePointerMove;
      (container as any).__pointerLeave = handlePointerLeave;

      // Occasional larger drops to create visible ring waves like falling water droplets.
      ambientDropTimer = setInterval(() => {
        const rect = container.getBoundingClientRect();
        const x = 24 + Math.random() * Math.max(24, rect.width - 48);
        const y = 24 + Math.random() * Math.max(24, rect.height - 48);
        const radius = 26 + Math.random() * 12;
        const strength = 0.009 + Math.random() * 0.006;
        $container.ripples('drop', x, y, radius, strength);
      }, 2600);

      resizeObserver = new ResizeObserver(() => {
        $container.ripples('updateSize');
        styleRippleCanvas();
      });
      resizeObserver.observe(container);
    };

    setup();

    return () => {
      destroyed = true;
      const container = containerRef.current;
      const pointerMove = (container as any)?.__pointerMove as ((event: PointerEvent) => void) | undefined;
      const pointerLeave = (container as any)?.__pointerLeave as (() => void) | undefined;

      if (pointerTarget && pointerMove && pointerLeave) {
        pointerTarget.removeEventListener('pointermove', pointerMove);
        pointerTarget.removeEventListener('pointerleave', pointerLeave);
      }

      if (ambientDropTimer) {
        clearInterval(ambientDropTimer);
      }

      resizeObserver?.disconnect();

      if (container && jq) {
        try {
          jq(container).ripples('destroy');
        } catch {
          // ignore destroy errors during hot reloads
        }
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 2,
        backgroundColor: '#0a0a0a',
        backgroundImage: `url("${RIPPLE_TEXTURE}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    />
  );
};

export default FluidBackground;
