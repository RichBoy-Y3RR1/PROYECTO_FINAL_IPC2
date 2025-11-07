import express from 'express';
import { crearAnuncio, anunciosVigentes } from '../controladores/anuncio.controlador.js';
import { verificarToken, soloRoles } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', verificarToken, soloRoles('admin', 'admin_cine'), crearAnuncio);
router.get('/activos', anunciosVigentes);

export default router;
