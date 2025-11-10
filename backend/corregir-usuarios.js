// Script para corregir usuarios existentes
import sequelize from './config/db.js';
import Usuario from './modelos/usuario.modelo.js';
import Cartera from './modelos/cartera.modelo.js';
import Cine from './modelos/cine.modelo.js';
import bcrypt from 'bcrypt';

async function corregirUsuarios() {
  try {
  await sequelize.authenticate();
  console.log('Conectado a la base de datos');

    // 1. CORREGIR/CREAR Usuario Anunciante
  console.log('Configurando Usuario Anunciante...');
    
    let anunciante = await Usuario.findOne({ where: { correo: 'anunciante@empresa.com' } });
    
    if (anunciante) {
  console.log('   Usuario anunciante ya existe, actualizando...');
      await anunciante.update({
        nombre: 'Anunciante Empresa',
        contraseña: await bcrypt.hash('anun123', 10),
        tipo: 'anunciante'
      });
    } else {
  console.log('   Creando nuevo usuario anunciante...');
      anunciante = await Usuario.create({
        nombre: 'Anunciante Empresa',
        correo: 'anunciante@empresa.com',
        email: 'anunciante@empresa.com',
        contraseña: await bcrypt.hash('anun123', 10),
        tipo: 'anunciante'
      });
    }

    // Crear/actualizar cartera con saldo inicial
    let carteraAnunciante = await Cartera.findOne({ where: { usuarioId: anunciante.id } });
    
    if (carteraAnunciante) {
  console.log('   Actualizando saldo de cartera...');
      await carteraAnunciante.update({ saldo: 5000.00 });
    } else {
  console.log('   Creando cartera con saldo inicial...');
      await Cartera.create({
        usuarioId: anunciante.id,
        saldo: 5000.00
      });
    }

  console.log('   Usuario Anunciante configurado:');
  console.log('      Correo: anunciante@empresa.com');
  console.log('      Contraseña: anun123');
  console.log('      Saldo: Q5,000.00\n');

    // 2. CORREGIR/CREAR Admin Cine Cinemark
  console.log('Configurando Admin Cine Cinemark...');

    // Buscar o crear el cine Cinemark
    let cinemark = await Cine.findOne({ where: { nombre: { [sequelize.Sequelize.Op.like]: '%Cinemark%' } } });
    
    if (!cinemark) {
  console.log('   Creando cine Cinemark...');
      cinemark = await Cine.create({
        nombre: 'Cinemark Pradera Xela',
        ubicacion: 'Pradera Concepción, Xela',
        telefono: '7765-4321',
        email: 'info@cinemark.gt'
      });
    }

    let adminCine = await Usuario.findOne({ where: { correo: 'admin.cine@cinemark.com' } });
    
    if (adminCine) {
  console.log('   Admin cine ya existe, actualizando...');
      await adminCine.update({
        nombre: 'Admin Cinemark',
        contraseña: await bcrypt.hash('cine123', 10),
        tipo: 'admin-cine',
        cineId: cinemark.id
      });
    } else {
  console.log('   Creando nuevo admin cine...');
      adminCine = await Usuario.create({
        nombre: 'Admin Cinemark',
        correo: 'admin.cine@cinemark.com',
        email: 'admin.cine@cinemark.com',
        contraseña: await bcrypt.hash('cine123', 10),
        tipo: 'admin-cine',
        cineId: cinemark.id
      });
    }

  console.log('   Admin Cine configurado:');
  console.log('      Correo: admin.cine@cinemark.com');
  console.log('      Contraseña: cine123');
  console.log(`      Cine: ${cinemark.nombre} (ID: ${cinemark.id})\n`);

    // 3. Verificar otros usuarios importantes
  console.log('Verificando otros usuarios...');
    
    const adminGeneral = await Usuario.findOne({ where: { tipo: 'admin-general' } });
    if (!adminGeneral) {
  console.log('   Creando Admin General...');
      await Usuario.create({
        nombre: 'Admin Sistema',
        correo: 'admin@cinehub.com',
        email: 'admin@cinehub.com',
        contraseña: await bcrypt.hash('admin123', 10),
        tipo: 'admin-general'
      });
      console.log('   Admin General creado: admin@cinehub.com / admin123');
    } else {
      console.log('   Admin General existe');
    }

    const clienteTest = await Usuario.findOne({ where: { tipo: 'cliente' } });
    if (!clienteTest) {
  console.log('   Creando Cliente de Prueba...');
      const cliente = await Usuario.create({
        nombre: 'Cliente Test',
        correo: 'cliente@test.com',
        email: 'cliente@test.com',
        contraseña: await bcrypt.hash('cliente123', 10),
        tipo: 'cliente'
      });
      
      await Cartera.create({
        usuarioId: cliente.id,
        saldo: 1000.00
      });
      console.log('   Cliente de Prueba creado: cliente@test.com / cliente123');
    } else {
      console.log('   Cliente existe');
    }

  console.log('\n' + '='.repeat(60));
  console.log('USUARIOS CORREGIDOS Y LISTOS PARA USAR');
  console.log('='.repeat(60));
  console.log('\nCREDENCIALES DE ACCESO:\n');
  console.log('ANUNCIANTE (Crear anuncios):');
  console.log('   Correo: anunciante@empresa.com');
  console.log('   Contraseña: anun123');
  console.log('   Saldo inicial: Q5,000.00');
  console.log('   Ruta: http://localhost:4200/anunciante\n');

  console.log('ADMIN CINE (Gestionar cine):');
  console.log('   Correo: admin.cine@cinemark.com');
  console.log('   Contraseña: cine123');
  console.log(`   Cine: ${cinemark.nombre}`);
  console.log('   Ruta: http://localhost:4200/admin-cine\n');

  console.log('ADMIN SISTEMA (Control total):');
  console.log('   Correo: admin@cinehub.com');
  console.log('   Contraseña: admin123');
  console.log('   Ruta: http://localhost:4200/admin-sistema\n');

  console.log('CLIENTE (Comprar boletos):');
  console.log('   Correo: cliente@test.com');
  console.log('   Contraseña: cliente123');
  console.log('   Saldo inicial: Q1,000.00');
  console.log('   Ruta: http://localhost:4200\n');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

corregirUsuarios();
