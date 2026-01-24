/**
 * Componente Providers
 * Envuelve la aplicación con los providers necesarios
 * Este patrón permite agregar Context Providers de forma organizada
 */

'use client';

import { ReactNode } from 'react';
import { LenisProvider } from '@/components/providers/lenis-provider';

interface ProvidersProps {
  readonly children: ReactNode;
}

export function Providers({ children }: Readonly<ProvidersProps>) {
  return (
    <LenisProvider>
      {children}
    </LenisProvider>
  );
}
