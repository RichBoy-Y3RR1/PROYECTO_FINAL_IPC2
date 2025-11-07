// controladores/costocine.controlador.js
import CostoCine from '../modelos/costocine.modelo.js';
import { Op } from 'sequelize';

export const cambiarCosto = async (req, res) => {
  const { cineId } = req.params;
  const { monto } = req.body;

  const nuevo = await CostoCine.create({
    cineId,
    monto,
    desdeFecha: new Date()
  });

  res.json({ msg: 'Costo actualizado', nuevo });
};

export const calcularCosto = async (req, res) => {
  const { cineId } = req.params;
  const { desde, hasta } = req.query;

  const costos = await CostoCine.findAll({
    where: { cineId },
    order: [['desdeFecha', 'ASC']]
  });

  // Cálculo de costos entre fechas (simplificado)
  let total = 0;
  let actual = new Date(desde);
  const fin = new Date(hasta || new Date());

  for (let i = 0; i < costos.length; i++) {
    const c = costos[i];
    const siguiente = costos[i + 1] ? new Date(costos[i + 1].desdeFecha) : fin;

    const inicio = new Date(c.desdeFecha) > actual ? new Date(c.desdeFecha) : actual;
    const finUso = siguiente < fin ? siguiente : fin;

    const dias = Math.max(0, (finUso - inicio) / (1000 * 60 * 60 * 24));
    total += dias * c.monto;
  }

  res.json({ total, moneda: 'GTQ' });
};
