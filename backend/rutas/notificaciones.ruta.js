// rutas/notificaciones.ruta.js
import express from 'express';
import {
  misNotificaciones,
  marcarLeida,
  marcarTodasLeidas,
  eliminarNotificacion,
  contadorNoLeidas
} from '../controladores/notificaciones.controlador.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Obtener mis notificaciones
router.get('/', misNotificaciones);

// Contador de no leídas
router.get('/no-leidas/count', contadorNoLeidas);

// Marcar una notificación como leída
router.patch('/:id/leida', marcarLeida);

// Marcar todas como leídas
router.patch('/marcar-todas-leidas', marcarTodasLeidas);

// Eliminar notificación
router.delete('/:id', eliminarNotificacion);

export default router;
