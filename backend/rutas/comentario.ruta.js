// rutas/comentario.ruta.js
import express from 'express';
import { crearComentario } from '../controladores/comentario.controlador.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', verificarToken, crearComentario);

export default router;
