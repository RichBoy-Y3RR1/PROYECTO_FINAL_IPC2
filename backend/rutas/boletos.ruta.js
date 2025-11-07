// backend/rutas/boletos.ruta.js
import express from 'express';
import {
  obtenerBoletos,
  crearBoleto,
  actualizarBoleto,
  eliminarBoleto
} from '../controladores/boletos.controlador.js';

const rutasBoletos = express.Router();

rutasBoletos.get('/', obtenerBoletos);
rutasBoletos.post('/', crearBoleto);
rutasBoletos.put('/:id', actualizarBoleto);
rutasBoletos.delete('/:id', eliminarBoleto);

export default rutasBoletos;
