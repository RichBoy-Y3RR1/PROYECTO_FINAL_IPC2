// backend/paginaprincipal.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './modelos/cine.modelo.js';
import Cine from './modelos/cine.modelo.js';
import sequelize, { inicializarConexion } from './config/db.js';
import rutasPeliculas from './rutas/peliculas.ruta.js';
import rutasCines from './rutas/cines.ruta.js';
import rutasBoletos from './rutas/boletos.ruta.js';
import rutasSalas from './rutas/salas.ruta.js';
import './modelos/boleto.modelo.js';
import rutasFunciones from './rutas/funciones.ruta.js';
import rutasPagos from './rutas/pagos.ruta.js';
import rutasUsuarios from './rutas/usuarios.ruta.js';
import './modelos/funcion.modelo.js';
import './modelos/pago.modelo.js';
import './modelos/usuario.modelo.js';
import authRuta from './rutas/auth.ruta.js';
import carteraRuta from './rutas/cartera.ruta.js';
import anuncioRuta from './rutas/anuncio.ruta.js';
import bloqueoRuta from './rutas/bloqueoanuncio.ruta.js';
import costoRuta from './rutas/costocine.ruta.js';
import comentarioRuta from './rutas/comentario.ruta.js';
import reportesRuta from './rutas/reportes.ruta.js';
import configAnuncioRuta from './rutas/config-anuncio.ruta.js';
import calificacionRuta from './rutas/calificacion.ruta.js';
import adminCineRuta from './rutas/admin-cine.ruta.js';
import adminSistemaRuta from './rutas/admin-sistema.ruta.js';
import reportesCineRuta from './rutas/reportes-cine.ruta.js';
import reportesSistemaRuta from './rutas/reportes-sistema.ruta.js';
import { iniciarJobLimpiezaAnuncios } from './jobs/limpiar-anuncios.js';



// Importar modelos
import './modelos/pelicula.modelo.js';
import './modelos/cine.modelo.js';
import './modelos/usuario.modelo.js';
import './modelos/funcion.modelo.js';
import './modelos/boleto.modelo.js';
import './modelos/pago.modelo.js';

// ✅ Importar asociaciones
import './modelos/asociaciones.js';






dotenv.config();

const app = express();
const PUERTO = process.env.PUERTO || 4000;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send(`
    <h1>API CineHub</h1>
    <ul>
      <li><a href="/api/peliculas">Películas</a></li>
      <li><a href="/api/cines">Cines</a></li>
      <li><a href="/api/boletos">Boletos</a></li>
      <li><a href="/api/funciones">Funciones</a></li>
      <li><a href="/api/pagos">Pagos</a></li>
      <li><a href="/api/usuarios">Usuarios</a></li>
    </ul>
  `);
});


app.use('/api/auth', authRuta);
app.use('/api/cartera', carteraRuta);
app.use('/api/anuncios', anuncioRuta);
app.use('/api/anuncios/config', configAnuncioRuta);

app.use('/api/bloqueo-anuncios', bloqueoRuta);
app.use('/api/costos-cine', costoRuta);
app.use('/api/comentarios', comentarioRuta);
app.use('/api/calificaciones', calificacionRuta);
app.use('/api/admin-cine', adminCineRuta);
app.use('/api/admin-sistema', adminSistemaRuta);

app.use('/api/reportes', reportesRuta);
app.use('/api/reportes-cine', reportesCineRuta);
app.use('/api/reportes-sistema', reportesSistemaRuta);

app.use('/api/peliculas', rutasPeliculas);
app.use('/api/cines', rutasCines);
app.use('/api/salas', rutasSalas);
app.use('/api/boletos', rutasBoletos);
app.use('/api/funciones', rutasFunciones);
app.use('/api/pagos', rutasPagos);
app.use('/api/usuarios', rutasUsuarios);
// app.use('/api/cines', rutasCines); ...

// Middleware para manejar errores globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal, por favor intenta nuevamente.' });
});

// Sincroniza Sequelize y levanta el servidor
// Inicializa conexión y sincroniza modelos una sola vez
const iniciarServidor = async () => {
  try {
    await inicializarConexion();
    await sequelize.sync({ alter: true });
  console.log('Modelos sincronizados (alter)');

    const server = app.listen(PUERTO, () => {
  console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
      iniciarJobLimpiezaAnuncios();
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Puerto ${PUERTO} en uso. Cierra el proceso que lo ocupa y vuelve a intentar.`);
      } else {
        console.error('❌ Error en el servidor:', err);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Fallo inicializando servidor:', error);
  }
};

iniciarServidor();
