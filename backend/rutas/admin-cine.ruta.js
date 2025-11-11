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

// Todas las rutas requieren token y ser admin-cine
router.use(verificarToken);

// Dashboard
router.get('/estadisticas', estadisticasCine);

// CRUD Salas
router.get('/salas', listarMisSalas);
router.post('/salas', crearSala);
router.put('/salas/:id', actualizarSala);
router.delete('/salas/:id', eliminarSala);

// Gestión de sala
router.patch('/salas/:id/comentarios', toggleBloqueoComentarios);
router.patch('/salas/:id/visibilidad', toggleVisibilidad);

// Asignar películas
router.post('/funciones', crearFuncion);
router.get('/funciones', listarMisFunciones);

// Bloquear anuncios
router.post('/bloquear-anuncio', bloquearAnuncio);
router.get('/anuncios-bloqueados', verAnunciosBloqueados);

export default router;
