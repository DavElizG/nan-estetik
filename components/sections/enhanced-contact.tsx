/**
 * Enhanced Contact - Diseño más visual con elementos flotantes
 * 
 * Formulario con efectos premium, cards de info interactivas
 * Más elementos decorativos para llenar el espacio
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, Instagram } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function EnhancedContact() {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animación de entrada de cards de contacto
      const contactCards = sectionRef.current?.querySelectorAll('.contact-card');
      contactCards?.forEach((card, index) => {
        gsap.from(card, {
          opacity: 0,
          y: 40,
          rotation: gsap.utils.random(-5, 5),
          duration: 0.6,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            once: true,
          },
          delay: index * 0.1,
        });
      });

      // Form elements
      const formElements = formRef.current?.querySelectorAll('input, textarea, button');
      formElements?.forEach((el, index) => {
        gsap.from(el, {
          opacity: 0,
          x: -30,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 80%',
            once: true,
          },
          delay: index * 0.08,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert('¡Mensaje enviado! Nos pondremos en contacto contigo pronto.');
      formRef.current?.reset();
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      alert('Error al enviar el mensaje. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: Phone,
      label: 'Llámanos',
      value: '+52 555 123 4567',
      link: 'tel:+525551234567',
      color: 'primary',
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: 'Chatea con nosotros',
      link: 'https://wa.me/525551234567',
      color: 'green',
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'info@nanestetik.com',
      link: 'mailto:info@nanestetik.com',
      color: 'primary',
    },
    {
      icon: Instagram,
      label: 'Instagram',
      value: '@nanestetik',
      link: 'https://instagram.com/nanestetik',
      color: 'pink',
    },
  ];

  const info = [
    { icon: MapPin, label: 'Ubicación', value: 'Calle Principal #123, CDMX' },
    { icon: Clock, label: 'Horario', value: 'Lun - Sáb: 9:00 - 19:00' },
  ];

  return (
    <section
      ref={sectionRef}
      id="contacto"
      className="relative bg-white py-16 md:py-24 lg:py-32 overflow-hidden"
    >
      {/* Background decorativo complejo */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-64 h-64 bg-primary-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-primary-300/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-1 h-40 bg-gradient-to-b from-transparent via-primary-400/20 to-transparent" />
        <div className="absolute bottom-1/ right-1/3 w-48 h-48 border border-primary-300/20 rounded-full" />
      </div>

      <div className="container-custom px-4 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-12 md:mb-20">
          <span className="text-xs uppercase tracking-[0.3em] text-primary-600 font-semibold mb-3 block">
            Contacto
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-heading font-bold text-secondary-900 mb-6">
            Comienza Tu
            <br />
            <span className="text-primary-500">Transformación</span>
          </h2>
          <p className="text-lg md:text-xl text-secondary-600">
            Agenda tu consulta personalizada y descubre cómo podemos ayudarte a alcanzar tus objetivos de belleza.
          </p>
        </div>

        {/* Grid de métodos de contacto */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-20">
          {contactMethods.map((method, index) => (
            <a
              key={index}
              href={method.link}
              target={method.link.startsWith('http') ? '_blank' : undefined}
              rel={method.link.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="contact-card group relative bg-gradient-to-br from-cream-50 to-white p-6 rounded-2xl border border-primary-500/10 hover:border-primary-500/30 hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                <method.icon className="w-6 h-6 text-primary-600" />
              </div>
              <p className="text-sm font-semibold text-secondary-500 mb-1">
                {method.label}
              </p>
              <p className="text-base font-medium text-secondary-900 group-hover:text-primary-600 transition-colors">
                {method.value}
              </p>
              
              {/* Decorative corner */}
              <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-primary-500/20 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>

        {/* Grid principal: formulario + info */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12">
          {/* Formulario (3 columnas) */}
          <div className="lg:col-span-3">
            <div className="bg-secondary-900 rounded-3xl p-6 md:p-10 relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(212,175,55,0.3),_transparent_50%)]" />
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="relative z-10 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                      placeholder="María González"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-white mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                      placeholder="+52 555 123 4567"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                    placeholder="maria@ejemplo.com"
                  />
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-semibold text-white mb-2">
                    Servicio de interés
                  </label>
                  <select
                    id="service"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                  >
                    <option value="">Selecciona un servicio</option>
                    <option value="facial">Tratamiento Facial</option>
                    <option value="labios">Relleno Labial</option>
                    <option value="armonizacion">Armonización Facial</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-white mb-2">
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all resize-none"
                    placeholder="Cuéntanos sobre tus objetivos..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group w-full px-8 py-4 bg-primary-500 text-secondary-900 font-bold rounded-xl hover:bg-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-secondary-900/30 border-t-secondary-900 rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar Mensaje
                      <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Info adicional (2 columnas) */}
          <div className="lg:col-span-2 space-y-6">
            {info.map((item, index) => (
              <div
                key={index}
                className="contact-card bg-gradient-to-br from-primary-50 to-cream-50 p-8 rounded-2xl border border-primary-500/20"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center mb-4">
                  <item.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="text-lg font-heading font-bold text-secondary-900 mb-2">
                  {item.label}
                </h3>
                <p className="text-base text-secondary-700">
                  {item.value}
                </p>
              </div>
            ))}

            {/* CTA urgencia */}
            <div className="contact-card bg-secondary-900 p-8 rounded-2xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,_rgba(212,175,55,0.5),_transparent_60%)]" />
              </div>
              <div className="relative z-10">
                <p className="text-sm font-semibold text-primary-400 mb-3">
                  ⚡ Promoción limitada
                </p>
                <h3 className="text-xl font-heading font-bold text-white mb-3">
                  Primera consulta
                  <br />
                  <span className="text-primary-500">20% descuento</span>
                </h3>
                <p className="text-sm text-white/70 mb-6">
                  Válido para nuevos pacientes hasta fin de mes
                </p>
                <a
                  href="https://wa.me/525551234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-secondary-900 font-bold rounded-lg hover:bg-primary-400 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  Agendar ahora
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
