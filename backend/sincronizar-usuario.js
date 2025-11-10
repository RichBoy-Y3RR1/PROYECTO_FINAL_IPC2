// backend/sincronizar-usuario.js
import sequelize from './config/db.js';
import './modelos/asociaciones.js';
import Usuario from './modelos/usuario.modelo.js';

async function sincronizarUsuario() {
  try {
    console.log('🔄 Sincronizando modelo Usuario...');

    await Usuario.sync({ alter: true });
    console.log('✅ Modelo Usuario sincronizado');

    console.log('\n🔍 Verificando estructura...');
    const [columns] = await sequelize.query("DESCRIBE Usuarios;");

    console.log('\n📋 Columnas de tabla Usuarios:');
    columns.forEach(col => {
      const isNew = ['cineId'].includes(col.Field);
      const emoji = isNew ? '🆕' : '  ';
      console.log(`   ${emoji} ${col.Field.padEnd(20)} | ${col.Type.padEnd(50)}`);
    });

    console.log('\n✨ Tabla Usuarios actualizada');
    console.log('   Roles disponibles: cliente, admin, admin_cine, admin-general, admin-cine, anunciante');
    console.log('   Campo cineId agregado para vincular admin-cine con su cine');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

sincronizarUsuario();
