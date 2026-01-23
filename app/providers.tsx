/**
 * Componente Providers
 * Envuelve la aplicación con los providers necesarios
 * Este patrón permite agregar Context Providers de forma organizada
 */

'use client';

import { ReactNode } from 'react';
import { SmoothScrollProvider } from '@/components/providers/smooth-scroll-provider';

interface ProvidersProps {
  readonly children: ReactNode;
}

export function Providers({ children }: Readonly<ProvidersProps>) {
  return (
    <SmoothScrollProvider>
      {children}
    </SmoothScrollProvider>
  );
}
