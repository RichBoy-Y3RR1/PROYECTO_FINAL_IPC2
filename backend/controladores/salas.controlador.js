import Sala from '../modelos/sala.modelo.js';
import Cine from '../modelos/cine.modelo.js';

export const obtenerSalas = async (req, res) => {
  try {
    const salas = await Sala.findAll({
      include: [{ model: Cine, attributes: ['nombre'] }]
    });
    res.json(salas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const crearSala = async (req, res) => {
  try {
    const sala = await Sala.create(req.body);
    res.status(201).json(sala);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const actualizarSala = async (req, res) => {
  try {
    const { id } = req.params;
    const sala = await Sala.findByPk(id);
    if (!sala) {
      return res.status(404).json({ error: 'Sala no encontrada' });
    }
    await sala.update(req.body);
    res.json(sala);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminarSala = async (req, res) => {
  try {
    const { id } = req.params;
    const sala = await Sala.findByPk(id);
    if (!sala) {
      return res.status(404).json({ error: 'Sala no encontrada' });
    }
    await sala.destroy();
    res.json({ mensaje: 'Sala eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
