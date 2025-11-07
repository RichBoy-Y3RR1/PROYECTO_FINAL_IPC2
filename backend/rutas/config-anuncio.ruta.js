// rutas/config-anuncio.ruta.js
import express from 'express';
import { obtenerConfig, upsertConfig } from '../controladores/config-anuncio.controlador.js';
import { verificarToken, soloRoles } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', obtenerConfig);
router.post('/', verificarToken, soloRoles('admin'), upsertConfig);

export default router;
