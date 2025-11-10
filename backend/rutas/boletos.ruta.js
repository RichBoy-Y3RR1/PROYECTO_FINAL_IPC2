// backend/rutas/boletos.ruta.js
import express from 'express';
import {
  obtenerBoletos,
  obtenerMisBoletos,
  crearBoleto,
  actualizarBoleto,
  eliminarBoleto
} from '../controladores/boletos.controlador.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const rutasBoletos = express.Router();

rutasBoletos.get('/', verificarToken, obtenerBoletos);
rutasBoletos.get('/mios', verificarToken, obtenerMisBoletos);
rutasBoletos.post('/', verificarToken, crearBoleto);
rutasBoletos.put('/:id', verificarToken, actualizarBoleto);
rutasBoletos.delete('/:id', verificarToken, eliminarBoleto);

export default rutasBoletos;
