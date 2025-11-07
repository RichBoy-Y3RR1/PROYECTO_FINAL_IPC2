import express from 'express';
import { obtenerSalas, crearSala, actualizarSala, eliminarSala, configurarBloqueosSala, configurarVisibilidadSala } from '../controladores/salas.controlador.js';
import { verificarToken, soloRoles } from '../middlewares/auth.middleware.js';

const rutasSalas = express.Router();

rutasSalas.get('/', obtenerSalas);
rutasSalas.post('/', verificarToken, soloRoles('admin', 'admin_cine'), crearSala);
rutasSalas.put('/:id', verificarToken, soloRoles('admin', 'admin_cine'), actualizarSala);
rutasSalas.delete('/:id', verificarToken, soloRoles('admin', 'admin_cine'), eliminarSala);

// Bloqueos comentario/calificación en sala
rutasSalas.patch('/:id/bloqueos', verificarToken, soloRoles('admin', 'admin_cine'), configurarBloqueosSala);

// Visibilidad pública de sala
rutasSalas.patch('/:id/visibilidad', verificarToken, soloRoles('admin', 'admin_cine'), configurarVisibilidadSala);

export default rutasSalas;
