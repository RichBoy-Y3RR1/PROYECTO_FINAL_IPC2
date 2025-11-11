import express from 'express';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { dashboardConsolidado } from '../controladores/reportes-sistema.controlador.js';
import {
  listarCines,
  crearCine,
  actualizarCine,
  eliminarCine,

  listarPeliculas,
  crearPelicula,
  actualizarPelicula,
  eliminarPelicula,

  configurarCostoOcultacion,
  obtenerConfiguracion,

  configurarPreciosAnuncios,

  configurarCostoDiario,
  listarCostosCines,

  listarTodosAnuncios,
  aprobarAnuncio,
  rechazarAnuncio,
  desactivarAnuncio,

  estadisticasGenerales
} from '../controladores/admin-sistema.controlador.js';

const router = express.Router();

router.get('/estadisticas', verificarToken, estadisticasGenerales);
router.get('/dashboard', verificarToken, dashboardConsolidado);
router.get('/cines', verificarToken, listarCines);
router.post('/cines', verificarToken, crearCine);
router.put('/cines/:id', verificarToken, actualizarCine);
router.delete('/cines/:id', verificarToken, eliminarCine);
router.get('/peliculas', verificarToken, listarPeliculas);
router.post('/peliculas', verificarToken, crearPelicula);
router.put('/peliculas/:id', verificarToken, actualizarPelicula);
router.delete('/peliculas/:id', verificarToken, eliminarPelicula);
router.get('/configuracion', verificarToken, obtenerConfiguracion);
router.post('/configuracion/ocultacion', verificarToken, configurarCostoOcultacion);
router.post('/configuracion/precios-anuncios', verificarToken, configurarPreciosAnuncios);
router.get('/costos-cines', verificarToken, listarCostosCines);
router.post('/costos-cines', verificarToken, configurarCostoDiario);
router.get('/anuncios', verificarToken, listarTodosAnuncios);
router.patch('/anuncios/:id/aprobar', verificarToken, aprobarAnuncio);
router.patch('/anuncios/:id/rechazar', verificarToken, rechazarAnuncio);
router.patch('/anuncios/:id/desactivar', verificarToken, desactivarAnuncio);
router.get('/estadisticas', verificarToken, estadisticasGenerales);
router.get('/dashboard', verificarToken, dashboardConsolidado);
router.get('/cines', verificarToken, listarCines);
router.post('/cines', verificarToken, crearCine);
router.put('/cines/:id', verificarToken, actualizarCine);
router.delete('/cines/:id', verificarToken, eliminarCine);
router.get('/peliculas', verificarToken, listarPeliculas);
router.post('/peliculas', verificarToken, crearPelicula);
router.put('/peliculas/:id', verificarToken, actualizarPelicula);
router.delete('/peliculas/:id', verificarToken, eliminarPelicula);
router.get('/configuracion', verificarToken, obtenerConfiguracion);
router.post('/configuracion/ocultacion', verificarToken, configurarCostoOcultacion);
router.post('/configuracion/precios-anuncios', verificarToken, configurarPreciosAnuncios);
router.get('/costos-cines', verificarToken, listarCostosCines);
router.post('/costos-cines', verificarToken, configurarCostoDiario);
router.get('/anuncios', verificarToken, listarTodosAnuncios);
router.patch('/anuncios/:id/aprobar', verificarToken, aprobarAnuncio);
router.patch('/anuncios/:id/rechazar', verificarToken, rechazarAnuncio);
router.patch('/anuncios/:id/desactivar', verificarToken, desactivarAnuncio);

export default router;
