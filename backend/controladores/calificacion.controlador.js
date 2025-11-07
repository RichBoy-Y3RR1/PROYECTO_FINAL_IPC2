// controladores/calificacion.controlador.js
import Calificacion from '../modelos/calificacion.modelo.js';

export const calificarPelicula = async (req, res) => {
  const { peliculaId, puntaje } = req.body;

  const ya = await Calificacion.findOne({
    where: { usuarioId: req.usuario.id, peliculaId }
  });

  if (ya) {
    await ya.update({ puntaje });
    return res.json({ msg: 'Calificación actualizada', calificacion: ya });
  }

  const nueva = await Calificacion.create({
    usuarioId: req.usuario.id,
    peliculaId,
    puntaje
  });

  res.json({ msg: 'Calificación guardada', calificacion: nueva });
};
