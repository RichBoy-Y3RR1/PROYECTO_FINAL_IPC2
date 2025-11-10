// controladores/comentario.controlador.js
import Comentario from '../modelos/comentario.modelo.js';
import Boleto from '../modelos/boleto.modelo.js';
import Sala from '../modelos/sala.modelo.js';
import Pelicula from '../modelos/pelicula.modelo.js';


export const crearComentario = async (req, res) => {
  const { tipo, referenciaId, peliculaId, salaId, texto } = req.body;
  const refId = referenciaId || peliculaId || salaId;

  if (!tipo || !refId || !texto) {
    return res.status(400).json({ msg: 'tipo, referenciaId/peliculaId/salaId y texto son requeridos' });
  }

  try {
    // Verificar que el usuario tenga al menos un boleto relacionado con el tipo
    let tieneAcceso = false;

    if (tipo === 'pelicula') {
      const boleto = await Boleto.findOne({
        where: {
          usuarioId: req.usuario.id,
          peliculaId: refId
        }
      });
      if (boleto) tieneAcceso = true;
    } else if (tipo === 'sala') {
      const boleto = await Boleto.findOne({
        where: {
          usuarioId: req.usuario.id,
          salaId: refId
        }
      });
      if (boleto) tieneAcceso = true;
    }

    if (!tieneAcceso) {
      return res.status(403).json({
        msg: 'Debes haber comprado un boleto para comentar'
      });
    }

    // Verificar bloqueo de comentarios en salas
    if (tipo === 'sala') {
      const sala = await Sala.findByPk(refId);
      if (!sala) {
        return res.status(404).json({ msg: 'Sala no encontrada' });
      }
      if (sala.bloquearComentarios) {
        return res.status(403).json({ msg: 'Comentarios bloqueados para esta sala' });
      }
    }

    // Crear el comentario
    const comentarioData = {
      usuarioId: req.usuario.id,
      tipo,
      texto
    };

    // Agregar el campo correcto según el tipo
    if (tipo === 'pelicula') {
      comentarioData.peliculaId = refId;
    } else if (tipo === 'sala') {
      comentarioData.salaId = refId;
    }

    const nuevo = await Comentario.create(comentarioData);

    res.json({
      msg: 'Comentario publicado exitosamente',
      comentario: nuevo
    });
  } catch (error) {
    console.error('Error creando comentario:', error);
    res.status(500).json({
      msg: 'Error al crear comentario',
      error: error.message
    });
  }
};
