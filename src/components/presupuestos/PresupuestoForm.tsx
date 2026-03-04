'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ItemPresupuesto, PresupuestoInput } from '@/types/presupuesto';
import ItemsTable from './ItemsTable';
import Button from '@/components/ui/Button';

const itemVacio = (): ItemPresupuesto => ({
  descripcion: '',
  cantidad: 1,
  precio: 0,
  subtotal: 0,
});

export default function PresupuestoForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    cliente: '',
    telefono: '',
    email: '',
    vehiculo: '',
    fecha: new Date().toISOString().split('T')[0],
  });

  const [items, setItems] = useState<ItemPresupuesto[]>([itemVacio()]);

  const subtotal = items.reduce((acc, i) => acc + i.subtotal, 0);
  const total = subtotal;

  const setField = (key: keyof typeof form, value: string | number) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.some(i => !i.descripcion.trim())) {
      setError('Todos los ítems deben tener descripción');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload: PresupuestoInput = {
        ...form,
        items,
        subtotal,
        total,
        estado: 'pendiente',
      };
      const res = await fetch('/api/presupuestos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al guardar');
      router.push(`/presupuestos/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el presupuesto.');
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 max-w-3xl">
      {/* Datos cliente */}
      <section className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Datos del cliente
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Cliente *">
            <input
              type="text" required value={form.cliente}
              onChange={e => setField('cliente', e.target.value)}
              placeholder="Nombre completo"
              className="input-field"
            />
          </Field>
          <Field label="Teléfono">
            <input
              type="tel" value={form.telefono}
              onChange={e => setField('telefono', e.target.value)}
              placeholder="+34 600 000 000"
              className="input-field"
            />
          </Field>
          <Field label="Email">
            <input
              type="email" value={form.email}
              onChange={e => setField('email', e.target.value)}
              placeholder="cliente@email.com"
              className="input-field"
            />
          </Field>
          <Field label="Fecha *">
            <input
              type="date" required value={form.fecha}
              onChange={e => setField('fecha', e.target.value)}
              className="input-field"
            />
          </Field>
          <Field label="Vehículo" className="sm:col-span-2">
            <input
              type="text" value={form.vehiculo}
              onChange={e => setField('vehiculo', e.target.value)}
              placeholder="Marca, modelo, matrícula..."
              className="input-field"
            />
          </Field>
        </div>
      </section>

      {/* Items */}
      <section className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
          Servicios / Piezas
        </h2>
        <ItemsTable items={items} onChange={setItems} />
      </section>

      {/* Totales */}
      <section className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-end gap-8 text-sm">
          <span className="font-semibold text-[#1e3a5f]">TOTAL</span>
          <span className="font-bold text-lg text-[#1e3a5f] w-36 text-right">
            ${total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </section>

      {error && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar presupuesto'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
  className = '',
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  );
}
