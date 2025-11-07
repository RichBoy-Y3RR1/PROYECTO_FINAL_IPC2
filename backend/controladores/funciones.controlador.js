import Funcion from '../modelos/funcion.modelo.js';

export const obtenerFunciones = async (req, res) => {
  const funciones = await Funcion.findAll();
  res.json(funciones);
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
