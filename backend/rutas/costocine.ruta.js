// rutas/costocine.ruta.js
import express from 'express';
import { cambiarCosto, calcularCosto } from '../controladores/costocine.controlador.js';
import { verificarToken, soloRoles } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/:cineId', verificarToken, soloRoles('admin'), cambiarCosto);
router.get('/:cineId', verificarToken, calcularCosto);

export default router;
