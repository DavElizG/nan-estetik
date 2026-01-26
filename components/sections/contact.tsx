/**
 * Contact Section
 * 
 * Sección de contacto con:
 * - Formulario de contacto con parallax
 * - Información de ubicación
 * - Integración con WhatsApp
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const decorativeRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax del formulario
      gsap.from(formRef.current, {
        scrollTrigger: {
          trigger: formRef.current,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
        x: -50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });

      // Parallax de la información de contacto
      gsap.from(infoRef.current?.children || [], {
        scrollTrigger: {
          trigger: infoRef.current,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
        x: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
      });

      // Parallax del elemento decorativo
      gsap.to(decorativeRef.current, {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implementar integración con API de email o servicio de mensajería
      // Por ahora, simular envío exitoso
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

  const contactInfo = [
    {
      icon: Phone,
      title: 'Teléfono',
      content: '+52 555 123 4567',
      link: 'tel:+525551234567',
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'info@nanestetik.com',
      link: 'mailto:info@nanestetik.com',
    },
    {
      icon: MapPin,
      title: 'Dirección',
      content: 'Calle Principal #123, Ciudad',
      link: 'https://maps.google.com',
    },
    {
      icon: Clock,
      title: 'Horario',
      content: 'Lun - Sáb: 9:00 - 19:00',
      link: null,
    },
  ];

  return (
    <section
      id="contacto"
      ref={sectionRef}
      className="py-20 md:py-32 bg-secondary-50 relative overflow-hidden"
    >
      {/* Elemento decorativo con parallax */}
      <div
        ref={decorativeRef}
        className="absolute bottom-0 left-0 w-96 h-96 bg-primary-300/20 rounded-full blur-3xl pointer-events-none"
      />
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-secondary-900 mb-6">
            Agenda tu Cita
          </h2>
          <div className="w-24 h-1 bg-primary-500 mx-auto mb-8" />
          <p className="text-lg md:text-xl text-secondary-600 max-w-3xl mx-auto">
            Estamos aquí para ayudarte. Contáctanos y agenda tu consulta.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulario */}
          <div>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="label">
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="input"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label htmlFor="email" className="label">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="input"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="label">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  className="input"
                  placeholder="+52 555 123 4567"
                />
              </div>

              <div>
                <label htmlFor="message" className="label">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  className="input"
                  placeholder="¿En qué podemos ayudarte?"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  'Enviando...'
                ) : (
                  <>
                    Enviar mensaje
                    <Send size={20} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Información de contacto */}
          <div ref={infoRef}>
            <div className="space-y-6 mb-8">
              {contactInfo.map((info) => {
                const Icon = info.icon;
                return (
                  <div
                    key={info.title}
                    className="flex items-start gap-4 p-4 rounded-lg bg-white hover:shadow-md transition-all border border-secondary-100"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                      <Icon className="text-primary-500" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary-900 mb-1">
                        {info.title}
                      </h3>
                      {info.link ? (
                        <a
                          href={info.link}
                          target={info.link.startsWith('http') ? '_blank' : undefined}
                          rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="text-secondary-600 hover:text-primary-600 transition-colors"
                        >
                          {info.content}
                        </a>
                      ) : (
                        <p className="text-secondary-600">{info.content}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* WhatsApp CTA */}
            <div className="card bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200">
              <h3 className="font-heading font-bold text-xl text-secondary-900 mb-3">
                ¿Prefieres WhatsApp?
              </h3>
              <p className="text-secondary-700 mb-4">
                Chatea con nosotros directamente y agenda tu cita de forma rápida.
              </p>
              <a
                href="https://wa.me/525551234567"
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-green-600 text-white hover:bg-green-700"
              >
                Abrir WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
