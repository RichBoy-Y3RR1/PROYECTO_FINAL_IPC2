import express from 'express';
import generarReporteBoletos from '../controladores/reporte.controlador.js';
import { verificarToken, soloRoles } from '../middlewares/auth.middleware.js';
import {
  reporteComentariosSalas,
  reportePeliculasProyectadas,
  reporteBoletosVendidos,
  reporteGanancias,
  reporteTopSalas,
  reporteAnuncios,
  reporteRendimientoAnunciosJasper
} from '../controladores/reportes.controlador.js';

const router = express.Router();

// Rutas POST para generar reportes (sin autenticación para pruebas)
router.post('/comentarios-salas', reporteComentariosSalas);
router.post('/peliculas-proyectadas', reportePeliculasProyectadas);
router.post('/top-salas', reporteTopSalas);
router.post('/boletos-vendidos', reporteBoletosVendidos);
router.post('/ganancias', reporteGanancias);
router.post('/anuncios', reporteAnuncios);

// Rutas GET (con autenticación)
router.get('/boletos', verificarToken, soloRoles('admin'), generarReporteBoletos);
router.get('/comentarios-salas', verificarToken, soloRoles('admin'), reporteComentariosSalas);
router.get('/peliculas-proyectadas', verificarToken, soloRoles('admin'), reportePeliculasProyectadas);
router.get('/top-salas', verificarToken, soloRoles('admin'), reporteTopSalas);
router.get('/boletos-vendidos', verificarToken, soloRoles('admin'), reporteBoletosVendidos);
router.get('/ganancias', verificarToken, soloRoles('admin'), reporteGanancias);
router.get('/anuncios', verificarToken, soloRoles('admin'), reporteAnuncios);

// Reporte Jasper de rendimiento de anuncios
router.get('/rendimiento-anuncios-jasper', verificarToken, soloRoles('admin', 'admin-general'), reporteRendimientoAnunciosJasper);

export default router;
