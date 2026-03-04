import { NextResponse } from 'next/server';
import { getPresupuesto } from '@/services/presupuestos.service';
import { generarPresupuestoPDF } from '@/lib/pdf-generator';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const presupuesto = await getPresupuesto(id);
    const pdfBytes = await generarPresupuestoPDF(presupuesto);

    const numeroStr = String(presupuesto.numero).padStart(4, '0');
    return new Response(pdfBytes.buffer as ArrayBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=presupuesto-${numeroStr}.pdf`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error al generar PDF' }, { status: 500 });
  }
}
