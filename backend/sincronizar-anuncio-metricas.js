// Script de sincronización para agregar columnas de métricas si no existen
import sequelize from './config/db.js';
import Anuncio from './modelos/anuncio.modelo.js';

async function syncMetrics() {
  try {
    // Verificar existencia de columnas impresiones y clics (simplificado)
    // Dependiendo de la BD se puede usar DESCRIBE; aquí se fuerza alter.
    await sequelize.getQueryInterface().addColumn('Anuncios', 'impresiones', {
      type: Anuncio.rawAttributes.impresiones.type,
      allowNull: false,
      defaultValue: 0
    }).catch(() => {});
    await sequelize.getQueryInterface().addColumn('Anuncios', 'clics', {
      type: Anuncio.rawAttributes.clics.type,
      allowNull: false,
      defaultValue: 0
    }).catch(() => {});
    console.log('Sincronización métricas anuncios completada');
    process.exit(0);
  } catch (e) {
    console.error('Error sincronizando métricas anuncios:', e);
    process.exit(1);
  }
}

syncMetrics();
