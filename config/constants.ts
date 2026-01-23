/**
 * Constantes de configuración de la aplicación
 * 
 * Centraliza valores constantes usados en toda la aplicación
 * siguiendo el patrón de configuración centralizada
 */

/**
 * Configuración general de la aplicación
 */
export const APP_CONFIG = {
  name: 'Nan Estetik',
  description: 'Centro de Estética Avanzada',
  url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  email: 'info@nanestetik.com',
  phone: '+52 555 123 4567',
  whatsapp: '+525551234567',
  address: 'Calle Principal #123, Ciudad',
} as const;

/**
 * Configuración de paginación
 */
export const PAGINATION = {
  defaultLimit: 10,
  maxLimit: 100,
  defaultPage: 1,
} as const;

/**
 * Configuración de archivos
 */
export const FILE_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  allowedDocumentTypes: ['application/pdf', 'application/msword'],
} as const;

/**
 * Mensajes de validación
 */
export const VALIDATION_MESSAGES = {
  required: 'Este campo es obligatorio',
  email: 'Ingresa un email válido',
  phone: 'Ingresa un teléfono válido (10 dígitos)',
  minLength: (min: number) => `Mínimo ${min} caracteres`,
  maxLength: (max: number) => `Máximo ${max} caracteres`,
} as const;

/**
 * Opciones para tipos de registro
 */
export const RECORD_TYPES = {
  CONSULTATION: 'Consulta',
  TREATMENT: 'Tratamiento',
  FOLLOW_UP: 'Seguimiento',
  EMERGENCY: 'Emergencia',
} as const;

/**
 * Opciones para género
 */
export const GENDER_OPTIONS = {
  MALE: 'Masculino',
  FEMALE: 'Femenino',
  OTHER: 'Otro',
} as const;

/**
 * Rutas de la aplicación
 */
export const ROUTES = {
  home: '/',
  admin: '/admin',
  adminLogin: '/admin/login',
  adminPatients: '/admin/patients',
  adminRecords: '/admin/records',
  adminSettings: '/admin/settings',
} as const;

/**
 * Configuración de animaciones (Lenis + GSAP)
 */
export const ANIMATION_CONFIG = {
  lenis: {
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  },
  gsap: {
    defaultDuration: 0.8,
    defaultEase: 'power3.out',
  },
} as const;
