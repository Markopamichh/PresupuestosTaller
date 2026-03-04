import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';
import { Presupuesto } from '@/types/presupuesto';
import { PDF_COORDS } from './pdf-coordinates';

export async function generarPresupuestoPDF(presupuesto: Presupuesto): Promise<Uint8Array> {
  // Cargar template desde /public (server-side)
  const templatePath = path.join(process.cwd(), 'public', 'template-presupuesto.pdf');
  const templateBytes = fs.readFileSync(templatePath);

  const pdfDoc = await PDFDocument.load(templateBytes);
  const page = pdfDoc.getPages()[0];
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const colorOscuro = rgb(0.1, 0.1, 0.1);
  const colorAzul = rgb(0.118, 0.227, 0.373);

  // Tapar logo viejo del template con rectángulo blanco
  page.drawRectangle({
    x: 0, y: 700, width: 370, height: 142,
    color: rgb(1, 1, 1),
  });

  // Logo nuevo
  const logoPath = path.join(process.cwd(), 'public', 'imagenes', 'logo pdf.png');
  const logoBytes = fs.readFileSync(logoPath);
  const logoImage = await pdfDoc.embedPng(logoBytes);
  const logoDims = logoImage.scaleToFit(230, 115);
  page.drawImage(logoImage, {
    x: 30,
    y: 840 - logoDims.height,
    width: logoDims.width,
    height: logoDims.height,
  });

  // Datos del cliente
  page.drawText(presupuesto.cliente,  { ...PDF_COORDS.cliente,  font, color: colorOscuro });
  page.drawText(presupuesto.telefono, { ...PDF_COORDS.telefono, font, color: colorOscuro });
  page.drawText(presupuesto.email,    { ...PDF_COORDS.email,    font, color: colorOscuro });
  page.drawText(presupuesto.vehiculo, { ...PDF_COORDS.vehiculo, font, color: colorOscuro });

  const fechaFormateada = new Date(presupuesto.fecha).toLocaleDateString('es-ES');
  page.drawText(fechaFormateada, { ...PDF_COORDS.fecha, font, color: colorOscuro });
  page.drawText(`N° ${String(presupuesto.numero).padStart(4, '0')}`, {
    ...PDF_COORDS.numero, font: fontBold, color: colorAzul,
  });

  // Items en tabla
  const { startY, rowHeight, cols, size } = PDF_COORDS.items;
  presupuesto.items.forEach((item, i) => {
    const y = startY - i * rowHeight;
    if (y < 110) return; // límite 1 página

    // Fondo alternado
    if (i % 2 === 0) {
      page.drawRectangle({
        x: 30, y: y - 5, width: 535, height: rowHeight,
        color: rgb(0.98, 0.99, 1),
      });
    }

    page.drawText(item.descripcion.substring(0, 45), {
      x: cols.descripcion, y, size, font, color: colorOscuro,
    });
    page.drawText(String(item.cantidad), {
      x: cols.cantidad, y, size, font, color: colorOscuro,
    });
    page.drawText(`$${item.precio.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, {
      x: cols.precio, y, size, font, color: colorOscuro,
    });
    page.drawText(`$${item.subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, {
      x: cols.subtotal, y, size, font, color: colorOscuro,
    });

    // Línea divisoria entre filas
    page.drawLine({
      start: { x: 30, y: y - 5 },
      end:   { x: 565, y: y - 5 },
      thickness: 0.3,
      color: rgb(0.85, 0.85, 0.85),
    });
  });

  // Total
  page.drawText('TOTAL:', { ...PDF_COORDS.totalLabel, font: fontBold, color: colorAzul });
  page.drawText(`$${presupuesto.total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, {
    ...PDF_COORDS.totalVal, font: fontBold, color: colorAzul,
  });

  return pdfDoc.save();
}
