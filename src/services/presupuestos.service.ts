import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Presupuesto, PresupuestoInput } from '@/types/presupuesto';

const COL = 'presupuestos';

function docToPresupuesto(id: string, data: Record<string, unknown>): Presupuesto {
  return {
    id,
    numero: data.numero as number,
    fecha: data.fecha as string,
    cliente: data.cliente as string,
    telefono: data.telefono as string,
    email: data.email as string,
    vehiculo: data.vehiculo as string,
    items: data.items as Presupuesto['items'],
    subtotal: data.subtotal as number,
    total: data.total as number,
    estado: data.estado as Presupuesto['estado'],
    creadoEn: data.creadoEn as string,
    actualizadoEn: data.actualizadoEn as string,
  };
}

export async function getPresupuestos(): Promise<Presupuesto[]> {
  const q = query(collection(db, COL), orderBy('numero', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => docToPresupuesto(d.id, d.data() as Record<string, unknown>));
}

export async function getPresupuesto(id: string): Promise<Presupuesto> {
  const snap = await getDoc(doc(db, COL, id));
  if (!snap.exists()) throw new Error(`Presupuesto ${id} no encontrado`);
  return docToPresupuesto(snap.id, snap.data() as Record<string, unknown>);
}

export async function getNextNumero(): Promise<number> {
  const q = query(collection(db, COL), orderBy('numero', 'desc'), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return 1;
  const last = snap.docs[0].data() as Record<string, unknown>;
  return (last.numero as number) + 1;
}

export async function crearPresupuesto(input: PresupuestoInput): Promise<string> {
  const numero = await getNextNumero();
  const now = new Date().toISOString();
  const data = {
    ...input,
    numero,
    creadoEn: now,
    actualizadoEn: now,
  };
  const ref = await addDoc(collection(db, COL), data);
  return ref.id;
}

export async function actualizarPresupuesto(
  id: string,
  data: Partial<PresupuestoInput>
): Promise<void> {
  await updateDoc(doc(db, COL, id), {
    ...data,
    actualizadoEn: new Date().toISOString(),
  });
}

export async function eliminarPresupuesto(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}
