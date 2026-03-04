import PresupuestoForm from '@/components/presupuestos/PresupuestoForm';
import Link from 'next/link';

export default function NuevoPresupuestoPage() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm">← Volver</Link>
        <span className="text-gray-300">/</span>
        <h2 className="text-2xl font-bold text-gray-900">Nuevo presupuesto</h2>
      </div>
      <PresupuestoForm />
    </div>
  );
}
