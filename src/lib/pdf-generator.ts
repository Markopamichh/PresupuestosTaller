import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';
import { Presupuesto } from '@/types/presupuesto';

const NAVY      = rgb(0.118, 0.227, 0.373);
const WHITE     = rgb(1, 1, 1);
const DARK      = rgb(0.12, 0.12, 0.12);
const GRAY_BG   = rgb(0.94, 0.95, 0.97);
const LINE_CLR  = rgb(0.80, 0.82, 0.86);
const BLUE_SOFT = rgb(0.70, 0.80, 0.91);
const GRAY_TEXT = rgb(0.50, 0.50, 0.50);

export async function generarPresupuestoPDF(presupuesto: Presupuesto): Promise<Uint8Array> {
  const pdfDoc   = await PDFDocument.create();
  const page     = pdfDoc.addPage([595, 842]); // A4
  const font     = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // ── LOGO ───────────────────────────────────────────────────────
  const logoPath  = path.join(process.cwd(), 'public', 'imagenes', 'logo pdf.png');
  const logoImage = await pdfDoc.embedPng(fs.readFileSync(logoPath));
  const logoDims  = logoImage.scaleToFit(100, 100);

  // ── HEADER (fondo navy) ────────────────────────────────────────
  const HH = 115;          // alto del header
  const HY = 842 - HH;    // y=727

  page.drawRectangle({ x: 0, y: HY, width: 595, height: HH, color: NAVY });

  // Logo centrado verticalmente, pegado a la derecha
  page.drawImage(logoImage, {
    x: 552 - logoDims.width,
    y: HY + (HH - logoDims.height) / 2,
    width: logoDims.width,
    height: logoDims.height,
  });

  // Nombre del taller
  page.drawText('Taller Integral Emmanuel', {
    x: 40, y: HY + 78, size: 18, font: fontBold, color: WHITE,
  });
  page.drawText('2995461930 - 2995219854  |  Sarmiento 849, Neuquén', {
    x: 40, y: HY + 52, size: 10, font, color: BLUE_SOFT,
  });

  // ── BANDA "PRESUPUESTO" (fondo gris claro) ─────────────────────
  const BH = 52;
  const BY = HY - BH; // y=675

  page.drawRectangle({ x: 0, y: BY, width: 595, height: BH, color: GRAY_BG });

  page.drawText('PRESUPUESTO', {
    x: 40, y: BY + 17, size: 20, font: fontBold, color: NAVY,
  });

  // N° (derecha)
  const numero = String(presupuesto.numero).padStart(4, '0');
  page.drawText('N°',    { x: 350, y: BY + 37, size: 10, font: fontBold, color: NAVY });
  page.drawText(numero,  { x: 372, y: BY + 37, size: 13, font: fontBold, color: NAVY });

  // Fecha (derecha, abajo de N°)
  const fechaStr = new Date(presupuesto.fecha).toLocaleDateString('es-ES');
  page.drawText('Fecha:', { x: 350, y: BY + 15, size: 10, font: fontBold, color: NAVY });
  page.drawText(fechaStr, { x: 397, y: BY + 15, size: 10, font, color: DARK });

  // ── DATOS DEL CLIENTE ──────────────────────────────────────────
  const campos = [
    { label: 'Cliente:',   value: presupuesto.cliente   || '' },
    { label: 'Teléfono:', value: presupuesto.telefono  || '' },
    { label: 'Email:',    value: presupuesto.email     || '' },
    { label: 'Vehículo:', value: presupuesto.vehiculo  || '' },
  ];

  const CL_Y   = BY - 22; // y=653 — primera fila de cliente
  const CL_ROW = 26;

  campos.forEach(({ label, value }, i) => {
    const y = CL_Y - i * CL_ROW;
    page.drawText(label, { x: 40, y, size: 10, font: fontBold, color: NAVY });
    page.drawText(value, { x: 118, y, size: 10, font, color: DARK });
    // Línea guía debajo del valor
    page.drawLine({
      start: { x: 118, y: y - 4 }, end: { x: 555, y: y - 4 },
      thickness: 0.4, color: LINE_CLR,
    });
  });

  // ── TABLA ──────────────────────────────────────────────────────
  const TL  = 40;   // left
  const TR  = 555;  // right
  const TW  = TR - TL; // 515
  const RH  = 22;   // alto de cada fila
  const MAX = 12;   // máximo de filas visibles

  // T_TOP: justo debajo de la sección cliente
  const T_TOP = CL_Y - (campos.length - 1) * CL_ROW - CL_ROW - 18;

  // Columnas
  const C_DESC = TL + 5;
  const C_CANT = TL + Math.round(TW * 0.61);
  const C_PU   = TL + Math.round(TW * 0.72);
  const C_SUB  = TL + Math.round(TW * 0.85);

  // Header de la tabla
  page.drawRectangle({ x: TL, y: T_TOP - RH, width: TW, height: RH, color: NAVY });
  ([ [C_DESC, 'DESCRIPCIÓN'], [C_CANT, 'CANT.'], [C_PU, 'P. UNIT.'], [C_SUB, 'SUBTOTAL'] ] as [number, string][])
    .forEach(([x, txt]) => {
      page.drawText(txt, { x, y: T_TOP - RH + 7, size: 9, font: fontBold, color: WHITE });
    });

  // Separadores verticales de columnas en el header
  [C_CANT - 5, C_PU - 5, C_SUB - 5].forEach(x => {
    page.drawLine({
      start: { x, y: T_TOP - RH }, end: { x, y: T_TOP },
      thickness: 0.3, color: rgb(0.3, 0.45, 0.6),
    });
  });

  // Filas (siempre dibuja MAX para aspecto uniforme)
  const T_BOT = T_TOP - RH - MAX * RH;

  for (let i = 0; i < MAX; i++) {
    const rY   = T_TOP - RH - (i + 1) * RH;
    const item = presupuesto.items[i];

    // Fondo alternado
    if (i % 2 === 1) {
      page.drawRectangle({ x: TL, y: rY, width: TW, height: RH, color: GRAY_BG });
    }

    // Línea inferior de la fila
    page.drawLine({
      start: { x: TL, y: rY }, end: { x: TR, y: rY },
      thickness: 0.3, color: LINE_CLR,
    });

    // Texto si hay item
    if (item) {
      const tY = rY + 7;
      page.drawText(item.descripcion.substring(0, 52), { x: C_DESC, y: tY, size: 9, font, color: DARK });
      page.drawText(String(item.cantidad),             { x: C_CANT, y: tY, size: 9, font, color: DARK });
      page.drawText(
        `$${item.precio.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        { x: C_PU, y: tY, size: 9, font, color: DARK }
      );
      page.drawText(
        `$${item.subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        { x: C_SUB, y: tY, size: 9, font, color: DARK }
      );
    }
  }

  // Borde exterior de la tabla
  page.drawLine({ start: { x: TL, y: T_TOP }, end: { x: TR, y: T_TOP }, thickness: 0.5, color: LINE_CLR });
  page.drawLine({ start: { x: TL, y: T_BOT }, end: { x: TR, y: T_BOT }, thickness: 0.5, color: LINE_CLR });
  page.drawLine({ start: { x: TL, y: T_BOT }, end: { x: TL, y: T_TOP }, thickness: 0.5, color: LINE_CLR });
  page.drawLine({ start: { x: TR, y: T_BOT }, end: { x: TR, y: T_TOP }, thickness: 0.5, color: LINE_CLR });

  // Separadores verticales en filas
  [C_CANT - 5, C_PU - 5, C_SUB - 5].forEach(x => {
    page.drawLine({ start: { x, y: T_BOT }, end: { x, y: T_TOP - RH }, thickness: 0.3, color: LINE_CLR });
  });

  // ── TOTAL ──────────────────────────────────────────────────────
  const TOT_W = Math.round(TW * 0.45);
  const TOT_X = TR - TOT_W;
  const TOT_Y = T_BOT - 6;

  page.drawRectangle({ x: TOT_X, y: TOT_Y - 30, width: TOT_W, height: 30, color: GRAY_BG });
  page.drawLine({ start: { x: TOT_X, y: TOT_Y },      end: { x: TR, y: TOT_Y },      thickness: 0.5, color: LINE_CLR });
  page.drawLine({ start: { x: TOT_X, y: TOT_Y - 30 }, end: { x: TR, y: TOT_Y - 30 }, thickness: 0.5, color: LINE_CLR });
  page.drawLine({ start: { x: TOT_X, y: TOT_Y - 30 }, end: { x: TOT_X, y: TOT_Y },   thickness: 0.5, color: LINE_CLR });
  page.drawLine({ start: { x: TR,    y: TOT_Y - 30 }, end: { x: TR, y: TOT_Y },       thickness: 0.5, color: LINE_CLR });

  page.drawText('TOTAL:', {
    x: TOT_X + 12, y: TOT_Y - 20, size: 12, font: fontBold, color: NAVY,
  });
  page.drawText(
    `$${presupuesto.total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    { x: TOT_X + 78, y: TOT_Y - 20, size: 12, font: fontBold, color: NAVY }
  );

  // ── FOOTER ─────────────────────────────────────────────────────
  page.drawLine({ start: { x: 40, y: 60 }, end: { x: 555, y: 60 }, thickness: 0.4, color: LINE_CLR });
  page.drawText('Taller Integral Emmanuel  ·  Sarmiento 849, Neuquén  ·  Tel: 2995461930 - 2995219854', {
    x: 40, y: 46, size: 8, font, color: GRAY_TEXT,
  });
  page.drawText('Este presupuesto tiene una validez de 30 días desde su fecha de emisión.', {
    x: 40, y: 33, size: 8, font, color: GRAY_TEXT,
  });

  return pdfDoc.save();
}
