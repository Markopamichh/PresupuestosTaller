'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Presupuesto, EstadoPresupuesto } from '@/types/presupuesto';
import { getPresupuestos } from '@/services/presupuestos.service';
import PresupuestoCard from './PresupuestoCard';
import Button from '@/components/ui/Button';

const ESTADOS: Array<{ value: EstadoPresupuesto | 'todos'; label: string }> = [
  { value: 'todos', label: 'Todos' },
  { value: 'pendiente', label: 'Pendientes' },
  { value: 'aprobado', label: 'Aprobados' },
  { value: 'rechazado', label: 'Rechazados' },
];

export default function PresupuestoList() {
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<EstadoPresupuesto | 'todos'>('todos');

  useEffect(() => {
    getPresupuestos()
      .then(setPresupuestos)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtrados = filtro === 'todos'
    ? presupuestos
    : presupuestos.filter(p => p.estado === filtro);

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap gap-2">
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
        <Link href="/presupuestos/nuevo" className="sm:shrink-0">
          <Button className="w-full sm:w-auto justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo presupuesto
          </Button>
        </Link>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Cargando...</div>
      ) : filtrados.length === 0 ? (
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
