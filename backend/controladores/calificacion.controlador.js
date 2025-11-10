// controladores/calificacion.controlador.js
import Calificacion from '../modelos/calificacion.modelo.js';
import Boleto from '../modelos/boleto.modelo.js';
import Sala from '../modelos/sala.modelo.js';

// Calificar una película (1-5). Acepta 'puntaje' o 'valor' en el cuerpo.
export const calificarPelicula = async (req, res) => {
  const { peliculaId, puntaje, valor } = req.body;
  const score = puntaje || valor;
  if (!peliculaId || !score) return res.status(400).json({ msg: 'peliculaId y puntaje/valor requeridos' });

  try {
    let existente = await Calificacion.findOne({
      where: { usuarioId: req.usuario.id, peliculaId, tipo: 'pelicula' }
    });

    if (existente) {
      await existente.update({ valor: score });
      return res.json({ msg: 'Calificación actualizada', calificacion: existente });
    }

    const nueva = await Calificacion.create({
      usuarioId: req.usuario.id,
      peliculaId,
      tipo: 'pelicula',
      valor: score
    });
    res.json({ msg: 'Calificación guardada', calificacion: nueva });
  } catch (error) {
    console.error('Error calificando película:', error);
    res.status(500).json({ error: error.message });
  }
};

// Calificar una sala de cine (1-5)
export const calificarSala = async (req, res) => {
  const { salaId, valor } = req.body;

  if (!salaId || !valor) {
    return res.status(400).json({ msg: 'salaId y valor requeridos' });
  }

  if (valor < 1 || valor > 5) {
    return res.status(400).json({ msg: 'El valor debe estar entre 1 y 5' });
  }

  try {
    // Verificar que la sala existe y no tiene bloqueadas las calificaciones
    const sala = await Sala.findByPk(salaId);
    
    if (!sala) {
      return res.status(404).json({ msg: 'Sala no encontrada' });
    }

    if (sala.bloquearCalificaciones) {
      return res.status(403).json({ msg: 'Calificaciones bloqueadas para esta sala' });
    }

    // Verificar que el usuario haya comprado un boleto para una función en esta sala
    const boletoEnSala = await Boleto.findOne({
      where: {
        usuarioId: req.usuario.id,
        salaId: salaId
      }
    });

    if (!boletoEnSala) {
      return res.status(403).json({
        msg: 'Debes haber asistido a esta sala para calificarla'
      });
    }

    // Buscar calificación existente
    let existente = await Calificacion.findOne({
      where: {
        usuarioId: req.usuario.id,
        salaId: salaId,
        tipo: 'sala'
      }
    });

    if (existente) {
      await existente.update({ valor });
      return res.json({
        msg: 'Calificación de sala actualizada',
        calificacion: existente
      });
    }

    // Crear nueva calificación
    const nueva = await Calificacion.create({
      usuarioId: req.usuario.id,
      salaId,
      tipo: 'sala',
      valor
    });

    res.json({
      msg: 'Calificación de sala guardada',
      calificacion: nueva
    });
  } catch (error) {
    console.error('Error calificando sala:', error);
    res.status(500).json({
      msg: 'Error al calificar la sala',
      error: error.message
    });
  }
};
