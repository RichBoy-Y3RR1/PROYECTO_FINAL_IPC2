import express from 'express';
import {
  reporteGananciasSistema,
  reporteAnunciosComprados,
  reporteGananciasAnunciante,
  reporteSalasPopulares,
  reporteSalasMasComentadas,
  estadisticasGenerales,
  dashboardConsolidado
} from '../controladores/reportes-sistema.controlador.js';
import { verificarToken, soloAdminGeneral } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/ganancias', verificarToken, soloAdminGeneral, reporteGananciasSistema);
router.get('/anuncios-comprados', verificarToken, soloAdminGeneral, reporteAnunciosComprados);
router.get('/ganancias-anunciante', verificarToken, soloAdminGeneral, reporteGananciasAnunciante);
router.get('/salas-populares', verificarToken, soloAdminGeneral, reporteSalasPopulares);
router.get('/salas-comentadas', verificarToken, soloAdminGeneral, reporteSalasMasComentadas);
router.get('/estadisticas', verificarToken, soloAdminGeneral, estadisticasGenerales);
// Nuevo endpoint consolidado para el dashboard del Administrador del sistema
router.get('/dashboard', verificarToken, soloAdminGeneral, dashboardConsolidado);

export default router;
