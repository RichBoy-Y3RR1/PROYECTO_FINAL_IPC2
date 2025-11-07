import express from 'express';
import { crearAnuncio, anunciosVigentes, desactivarAnuncio } from '../controladores/anuncio.controlador.js';
import { verificarToken, soloRoles } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', verificarToken, soloRoles('admin', 'admin_cine'), crearAnuncio);
router.get('/activos', anunciosVigentes);
router.patch('/:id/desactivar', verificarToken, soloRoles('admin', 'admin_cine'), desactivarAnuncio);

export default router;
