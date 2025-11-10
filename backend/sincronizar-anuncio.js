// backend/sincronizar-anuncio.js
import sequelize from './config/db.js';
import './modelos/asociaciones.js';
import Anuncio from './modelos/anuncio.modelo.js';

async function sincronizarAnuncio() {
  try {
  console.log('Sincronizando modelo Anuncio...');

    await Anuncio.sync({ alter: true });
  console.log('Modelo Anuncio sincronizado');

  console.log('\nVerificando estructura...');
    const [columns] = await sequelize.query("DESCRIBE Anuncios;");

  console.log('\nColumnas de tabla Anuncios:');
    columns.forEach(col => {
      const isNew = ['titulo', 'contenido', 'costo', 'costoOcultacion', 'fechaFin', 'aprobado', 'usuarioAnuncianteId', 'destinatarios', 'enlaceUrl'].includes(col.Field);
  const marker = isNew ? '*' : ' ';
  console.log(`   ${marker} ${col.Field.padEnd(25)} | ${col.Type.padEnd(30)}`);
    });

  console.log('\nTabla Anuncios lista para usar');
    console.log('   Campos principales:');
    console.log('   - titulo, contenido, tipo');
    console.log('   - imagenUrl, videoUrl, enlaceUrl');
    console.log('   - costo, costoOcultacion, duracionDias');
    console.log('   - fechaInicio, fechaFin');
    console.log('   - activo, aprobado');
    console.log('   - usuarioAnuncianteId, destinatarios');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

sincronizarAnuncio();
