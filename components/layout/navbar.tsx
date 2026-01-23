/**
 * Navbar Component
 * 
 * Barra de navegación principal con:
 * - Diseño responsive
 * - Efecto de transparencia al hacer scroll
 * - Enlaces de navegación suave
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { clsx } from 'clsx';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Detectar scroll para cambiar estilo del navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
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
              isScrolled ? 'text-primary-600' : 'text-white'
            )}
          >
            Nan Estetik
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
          <div className="md:hidden mt-4 py-4 bg-white rounded-lg shadow-lg">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-secondary-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
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
