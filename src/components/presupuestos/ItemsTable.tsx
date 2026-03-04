'use client';

import { ItemPresupuesto } from '@/types/presupuesto';

interface Props {
  items: ItemPresupuesto[];
  onChange: (items: ItemPresupuesto[]) => void;
}

const itemVacio = (): ItemPresupuesto => ({
  descripcion: '',
  cantidad: 1,
  precio: 0,
  subtotal: 0,
});

export default function ItemsTable({ items, onChange }: Props) {
  const update = (index: number, field: keyof ItemPresupuesto, value: string | number) => {
    const updated = items.map((item, i) => {
      if (i !== index) return item;
      const next = { ...item, [field]: value };
      next.subtotal = next.cantidad * next.precio;
      return next;
    });
    onChange(updated);
  };

  const agregar = () => onChange([...items, itemVacio()]);

  const eliminar = (index: number) => onChange(items.filter((_, i) => i !== index));

  return (
    <div className="mt-4">
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="bg-[#e8f0fe] text-[#1e3a5f]">
              <th className="text-left px-3 py-2 font-semibold">Descripción</th>
              <th className="text-right px-3 py-2 font-semibold w-20">Cant.</th>
              <th className="text-right px-3 py-2 font-semibold w-28">P. Unit. ($)</th>
              <th className="text-right px-3 py-2 font-semibold w-28">Subtotal</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-3 py-1.5">
                  <input
                    type="text"
                    value={item.descripcion}
                    onChange={e => update(i, 'descripcion', e.target.value)}
                    placeholder="Descripción del servicio o pieza"
                    className="w-full bg-transparent outline-none placeholder:text-gray-300"
                    required
                  />
                </td>
                <td className="px-3 py-1.5">
                  <input
                    type="number"
                    min={1}
                    value={item.cantidad}
                    onChange={e => update(i, 'cantidad', Number(e.target.value))}
                    className="w-full text-right bg-transparent outline-none"
                  />
                </td>
                <td className="px-3 py-1.5">
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={item.precio}
                    onChange={e => update(i, 'precio', Number(e.target.value))}
                    className="w-full text-right bg-transparent outline-none"
                  />
                </td>
                <td className="px-3 py-1.5 text-right font-medium text-gray-700">
                  ${item.subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="px-2 py-1.5 text-center">
                  <button
                    type="button"
                    onClick={() => eliminar(i)}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                    disabled={items.length === 1}
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={agregar}
        className="mt-2 text-sm text-[#1e3a5f] hover:underline flex items-center gap-1"
      >
        <span className="text-lg leading-none">+</span> Agregar ítem
      </button>
    </div>
  );
}
