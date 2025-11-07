import express from 'express';
import { obtenerSalas, crearSala, actualizarSala, eliminarSala } from '../controladores/salas.controlador.js';

const rutasSalas = express.Router();

rutasSalas.get('/', obtenerSalas);
rutasSalas.post('/', crearSala);
rutasSalas.put('/:id', actualizarSala);
rutasSalas.delete('/:id', eliminarSala);

export default rutasSalas;
