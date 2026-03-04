import { PDFDocument, rgb, StandardFonts, PDFPage } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';
import { BUSINESS_CONFIG } from '../src/lib/business-config';

async function createTemplate() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const colorAzulOscuro = rgb(0.118, 0.227, 0.373);  // #1e3a5f
  const colorAzulClaro  = rgb(0.91, 0.941, 0.996);   // #e8f0fe
  const colorGris       = rgb(0.945, 0.961, 0.976);  // #f1f5f9
  const colorBlanco     = rgb(1, 1, 1);
  const colorGrisOscuro = rgb(0.4, 0.4, 0.4);
  const colorTexto      = rgb(0.1, 0.1, 0.1);

  // ── HEADER (azul oscuro) ──────────────────────────────────────────────────
  page.drawRectangle({ x: 0, y: 790, width: 595, height: 52, color: colorAzulOscuro });

  // Logo (derecha del header)
  const logoPath = path.join(process.cwd(), 'public', 'imagenes', 'WhatsApp Image 2026-03-03 at 21.36.12.jpeg');
  if (fs.existsSync(logoPath)) {
    const logoBytes = fs.readFileSync(logoPath);
    const logoImage = await pdfDoc.embedJpg(logoBytes);
    const targetH = 44;
    const targetW = logoImage.width * (targetH / logoImage.height);
    page.drawImage(logoImage, { x: 560 - targetW, y: 791, width: targetW, height: targetH });
  }

  // Nombre del negocio
  page.drawText(BUSINESS_CONFIG.nombre, {
    x: 30, y: 818, size: 16, font: fontBold, color: colorBlanco,
  });
  // Teléfonos y dirección
  page.drawText(`${BUSINESS_CONFIG.telefono}  |  ${BUSINESS_CONFIG.direccion}`, {
    x: 30, y: 800, size: 9, font: fontRegular, color: rgb(0.8, 0.88, 1),
  });

  // ── SUBHEADER (azul claro) ────────────────────────────────────────────────
  page.drawRectangle({ x: 0, y: 750, width: 595, height: 40, color: colorAzulClaro });

  page.drawText('PRESUPUESTO', {
    x: 30, y: 763, size: 16, font: fontBold, color: colorAzulOscuro,
  });

  // Etiqueta número (el valor dinámico se superpone)
  page.drawText('N°:', {
    x: 390, y: 763, size: 13, font: fontBold, color: colorAzulOscuro,
  });

  // ── SECCIÓN CLIENTE ───────────────────────────────────────────────────────
  const labelX = 30;
  const lineStart = 125;
  const lineEnd = 290;
  const clienteFields: Array<{ label: string; y: number }> = [
    { label: 'Cliente:',   y: 680 },
    { label: 'Teléfono:',  y: 662 },
    { label: 'Email:',     y: 644 },
    { label: 'Vehículo:',  y: 620 },
  ];

  for (const field of clienteFields) {
    page.drawText(field.label, {
      x: labelX, y: field.y, size: 10, font: fontBold, color: colorGrisOscuro,
    });
    // Línea punteada
    drawDashedLine(page, lineStart, field.y - 2, lineEnd, field.y - 2, rgb(0.7, 0.7, 0.7));
  }

  // Etiquetas fecha (columna derecha)
  page.drawText('Fecha:', {
    x: 370, y: 680, size: 10, font: fontBold, color: colorGrisOscuro,
  });

  // Línea separadora horizontal debajo de la sección cliente
  page.drawLine({
    start: { x: 30, y: 605 }, end: { x: 565, y: 605 },
    thickness: 1, color: rgb(0.8, 0.8, 0.8),
  });

  // ── TABLA ITEMS ───────────────────────────────────────────────────────────
  // Cabecera de tabla
  page.drawRectangle({ x: 30, y: 580, width: 535, height: 22, color: colorGris });
  page.drawRectangle({ x: 30, y: 580, width: 535, height: 22, borderColor: rgb(0.75, 0.82, 0.9), borderWidth: 1 });

  const headerY = 588;
  page.drawText('DESCRIPCIÓN', {
    x: 40, y: headerY, size: 9, font: fontBold, color: colorAzulOscuro,
  });
  page.drawText('CANT.', {
    x: 330, y: headerY, size: 9, font: fontBold, color: colorAzulOscuro,
  });
  page.drawText('P. UNIT.', {
    x: 385, y: headerY, size: 9, font: fontBold, color: colorAzulOscuro,
  });
  page.drawText('SUBTOTAL', {
    x: 475, y: headerY, size: 9, font: fontBold, color: colorAzulOscuro,
  });

  // Líneas de columna en la cabecera
  const colDividers = [325, 380, 468];
  for (const x of colDividers) {
    page.drawLine({
      start: { x, y: 580 }, end: { x, y: 602 },
      thickness: 0.5, color: rgb(0.75, 0.82, 0.9),
    });
  }

  // Área de datos de items (fondo muy claro alternado se genera dinámicamente)
  // Solo dibujamos el borde del área completa
  page.drawRectangle({
    x: 30, y: 100, width: 535, height: 480,
    borderColor: rgb(0.85, 0.85, 0.85), borderWidth: 0.5,
  });

  // ── ZONA TOTALES ──────────────────────────────────────────────────────────
  // Rect fondo
  page.drawRectangle({ x: 365, y: 125, width: 200, height: 70, color: colorGris });
  page.drawRectangle({
    x: 365, y: 125, width: 200, height: 70,
    borderColor: rgb(0.75, 0.82, 0.9), borderWidth: 1,
  });

  // Línea separadora antes del total
  page.drawLine({
    start: { x: 365, y: 148 }, end: { x: 565, y: 148 },
    thickness: 1, color: colorAzulOscuro,
  });

  // ── FOOTER ────────────────────────────────────────────────────────────────
  page.drawLine({
    start: { x: 30, y: 75 }, end: { x: 565, y: 75 },
    thickness: 0.5, color: rgb(0.7, 0.7, 0.7),
  });

  page.drawText(
    `${BUSINESS_CONFIG.nombre}  ·  ${BUSINESS_CONFIG.direccion}  ·  Tel: ${BUSINESS_CONFIG.telefono}`,
    { x: 30, y: 60, size: 7.5, font: fontRegular, color: colorGrisOscuro }
  );

  page.drawText('Este presupuesto tiene una validez de 30 días desde su fecha de emisión.', {
    x: 30, y: 48, size: 7, font: fontRegular, color: rgb(0.6, 0.6, 0.6),
  });

  // ── GUARDAR ───────────────────────────────────────────────────────────────
  const pdfBytes = await pdfDoc.save();
  const outputPath = path.join(process.cwd(), 'public', 'template-presupuesto.pdf');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, pdfBytes);
  console.log(`✅ Template guardado en: ${outputPath}`);
}

function drawDashedLine(
  page: PDFPage,
  x1: number, y1: number,
  x2: number, y2: number,
  color: ReturnType<typeof rgb>,
  dashLen = 3,
  gapLen = 3
) {
  const total = x2 - x1;
  let cur = x1;
  while (cur < x2) {
    const end = Math.min(cur + dashLen, x2);
    page.drawLine({ start: { x: cur, y: y1 }, end: { x: end, y: y2 }, thickness: 0.5, color });
    cur = end + gapLen;
  }
}

createTemplate().catch(console.error);
