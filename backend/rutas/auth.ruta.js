// rutas/auth.ruta.js
import express from 'express';
import { registrar, login } from '../controladores/auth.controlador.js';

const router = express.Router();

router.post('/registro', registrar);
router.post('/login', login);

export default router;
