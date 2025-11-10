// backend/crear-usuarios-roles.js
import bcrypt from 'bcryptjs';
import sequelize from './config/db.js';
import Usuario from './modelos/usuario.modelo.js';
import Cartera from './modelos/cartera.modelo.js';
import Cine from './modelos/cine.modelo.js';

async function crearUsuariosRoles() {
  try {
    console.log('👥 Creando usuarios con roles específicos...\n');

    const usuariosData = [
      {
        nombre: 'Administrador General',
        email: 'admin@cinehub.com',
        password: 'admin123',
        rol: 'admin-general',
        saldo: 10000
      },
      {
        nombre: 'Carlos Usuario Cliente',
        email: 'carlos@cinehub.com',
        password: 'admin123',
        rol: 'cliente',
        saldo: 500
      },
      {
        nombre: 'Empresa Anunciante',
        email: 'anunciante@empresa.com',
        password: 'anun123',
        rol: 'anunciante',
        saldo: 2000
      },
      {
        nombre: 'Admin Cinépolis',
        email: 'admin.cine@cinepolis.com',
        password: 'cine123',
        rol: 'admin-cine',
        cineId: 1, // Cinépolis Plaza Miraflores
        saldo: 1000
      },
      {
        nombre: 'Admin Cinemark',
        email: 'admin.cine@cinemark.com',
        password: 'cine123',
        rol: 'admin-cine',
        cineId: 2, // Cinemark Pradera Xela
        saldo: 1000
      },
      {
        nombre: 'Usuario Eltontis',
        email: 'Eltontis@cunoc.edu.gt',
        password: '123456',
        rol: 'cliente',
        saldo: 500
      }
    ];

    for (const userData of usuariosData) {
      // Verificar si ya existe
      let usuario = await Usuario.findOne({ where: { correo: userData.email } });

      const passwordHash = await bcrypt.hash(userData.password, 10);

      if (usuario) {
        // Actualizar
        await usuario.update({
          nombre: userData.nombre,
          correo: userData.email,
          contraseña: passwordHash,
          tipo: userData.rol,
          cineId: userData.cineId || null
        });
        console.log(`🔄 Actualizado: ${usuario.nombre} (${usuario.correo}) - Rol: ${usuario.tipo}`);
      } else {
        // Crear nuevo
        usuario = await Usuario.create({
          nombre: userData.nombre,
          correo: userData.email,
          email: userData.email,
          contraseña: passwordHash,
          tipo: userData.rol,
          cineId: userData.cineId || null
        });
        console.log(`✨ Creado: ${usuario.nombre} (${usuario.correo}) - Rol: ${usuario.tipo}`);
      }

      // Crear/actualizar cartera
      let cartera = await Cartera.findOne({ where: { usuarioId: usuario.id } });
      if (cartera) {
        await cartera.update({ saldo: userData.saldo });
      } else {
        await Cartera.create({
          usuarioId: usuario.id,
          saldo: userData.saldo
        });
      }
      console.log(`   💰 Cartera: Q${userData.saldo}\n`);
    }

    console.log('✅ Usuarios creados/actualizados exitosamente');
    console.log('\n📋 CREDENCIALES:\n');
    console.log('┌─────────────────────────────────────────────────────┐');
    console.log('│ Admin General:                                      │');
    console.log('│   email: admin@cinehub.com                          │');
    console.log('│   password: admin123                                │');
    console.log('│   rol: admin-general                                │');
    console.log('├─────────────────────────────────────────────────────┤');
    console.log('│ Usuario Cliente 1:                                  │');
    console.log('│   email: carlos@cinehub.com                         │');
    console.log('│   password: admin123                                │');
    console.log('│   rol: cliente                                      │');
    console.log('├─────────────────────────────────────────────────────┤');
    console.log('│ Usuario Cliente 2:                                  │');
    console.log('│   email: Eltontis@cunoc.edu.gt                      │');
    console.log('│   password: 123456                                  │');
    console.log('│   rol: cliente                                      │');
    console.log('├─────────────────────────────────────────────────────┤');
    console.log('│ Usuario Anunciante:                                 │');
    console.log('│   email: anunciante@empresa.com                     │');
    console.log('│   password: anun123                                 │');
    console.log('│   rol: anunciante                                   │');
    console.log('│   saldo: Q2000 (para crear anuncios)               │');
    console.log('├─────────────────────────────────────────────────────┤');
    console.log('│ Admin Cine Cinépolis:                               │');
    console.log('│   email: admin.cine@cinepolis.com                   │');
    console.log('│   password: cine123                                 │');
    console.log('│   rol: admin-cine                                   │');
    console.log('│   cineId: 1 (Cinépolis Plaza Miraflores)           │');
    console.log('├─────────────────────────────────────────────────────┤');
    console.log('│ Admin Cine Cinemark:                                │');
    console.log('│   email: admin.cine@cinemark.com                    │');
    console.log('│   password: cine123                                 │');
    console.log('│   rol: admin-cine                                   │');
    console.log('│   cineId: 2 (Cinemark Pradera Xela)                │');
    console.log('└─────────────────────────────────────────────────────┘');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

crearUsuariosRoles();
