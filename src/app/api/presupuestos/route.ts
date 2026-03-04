import { NextResponse } from 'next/server';
import { getPresupuestos, crearPresupuesto } from '@/services/presupuestos.service';

export async function GET() {
  try {
    const presupuestos = await getPresupuestos();
    return NextResponse.json(presupuestos);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener presupuestos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = await crearPresupuesto(body);
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear presupuesto' }, { status: 500 });
  }
}
