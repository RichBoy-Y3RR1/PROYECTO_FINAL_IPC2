// controladores/bloqueoanuncio.controlador.js
import BloqueoAnuncio from '../modelos/bloqueoanuncio.modelo.js';
import Cartera from '../modelos/cartera.modelo.js';

export const bloquearAnuncios = async (req, res) => {
  const { dias, monto } = req.body;
  const { cineId } = req.params;

  const cartera = await Cartera.findOne({ where: { usuarioId: req.usuario.id } });

  if (cartera.saldo < monto) {
    return res.status(400).json({ msg: 'Saldo insuficiente' });
  }

  cartera.saldo -= monto;
  await cartera.save();

  const bloqueo = await BloqueoAnuncio.create({
    cineId,
    fechaInicio: new Date(),
    dias,
    montoPagado: monto
  });

  res.json({ msg: 'Anuncios bloqueados', bloqueo });
};
