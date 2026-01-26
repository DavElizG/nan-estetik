/**
 * Navbar Component
 * 
 * Barra de navegación principal con:
 * - Diseño responsive
 * - Efecto de transparencia al hacer scroll
 * - Enlaces de navegación suave
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import { gsap } from 'gsap';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);

  // Auto-hide navbar al hacer scroll down, show al hacer scroll up
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Cambiar estilo del navbar al hacer scroll
          setIsScrolled(currentScrollY > 50);

          // Auto-hide logic
          if (navRef.current) {
            if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
              // Scrolling down - hide navbar
              gsap.to(navRef.current, {
                y: -100,
                duration: 0.3,
                ease: 'power2.out',
              });
            } else if (currentScrollY < lastScrollY.current) {
              // Scrolling up - show navbar
              gsap.to(navRef.current, {
                y: 0,
                duration: 0.3,
                ease: 'power2.out',
              });
            }
          }

          lastScrollY.current = currentScrollY;
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#inicio', label: 'Inicio' },
    { href: '#nosotros', label: 'Nosotros' },
    { href: '#servicios', label: 'Servicios' },
    { href: '#galeria', label: 'Galería' },
    { href: '#contacto', label: 'Contacto' },
  ];

  return (
    <nav
      ref={navRef}
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white shadow-md py-4'
          : 'bg-transparent py-6'
      )}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className={clsx(
              'text-2xl font-heading font-bold transition-colors',
              isScrolled ? 'text-secondary-900' : 'text-white'
            )}
          >
            <span className="text-primary-500">Nan</span> Estetik
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={clsx(
                  'font-medium transition-colors hover:text-primary-500',
                  isScrolled ? 'text-secondary-700' : 'text-white'
                )}
              >
                {link.label}
              </a>
            ))}
            <Link href="/admin" className="btn-primary">
              Área Administrativa
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={clsx(
              'md:hidden p-2 transition-colors',
              isScrolled ? 'text-secondary-900' : 'text-white'
            )}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 bg-white rounded-lg shadow-lg border border-secondary-100">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-secondary-700 hover:bg-secondary-50 hover:text-primary-600 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/admin"
              className="block mx-4 mt-2 text-center btn-primary"
            >
              Área Administrativa
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
