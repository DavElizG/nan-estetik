/**
 * Footer Component
 * 
 * Pie de página con información de contacto y enlaces
 */

import Link from 'next/link';
import { Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary-950 text-white py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Información de contacto */}
          <div>
            <h3 className="text-2xl font-heading font-bold mb-4">
              <span className="text-primary-500">Nan</span> Estetik
            </h3>
            <p className="text-secondary-400 mb-4">
              Centro de estética especializado en tratamientos faciales y
              corporales de vanguardia.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary-400 hover:text-primary-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary-400 hover:text-primary-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#servicios"
                  className="text-secondary-400 hover:text-primary-500 transition-colors"
                >
                  Servicios
                </a>
              </li>
              <li>
                <a
                  href="#nosotros"
                  className="text-secondary-400 hover:text-primary-500 transition-colors"
                >
                  Nosotros
                </a>
              </li>
              <li>
                <a
                  href="#galeria"
                  className="text-secondary-400 hover:text-primary-500 transition-colors"
                >
                  Galería
                </a>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="text-secondary-400 hover:text-primary-500 transition-colors"
                >
                  Área Administrativa
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-primary-500 mt-1 flex-shrink-0" />
                <span className="text-secondary-400">
                  Dirección del centro estético
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-primary-500 flex-shrink-0" />
                <a
                  href="tel:+525551234567"
                  className="text-secondary-400 hover:text-primary-500 transition-colors"
                >
                  +52 555 123 4567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-primary-500 flex-shrink-0" />
                <a
                  href="mailto:info@nanestetik.com"
                  className="text-secondary-400 hover:text-primary-500 transition-colors"
                >
                  info@nanestetik.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-secondary-800 mt-8 pt-8 text-center text-secondary-400">
          <p>
            © {currentYear} <span className="text-primary-500">Nan</span> Estetik. Todos los derechos reservados.
          </p>
          <p className="mt-2 text-sm">
            Desarrollado por{' '}
            <a
              href="https://github.com/DavElizG"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-500 hover:text-primary-400 transition-colors"
            >
              @DavElizG
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
