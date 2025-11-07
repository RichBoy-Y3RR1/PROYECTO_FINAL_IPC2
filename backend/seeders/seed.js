// backend/seeders/seed.js
import sequelize from '../config/db.js';
import bcrypt from 'bcryptjs';

import Usuario from '../modelos/usuario.modelo.js';
import Cine from '../modelos/cine.modelo.js';
import Pelicula from '../modelos/pelicula.modelo.js';
import Funcion from '../modelos/funcion.modelo.js';
import Boleto from '../modelos/boleto.modelo.js';
import Cartera from '../modelos/cartera.modelo.js';
import Pago from '../modelos/pago.modelo.js';

// Importar asociaciones
import '../modelos/asociaciones.js';

async function runSeed() {
  try {
    await sequelize.sync({ force: true });
    console.log('📦 Base de datos reiniciada');

    // 👤 Crear usuarios
    const hashedPassword = await bcrypt.hash('123456', 10);
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    
    const usuario = await Usuario.create({
      nombre: 'Carlos Dev',
      email: 'carlos@cinehub.com',
      correo: 'carlos@cinehub.com',
      contraseña: hashedAdminPassword,
      tipo: 'cliente',
      edad: 25,
      telefono: '5555-5555'
    });

    const admin = await Usuario.create({
      nombre: 'Admin CineHub',
      email: 'admin@cinehub.com',
      correo: 'admin@cinehub.com',
      contraseña: hashedAdminPassword,
      tipo: 'admin',
      edad: 30,
      telefono: '1234-5678'
    });

    // 💳 Cartera
    await Cartera.create({
      usuarioId: usuario.id,
      saldo: 200.00
    });

    // 🎬 Crear cine
    const cine = await Cine.create({
      nombre: 'Cine Grand Plaza',
      direccion: 'Zona 10, Ciudad de Guatemala',
      ciudad: 'Guatemala'
    });

    // 🍿 Crear película
    const pelicula = await Pelicula.create({
      titulo: 'Demon Slayer: Castillo Infinito',
      sinopsis: 'Tanjiro y compañía enfrentan a Muzan en su castillo final.',
      duracionMinutos: 140,
      categorias: 'Anime, Acción',
      director: 'Haruo Sotozaki',
      clasificacion: 'PG-13',
      estreno: '2025-01-01'
    });

    // 🕒 Crear función
    const funcion = await Funcion.create({
      fecha: '2025-12-15',
      hora: '19:00',
      peliculaId: pelicula.id,
      cineId: cine.id,
      precio: 45.00
    });
// 🧾 Crear boleto
const boleto = await Boleto.create({
  usuarioId: usuario.id,
  funcionId: funcion.id,
  peliculaId: pelicula.id,
  cineId: cine.id,
  precio: 45.00,
  fechaCompra: new Date()
});


await Pago.create({
  usuarioId: usuario.id,
  boletoId: boleto.id, // ✅ boleto está definido ahora
  monto: 45.00,
  metodo: 'cartera',
  fechaPago: new Date()
});


    console.log('✅ Datos de prueba insertados exitosamente');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error durante el seeding:', error);
    process.exit(1);
  }
}

runSeed();
