import Pago from '../modelos/pago.modelo.js';

export const obtenerPagos = async (req, res) => {
  const pagos = await Pago.findAll();
  res.json(pagos);
};

export const crearPago = async (req, res) => {
  try {
    const pago = await Pago.create(req.body);
    res.status(201).json(pago);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const actualizarPago = async (req, res) => {
  const { id } = req.params;
  try {
    const pago = await Pago.findByPk(id);
    if (!pago) return res.status(404).json({ error: 'Pago no encontrado' });

    await pago.update(req.body);
    res.json(pago);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const eliminarPago = async (req, res) => {
  const { id } = req.params;
  try {
    const pago = await Pago.findByPk(id);
    if (!pago) return res.status(404).json({ error: 'Pago no encontrado' });

    await pago.destroy();
    res.json({ mensaje: 'Pago eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
