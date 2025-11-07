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
    // Normalizar payload para aceptar ambos esquemas (frontend/backends previos)
    const payload = { ...req.body };
    if (!payload.sinopsis && payload.descripcion) payload.sinopsis = payload.descripcion;
    if (!payload.descripcion && payload.sinopsis) payload.descripcion = payload.sinopsis;
    if (!payload.duracionMinutos && payload.duracion) payload.duracionMinutos = payload.duracion;
    if (!payload.duracion && payload.duracionMinutos) payload.duracion = payload.duracionMinutos;
    if (!payload.posterUrl && payload.imagen) payload.posterUrl = payload.imagen;
    if (!payload.imagen && payload.posterUrl) payload.imagen = payload.posterUrl;
    if (!payload.estreno && payload.anio) payload.estreno = `${payload.anio}-01-01`;

    const pelicula = await Pelicula.create(payload);
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

    const payload = { ...req.body };
    if (!payload.sinopsis && payload.descripcion) payload.sinopsis = payload.descripcion;
    if (!payload.descripcion && payload.sinopsis) payload.descripcion = payload.sinopsis;
    if (!payload.duracionMinutos && payload.duracion) payload.duracionMinutos = payload.duracion;
    if (!payload.duracion && payload.duracionMinutos) payload.duracion = payload.duracionMinutos;
    if (!payload.posterUrl && payload.imagen) payload.posterUrl = payload.imagen;
    if (!payload.imagen && payload.posterUrl) payload.imagen = payload.posterUrl;
    if (!payload.estreno && payload.anio) payload.estreno = `${payload.anio}-01-01`;

    await pelicula.update(payload);
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
