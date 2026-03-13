/**
 * Footer â€” Estilo Luxuria Laser Spa
 * Card redondeada con newsletter + nav | Nombre gigante al fondo
 */

import Link from 'next/link';
import { Share2, AtSign, Mail, Phone, MapPin } from 'lucide-react';
import { FluidDistortionBackground } from '../ui/fluid-distortion-background';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative isolate text-white overflow-hidden bg-[#070410]">
      <FluidDistortionBackground />
      {/* Main section */}
      <div className="relative z-10 container-custom px-4 pt-16 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">

          {/* Left: brand + description + socials + contact */}
          <div className="flex flex-col justify-between gap-10">
            <div>
              <p className="text-2xl font-heading font-black mb-4">
                <span className="text-primary-500">Nan</span> Estetik
              </p>
              <p className="text-secondary-400 text-sm leading-relaxed max-w-[240px]">
                Centro de estÃ©tica especializado en tratamientos faciales y corporales de vanguardia.
              </p>
            </div>

            {/* Socials */}
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full border border-secondary-700 flex items-center justify-center text-secondary-400 hover:border-primary-500 hover:text-primary-500 transition-all duration-300"
              >
                <Share2 size={16} />
              </a>
              <a
                href="https://instagram.com/nanestetik"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-secondary-700 flex items-center justify-center text-secondary-400 hover:border-primary-500 hover:text-primary-500 transition-all duration-300"
              >
                <AtSign size={16} />
              </a>
            </div>

            {/* Contact info */}
            <div className="space-y-2 text-sm text-secondary-500">
              <p className="flex items-center gap-2">
                <Mail size={13} className="text-primary-500/70" />
                info@nanestetik.com
              </p>
              <p className="flex items-center gap-2">
                <Phone size={13} className="text-primary-500/70" />
                +52 555 123 4567
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={13} className="text-primary-500/70" />
                Calle Principal #123, CDMX
              </p>
            </div>
          </div>

          {/* Right: rounded card with newsletter + nav */}
          <div className="bg-secondary-900/50 backdrop-blur-sm rounded-[2rem] p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-8">

              {/* Newsletter */}
              <div>
                <h4 className="text-lg font-heading font-bold text-white mb-1">
                  Novedades & Promociones
                </h4>
                <p className="text-secondary-400 text-xs mb-5">
                  SuscrÃ­bete y recibe ofertas exclusivas
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Tu email"
                    className="flex-1 min-w-0 px-4 py-2.5 bg-white/5 border border-white/10 rounded-full text-white text-sm placeholder-white/30 focus:outline-none focus:border-primary-500/60 transition-colors"
                  />
                  <button className="px-5 py-2.5 bg-primary-500 text-secondary-900 font-bold text-xs rounded-full hover:bg-primary-400 transition-colors whitespace-nowrap">
                    Enviar
                  </button>
                </div>
              </div>

              {/* Columna: Tratamientos */}
              <div className="min-w-[130px]">
                <h5 className="text-[10px] uppercase tracking-[0.2em] text-secondary-500 font-semibold mb-4">
                  Tratamientos
                </h5>
                <ul className="space-y-2.5">
                  {['Relleno Labial', 'ArmonizaciÃ³n', 'Botox', 'Limpieza Facial', 'Radiofrecuencia'].map((t) => (
                    <li key={t}>
                      <a href="#servicios" className="text-secondary-400 hover:text-primary-400 text-sm transition-colors">
                        {t}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Columna: InformaciÃ³n */}
              <div className="min-w-[120px]">
                <h5 className="text-[10px] uppercase tracking-[0.2em] text-secondary-500 font-semibold mb-4">
                  InformaciÃ³n
                </h5>
                <ul className="space-y-2.5">
                  {[
                    { label: 'Nosotros',    href: '#nosotros' },
                    { label: 'GalerÃ­a',     href: '#galeria' },
                    { label: 'Testimonios', href: '#testimonios' },
                    { label: 'Contacto',    href: '#contacto' },
                  ].map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className="text-secondary-400 hover:text-primary-400 text-sm transition-colors">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Columna: Links */}
              <div className="min-w-[110px]">
                <h5 className="text-[10px] uppercase tracking-[0.2em] text-secondary-500 font-semibold mb-4">
                  Links
                </h5>
                <ul className="space-y-2.5">
                  <li>
                    <a href="https://instagram.com/nanestetik" target="_blank" rel="noopener noreferrer"
                      className="text-secondary-400 hover:text-primary-400 text-sm transition-colors">
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a href="https://wa.me/525551234567" target="_blank" rel="noopener noreferrer"
                      className="text-secondary-400 hover:text-primary-400 text-sm transition-colors">
                      WhatsApp
                    </a>
                  </li>
                  <li>
                    <Link href="/admin" className="text-secondary-400 hover:text-primary-400 text-sm transition-colors">
                      Admin
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Barra inferior de la card */}
            <div className="border-t border-white/[0.07] mt-8 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="flex items-center gap-2 text-secondary-500 text-xs">
                <Mail size={12} className="text-primary-500/60" />
                info@nanestetik.com
              </p>
              <a
                href="https://wa.me/525551234567"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm text-white hover:border-primary-500/50 hover:text-primary-400 transition-all duration-300"
              >
                Reserva una cita â†’
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Name giant - same as Luxuria */}
      <div className="relative z-10 overflow-hidden py-4">
        <p
          className="text-center font-heading font-black text-white/[0.04] tracking-tight leading-none whitespace-nowrap select-none"
          style={{ fontSize: 'clamp(5rem, 14vw, 16rem)' }}
        >
          NAN ESTETIK
        </p>
      </div>

      {/* Copyright bar */}
      <div className="relative z-10 border-t border-secondary-800/60">
        <div className="container-custom px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-secondary-600 text-xs">
          <p>Â© {currentYear} Nan Estetik. Todos los derechos reservados.</p>
          <a
            href="https://github.com/DavElizG"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary-500 transition-colors"
          >
            Desarrollado por @DavElizG
          </a>
        </div>
      </div>
    </footer>
  );
}


