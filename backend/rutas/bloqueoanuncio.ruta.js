// rutas/bloqueoanuncio.ruta.js
import express from 'express';
import { bloquearAnuncios } from '../controladores/bloqueoanuncio.controlador.js';
import { verificarToken, soloRoles } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/:cineId', verificarToken, soloRoles('admin_cine'), bloquearAnuncios);

export default router;
