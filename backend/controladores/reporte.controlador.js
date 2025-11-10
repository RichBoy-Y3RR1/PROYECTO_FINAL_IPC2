// controladores/reporte.controlador.js
import PDFDocument from 'pdfkit';
import fs from 'fs';
import Boleto from '../modelos/boleto.modelo.js';
import Usuario from '../modelos/usuario.modelo.js';
import Pelicula from '../modelos/pelicula.modelo.js';
import Cine from '../modelos/cine.modelo.js';

export const generarReporteBoletos = async (req, res) => {
  const boletos = await Boleto.findAll({
    include: ['comprador', 'peliculaComprada', 'cineComprado']
  });

  const doc = new PDFDocument();
  const filename = `reporte-boletos-${Date.now()}.pdf`;

  // Ruta temporal (podés cambiarla)
  const filepath = `./backend/temp/${filename}`;
  doc.pipe(fs.createWriteStream(filepath));

  doc.fontSize(18).text('🎟️ Reporte de Boletos - CineHub', { align: 'center' });
  doc.moveDown();

  boletos.forEach(b => {
    doc.fontSize(12).text(`
 Fecha: ${b.fechaCompra}
 Película: ${b.peliculaComprada?.titulo}
Cine: ${b.cineComprado?.nombre}
Precio: Q${b.precio}
Cliente: ${b.comprador?.nombre}
-------------------------
`);
  });

  doc.end();

  // Esperar que termine
  doc.on('finish', () => {
    res.download(filepath, filename, err => {
      if (err) res.status(500).json({ msg: 'Error al enviar PDF' });
      fs.unlinkSync(filepath); // Limpieza
    });
  });
};
export default generarReporteBoletos;
