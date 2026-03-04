export const PDF_COORDS = {
  // Datos del cliente (columna izquierda, zona media-alta)
  cliente:   { x: 130, y: 680, size: 11 },
  telefono:  { x: 130, y: 662, size: 11 },
  email:     { x: 130, y: 644, size: 11 },
  vehiculo:  { x: 130, y: 620, size: 11 },
  // Fecha y número (columna derecha)
  fecha:     { x: 430, y: 680, size: 11 },
  numero:    { x: 430, y: 700, size: 13 },
  // Items - tabla
  items: {
    startY: 560,    // Y de la primera fila
    rowHeight: 22,  // Alto de cada fila
    cols: {
      descripcion: 40,
      cantidad: 330,
      precio: 390,
      subtotal: 480,
    },
    size: 10,
  },
  // Totales (alineados a la derecha, abajo)
  totalLabel: { x: 380, y: 155, size: 13 },
  totalVal:   { x: 470, y: 155, size: 13 },
};

// Para modificar posiciones: ajusta los valores x/y arriba.
// x: distancia desde el borde izquierdo (0=izquierda, 595=derecha)
// y: distancia desde el borde inferior (0=abajo, 842=arriba)
