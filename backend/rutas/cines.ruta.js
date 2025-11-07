// backend/rutas/cines.ruta.js
import express from 'express';
import {
  obtenerCines,
  crearCine,
  actualizarCine,
  eliminarCine
} from '../controladores/cines.controlador.js';

const rutasCines = express.Router();

rutasCines.get('/', obtenerCines);
rutasCines.post('/', crearCine);
rutasCines.put('/:id', actualizarCine);
rutasCines.delete('/:id', eliminarCine);

export default rutasCines;
