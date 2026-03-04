'use client';

import Link from 'next/link';
import { Presupuesto } from '@/types/presupuesto';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';

interface Props {
  presupuesto: Presupuesto;
}

export default function PresupuestoCard({ presupuesto }: Props) {
  const numero = String(presupuesto.numero).padStart(4, '0');
  const d = new Date(presupuesto.fecha);
  const fecha = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

  const handlePDF = () => {
    window.open(`/api/pdf/${presupuesto.id}`, '_blank');
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-xs font-mono text-gray-400">N° {numero}</span>
          <h3 className="text-base font-semibold text-gray-900 mt-0.5">{presupuesto.cliente}</h3>
          <p className="text-sm text-gray-500">{presupuesto.vehiculo}</p>
        </div>
        <StatusBadge estado={presupuesto.estado} />
      </div>

      <div className="flex items-center justify-between mt-4">
        <div>
          <p className="text-xs text-gray-400">{fecha}</p>
          <p className="text-xl font-bold text-[#1e3a5f]" suppressHydrationWarning>${presupuesto.total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={handlePDF} title="Descargar PDF">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PDF
          </Button>
          <Link href={`/presupuestos/${presupuesto.id}`}>
            <Button variant="secondary">Ver</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
