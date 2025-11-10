// controladores/usuarios.controlador.js
import Usuario from '../modelos/usuario.modelo.js';

export const obtenerUsuarios = async (req, res) => {
  const usuarios = await Usuario.findAll();
  res.json(usuarios);
};

// Agrega las otras funciones si las necesitas:
export const crearUsuario = async (req, res) => {
  const nuevo = await Usuario.create(req.body);
  res.status(201).json(nuevo);
};

export const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const usuario = await Usuario.findByPk(id);
  if (!usuario) return res.status(404).json({ error: 'No encontrado' });

  await usuario.update(req.body);
  res.json(usuario);
};

export const eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  const usuario = await Usuario.findByPk(id);
  if (!usuario) return res.status(404).json({ error: 'No encontrado' });

  await usuario.destroy();
  res.json({ mensaje: 'Usuario eliminado' });
};
