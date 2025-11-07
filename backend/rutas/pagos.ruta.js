import express from 'express';
import {
  obtenerPagos,
  crearPago,
  actualizarPago,
  eliminarPago
} from '../controladores/pagos.controlador.js';

const rutasPagos = express.Router();

rutasPagos.get('/', obtenerPagos);
rutasPagos.post('/', crearPago);
rutasPagos.put('/:id', actualizarPago);
rutasPagos.delete('/:id', eliminarPago);

export default rutasPagos;
