import express from 'express';
import {
  obtenerFunciones,
  obtenerFuncionesPorPelicula,
  crearFuncion,
  actualizarFuncion,
  eliminarFuncion
} from '../controladores/funciones.controlador.js';

const rutasFunciones = express.Router();

rutasFunciones.get('/', obtenerFunciones);
rutasFunciones.get('/pelicula/:peliculaId', obtenerFuncionesPorPelicula);
rutasFunciones.post('/', crearFuncion);
rutasFunciones.put('/:id', actualizarFuncion);
rutasFunciones.delete('/:id', eliminarFuncion);

export default rutasFunciones;
