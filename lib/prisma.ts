/**
 * Prisma Client Singleton
 * 
 * Patrón Singleton para evitar múltiples instancias de Prisma Client
 * en desarrollo (hot reload) y producción.
 * 
 * @see https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices
 */

import { PrismaClient } from '@prisma/client';

// Extend global type para TypeScript
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

/**
 * Instancia única de Prisma Client
 * En desarrollo, se reutiliza la instancia global
 * En producción, se crea una nueva instancia
 */
export const prisma = globalThis.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// En desarrollo, guardar la instancia en global para hot reload
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

/**
 * Tipos útiles exportados desde Prisma
 */
export type { Patient, PatientRecord, User } from '@prisma/client';
