// Script para permitir valores NULL en campos opcionales de Anuncios
import sequelize from './config/db.js';

async function actualizarTablaAnuncios() {
  try {
    console.log('🔧 Modificando tabla Anuncios para permitir valores NULL...');

    // Modificar columnas para permitir NULL
    await sequelize.query(`
      ALTER TABLE Anuncios
      MODIFY COLUMN texto TEXT NULL,
      MODIFY COLUMN imagenUrl VARCHAR(255) NULL,
      MODIFY COLUMN videoUrl VARCHAR(255) NULL,
      MODIFY COLUMN enlaceUrl VARCHAR(255) NULL;
    `);

    console.log('✅ Tabla Anuncios actualizada correctamente');
    console.log('');
    console.log('Columnas modificadas:');
    console.log('  • texto: TEXT NULL');
    console.log('  • imagenUrl: VARCHAR(255) NULL');
    console.log('  • videoUrl: VARCHAR(255) NULL');
    console.log('  • enlaceUrl: VARCHAR(255) NULL');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al actualizar la tabla:', error.message);
    process.exit(1);
  }
}

actualizarTablaAnuncios();
