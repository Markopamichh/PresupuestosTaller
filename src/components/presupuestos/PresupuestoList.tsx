'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Presupuesto, EstadoPresupuesto } from '@/types/presupuesto';
import PresupuestoCard from './PresupuestoCard';
import Button from '@/components/ui/Button';

const ESTADOS: Array<{ value: EstadoPresupuesto | 'todos'; label: string }> = [
  { value: 'todos', label: 'Todos' },
  { value: 'pendiente', label: 'Pendientes' },
  { value: 'aprobado', label: 'Aprobados' },
  { value: 'rechazado', label: 'Rechazados' },
];

export default function PresupuestoList({ presupuestos }: { presupuestos: Presupuesto[] }) {
  const [filtro, setFiltro] = useState<EstadoPresupuesto | 'todos'>('todos');

  const filtrados = filtro === 'todos'
    ? presupuestos
    : presupuestos.filter(p => p.estado === filtro);

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {ESTADOS.map(e => (
            <button
              key={e.value}
              onClick={() => setFiltro(e.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filtro === e.value
                  ? 'bg-[#1e3a5f] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>
        <Link href="/presupuestos/nuevo">
          <Button>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo presupuesto
          </Button>
        </Link>
      </div>

      {/* Lista */}
      {filtrados.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>No hay presupuestos</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtrados.map(p => (
            <PresupuestoCard key={p.id} presupuesto={p} />
          ))}
        </div>
      )}
    </div>
  );
}
