// seeders/crear-usuario-prueba.js
import bcrypt from 'bcryptjs';
import Usuario from '../modelos/usuario.modelo.js';
import sequelize from '../config/db.js';

async function crearUsuarioPrueba() {
  try {
    await sequelize.sync();
    
    // Hash de la contraseña
    const hashCliente = await bcrypt.hash('123456', 10);
    const hashAdmin = await bcrypt.hash('admin123', 10);
    
    // Verificar si ya existen
    const clienteExiste = await Usuario.findOne({ where: { correo: 'carlos@cinehub.com' } });
    const adminExiste = await Usuario.findOne({ where: { correo: 'admin@cinehub.com' } });
    
    // Crear usuario cliente si no existe
    if (!clienteExiste) {
      await Usuario.create({
        nombre: 'Carlos Cliente',
        correo: 'carlos@cinehub.com',
        contraseña: hashCliente,
        tipo: 'cliente'
      });
      console.log('✅ Usuario cliente creado: carlos@cinehub.com / 123456');
    } else {
      console.log('ℹ️  Usuario cliente ya existe');
    }
    
    // Crear usuario admin si no existe
    if (!adminExiste) {
      await Usuario.create({
        nombre: 'Admin CineHub',
        correo: 'admin@cinehub.com',
        contraseña: hashAdmin,
        tipo: 'admin'
      });
      console.log('✅ Usuario admin creado: admin@cinehub.com / admin123');
    } else {
      console.log('ℹ️  Usuario admin ya existe');
    }
    
    console.log('\n🎉 Usuarios de prueba listos!');
    console.log('Cliente: carlos@cinehub.com / 123456');
    console.log('Admin: admin@cinehub.com / admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

crearUsuarioPrueba();
