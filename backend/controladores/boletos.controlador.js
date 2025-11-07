// backend/controladores/boletos.controlador.js
import Boleto from '../modelos/boleto.modelo.js';
import Funcion from '../modelos/funcion.modelo.js';
import Cartera from '../modelos/cartera.modelo.js';
import Pago from '../modelos/pago.modelo.js';

export const crearBoleto = async (req, res) => {
  try {
    const { funcionId } = req.body;

    const funcion = await Funcion.findByPk(funcionId);
    if (!funcion) return res.status(404).json({ msg: 'Función no encontrada' });

    const cartera = await Cartera.findOne({ where: { usuarioId: req.usuario.id } });
    if (!cartera || cartera.saldo < funcion.precio)
      return res.status(400).json({ msg: 'Saldo insuficiente' });

    const boletoExistente = await Boleto.findOne({
      where: { usuarioId: req.usuario.id, funcionId }
    });
    if (boletoExistente) return res.status(400).json({ msg: 'Ya compraste este boleto' });

    cartera.saldo -= funcion.precio;
    await cartera.save();

    const boleto = await Boleto.create({
      usuarioId: req.usuario.id,
      funcionId,
      peliculaId: funcion.peliculaId,
      cineId: funcion.cineId,
      precio: funcion.precio,
      fechaCompra: new Date()
    });

    await Pago.create({
      usuarioId: req.usuario.id,
      boletoId: boleto.id,
      monto: funcion.precio
    });

    res.status(201).json({ msg: 'Boleto comprado', boleto });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerBoletos = async (req, res) => {
  try {
    const boletos = await Boleto.findAll();
    res.json(boletos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const actualizarBoleto = async (req, res) => {
  const { id } = req.params;
  try {
    const boleto = await Boleto.findByPk(id);
    if (!boleto) return res.status(404).json({ error: 'Boleto no encontrado' });

    await boleto.update(req.body);
    res.json(boleto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const eliminarBoleto = async (req, res) => {
  const { id } = req.params;
  try {
    const boleto = await Boleto.findByPk(id);
    if (!boleto) return res.status(404).json({ error: 'Boleto no encontrado' });

    await boleto.destroy();
    res.json({ mensaje: 'Boleto eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
