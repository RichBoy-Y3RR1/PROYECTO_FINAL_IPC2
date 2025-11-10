// seeders/usuario.seeder.js
import Usuario from '../modelos/usuario.modelo.js';
import bcrypt from 'bcryptjs';

const seedUsuarios = async () => {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);

    await Usuario.create({
      nombre: 'Test User',
      correo: 'testuser@example.com',
      contraseña: hashedPassword,
      tipo: 'cliente'
    });

    await Usuario.create({
      nombre: 'Admin User',
      correo: 'admin@example.com',
      contraseña: hashedPassword,
      tipo: 'admin'
    });

    console.log('Usuarios de prueba creados exitosamente.');
  } catch (error) {
    console.error('Error al crear usuarios de prueba:', error);
  }
};

seedUsuarios();
