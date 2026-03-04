import PresupuestoList from '@/components/presupuestos/PresupuestoList';

export default function HomePage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Presupuestos</h2>
      <PresupuestoList />
    </div>
  );
}
