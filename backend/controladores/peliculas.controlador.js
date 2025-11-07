// backend/controladores/peliculas.controlador.js
import Pelicula from '../modelos/pelicula.modelo.js';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';

export const crearPelicula = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    const pelicula = await Pelicula.create(req.body);
    res.status(201).json(pelicula);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




export const obtenerPeliculas = async (req, res) => {
  const peliculas = await Pelicula.findAll();
  res.json(peliculas);
};


export const actualizarPelicula = async (req, res) => {
  const { id } = req.params;
  try {
    const pelicula = await Pelicula.findByPk(id);
    if (!pelicula) return res.status(404).json({ error: 'Pelicula no encontrada' });

    await pelicula.update(req.body);
    res.json(pelicula);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const eliminarPelicula = async (req, res) => {
  const { id } = req.params;
  try {
    const pelicula = await Pelicula.findByPk(id);
    if (!pelicula) return res.status(404).json({ error: 'Pelicula no encontrada' });

    await pelicula.destroy();
    res.json({ mensaje: 'Película eliminada correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const buscarPeliculas = async (req, res) => {
  try {
    const { titulo, categoria } = req.query;
    const where = {};

    if (titulo) {
      where.titulo = { [Op.like]: `%${titulo}%` };
    }

    if (categoria) {
      where.categorias = { [Op.like]: `%${categoria}%` };
    }

    const peliculas = await Pelicula.findAll({ where });
    res.json(peliculas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
