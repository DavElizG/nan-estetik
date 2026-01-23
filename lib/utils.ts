/**
 * Utilidades generales
 * 
 * Funciones helper reutilizables en toda la aplicación
 */

import { clsx, type ClassValue } from 'clsx';

/**
 * Combina clases de CSS de manera inteligente
 * Útil para componentes con clases condicionales
 * 
 * @example
 * cn('base-class', condition && 'conditional-class', 'another-class')
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Formatea un número de teléfono al formato mexicano
 * 
 * @example
 * formatPhone('5551234567') // '+52 555 123 4567'
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replaceAll(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `+52 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  
  return phone;
}

/**
 * Formatea una fecha en español
 * 
 * @example
 * formatDate(new Date()) // '23 de enero de 2026'
 */
export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };

  return new Intl.DateTimeFormat('es-MX', defaultOptions).format(date);
}

/**
 * Formatea fecha y hora
 * 
 * @example
 * formatDateTime(new Date()) // '23 de enero de 2026, 14:30'
 */
export function formatDateTime(date: Date): string {
  return formatDate(date, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Trunca un texto a una longitud específica
 * 
 * @example
 * truncate('Lorem ipsum dolor sit amet', 10) // 'Lorem ipsu...'
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * Capitaliza la primera letra de un string
 * 
 * @example
 * capitalize('hello world') // 'Hello world'
 */
export function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Espera un tiempo determinado (útil para desarrollo)
 * 
 * @example
 * await sleep(1000) // Espera 1 segundo
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Valida un email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida un teléfono mexicano
 */
export function isValidMexicanPhone(phone: string): boolean {
  const cleaned = phone.replaceAll(/\D/g, '');
  return cleaned.length === 10 || cleaned.length === 12;
}
