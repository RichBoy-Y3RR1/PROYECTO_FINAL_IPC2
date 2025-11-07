// controladores/comentario.controlador.js
import Comentario from '../modelos/comentario.modelo.js';
import Boleto from '../modelos/boleto.modelo.js';


export const crearComentario = async (req, res) => {
  const { tipo, referenciaId, texto } = req.body;

  const comprueba = await Boleto.findOne({
    where: { usuarioId: req.usuario.id }
  });

  if (!comprueba) return res.status(403).json({ msg: 'Debes haber asistido para comentar' });

  const nuevo = await Comentario.create({
    usuarioId: req.usuario.id,
    tipo,
    referenciaId,
    texto
  });

  res.json(nuevo);
};
