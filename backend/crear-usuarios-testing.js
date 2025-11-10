import bcrypt from 'bcryptjs';
import Usuario from './modelos/usuario.modelo.js';
import Cine from './modelos/cine.modelo.js';
import Cartera from './modelos/cartera.modelo.js';
import sequelize from './config/db.js';
import './modelos/asociaciones.js';

const crearUsuariosTesting = async () => {
  try {
  await sequelize.sync();
  console.log('Base de datos sincronizada');

    const salt = await bcrypt.genSalt(10);

    // ============================================
    // 1. ADMIN SISTEMA
    // ============================================
    const [adminSistema, createdAS] = await Usuario.findOrCreate({
      where: { correo: 'admin@cinehub.com' },
      defaults: {
        nombre: 'Administrador General',
        correo: 'admin@cinehub.com',
        email: 'admin@cinehub.com',
        contraseña: await bcrypt.hash('admin123', salt),
        tipo: 'admin-general'
      }
    });
  console.log(createdAS ? 'Admin Sistema creado' : 'Admin Sistema ya existe');
  console.log('   Email: admin@cinehub.com');
  console.log('   Password: admin123');
  console.log('   Tipo: admin-general\n');

    // ============================================
    // 2. ANUNCIANTE
    // ============================================
    const [anunciante, createdAN] = await Usuario.findOrCreate({
      where: { correo: 'anunciante@test.com' },
      defaults: {
        nombre: 'Empresa Publicidad SA',
        correo: 'anunciante@test.com',
        email: 'anunciante@test.com',
        contraseña: await bcrypt.hash('anunciante123', salt),
        tipo: 'anunciante'
      }
    });

    if (createdAN) {
      // Crear cartera para anunciante
      await Cartera.create({
        usuarioId: anunciante.id,
        saldo: 5000.00
      });
      console.log('Anunciante creado con cartera inicial Q5,000');
    } else {
      console.log('Anunciante ya existe');
    }
    console.log('   Email: anunciante@test.com');
    console.log('   Password: anunciante123');
    console.log('   Tipo: anunciante\n');

    // ============================================
    // 3. ADMIN CINE (necesitamos crear cines primero)
    // ============================================

    // Crear Cine 1
    const [cine1, createdC1] = await Cine.findOrCreate({
      where: { nombre: 'CineHub Central' },
      defaults: {
        nombre: 'CineHub Central',
        direccion: 'Zona 10, Ciudad de Guatemala',
        telefono: '2234-5678',
        email: 'central@cinehub.com',
        estado: 'activo'
      }
    });
  console.log(createdC1 ? 'Cine "CineHub Central" creado' : 'Cine ya existe');

    // Crear Admin Cine 1
    const [adminCine1, createdAC1] = await Usuario.findOrCreate({
      where: { correo: 'admin.central@cinehub.com' },
      defaults: {
        nombre: 'Admin CineHub Central',
        correo: 'admin.central@cinehub.com',
        email: 'admin.central@cinehub.com',
        contraseña: await bcrypt.hash('cine123', salt),
        tipo: 'admin-cine',
        cineId: cine1.id
      }
    });
  console.log(createdAC1 ? 'Admin Cine Central creado' : 'Admin Cine ya existe');
  console.log('   Email: admin.central@cinehub.com');
  console.log('   Password: cine123');
  console.log('   Tipo: admin-cine');
  console.log(`   Cine: ${cine1.nombre}\n`);

    // Crear Cine 2 (opcional)
    const [cine2, createdC2] = await Cine.findOrCreate({
      where: { nombre: 'CineHub Plaza' },
      defaults: {
        nombre: 'CineHub Plaza',
        direccion: 'Zona 4, Ciudad de Guatemala',
        telefono: '2234-9999',
        email: 'plaza@cinehub.com',
        estado: 'activo'
      }
    });
  console.log(createdC2 ? 'Cine "CineHub Plaza" creado' : 'Cine ya existe');

    // Crear Admin Cine 2
    const [adminCine2, createdAC2] = await Usuario.findOrCreate({
      where: { correo: 'admin.plaza@cinehub.com' },
      defaults: {
        nombre: 'Admin CineHub Plaza',
        correo: 'admin.plaza@cinehub.com',
        email: 'admin.plaza@cinehub.com',
        contraseña: await bcrypt.hash('cine123', salt),
        tipo: 'admin-cine',
        cineId: cine2.id
      }
    });
  console.log(createdAC2 ? 'Admin Cine Plaza creado' : 'Admin Cine ya existe');
  console.log('   Email: admin.plaza@cinehub.com');
  console.log('   Password: cine123');
  console.log('   Tipo: admin-cine');
  console.log(`   Cine: ${cine2.nombre}\n`);

    // ============================================
    // 4. USUARIO COMÚN
    // ============================================
    const [usuarioComun, createdUC] = await Usuario.findOrCreate({
      where: { correo: 'usuario@test.com' },
      defaults: {
        nombre: 'Juan Pérez',
        correo: 'usuario@test.com',
        email: 'usuario@test.com',
        contraseña: await bcrypt.hash('user123', salt),
        tipo: 'cliente'
      }
    });

    if (createdUC) {
      await Cartera.create({
        usuarioId: usuarioComun.id,
        saldo: 1000.00
      });
      console.log('Usuario común creado con cartera inicial Q1,000');
    } else {
      console.log('Usuario común ya existe');
    }
    console.log('   Email: usuario@test.com');
    console.log('   Password: user123');
    console.log('   Tipo: usuario\n');

    // ============================================
    // RESUMEN
    // ============================================
  console.log('\n' + '='.repeat(60));
  console.log('USUARIOS DE PRUEBA LISTOS\n');
  console.log('CREDENCIALES PARA LOGIN:\n');
  console.log('ADMIN SISTEMA (Dashboard completo)');
  console.log('    admin@cinehub.com | admin123\n');
  console.log('ANUNCIANTE (Crear/gestionar anuncios)');
  console.log('    anunciante@test.com | anunciante123\n');
  console.log('ADMIN CINE CENTRAL (Gestionar funciones/salas)');
  console.log('    admin.central@cinehub.com | cine123\n');
  console.log('ADMIN CINE PLAZA (Gestionar funciones/salas)');
  console.log('    admin.plaza@cinehub.com | cine123\n');
  console.log('USUARIO COMÚN (Comprar boletos)');
  console.log('    usuario@test.com | user123\n');
  console.log('='.repeat(60));

    process.exit(0);

  } catch (error) {
    console.error('❌ Error creando usuarios:', error);
    process.exit(1);
  }
};

crearUsuariosTesting();
