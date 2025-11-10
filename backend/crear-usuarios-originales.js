// Script para crear los usuarios originales
import bcrypt from 'bcryptjs';
import Usuario from './modelos/usuario.modelo.js';
import Cartera from './modelos/cartera.modelo.js';
import sequelize from './config/db.js';
import './modelos/asociaciones.js';

async function crearUsuariosOriginales() {
  try {
    await sequelize.sync();
    console.log('Base de datos sincronizada');

    // Lista de usuarios a crear
    const usuariosACrear = [
      {
        nombre: 'Eltontis',
        email: 'Eltontis@cunoc.edu.gt',
        contraseña: '123456',
        tipo: 'cliente'
      },
      {
        nombre: 'Admin CineHub',
        email: 'admin@cinehub.com',
        contraseña: 'admin123',
        tipo: 'admin'
      },
      {
        nombre: 'Carlos',
        email: 'carlos@cinehub.com',
        contraseña: 'admin123',
        tipo: 'cliente'
      }
    ];

  console.log('Creando usuarios...');

    for (const userData of usuariosACrear) {
      // Verificar si ya existe
      const existe = await Usuario.findOne({ where: { email: userData.email } });

      // Ejecutar operaciones dentro de una transacción cuando se crea usuario/cartera
      if (existe) {
        console.log(`Usuario ${userData.email} ya existe, actualizando contraseña...`);

        const hashContraseña = await bcrypt.hash(userData.contraseña, 10);
        await existe.update(
          {
            contraseña: hashContraseña,
            tipo: userData.tipo
          }
        );
        console.log(`   Contraseña actualizada para ${userData.email}`);
      } else {
        await sequelize.transaction(async (t) => {
          const hashContraseña = await bcrypt.hash(userData.contraseña, 10);

          const nuevoUsuario = await Usuario.create(
            {
              nombre: userData.nombre,
              email: userData.email,
              correo: userData.email, // compatibilidad
              contraseña: hashContraseña,
              tipo: userData.tipo,
              edad: 25,
              telefono: '0000-0000'
            },
            { transaction: t }
          );

          if (userData.tipo === 'cliente') {
            await Cartera.create(
              {
                usuarioId: nuevoUsuario.id,
                saldo: 500.0
              },
              { transaction: t }
            );
            console.log('   Cartera creada con Q500.00');
          }

          console.log(`   Usuario creado: ${userData.email}`);
          console.log(`   Contraseña temporal: ${userData.contraseña}`);
        });
      }
    }

    console.log('\nUsuarios listos para usar');
    console.log('CREDENCIALES DE ACCESO:');
    console.log('- Admin: admin@cinehub.com / admin123');
    console.log('- Cliente: carlos@cinehub.com / admin123');
    console.log('- Cliente: Eltontis@cunoc.edu.gt / 123456');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

crearUsuariosOriginales();
