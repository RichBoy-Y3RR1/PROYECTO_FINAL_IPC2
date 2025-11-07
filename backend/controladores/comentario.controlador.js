// controladores/comentario.controlador.js
import Comentario from '../modelos/comentario.modelo.js';
import Boleto from '../modelos/boleto.modelo.js';
import Sala from '../modelos/sala.modelo.js';


export const crearComentario = async (req, res) => {
  const { tipo, referenciaId, texto } = req.body;

  const comprueba = await Boleto.findOne({
    where: { usuarioId: req.usuario.id }
  });

  if (!comprueba) return res.status(403).json({ msg: 'Debes haber asistido para comentar' });

  // Bloqueo de comentarios por sala
  if (tipo === 'sala' && referenciaId) {
    const sala = await Sala.findByPk(referenciaId);
    if (!sala) return res.status(404).json({ msg: 'Sala no encontrada' });
    if (sala.bloquearComentarios) return res.status(403).json({ msg: 'Comentarios bloqueados para esta sala' });
  }

  const nuevo = await Comentario.create({
    usuarioId: req.usuario.id,
    tipo,
    referenciaId,
    texto
  });

  res.json(nuevo);
};
