'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Presupuesto, EstadoPresupuesto } from '@/types/presupuesto';
import { getPresupuesto, actualizarPresupuesto, eliminarPresupuesto } from '@/services/presupuestos.service';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';

export default function PresupuestoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [presupuesto, setPresupuesto] = useState<Presupuesto | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingEstado, setUpdatingEstado] = useState(false);

  useEffect(() => {
    getPresupuesto(id)
      .then(setPresupuesto)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleEstado = async (estado: EstadoPresupuesto) => {
    if (!presupuesto) return;
    setUpdatingEstado(true);
    await actualizarPresupuesto(id, { estado });
    setPresupuesto({ ...presupuesto, estado });
    setUpdatingEstado(false);
  };

  const handleEliminar = async () => {
    if (!confirm('¿Eliminar este presupuesto?')) return;
    await eliminarPresupuesto(id);
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        Cargando...
      </div>
    );
  }

  if (!presupuesto) {
    return (
      <div className="text-center py-24">
        <p className="text-gray-500">Presupuesto no encontrado.</p>
        <Link href="/" className="text-[#1e3a5f] underline mt-2 inline-block">Volver</Link>
      </div>
    );
  }

  const numero = String(presupuesto.numero).padStart(4, '0');
  const fecha = new Date(presupuesto.fecha).toLocaleDateString('es-ES');
  const totalFmt = `$${presupuesto.total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const whatsappText = encodeURIComponent(
    `Hola ${presupuesto.cliente}, aquí tu presupuesto N°${numero} por ${totalFmt}`
  );
  const whatsappUrl = `https://wa.me/${presupuesto.telefono.replace(/\D/g, '')}?text=${whatsappText}`;

  return (
    <div className="max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-600">← Volver</Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">Presupuesto N° {numero}</span>
      </div>

      {/* Header tarjeta */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
          <div className="min-w-0">
            <p className="text-xs text-gray-400 font-mono">N° {numero} · {fecha}</p>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 wrap-break-words">{presupuesto.cliente}</h2>
            {presupuesto.vehiculo && (
              <p className="text-gray-500 text-sm mt-0.5">{presupuesto.vehiculo}</p>
            )}
          </div>
          <StatusBadge estado={presupuesto.estado} />
        </div>

        {/* Contacto */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-3 pt-3 border-t border-gray-100">
          {presupuesto.telefono && (
            <span>📞 {presupuesto.telefono}</span>
          )}
          {presupuesto.email && (
            <span>✉️ {presupuesto.email}</span>
          )}
        </div>

        {/* Acciones de contacto */}
        <div className="flex flex-wrap gap-2 mt-4">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="secondary">
              WhatsApp
            </Button>
          </a>
          <a href={`/api/pdf/${id}`} target="_blank">
            <Button>
              Generar PDF
            </Button>
          </a>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Servicios / Piezas
        </h3>
        <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full min-w-95 text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
              <th className="pb-2 font-medium">Descripción</th>
              <th className="pb-2 font-medium text-right w-14">Cant.</th>
              <th className="pb-2 font-medium text-right w-24">P. Unit.</th>
              <th className="pb-2 font-medium text-right w-24">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {presupuesto.items.map((item, i) => (
              <tr key={i} className="border-b border-gray-50 last:border-0">
                <td className="py-2">{item.descripcion}</td>
                <td className="py-2 text-right text-gray-500">{item.cantidad}</td>
                <td className="py-2 text-right text-gray-500">${item.precio.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="py-2 text-right font-medium">${item.subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {/* Totales */}
        <div className="flex items-center justify-end gap-8 mt-4 pt-4 border-t border-gray-100 text-base font-bold text-[#1e3a5f]">
          <span>TOTAL</span>
          <span className="w-36 text-right">{totalFmt}</span>
        </div>
      </div>

      {/* Estado + acciones */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Estado:</span>
          <select
            value={presupuesto.estado}
            onChange={e => handleEstado(e.target.value as EstadoPresupuesto)}
            disabled={updatingEstado}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 bg-white text-gray-900"
          >
            <option value="pendiente">Pendiente</option>
            <option value="aprobado">Aprobado</option>
            <option value="rechazado">Rechazado</option>
          </select>
        </div>
        <Button variant="danger" onClick={handleEliminar}>
          Eliminar
        </Button>
      </div>
    </div>
  );
}
