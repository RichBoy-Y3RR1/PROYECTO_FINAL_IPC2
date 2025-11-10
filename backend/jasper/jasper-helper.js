import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';

const execPromise = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPORTS_DIR = path.join(__dirname, 'reports');
const OUTPUT_DIR = path.join(__dirname, 'output');

/**
 * Genera un reporte PDF usando JasperReports
 *
 * NOTA: Esta implementación requiere tener instalado JasperReports Studio o jasperstarter
 * Para desarrollo sin Java, se puede usar una alternativa simplificada con PDFKit
 *
 * @param {string} reportName - Nombre del archivo .jrxml (sin extensión)
 * @param {object} parameters - Parámetros del reporte
 * @param {array} dataSource - Datos para el reporte
 * @returns {Promise<string>} - Ruta del PDF generado
 */
export async function generateReport(reportName, parameters, dataSource) {
  try {
    // Crear directorio de salida si no existe
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    const jrxmlPath = path.join(REPORTS_DIR, `${reportName}.jrxml`);
    const outputFileName = `${reportName}_${Date.now()}.pdf`;
    const outputPath = path.join(OUTPUT_DIR, outputFileName);

    // Verificar que existe el template
    try {
      await fs.access(jrxmlPath);
    } catch (error) {
      throw new Error(`Template no encontrado: ${jrxmlPath}`);
    }

    // OPCIÓN 1: Usar jasperstarter (requiere instalación)
    // Comando ejemplo: jasperstarter pr report.jrxml -o output.pdf -f pdf -P param1=value1

    // OPCIÓN 2: Para desarrollo sin Java, generar PDF simple con los datos
    // Esto es una alternativa práctica sin dependencia de Java
    const pdfContent = await generateSimplePDF(reportName, parameters, dataSource);
    await fs.writeFile(outputPath, pdfContent);

    return outputPath;
  } catch (error) {
    console.error('Error generando reporte:', error);
    throw error;
  }
}

/**
 * Genera un PDF simple sin JasperReports (para desarrollo)
 * En producción, reemplazar con integración real de Jasper
 */
async function generateSimplePDF(reportName, parameters, dataSource) {
  const PDFDocument = await import('pdfkit').then(m => m.default).catch(() => null);

  if (!PDFDocument) {
    const content = `
      REPORTE: ${reportName}
      PARÁMETROS: ${JSON.stringify(parameters, null, 2)}
      DATOS: ${dataSource.length} registros

      NOTA: Instalar JasperReports o pdfkit para generar PDFs reales
    `;
    return Buffer.from(content, 'utf-8');
  }

  // Generar PDF con PDFKit y tablas estilizadas
  const doc = new PDFDocument({ margin: 40, size: 'LETTER' });
  const chunks = [];

  doc.on('data', chunk => chunks.push(chunk));

  return new Promise((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header con color
    doc.rect(0, 0, doc.page.width, 80).fill('#2c3e50');
    doc.fillColor('white').fontSize(22).text(getTituloReporte(reportName), 40, 30, { align: 'center' });
    doc.moveDown(3);

    // Parámetros en recuadro
    doc.fillColor('#34495e').fontSize(12).text('Parámetros del Reporte', { underline: true });
    doc.fillColor('black').fontSize(9);
    Object.entries(parameters).forEach(([key, value]) => {
      doc.text(`• ${formatLabel(key)}: ${value}`);
    });
    doc.moveDown();

    // Total de registros con énfasis
    doc.fillColor('#27ae60').fontSize(11).text(`Total de registros: ${dataSource.length}`, { underline: true });
    doc.moveDown(0.5);

    // Tabla de datos con bordes
    if (dataSource.length > 0) {
      drawTable(doc, dataSource);
    } else {
      doc.fillColor('#e74c3c').fontSize(10);
      doc.text('⚠ No se encontraron datos para mostrar en este reporte.', { align: 'center' });
    }

    // Footer
    doc.moveDown(2);
    const footerY = doc.page.height - 60;
    doc.fontSize(8).fillColor('#7f8c8d');
    doc.text(`Generado: ${new Date().toLocaleString('es-ES')}`, 40, footerY, { align: 'center' });
    doc.text('Sistema CineHub - Reportes Administrativos', { align: 'center' });

    doc.end();
  });
}

/**
 * Dibuja una tabla con bordes y estilos en el PDF
 */
