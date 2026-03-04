export interface ItemPresupuesto {
  descripcion: string;
  cantidad: number;
  precio: number;
  subtotal: number;
}

export type EstadoPresupuesto = 'pendiente' | 'aprobado' | 'rechazado';

export interface Presupuesto {
  id: string;
  numero: number;
  fecha: string;
  cliente: string;
  telefono: string;
  email: string;
  vehiculo: string;
  items: ItemPresupuesto[];
  subtotal: number;
  total: number;
  estado: EstadoPresupuesto;
  creadoEn: string;
  actualizadoEn: string;
}

export type PresupuestoInput = Omit<Presupuesto, 'id' | 'numero' | 'creadoEn' | 'actualizadoEn'>;
