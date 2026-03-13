/**
 * Enhanced Contact — Estilo TutuSchool adaptado
 * Título + info a la izquierda | Gran card redondeada oscura con form a la derecha
 * Con Swipe Slider pattern — transición suave con GSAP + Observer
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, AtSign } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, Observer);

export function EnhancedContact() {
  const sectionRef = useRef<HTMLElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    { icon: Phone, label: 'Llámanos', value: '+52 555 123 4567', link: 'tel:+525551234567' },
    { icon: MessageCircle, label: 'WhatsApp', value: 'Chatea con nosotros', link: 'https://wa.me/525551234567' },
    { icon: Mail, label: 'Email', value: 'info@nanestetik.com', link: 'mailto:info@nanestetik.com' },
    { icon: AtSign, label: 'Instagram', value: '@nanestetik', link: 'https://instagram.com/nanestetik' },
  ];

  useEffect(() => {
    if (!sectionRef.current || !outerRef.current || !innerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(outerRef.current, { yPercent: 100 });
      gsap.set(innerRef.current, { yPercent: -100 });

      const animateIn = () => {
        const tl = gsap.timeline({
          defaults: { duration: 1.25, ease: 'power1.inOut' },
        });

        const indices = [0, 1];
        const yPercents = indices.map((i) => (i ? -100 : 100));

        tl.fromTo(
          [outerRef.current, innerRef.current],
          { yPercent: (i: number) => yPercents[i] ?? 0 },
          { yPercent: 0 },
          0
        )
          .fromTo(
            '.contact-left > *',
            { opacity: 0, yPercent: 50 },
            { opacity: 1, yPercent: 0, duration: 0.8, stagger: 0.08, ease: 'power2.out' },
            0.3
          )
          .fromTo(
            '.contact-card-right',
            { opacity: 0, xPercent: 50 },
            { opacity: 1, xPercent: 0, duration: 0.8, ease: 'power2.out' },
            0.3
          );
      };

      gsap.to(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top center',
          onEnter: animateIn,
          once: true,
        },
      });

      Observer.create({
        type: 'wheel,touch',
        tolerance: 10,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contacto"
      className="relative bg-cream-50 py-20 md:py-32 overflow-hidden"
    >
      <div ref={outerRef} className="outer w-full overflow-hidden">
        <div ref={innerRef} className="inner w-full">
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-primary-300/10 rounded-full blur-3xl pointer-events-none" />

          <div className="container-custom px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div className="contact-left flex flex-col gap-8">
                <div>
                  <span className="text-xs uppercase tracking-[0.35em] text-primary-600 font-semibold block mb-4">
                    Contacto
                  </span>
                  <h2 className="text-5xl md:text-6xl xl:text-7xl font-heading font-bold text-secondary-900 leading-[0.92] mb-6">
                    Agenda<br />
                    <span className="text-primary-500">Tu Cita</span>
                  </h2>
                  <p className="text-lg text-secondary-600 max-w-md leading-relaxed">
                    Agenda tu consulta personalizada y descubre cómo podemos ayudarte a alcanzar tus objetivos de belleza.
                  </p>
                </div>

                <ul className="space-y-5">
                  {contactMethods.map((m) => (
                    <li key={m.label}>
                      <a
                        href={m.link}
                        target={m.link.startsWith('http') ? '_blank' : undefined}
                        rel={m.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="group flex items-center gap-4"
                      >
                        <div className="w-11 h-11 rounded-full bg-white border border-primary-500/20 flex items-center justify-center group-hover:border-primary-500 group-hover:bg-primary-500/5 transition-all duration-300 flex-shrink-0">
                          <m.icon className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-xs text-secondary-500 font-medium uppercase tracking-wider">{m.label}</p>
                          <p className="text-base font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors">{m.value}</p>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>

                <div className="pt-6 border-t border-secondary-200/80 space-y-3">
                  <div className="flex items-center gap-3 text-secondary-600">
                    <MapPin className="w-4 h-4 text-primary-500 flex-shrink-0" />
                    <span className="text-sm">Calle Principal #123, CDMX</span>
                  </div>
                  <div className="flex items-center gap-3 text-secondary-600">
                    <Clock className="w-4 h-4 text-primary-500 flex-shrink-0" />
                    <span className="text-sm">Lunes a Sábado: 9:00 - 19:00</span>
                  </div>
                </div>
              </div>

              <div className="contact-card-right bg-secondary-900 rounded-[2.5rem] p-8 md:p-12">
                <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-1">
                  Escríbenos
                </h3>
                <p className="text-white/50 text-sm mb-8">
                  Te respondemos en menos de 24 horas
                </p>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">
                        Nombre
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        placeholder="María González"
                        className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:border-primary-500/60 focus:ring-1 focus:ring-primary-500/20 focus:outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        required
                        placeholder="+52 555 123 4567"
                        className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:border-primary-500/60 focus:ring-1 focus:ring-primary-500/20 focus:outline-none transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      placeholder="maria@ejemplo.com"
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:border-primary-500/60 focus:ring-1 focus:ring-primary-500/20 focus:outline-none transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="service" className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">
                      Servicio de interés
                    </label>
                    <select
                      id="service"
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white/80 focus:border-primary-500/60 focus:ring-1 focus:ring-primary-500/20 focus:outline-none transition-all text-sm"
                    >
                      <option value="" className="bg-secondary-900">Selecciona un servicio</option>
                      <option value="facial" className="bg-secondary-900">Tratamiento Facial</option>
                      <option value="labios" className="bg-secondary-900">Relleno Labial</option>
                      <option value="armonizacion" className="bg-secondary-900">Armonización Facial</option>
                      <option value="botox" className="bg-secondary-900">Botox</option>
                      <option value="otro" className="bg-secondary-900">Otro</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">
                      Mensaje
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      required
                      placeholder="Cuéntanos sobre tus objetivos..."
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/30 focus:border-primary-500/60 focus:ring-1 focus:ring-primary-500/20 focus:outline-none transition-all resize-none text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group w-full px-8 py-4 bg-primary-500 text-secondary-900 font-bold rounded-2xl hover:bg-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 text-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-secondary-900/30 border-t-secondary-900 rounded-full animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Enviar Mensaje
                        <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                <div className="flex flex-wrap gap-6 mt-8 pt-6 border-t border-white/10">
                  <a
                    href="https://wa.me/525551234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/40 hover:text-primary-400 text-xs uppercase tracking-widest transition-colors"
                  >
                    WhatsApp
                  </a>
                  <a
                    href="https://instagram.com/nanestetik"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/40 hover:text-primary-400 text-xs uppercase tracking-widest transition-colors"
                  >
                    Instagram
                  </a>
                  <a
                    href="mailto:info@nanestetik.com"
                    className="text-white/40 hover:text-primary-400 text-xs uppercase tracking-widest transition-colors"
                  >
                    Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
