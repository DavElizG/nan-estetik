/**
 * Morphing Transition — SVG paths morphing que revela el footer
 * Triggered automáticamente por ScrollTrigger al scrollear
 */

'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function MorphingTransition() {
  const svgRef = useRef<HTMLDivElement>(null);
  const pathsRef = useRef<SVGPathElement[]>([]);
  const allPointsRef = useRef<number[][]>([]);
  const pointsDelayRef = useRef<number[]>([]);
  const morphedRef = useRef(false);

  const numPoints = 10;
  const numPaths = 2;
  const delayPointsMax = 0.25;
  const delayPerPath = 0.2;
  const duration = 1.2;

  useEffect(() => {
    if (!svgRef.current) return;

    const overlay = svgRef.current;
    const paths = overlay.querySelectorAll('.shape-overlays__path');
    pathsRef.current = Array.from(paths).filter(
      (path): path is SVGPathElement => path instanceof SVGPathElement
    );
    pointsDelayRef.current = [];
    allPointsRef.current = [];

    // Initialize points
    for (let i = 0; i < numPaths; i++) {
      const points: number[] = [];
      allPointsRef.current.push(points);
      for (let j = 0; j < numPoints; j++) {
        points.push(100); // Start closed (100px)
      }
    }

    render();

    function render() {
      pathsRef.current.forEach((path, pathIndex) => {
        const points = allPointsRef.current[pathIndex];
        let d = '';
        d += `M 0 ${points[0]} C`;

        for (let j = 0; j < numPoints - 1; j++) {
          const p = ((j + 1) / (numPoints - 1)) * 100;
          const cp = p - ((1 / (numPoints - 1)) * 100) / 2;
          d += ` ${cp} ${points[j]} ${cp} ${points[j + 1]} ${p} ${points[j + 1]}`;
        }

        d += ` V 0 H 0`;
        path.setAttribute('d', d);
      });
    }

    // ScrollTrigger para activar la animación automáticamente
    ScrollTrigger.create({
      trigger: overlay,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        if (!morphedRef.current) {
          morphedRef.current = true;
          
          // Timeline para animar la apertura
          const tl = gsap.timeline({
            onUpdate: render,
            defaults: {
              ease: 'elastic.inOut',
              duration: duration,
            },
          });

          for (let i = 0; i < numPoints; i++) {
            pointsDelayRef.current[i] = Math.random() * delayPointsMax;
          }

          for (let i = 0; i < numPaths; i++) {
            const points = allPointsRef.current[i];
            const pathDelay = delayPerPath * i;

            for (let j = 0; j < numPoints; j++) {
              const delay = pointsDelayRef.current[j];
              tl.to(
                points,
                {
                  [j]: 0, // Open (0px)
                },
                delay + pathDelay
              );
            }
          }
        }
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={svgRef} className="relative w-full h-screen pointer-events-none">
      <svg
        className="shape-overlays w-full h-full absolute inset-0 z-40"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ pointerEvents: 'none' }}
      >
        <defs>
          {/* Gradient 1: Cream to Primary */}
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f0f0f" />
            <stop offset="100%" stopColor="#1a1a1a" />
          </linearGradient>
          {/* Gradient 2: Primary to Gold */}
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#0f0f0f" />
          </linearGradient>
        </defs>
        <path className="shape-overlays__path" fill="url(#gradient1)" />
        <path className="shape-overlays__path" fill="url(#gradient2)" />
      </svg>
    </div>
  );
}
