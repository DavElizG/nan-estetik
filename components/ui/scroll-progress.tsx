'use client';

import { useEffect, useRef } from 'react';

export function ScrollProgress() {
  const topBarRef = useRef<HTMLDivElement>(null);
  const leftFillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const viewport = window.innerHeight;
      const maxScroll = Math.max(1, scrollHeight - viewport);
      const progress = Math.min(1, Math.max(0, scrollTop / maxScroll));

      if (topBarRef.current) {
        topBarRef.current.style.transform = `scaleX(${progress})`;
      }

      if (leftFillRef.current) {
        leftFillRef.current.style.transform = `scaleY(${progress})`;
      }

      raf = 0;
    };

    const requestUpdate = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    requestUpdate();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="pointer-events-none fixed left-0 top-0 z-[100] h-[3px] w-full bg-transparent">
        <div
          ref={topBarRef}
          className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-[#8b6a16] via-[#d4af37] to-[#f4dd8f] shadow-[0_0_14px_rgba(212,175,55,0.6)]"
        />
      </div>

      <div className="pointer-events-none fixed left-2 top-1/2 z-[100] h-[68vh] w-[7px] -translate-y-1/2 rounded-full border border-white/10 bg-black/35 backdrop-blur-sm">
        <div
          ref={leftFillRef}
          className="h-full w-full origin-bottom scale-y-0 rounded-full bg-gradient-to-t from-[#8b6a16] via-[#d4af37] to-[#f4dd8f] shadow-[0_0_12px_rgba(212,175,55,0.5)]"
        />
      </div>
    </>
  );
}
