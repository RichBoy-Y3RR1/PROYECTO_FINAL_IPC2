// controladores/config-anuncio.controlador.js
import ConfigAnuncio from '../modelos/config-anuncio.modelo.js';

export const obtenerConfig = async (req, res) => {
  const configs = await ConfigAnuncio.findAll();
  res.json(configs);
};

export const upsertConfig = async (req, res) => {
  const { tipo, precioDiario, periodosPermitidos } = req.body;
  if (!tipo) return res.status(400).json({ error: 'tipo es requerido' });
  const [cfg] = await ConfigAnuncio.upsert({ tipo, precioDiario, periodosPermitidos }, { returning: true });
  res.json(cfg);
};
