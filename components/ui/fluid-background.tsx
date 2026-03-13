"use client";
import { useEffect, useRef } from 'react';

const FluidBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    let fluidInstance: any = null;
    let ambientSplatTimer: ReturnType<typeof setInterval> | null = null;
    let containerStyleGuard: ReturnType<typeof setInterval> | null = null;
    let containerResizeObserver: ResizeObserver | null = null;
    let pointerTarget: HTMLElement | null = null;
    let pointerX = 0;
    let pointerY = 0;
    let hasPointer = false;
    let lastPointerTs = 0;

    const pinContainerAsBackground = (container: HTMLDivElement) => {
      container.style.setProperty('position', 'absolute', 'important');
      container.style.setProperty('inset', '0', 'important');
      container.style.setProperty('width', '100%', 'important');
      container.style.setProperty('height', '100%', 'important');
      container.style.setProperty('z-index', '2', 'important');
      container.style.setProperty('overflow', 'hidden', 'important');
      container.style.setProperty('background-color', '#0a0a0a', 'important');
      container.style.setProperty('pointer-events', 'auto', 'important');
    };

    const setup = async () => {
      if (!containerRef.current) return;
      const container = containerRef.current;

      const fluidModule = await import('webgl-fluid-enhanced');
      const WebGLFluidEnhanced = fluidModule.default;

      if (!containerRef.current || disposed) return;

      const isMobile = globalThis.matchMedia('(max-width: 768px)').matches;
      const isLowPower = globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;

      fluidInstance = new WebGLFluidEnhanced(container);
      pinContainerAsBackground(container);
      fluidInstance.setConfig({
        simResolution: isMobile || isLowPower ? 96 : 160,
        dyeResolution: isMobile || isLowPower ? 512 : 1024,
        densityDissipation: 0.994,
        velocityDissipation: 0.12,
        pressure: 0.8,
        pressureIterations: isMobile || isLowPower ? 16 : 24,
        curl: 16,
        splatRadius: isMobile ? 0.09 : 0.07,
        splatForce: isMobile ? 1800 : 2400,
        shading: true,
        colorful: false,
        colorPalette: ['#4a3a12', '#7a6020', '#967724', '#b8942d'],
        hover: false,
        backgroundColor: '#0a0a0a',
        transparent: false,
        brightness: 0.66,
        bloom: false,
        sunrays: false,
      });
      fluidInstance.start();
      fluidInstance.multipleSplats(isMobile ? 3 : 5);

      const handlePointerMove = (event: PointerEvent) => {
        const now = performance.now();
        if (now - lastPointerTs < 16) return;
        lastPointerTs = now;

        if (!hasPointer) {
          pointerX = event.clientX;
          pointerY = event.clientY;
          hasPointer = true;
          return;
        }

        const dx = event.clientX - pointerX;
        const dy = event.clientY - pointerY;
        pointerX = event.clientX;
        pointerY = event.clientY;

        if (Math.abs(dx) + Math.abs(dy) < 0.8) return;

        fluidInstance?.splatAtLocation(
          event.clientX,
          event.clientY,
          dx * 14,
          dy * 14,
          '#b8942d'
        );
      };

      const handlePointerLeave = () => {
        hasPointer = false;
      };

      pointerTarget = container.closest('footer') ?? container;
      pointerTarget.addEventListener('pointermove', handlePointerMove, { passive: true });
      pointerTarget.addEventListener('pointerleave', handlePointerLeave);

      (container as any).__pointerMove = handlePointerMove;
      (container as any).__pointerLeave = handlePointerLeave;

      ambientSplatTimer = setInterval(() => {
        if (!disposed) {
          fluidInstance?.multipleSplats(1);
        }
      }, isMobile ? 4500 : 3600);

      const syncCanvasToFooter = () => {
        const canvas = container.querySelector('canvas');
        if (!canvas) return;
        pinContainerAsBackground(container);
        canvas.style.position = 'absolute';
        canvas.style.inset = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.display = 'block';
      };

      syncCanvasToFooter();

      const observer = new MutationObserver(() => {
        syncCanvasToFooter();
      });

      observer.observe(container, { childList: true, subtree: true });
      containerResizeObserver = new ResizeObserver(() => {
        globalThis.dispatchEvent(new Event('resize'));
      });
      containerResizeObserver.observe(container);

      // The library mutates container styles; keep the intended background layout pinned.
      containerStyleGuard = setInterval(() => {
        if (!disposed) {
          pinContainerAsBackground(container);
        }
      }, 500);

      (container as any).__fluidObserver = observer;
    };

    setup();

    return () => {
      disposed = true;
      const observer = (containerRef.current as any)?.__fluidObserver as MutationObserver | undefined;
      observer?.disconnect();
      containerResizeObserver?.disconnect();
      if (ambientSplatTimer) {
        clearInterval(ambientSplatTimer);
      }
      if (containerStyleGuard) {
        clearInterval(containerStyleGuard);
      }
      const pointerMove = (containerRef.current as any)?.__pointerMove as ((event: PointerEvent) => void) | undefined;
      const pointerLeave = (containerRef.current as any)?.__pointerLeave as (() => void) | undefined;
      if (pointerTarget && pointerMove && pointerLeave) {
        pointerTarget.removeEventListener('pointermove', pointerMove);
        pointerTarget.removeEventListener('pointerleave', pointerLeave);
      }
      fluidInstance?.stop();
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
        overflow: 'hidden',
        pointerEvents: 'auto',
      }}
    />
  );
};

export default FluidBackground;
