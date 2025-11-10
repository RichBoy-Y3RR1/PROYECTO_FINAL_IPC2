import express from 'express';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { dashboardConsolidado } from '../controladores/reportes-sistema.controlador.js';
import {
  // CRUD Cines (4 pts)
  listarCines,
  crearCine,
  actualizarCine,
  eliminarCine,

  // CRUD Películas (4 pts)
  listarPeliculas,
  crearPelicula,
  actualizarPelicula,
  eliminarPelicula,

  // Gestionar costos ocultación (1 pt)
  configurarCostoOcultacion,
  obtenerConfiguracion,

  // Configurar precios anuncios (2 pts)
  configurarPreciosAnuncios,

  // Gestionar costos diarios (1 pt)
  configurarCostoDiario,
  listarCostosCines,

  // Desactivar anuncios (2 pts)
  listarTodosAnuncios,
  aprobarAnuncio,
  rechazarAnuncio,
  desactivarAnuncio,

  // Estadísticas
  estadisticasGenerales
} from '../controladores/admin-sistema.controlador.js';

const router = express.Router();

// ============================================
// TODAS LAS RUTAS REQUIEREN AUTENTICACIÓN
// ============================================

// ESTADÍSTICAS
router.get('/estadisticas', verificarToken, estadisticasGenerales);
// Dashboard consolidado (Admin del sistema)
router.get('/dashboard', verificarToken, dashboardConsolidado);

// CRUD CINES (4 pts)
router.get('/cines', verificarToken, listarCines);
router.post('/cines', verificarToken, crearCine);
router.put('/cines/:id', verificarToken, actualizarCine);
router.delete('/cines/:id', verificarToken, eliminarCine);

// CRUD PELÍCULAS (4 pts)
router.get('/peliculas', verificarToken, listarPeliculas);
router.post('/peliculas', verificarToken, crearPelicula);
router.put('/peliculas/:id', verificarToken, actualizarPelicula);
router.delete('/peliculas/:id', verificarToken, eliminarPelicula);

// CONFIGURACIÓN COSTOS OCULTACIÓN (1 pt)
router.get('/configuracion', verificarToken, obtenerConfiguracion);
router.post('/configuracion/ocultacion', verificarToken, configurarCostoOcultacion);

// CONFIGURAR PRECIOS ANUNCIOS (2 pts)
router.post('/configuracion/precios-anuncios', verificarToken, configurarPreciosAnuncios);

// GESTIONAR COSTOS DIARIOS (1 pt)
router.get('/costos-cines', verificarToken, listarCostosCines);
router.post('/costos-cines', verificarToken, configurarCostoDiario);

// MODERAR ANUNCIOS (2 pts)
router.get('/anuncios', verificarToken, listarTodosAnuncios);
router.patch('/anuncios/:id/aprobar', verificarToken, aprobarAnuncio);
router.patch('/anuncios/:id/rechazar', verificarToken, rechazarAnuncio);
router.patch('/anuncios/:id/desactivar', verificarToken, desactivarAnuncio);

export default router;
