// rutas/usuarios.ruta.js
import express from 'express';
import {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
} from '../controladores/usuarios.controlador.js';

const rutasUsuarios = express.Router();

rutasUsuarios.get('/', obtenerUsuarios);
rutasUsuarios.post('/', crearUsuario);
rutasUsuarios.put('/:id', actualizarUsuario);
rutasUsuarios.delete('/:id', eliminarUsuario);

export default rutasUsuarios;
