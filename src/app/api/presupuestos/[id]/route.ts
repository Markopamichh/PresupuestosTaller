import { NextResponse } from 'next/server';
import {
  getPresupuesto,
  actualizarPresupuesto,
  eliminarPresupuesto,
} from '@/services/presupuestos.service';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const presupuesto = await getPresupuesto(id);
    return NextResponse.json(presupuesto);
  } catch (error) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    await actualizarPresupuesto(id, body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    await eliminarPresupuesto(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
  }
}