function drawTable(doc, dataSource) {
  if (dataSource.length === 0) return;

  const headers = Object.keys(dataSource[0]);
  const startX = 40;
  let startY = doc.y;
  const rowHeight = 20;
  const colWidth = (doc.page.width - 80) / headers.length;

  // Dibujar encabezados con fondo azul
  doc.fillColor('#3498db').rect(startX, startY, colWidth * headers.length, rowHeight).fill();
  doc.fillColor('white').fontSize(8);

  headers.forEach((header, i) => {
    const x = startX + i * colWidth + 5;
    doc.text(formatLabel(header), x, startY + 5, { width: colWidth - 10, ellipsis: true });
  });

  startY += rowHeight;
  doc.fillColor('black');

  // Dibujar filas con alternancia de color
  const maxRows = Math.min(dataSource.length, 30);
  for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
    const row = dataSource[rowIndex];
    const isEven = rowIndex % 2 === 0;

    // Fondo alternado
    if (isEven) {
      doc.fillColor('#ecf0f1').rect(startX, startY, colWidth * headers.length, rowHeight).fill();
    }

    // Bordes de celda
    doc.strokeColor('#bdc3c7').lineWidth(0.5);
    headers.forEach((header, colIndex) => {
      const x = startX + colIndex * colWidth;
      doc.rect(x, startY, colWidth, rowHeight).stroke();
    });

    // Contenido de celda
    doc.fillColor('black').fontSize(7);
    headers.forEach((header, colIndex) => {
      const x = startX + colIndex * colWidth + 3;
      let value = row[header];
      
      // Formatear valores
      if (typeof value === 'number') {
        value = Number.isInteger(value) ? value.toString() : value.toFixed(2);
      } else if (value === null || value === undefined) {
        value = 'N/A';
      } else {
        value = String(value);
      }

      doc.text(value, x, startY + 5, { width: colWidth - 6, ellipsis: true });
    });

    startY += rowHeight;

    // Nueva página si es necesario
    if (startY > doc.page.height - 100) {
      doc.addPage();
      startY = 50;
      
      // Re-dibujar encabezados en nueva página
      doc.fillColor('#3498db').rect(startX, startY, colWidth * headers.length, rowHeight).fill();
      doc.fillColor('white').fontSize(8);
      headers.forEach((header, i) => {
        const x = startX + i * colWidth + 5;
        doc.text(formatLabel(header), x, startY + 5, { width: colWidth - 10, ellipsis: true });
      });
      startY += rowHeight;
      doc.fillColor('black');
    }
  }

  // Indicador de más registros
  if (dataSource.length > maxRows) {
    doc.moveDown();
    doc.fontSize(8).fillColor('#95a5a6');
    doc.text(`... y ${dataSource.length - maxRows} registros más no mostrados`, { align: 'center' });
  }

  doc.y = startY + 10;
}

/**
 * Formatea las etiquetas de columnas para mejor presentación
 */
function formatLabel(key) {
  return key
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getTituloReporte(reportName) {
  const titulos = {
    'comentarios-salas': 'Reporte de Comentarios de Salas',
    'peliculas-proyectadas': 'Reporte de Películas Proyectadas',
    'salas-mas-gustadas': 'Top 5 Salas Más Gustadas',
    'boletos-vendidos': 'Reporte de Boletos Vendidos',
    'ganancias-sistema': 'Reporte de Ganancias del Sistema',
    'anuncios-comprados': 'Reporte de Anuncios Comprados',
    'ganancias-anunciante': 'Ganancias por Anunciante',
    'salas-populares': 'Top 5 Salas Más Populares',
    'salas-comentadas': 'Top 5 Salas Más Comentadas'
  };
  return titulos[reportName] || reportName.toUpperCase();
}

/**
 * Limpia archivos PDF antiguos (más de 1 hora)
 */
export async function cleanOldReports() {
  try {
    const files = await fs.readdir(OUTPUT_DIR);
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    for (const file of files) {
      if (file.endsWith('.pdf')) {
        const filePath = path.join(OUTPUT_DIR, file);
        const stats = await fs.stat(filePath);

        if (now - stats.mtimeMs > oneHour) {
          await fs.unlink(filePath);
          console.log(`Reporte antiguo eliminado: ${file}`);
        }
      }
    }
  } catch (error) {
    console.error('Error limpiando reportes antiguos:', error);
  }
}

// Limpiar reportes antiguos cada hora
setInterval(cleanOldReports, 60 * 60 * 1000);

export default { generateReport, cleanOldReports };
