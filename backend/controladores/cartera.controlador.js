// controladores/cartera.controlador.js
import Cartera from '../modelos/cartera.modelo.js';

export const verSaldo = async (req, res) => {
  const cartera = await Cartera.findOne({ where: { usuarioId: req.usuario.id } });
  res.json(cartera);
};

export const recargarSaldo = async (req, res) => {
  const { monto } = req.body;
  const cartera = await Cartera.findOne({ where: { usuarioId: req.usuario.id } });
  cartera.saldo += parseFloat(monto);
  await cartera.save();
  res.json({ msg: 'Recarga exitosa', saldo: cartera.saldo });
};
