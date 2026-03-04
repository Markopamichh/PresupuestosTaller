import { getPresupuestos } from '@/services/presupuestos.service';
import PresupuestoList from '@/components/presupuestos/PresupuestoList';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let presupuestos: Awaited<ReturnType<typeof getPresupuestos>> = [];
  try {
    presupuestos = await getPresupuestos();
  } catch {
    // Firebase no configurado aún
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Presupuestos</h2>
      <PresupuestoList presupuestos={presupuestos} />
    </div>
  );
}
