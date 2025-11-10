// rutas/calificacion.ruta.js
import express from 'express';
import { calificarPelicula, calificarSala } from '../controladores/calificacion.controlador.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/pelicula', verificarToken, calificarPelicula);
router.post('/sala', verificarToken, calificarSala);

export default router;
