// rutas/peliculas.ruta.js
import express from 'express';
import { body } from 'express-validator';
import {
  obtenerPeliculas,
  crearPelicula,
  actualizarPelicula,
  eliminarPelicula
} from '../controladores/peliculas.controlador.js';
import { buscarPeliculas } from '../controladores/peliculas.controlador.js';

const rutasPeliculas = express.Router();

// ✅ Validaciones para crear y actualizar
const validacionesPelicula = [
  body('titulo').notEmpty().withMessage('El título es obligatorio'),
  body('sinopsis').notEmpty().withMessage('La sinopsis es obligatoria'),
  body('duracionMinutos').isInt({ min: 1 }).withMessage('La duración debe ser un número positivo'),
  body('director').notEmpty().withMessage('El director es obligatorio'),
  body('clasificacion').notEmpty().withMessage('La clasificación es obligatoria'),
  body('estreno').isDate().withMessage('Fecha de estreno inválida')
];

// Rutas CRUD
rutasPeliculas.get('/', obtenerPeliculas);
rutasPeliculas.post('/', validacionesPelicula, crearPelicula);
rutasPeliculas.put('/:id', validacionesPelicula, actualizarPelicula);
rutasPeliculas.delete('/:id', eliminarPelicula);
rutasPeliculas.get('/buscar', buscarPeliculas);

export default rutasPeliculas;
