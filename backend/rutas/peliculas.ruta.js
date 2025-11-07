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

// ✅ Validaciones flexibles para crear y actualizar (acepta ambos esquemas)
const validacionesPelicula = [
  body('titulo').notEmpty().withMessage('El título es obligatorio'),
  body('sinopsis').optional().isString().withMessage('La sinopsis debe ser texto'),
  body('descripcion').optional().isString().withMessage('La descripción debe ser texto'),
  body('duracionMinutos').optional().isInt({ min: 1 }).withMessage('La duración debe ser un número positivo'),
  body('duracion').optional().isInt({ min: 1 }).withMessage('La duración debe ser un número positivo'),
  body('director').optional().isString().withMessage('El director debe ser texto'),
  body('clasificacion').optional().isString().withMessage('La clasificación debe ser texto'),
  body('estreno').optional().isISO8601().withMessage('Fecha de estreno inválida'),
  body('anio').optional().isInt({ min: 1880 }).withMessage('El año es inválido'),
  body('genero').optional().isString(),
  body('categorias').optional().isString(),
  body('imagen').optional().isString(),
  body('posterUrl').optional().isString()
];

// Rutas CRUD
rutasPeliculas.get('/', obtenerPeliculas);
rutasPeliculas.post('/', validacionesPelicula, crearPelicula);
rutasPeliculas.put('/:id', validacionesPelicula, actualizarPelicula);
rutasPeliculas.delete('/:id', eliminarPelicula);
rutasPeliculas.get('/buscar', buscarPeliculas);

export default rutasPeliculas;
