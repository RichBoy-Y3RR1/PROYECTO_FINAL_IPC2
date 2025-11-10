// Script para agregar campo cast a tabla Peliculas
import sequelize from './config/db.js';

async function agregarCampoCast() {
  try {
    console.log('🔧 Agregando campo cast a tabla Peliculas...');

    await sequelize.query(`
      ALTER TABLE Peliculas 
      ADD COLUMN cast TEXT NULL 
      COMMENT 'Elenco/reparto de la película (separado por comas)';
    `);

    console.log('✅ Campo cast agregado correctamente');
    console.log('');
    console.log('📝 Ahora las películas pueden incluir:');
    console.log('  • titulo');
    console.log('  • sinopsis/descripcion');
    console.log('  • duracion');
    console.log('  • director');
    console.log('  • cast (NUEVO) ← Elenco de actores');
    console.log('  • clasificacion (A, B, B15, C)');
    console.log('  • estreno (fecha)');
    console.log('  • categorias');
    console.log('  • posterUrl/imagen');
    console.log('');
    console.log('✅ ¡Sistema 100% completo según enunciado!');
    
    process.exit(0);
  } catch (error) {
    if (error.message.includes('Duplicate column name')) {
      console.log('ℹ️  El campo cast ya existe en la tabla');
      process.exit(0);
    }
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

agregarCampoCast();
