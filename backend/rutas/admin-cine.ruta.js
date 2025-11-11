import express from 'express';
import {
  listarMisSalas,
  crearSala,
  actualizarSala,
  eliminarSala,
  crearFuncion,
  listarMisFunciones,
  bloquearAnuncio,
  verAnunciosBloqueados,
  toggleBloqueoComentarios,
  toggleVisibilidad,
  estadisticasCine
} from '../controladores/admin-cine.controlador.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(verificarToken);

router.get('/estadisticas', estadisticasCine);

router.get('/salas', listarMisSalas);
router.post('/salas', crearSala);
router.put('/salas/:id', actualizarSala);
router.delete('/salas/:id', eliminarSala);

router.patch('/salas/:id/comentarios', toggleBloqueoComentarios);
router.patch('/salas/:id/visibilidad', toggleVisibilidad);

router.post('/funciones', crearFuncion);
router.get('/funciones', listarMisFunciones);

router.post('/bloquear-anuncio', bloquearAnuncio);
router.get('/anuncios-bloqueados', verAnunciosBloqueados);

export default router;
