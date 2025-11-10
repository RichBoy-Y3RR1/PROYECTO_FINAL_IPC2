// ====================================================================
// SEEDER COMPLETO - DATOS PERMANENTES PARA CINEHUB
// ====================================================================
// Este archivo crea TODOS los datos necesarios para el proyecto
// Ejecutar: node backend/seed-completo.js
// ====================================================================

import sequelize from './config/db.js';
import bcrypt from 'bcryptjs';

// Modelos
import Usuario from './modelos/usuario.modelo.js';
import Cine from './modelos/cine.modelo.js';
import Sala from './modelos/sala.modelo.js';
import Pelicula from './modelos/pelicula.modelo.js';
import Funcion from './modelos/funcion.modelo.js';
import Boleto from './modelos/boleto.modelo.js';
import Cartera from './modelos/cartera.modelo.js';
import Pago from './modelos/pago.modelo.js';
import CostoCine from './modelos/costocine.modelo.js';

// Importar asociaciones
import './modelos/asociaciones.js';

async function seedCompleto() {
  try {
  console.log('\nINICIANDO SEEDER COMPLETO DE CINEHUB\n');

    // Sincronizar base de datos (SIN borrar datos existentes)
    await sequelize.sync();
  console.log('Base de datos sincronizada\n');

    // ================================================================
    // 1️⃣ CREAR USUARIOS
    // ================================================================
  console.log('Creando usuarios...');

    const usuarios = [
      {
        nombre: 'Admin CineHub',
        email: 'admin@cinehub.com',
        contraseña: 'admin123',
        tipo: 'admin',
        edad: 30,
        telefono: '1234-5678'
      },
      {
        nombre: 'Carlos',
        email: 'carlos@cinehub.com',
        contraseña: 'admin123',
        tipo: 'cliente',
        edad: 25,
        telefono: '5555-5555'
      },
      {
        nombre: 'Eltontis',
        email: 'Eltontis@cunoc.edu.gt',
        contraseña: '123456',
        tipo: 'cliente',
        edad: 22,
        telefono: '7777-7777'
      }
    ];

    const usuariosCreados = {};

    for (const userData of usuarios) {
      let usuario = await Usuario.findOne({ where: { email: userData.email } });

      if (!usuario) {
        const hashContraseña = await bcrypt.hash(userData.contraseña, 10);
        usuario = await Usuario.create({
          nombre: userData.nombre,
          email: userData.email,
          correo: userData.email,
          contraseña: hashContraseña,
          tipo: userData.tipo,
          edad: userData.edad,
          telefono: userData.telefono
        });
  console.log(`   ${usuario.nombre} - ${usuario.email}`);
      } else {
  console.log(`   ${usuario.email} ya existe`);
      }

      usuariosCreados[usuario.tipo === 'admin' ? 'admin' : usuario.nombre] = usuario;
    }

    // ================================================================
    // 2️⃣ CREAR CARTERAS PARA CLIENTES
    // ================================================================
  console.log('\nCreando carteras...');

    for (const [nombre, usuario] of Object.entries(usuariosCreados)) {
      if (usuario.tipo === 'cliente') {
        let cartera = await Cartera.findOne({ where: { usuarioId: usuario.id } });
        if (!cartera) {
          await Cartera.create({
            usuarioId: usuario.id,
            saldo: 500.00
          });
          console.log(`   Cartera para ${usuario.nombre}: Q500.00`);
        } else {
          console.log(`   Cartera de ${usuario.nombre} ya existe`);
        }
      }
    }

    // ================================================================
    // 3️⃣ CREAR CINES Y SALAS
    // ================================================================
  console.log('\nCreando cines y salas...');

    const cinesData = [
      {
        nombre: 'Cinépolis Plaza Miraflores',
        direccion: 'Centro Comercial Miraflores, 21 Avenida',
        ciudad: 'Guatemala',
        salas: [
          { nombre: 'Sala 1', capacidad: 150, tipo: 'Normal' },
          { nombre: 'Sala 2', capacidad: 120, tipo: 'Normal' },
          { nombre: 'Sala VIP', capacidad: 80, tipo: 'VIP' }
        ]
      },
      {
        nombre: 'Cinemark Portales',
        direccion: 'C.C. Los Portales, Zona 11',
        ciudad: 'Guatemala',
        salas: [
          { nombre: 'Sala Premium', capacidad: 100, tipo: 'Premium' },
          { nombre: 'Sala 3D', capacidad: 140, tipo: '3D' }
        ]
      },
      {
        nombre: 'Cine Grand Plaza',
        direccion: 'Zona 10, Ciudad de Guatemala',
        ciudad: 'Guatemala',
        salas: [
          { nombre: 'Sala IMAX', capacidad: 200, tipo: 'IMAX' },
          { nombre: 'Sala Estándar', capacidad: 130, tipo: 'Normal' }
        ]
      }
    ];

    const cinesCreados = [];

    for (const cineData of cinesData) {
      let cine = await Cine.findOne({ where: { nombre: cineData.nombre } });

      if (!cine) {
        cine = await Cine.create({
          nombre: cineData.nombre,
          direccion: cineData.direccion,
          ciudad: cineData.ciudad
        });
  console.log(`   ${cine.nombre}`);

        // Crear salas para este cine
        for (const salaData of cineData.salas) {
          const sala = await Sala.create({
            nombre: salaData.nombre,
            capacidad: salaData.capacidad,
            tipo: salaData.tipo,
            cineId: cine.id
          });
          console.log(`      ${sala.nombre} (${sala.tipo}) - Capacidad: ${sala.capacidad}`);
        }

        // Crear costo base para este cine
        await CostoCine.create({
          cineId: cine.id,
          monto: 45.00,
          desdeFecha: '2025-01-01'
        });
  console.log(`      Costo base: Q45.00`);
      } else {
  console.log(`   ${cine.nombre} ya existe`);
      }

      cinesCreados.push(cine);
    }

    // ================================================================
    // 4️⃣ CREAR PELÍCULAS CON IMÁGENES
    // ================================================================
  console.log('\nCreando películas...');

    const peliculasData = [
      {
        titulo: 'Demon Slayer: Castillo Infinito',
        sinopsis: 'Tanjiro y sus compañeros enfrentan a Muzan Kibutsuji en su castillo dimensional. La batalla final por la humanidad comienza en este emocionante desenlace de la saga.',
        duracionMinutos: 140,
        categorias: 'Anime, Acción, Fantasía',
        genero: 'Anime',
        director: 'Haruo Sotozaki',
        clasificacion: 'PG-13',
        estreno: '2025-01-15',
        imagen: 'https://m.media-amazon.com/images/M/MV5BYjliNDY5NTMtNTc1ZC00NGIxLWFlZDItYWNmOTUzZTU4YjJjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BYjliNDY5NTMtNTc1ZC00NGIxLWFlZDItYWNmOTUzZTU4YjJjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'
      },
      {
        titulo: 'Tron: Ares',
        sinopsis: 'Tercera entrega de la saga Tron. Un programa altamente sofisticado llamado Ares cruza del mundo digital al mundo real en una peligrosa misión que cambiará todo.',
        duracionMinutos: 125,
        categorias: 'Ciencia Ficción, Acción',
        genero: 'Ciencia Ficción',
        director: 'Joachim Rønning',
        clasificacion: 'PG-13',
        estreno: '2025-10-10',
        imagen: 'https://m.media-amazon.com/images/M/MV5BMmRlMzYzZDMtYTQ0Yy00YTJiLWFiMTItYWIzODdlZTc3ZTU4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BMmRlMzYzZDMtYTQ0Yy00YTJiLWFiMTItYWIzODdlZTc3ZTU4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'
      },
      {
        titulo: 'La Llorona',
        sinopsis: 'Basada en la leyenda guatemalteca, una antigua maldición cobra vida cuando una familia despierta el espíritu vengativo de La Llorona. Terror latinoamericano en su máxima expresión.',
        duracionMinutos: 110,
        categorias: 'Terror, Suspenso',
        genero: 'Terror',
        director: 'Jayro Bustamante',
        clasificacion: 'R',
        estreno: '2025-03-20',
        imagen: 'https://m.media-amazon.com/images/M/MV5BZWM0NWY5ZDctMzk1Ny00NmQ4LWJjMjktMGQ1ZmI4NzJmNzQxXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BZWM0NWY5ZDctMzk1Ny00NmQ4LWJjMjktMGQ1ZmI4NzJmNzQxXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'
      },
      {
        titulo: 'Avatar: Fire and Ash',
        sinopsis: 'La familia Sully explora nuevas regiones de Pandora mientras enfrentan una amenaza que pondrá a prueba todo lo que conocen.',
        duracionMinutos: 190,
        categorias: 'Ciencia Ficción, Aventura',
        genero: 'Ciencia Ficción',
        director: 'James Cameron',
        clasificacion: 'PG-13',
        estreno: '2025-12-19',
        imagen: 'https://m.media-amazon.com/images/M/MV5BYzUxNzUzZjAtNGRkYi00NWYyLWE3ZTItNGJlZDhhNjE5NmVlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BYzUxNzUzZjAtNGRkYi00NWYyLWE3ZTItNGJlZDhhNjE5NmVlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'
      },
      {
        titulo: 'Misión Imposible: The Final Reckoning',
        sinopsis: 'Ethan Hunt y su equipo enfrentan su misión más peligrosa: detener una inteligencia artificial que amenaza al mundo entero.',
        duracionMinutos: 155,
        categorias: 'Acción, Espionaje',
        genero: 'Acción',
        director: 'Christopher McQuarrie',
        clasificacion: 'PG-13',
        estreno: '2025-05-23',
        imagen: 'https://m.media-amazon.com/images/M/MV5BZWQ1ZjZlMGEtNjUwOC00YzI3LWJjMDgtOGJjMjA2NzY2OGIwXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BZWQ1ZjZlMGEtNjUwOC00YzI3LWJjMDgtOGJjMjA2NzY2OGIwXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'
      }
    ];

    const peliculasCreadas = [];

    for (const peliculaData of peliculasData) {
      let pelicula = await Pelicula.findOne({ where: { titulo: peliculaData.titulo } });

      if (!pelicula) {
        pelicula = await Pelicula.create(peliculaData);
  console.log(`   ${pelicula.titulo} (${pelicula.director})`);
  console.log(`      Imagen: ${pelicula.imagen.substring(0, 60)}...`);
      } else {
  console.log(`   ${pelicula.titulo} ya existe`);
      }

      peliculasCreadas.push(pelicula);
    }

    // ================================================================
    // 5️⃣ CREAR FUNCIONES (Horarios de películas)
    // ================================================================
  console.log('\nCreando funciones...');

    // Obtener todas las salas
    const todasLasSalas = await Sala.findAll();

    const horarios = ['14:00', '16:30', '19:00', '21:30'];
    const fechas = ['2025-11-09', '2025-11-10', '2025-11-11'];

    let funcionesCreadas = 0;

    for (const pelicula of peliculasCreadas) {
      // Cada película se proyecta en 2 salas aleatorias
      const salasParaPelicula = todasLasSalas.slice(0, 2);

      for (const sala of salasParaPelicula) {
        for (const fecha of fechas) {
          for (const hora of horarios) {
            const existe = await Funcion.findOne({
              where: {
                peliculaId: pelicula.id,
                salaId: sala.id,
                fecha: fecha,
                hora: hora
              }
            });

            if (!existe) {
              // Obtener el cine de la sala
              const cine = await Cine.findByPk(sala.cineId);
              const costoCine = await CostoCine.findOne({ where: { cineId: cine.id } });

              // Determinar precio según tipo de sala
              const costoBase = costoCine?.monto || 45.00;
              let precio = costoBase;

              if (sala.tipo === 'VIP') precio = costoBase * 1.67; // ~75
              else if (sala.tipo === 'Premium') precio = costoBase * 1.44; // ~65
              else if (sala.tipo === '3D') precio = costoBase * 1.22; // ~55
              else if (sala.tipo === 'IMAX') precio = costoBase * 1.89; // ~85

              precio = Math.round(precio * 100) / 100; // Redondear a 2 decimales

              await Funcion.create({
                fecha: fecha,
                hora: hora,
                peliculaId: pelicula.id,
                salaId: sala.id,
                cineId: cine.id,
                precio: precio
              });

              funcionesCreadas++;
            }
          }
        }
      }
    }

  console.log(`   ${funcionesCreadas} funciones creadas`);

    // ================================================================
    // 6️⃣ CREAR BOLETO DE PRUEBA PARA CARLOS
    // ================================================================
  console.log('\nCreando boleto de prueba...');

    const carlos = usuariosCreados.Carlos;
    if (carlos) {
      const primeraFuncion = await Funcion.findOne({
        include: [
          { model: Pelicula, as: 'pelicula' },
          { model: Cine, as: 'cine' }
        ]
      });

      if (primeraFuncion) {
        const boletoExiste = await Boleto.findOne({
          where: {
            usuarioId: carlos.id,
            funcionId: primeraFuncion.id
          }
        });

        if (!boletoExiste) {
          const boleto = await Boleto.create({
            usuarioId: carlos.id,
            funcionId: primeraFuncion.id,
            peliculaId: primeraFuncion.peliculaId,
            cineId: primeraFuncion.cineId,
            salaId: primeraFuncion.salaId,
            precio: primeraFuncion.precio,
            fechaCompra: new Date()
          });

          await Pago.create({
            usuarioId: carlos.id,
            boletoId: boleto.id,
            monto: primeraFuncion.precio,
            metodo: 'cartera',
            fechaPago: new Date()
          });

          console.log(`   Boleto creado para Carlos: ${primeraFuncion.pelicula.titulo}`);
        } else {
          console.log(`   Carlos ya tiene un boleto de prueba`);
        }
      }
    }

    // ================================================================
    // ✅ RESUMEN FINAL
    // ================================================================
    console.log('\n');
    console.log('═══════════════════════════════════════════════════════════════');
  console.log('SEEDER COMPLETO EJECUTADO EXITOSAMENTE');
    console.log('═══════════════════════════════════════════════════════════════');
  console.log('\nRESUMEN DE DATOS CREADOS:\n');

    const totalUsuarios = await Usuario.count();
    const totalCines = await Cine.count();
    const totalSalas = await Sala.count();
    const totalPeliculas = await Pelicula.count();
    const totalFunciones = await Funcion.count();
    const totalBoletos = await Boleto.count();

  console.log(`   Usuarios: ${totalUsuarios}`);
  console.log(`   Cines: ${totalCines}`);
  console.log(`   Salas: ${totalSalas}`);
  console.log(`   Películas: ${totalPeliculas}`);
  console.log(`   Funciones: ${totalFunciones}`);
  console.log(`   Boletos: ${totalBoletos}`);

  console.log('\nCREDENCIALES DE ACCESO:\n');
  console.log('   ADMIN:');
    console.log('      Email: admin@cinehub.com');
    console.log('      Contraseña: admin123\n');
  console.log('   CLIENTES:');
    console.log('      Email: carlos@cinehub.com');
    console.log('      Contraseña: admin123');
    console.log('      Saldo: Q500.00\n');
    console.log('      Email: Eltontis@cunoc.edu.gt');
    console.log('      Contraseña: 123456');
    console.log('      Saldo: Q500.00\n');
    console.log('═══════════════════════════════════════════════════════════════\n');

    process.exit(0);

  } catch (error) {
  console.error('\nERROR DURANTE EL SEEDING:', error);
    process.exit(1);
  }
}

// Ejecutar el seeder
seedCompleto();
