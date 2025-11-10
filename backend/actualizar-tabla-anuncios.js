// backend/actualizar-tabla-anuncios.js
import sequelize from './config/db.js';

async function actualizarTablaAnuncios() {
  try {
    console.log('🔧 Actualizando tabla Anuncios...\n');

    // Agregar columna impresiones
    try {
      await sequelize.query(`
        ALTER TABLE Anuncios ADD COLUMN impresiones INT DEFAULT 0 NOT NULL
      `);
      console.log('✅ Columna impresiones agregada');
    } catch (err) {
      if (err.message.includes('Duplicate column')) {
        console.log('ℹ️  Columna impresiones ya existe');
      } else {
        throw err;
      }
    }

    // Agregar columna clics
    try {
      await sequelize.query(`
        ALTER TABLE Anuncios ADD COLUMN clics INT DEFAULT 0 NOT NULL
      `);
      console.log('✅ Columna clics agregada');
    } catch (err) {
      if (err.message.includes('Duplicate column')) {
        console.log('ℹ️  Columna clics ya existe');
      } else {
        throw err;
      }
    }

    console.log('\n✅ Columnas actualizadas correctamente');
    
    // Verificar estructura
    const [columns] = await sequelize.query(`
      SHOW COLUMNS FROM Anuncios
    `);
    
    console.log('\n📋 Columnas actuales en la tabla Anuncios:');
    columns.forEach(col => {
      console.log(`   - ${col.Field} (${col.Type})`);
    });

    await sequelize.close();
    console.log('\n✅ Actualización completada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

actualizarTablaAnuncios();
