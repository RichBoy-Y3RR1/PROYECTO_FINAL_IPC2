// Script para actualizar la columna tipo con los valores correctos
import sequelize from './config/db.js';

async function actualizarEnumTipo() {
  try {
    console.log('🔧 Actualizando columna tipo en tabla Anuncios...');

    // Primero, eliminamos la restricción ENUM existente
    await sequelize.query(`
      ALTER TABLE Anuncios 
      MODIFY COLUMN tipo VARCHAR(50) NOT NULL;
    `);
    
    console.log('✅ Paso 1: Columna tipo convertida a VARCHAR');

    // Ahora la convertimos a ENUM con todos los valores necesarios
    await sequelize.query(`
      ALTER TABLE Anuncios 
      MODIFY COLUMN tipo ENUM('texto', 'texto-imagen', 'video-texto', 'imagen', 'video', 'banner', 'mixto') NOT NULL DEFAULT 'texto';
    `);

    console.log('✅ Paso 2: Columna tipo actualizada con todos los valores ENUM');
    console.log('');
    console.log('Valores permitidos:');
    console.log('  ✓ texto');
    console.log('  ✓ texto-imagen');
    console.log('  ✓ video-texto');
    console.log('  ✓ imagen (legacy)');
    console.log('  ✓ video (legacy)');
    console.log('  ✓ banner (legacy)');
    console.log('  ✓ mixto (legacy)');
    console.log('');
    console.log('✅ ¡Base de datos actualizada correctamente!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al actualizar:', error.message);
    console.error(error);
    process.exit(1);
  }
}

actualizarEnumTipo();
