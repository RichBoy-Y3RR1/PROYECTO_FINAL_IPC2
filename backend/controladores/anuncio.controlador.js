// controladores/anuncio.controlador.js
import Anuncio from '../modelos/anuncio.modelo.js';
import { Op } from 'sequelize';

export const crearAnuncio = async (req, res) => {
  try {
    const { tipo, texto, imagenUrl, videoUrl, duracionDias } = req.body;
    const fechaInicio = new Date();

    const anuncio = await Anuncio.create({
      tipo, texto, imagenUrl, videoUrl, duracionDias, fechaInicio,
      usuarioId: req.usuario?.id || null
    });

    res.json(anuncio);
  } catch (error) {
    console.error('Error crearAnuncio:', error);
    res.status(500).json({ error: error.message });
  }
};

export const anunciosVigentes = async (req, res) => {
  try {
    const hoy = new Date();

    const anuncios = await Anuncio.findAll({
      where: {
        activo: true,
        fechaInicio: {
          [Op.lte]: hoy
        },
        duracionDias: {
          [Op.gte]: 0
        }
      },
      order: [['id', 'DESC']],
      limit: 5
    });

    res.json(anuncios);
  } catch (error) {
    console.error('Error anunciosVigentes:', error);
    res.status(500).json({ error: error.message });
  }
};
