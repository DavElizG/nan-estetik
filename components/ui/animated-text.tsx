/**
 * AnimatedText - Componente para animación de texto letra por letra
 * 
 * Divide el texto en letras y las anima con GSAP ScrollTrigger
 */

'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedTextProps {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  delay?: number;
  stagger?: number;
  animateOnView?: boolean;
}

export function AnimatedText({
  children,
  className = '',
  as: Component = 'h2',
  delay = 0,
  stagger = 0.03,
  animateOnView = true,
}: AnimatedTextProps) {
  const textRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    // Split text en palabras y letras
    const text = children;
    const words = text.split(' ');
    el.innerHTML = '';

    words.forEach((word) => {
      const wordSpan = document.createElement('span');
      wordSpan.style.display = 'inline-block';
      wordSpan.style.whiteSpace = 'nowrap';
      wordSpan.style.marginRight = '0.2em';

      const letters = word.split('');
      letters.forEach((letter) => {
        const letterSpan = document.createElement('span');
        letterSpan.textContent = letter;
        letterSpan.className = 'letter-anim';
        letterSpan.style.display = 'inline-block';
        wordSpan.appendChild(letterSpan);
      });

      el.appendChild(wordSpan);
    });

    const letters = el.querySelectorAll('.letter-anim');

    const ctx = gsap.context(() => {
      if (animateOnView) {
        gsap.from(letters, {
          y: 50,
          opacity: 0,
          rotationX: -45,
          stagger,
          duration: 0.6,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
        });
      } else {
        gsap.from(letters, {
          y: 50,
          opacity: 0,
          rotationX: -45,
          stagger,
          duration: 0.6,
          ease: 'back.out(1.5)',
          delay,
        });
      }
    }, el);

    return () => ctx.revert();
  }, [children, delay, stagger, animateOnView]);

  return <Component ref={textRef as React.RefObject<HTMLElement> | undefined} className={className}>{children}</Component>;
}
