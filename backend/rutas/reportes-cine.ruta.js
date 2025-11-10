import express from 'express';
import {
  reporteComentariosSalas,
  reportePeliculasProyectadas,
  reporteSalasMasGustadas,
  reporteBoletosVendidos,
  previewComentarios
} from '../controladores/reportes-cine.controlador.js';
import { verificarToken, soloAdminCine } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/comentarios', verificarToken, soloAdminCine, reporteComentariosSalas);
router.get('/peliculas-proyectadas', verificarToken, soloAdminCine, reportePeliculasProyectadas);
router.get('/salas-gustadas', verificarToken, soloAdminCine, reporteSalasMasGustadas);
router.get('/boletos', verificarToken, soloAdminCine, reporteBoletosVendidos);
router.get('/preview/comentarios', verificarToken, soloAdminCine, previewComentarios);

export default router;
