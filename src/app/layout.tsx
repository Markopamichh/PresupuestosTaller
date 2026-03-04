import type { Metadata } from 'next';
import './globals.css';
import { BUSINESS_CONFIG } from '@/lib/business-config';

export const metadata: Metadata = {
  title: BUSINESS_CONFIG.nombre,
  description: 'Gestión de presupuestos',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-[#f8fafc]">
        <header className="bg-[#1e3a5f] text-white shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold truncate">{BUSINESS_CONFIG.nombre}</h1>
              <p className="text-xs text-blue-200 truncate">{BUSINESS_CONFIG.telefono}</p>
            </div>
            <span className="text-blue-200 text-xs sm:text-sm whitespace-nowrap shrink-0">Presupuestos</span>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-3 sm:px-4 py-5 sm:py-8">{children}</main>
      </body>
    </html>
  );
}
