import express from 'express';
import { recargarSaldo, verSaldo, obtenerHistorialMovimientos } from '../controladores/cartera.controlador.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/saldo', verificarToken, verSaldo);
router.post('/recargar', verificarToken, recargarSaldo);
router.get('/historial', verificarToken, obtenerHistorialMovimientos);

export default router;
