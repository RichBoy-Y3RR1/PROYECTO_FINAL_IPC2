// backend/controladores/cines.controlador.js
import Cine from '../modelos/cine.modelo.js';
import Sala from '../modelos/sala.modelo.js';

export const obtenerCines = async (req, res) => {
  try {
    const cines = await Cine.findAll({
      include: [{ model: Sala }]
    });
    res.json(cines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const crearCine = async (req, res) => {
  try {
    const cine = await Cine.create(req.body);
    res.status(201).json(cine);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const actualizarCine = async (req, res) => {
  const { id } = req.params;
  try {
    const cine = await Cine.findByPk(id);
    if (!cine) return res.status(404).json({ error: 'Cine no encontrado' });

    await cine.update(req.body);
    res.json(cine);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const eliminarCine = async (req, res) => {
  const { id } = req.params;
  try {
    const cine = await Cine.findByPk(id);
    if (!cine) return res.status(404).json({ error: 'Cine no encontrado' });

    await cine.destroy();
    res.json({ mensaje: 'Cine eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
