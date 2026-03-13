"use client";
import { useEffect, useRef } from 'react';

const FluidBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    let fluidInstance: any = null;
    let containerStyleGuard: ReturnType<typeof setInterval> | null = null;
    let containerResizeObserver: ResizeObserver | null = null;
    let footerElement: HTMLElement | null = null;
    let lastPointerX: number | null = null;
    let lastPointerY: number | null = null;
    let lastPointerTime = 0;

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
        simResolution: isMobile || isLowPower ? 64 : 96,
        dyeResolution: isMobile || isLowPower ? 512 : 768,
        densityDissipation: 0.92,
        velocityDissipation: 0.18,
        pressure: 0.8,
        pressureIterations: isMobile || isLowPower ? 14 : 18,
        curl: 26,
        splatRadius: isMobile ? 0.12 : 0.1,
        splatForce: isMobile ? 3600 : 5200,
        shading: true,
        colorful: false,
        colorPalette: ['#967724', '#b8942d', '#d4af37', '#e4c56d'],
        hover: false,
        backgroundColor: '#0a0a0a',
        transparent: false,
        brightness: 0.95,
        bloom: false,
        sunrays: false,
      });
      fluidInstance.start();
      fluidInstance.multipleSplats(isMobile ? 2 : 4);

      const handlePointerMove = (event: PointerEvent) => {
        if (disposed || !fluidInstance) return;

        const now = performance.now();
        if (now - lastPointerTime < 16) return;
        lastPointerTime = now;

        if (lastPointerX === null || lastPointerY === null) {
          lastPointerX = event.clientX;
          lastPointerY = event.clientY;
          return;
        }

        const dx = event.clientX - lastPointerX;
        const dy = event.clientY - lastPointerY;

        lastPointerX = event.clientX;
        lastPointerY = event.clientY;

        // Avoid generating splats from tiny pointer jitter.
        if (Math.abs(dx) + Math.abs(dy) < 0.8) return;

        fluidInstance.splatAtLocation(
          event.clientX,
          event.clientY,
          dx * 16,
          dy * 16,
          '#d4af37'
        );
      };

      const handlePointerLeave = () => {
        lastPointerX = null;
        lastPointerY = null;
      };

      footerElement = container.closest('footer');
      const interactionTarget = footerElement ?? container;
      interactionTarget.addEventListener('pointermove', handlePointerMove, { passive: true });
      interactionTarget.addEventListener('pointerleave', handlePointerLeave);

      (container as any).__fluidPointerMove = handlePointerMove;
      (container as any).__fluidPointerLeave = handlePointerLeave;
      (container as any).__fluidInteractionTarget = interactionTarget;

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
      if (containerStyleGuard) {
        clearInterval(containerStyleGuard);
      }
      const interactionTarget = (containerRef.current as any)?.__fluidInteractionTarget as HTMLElement | undefined;
      const pointerMove = (containerRef.current as any)?.__fluidPointerMove as ((event: PointerEvent) => void) | undefined;
      const pointerLeave = (containerRef.current as any)?.__fluidPointerLeave as (() => void) | undefined;
      if (interactionTarget && pointerMove && pointerLeave) {
        interactionTarget.removeEventListener('pointermove', pointerMove);
        interactionTarget.removeEventListener('pointerleave', pointerLeave);
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
