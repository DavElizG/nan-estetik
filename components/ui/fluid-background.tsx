"use client";
import { useEffect, useRef } from 'react';

const FluidBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    let fluidInstance: any = null;
    let splatTimer: ReturnType<typeof setInterval> | null = null;

    const setup = async () => {
      if (!containerRef.current) return;
      const container = containerRef.current;

      const fluidModule = await import('webgl-fluid-enhanced');
      const WebGLFluidEnhanced = fluidModule.default;

      if (!containerRef.current || disposed) return;

      const isMobile = globalThis.matchMedia('(max-width: 768px)').matches;
      const isLowPower = globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;

      fluidInstance = new WebGLFluidEnhanced(container);
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
        hover: true,
        backgroundColor: '#0a0a0a',
        transparent: false,
        brightness: 0.95,
        bloom: false,
        sunrays: false,
      });
      fluidInstance.start();
      fluidInstance.multipleSplats(isMobile ? 8 : 14);

      // Keep subtle motion alive so the effect remains visible even without cursor movement.
      splatTimer = setInterval(() => {
        if (!disposed) {
          fluidInstance?.multipleSplats(isMobile ? 2 : 3);
        }
      }, isMobile ? 2800 : 2200);

      const syncCanvasToFooter = () => {
        const canvas = container.querySelector('canvas');
        if (!canvas) return;
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

      (container as any).__fluidObserver = observer;
    };

    setup();

    return () => {
      disposed = true;
      const observer = (containerRef.current as any)?.__fluidObserver as MutationObserver | undefined;
      observer?.disconnect();
      if (splatTimer) {
        clearInterval(splatTimer);
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
