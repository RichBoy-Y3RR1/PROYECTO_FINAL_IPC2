import Funcion from '../modelos/funcion.modelo.js';
import Pelicula from '../modelos/pelicula.modelo.js';
import Cine from '../modelos/cine.modelo.js';
import Sala from '../modelos/sala.modelo.js';

export const obtenerFunciones = async (req, res) => {
  try {
    const where = {};
    const { peliculaId, cineId, salaId } = req.query;
    if (peliculaId) where.peliculaId = peliculaId;
    if (cineId) where.cineId = cineId;
    if (salaId) where.salaId = salaId;

    const funciones = await Funcion.findAll({
      where,
      include: [
        { model: Pelicula, as: 'pelicula', attributes: ['id','titulo','clasificacion','duracionMinutos'] },
        { model: Cine, as: 'cine', attributes: ['id','nombre','direccion'] },
        { model: Sala, as: 'sala', attributes: ['id','nombre','numero','bloquearComentarios','bloquearCalificaciones'] }
      ],
      order: [['fecha','ASC'], ['hora','ASC']]
    });
    res.json(funciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerFuncionesPorPelicula = async (req, res) => {
  const { peliculaId } = req.params;
  try {
    const funciones = await Funcion.findAll({
      where: { peliculaId },
      include: [
        { model: Sala, as: 'sala', attributes: ['id','nombre','numero'] },
        { model: Cine, as: 'cine', attributes: ['id','nombre'] }
      ],
      order: [['fecha','ASC'], ['hora','ASC']]
    });
    res.json(funciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const crearFuncion = async (req, res) => {
  try {
    const funcion = await Funcion.create(req.body);
    res.status(201).json(funcion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const actualizarFuncion = async (req, res) => {
  const { id } = req.params;
  try {
    const funcion = await Funcion.findByPk(id);
    if (!funcion) return res.status(404).json({ error: 'Función no encontrada' });

    await funcion.update(req.body);
    res.json(funcion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const eliminarFuncion = async (req, res) => {
  const { id } = req.params;
  try {
    const funcion = await Funcion.findByPk(id);
    if (!funcion) return res.status(404).json({ error: 'Función no encontrada' });

    await funcion.destroy();
    res.json({ mensaje: 'Función eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
