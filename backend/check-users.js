// Script temporal para verificar usuarios
import sequelize from './config/db.js';
import Usuario from './modelos/usuario.modelo.js';

async function checkUsers() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos\n');

    const usuarios = await Usuario.findAll({
      attributes: ['id', 'nombre', 'email', 'correo', 'tipo'],
      raw: true
    });

    console.log('👥 Usuarios en la base de datos:');
    console.table(usuarios);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkUsers();
