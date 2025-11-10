// backend/paginaprincipal.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './modelos/cine.modelo.js';
import Cine from './modelos/cine.modelo.js';
import sequelize from './config/db.js';
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
import adminSistemaRuta from './rutas/admin-sistema.ruta.js';
import adminCineRuta from './rutas/admin-cine.ruta.js';
import reportesCineRuta from './rutas/reportes-cine.ruta.js';
import reportesSistemaRuta from './rutas/reportes-sistema.ruta.js';
import notificacionesRuta from './rutas/notificaciones.ruta.js';
import { iniciarJobLimpiezaAnuncios, limpiarAnunciosManual } from './jobs/limpiar-anuncios.js';



// Importar modelos
import './modelos/pelicula.modelo.js';
import './modelos/cine.modelo.js';
import './modelos/usuario.modelo.js';
import './modelos/funcion.modelo.js';
import './modelos/boleto.modelo.js';
import './modelos/pago.modelo.js';
import './modelos/config-anuncio.modelo.js';
import './modelos/notificacion.modelo.js';

// ✅ Importar asociaciones
import './modelos/asociaciones.js';






dotenv.config();

const app = express();
const PUERTO = process.env.PUERTO || 4000;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send(`
    <h1>Bienvenido a la API de CineHub</h1>
    <ul>
      <li><a href="/api/peliculas">Ver Películas</a></li>
      <li><a href="/api/cines">Ver Cines</a></li>
      <li><a href="/api/boletos">Ver Boletos</a></li>
      <li><a href="/api/funciones">Ver Funciones</a></li>
      <li><a href="/api/pagos">Ver Pagos</a></li>
      <li><a href="/api/usuarios">Ver Usuarios</a></li>
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
app.use('/api/notificaciones', notificacionesRuta);

app.use('/api/reportes', reportesRuta);
app.use('/api/reportes-cine', reportesCineRuta);
app.use('/api/reportes-sistema', reportesSistemaRuta);

// Rutas de administración
app.use('/api/admin-sistema', adminSistemaRuta);
app.use('/api/admin-cine', adminCineRuta);

app.use('/api/peliculas', rutasPeliculas);
app.use('/api/cines', rutasCines);
app.use('/api/salas', rutasSalas);
app.use('/api/boletos', rutasBoletos);
app.use('/api/funciones', rutasFunciones);
app.use('/api/pagos', rutasPagos);
app.use('/api/usuarios', rutasUsuarios);

// Endpoint manual para limpiar anuncios expirados
app.post('/api/jobs/limpiar-anuncios', limpiarAnunciosManual);
// app.use('/api/cines', rutasCines); ...

// Middleware para manejar errores globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal, por favor intenta nuevamente.' });
});

// Sincroniza Sequelize y levanta el servidor
// Habilitar alter en esta iteración para actualizar columnas (ej. salaId en Función)
sequelize.sync({ force: false }) // No borrar datos
  .then(() => {
    console.log('Base de datos sincronizada');
    app.listen(PUERTO, () => {
      console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
      // Iniciar jobs de limpieza automática de anuncios
      iniciarJobLimpiezaAnuncios();
    });
  })
  .catch(err => console.error('Error al conectar con la BD:', err));
