import express from 'express';
import {
  obtenerFunciones,
  crearFuncion,
  actualizarFuncion,
  eliminarFuncion
} from '../controladores/funciones.controlador.js';

const rutasFunciones = express.Router();

rutasFunciones.get('/', obtenerFunciones);
rutasFunciones.post('/', crearFuncion);
rutasFunciones.put('/:id', actualizarFuncion);
rutasFunciones.delete('/:id', eliminarFuncion);

export default rutasFunciones;
