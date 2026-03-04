import { EstadoPresupuesto } from '@/types/presupuesto';

const config: Record<EstadoPresupuesto, { label: string; classes: string }> = {
  pendiente: {
    label: 'Pendiente',
    classes: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  },
  aprobado: {
    label: 'Aprobado',
    classes: 'bg-green-100 text-green-800 border border-green-200',
  },
  rechazado: {
    label: 'Rechazado',
    classes: 'bg-red-100 text-red-800 border border-red-200',
  },
};

export default function StatusBadge({ estado }: { estado: EstadoPresupuesto }) {
  const { label, classes } = config[estado];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}>
      {label}
    </span>
  );
}
