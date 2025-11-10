// controladores/notificaciones.controlador.js
import Notificacion from '../modelos/notificacion.modelo.js';
import Anuncio from '../modelos/anuncio.modelo.js';

// Obtener notificaciones del usuario autenticado
export const misNotificaciones = async (req, res) => {
  try {
    const notificaciones = await Notificacion.findAll({
      where: { usuarioId: req.usuario.id },
      include: [{
        model: Anuncio,
        as: 'anuncio',
        attributes: ['id', 'titulo', 'tipo']
      }],
      order: [['createdAt', 'DESC']],
      limit: 50 // Últimas 50 notificaciones
    });

    const noLeidas = notificaciones.filter(n => !n.leida).length;

    res.json({
      notificaciones,
      noLeidas,
      total: notificaciones.length
    });
  } catch (error) {
    console.error('Error obteniendo notificaciones:', error);
    res.status(500).json({ error: error.message });
  }
};

// Marcar notificación como leída
export const marcarLeida = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notificacion = await Notificacion.findOne({
      where: {
        id,
        usuarioId: req.usuario.id
      }
    });

    if (!notificacion) {
      return res.status(404).json({ msg: 'Notificación no encontrada' });
    }

    await notificacion.update({ leida: true });
    res.json({ msg: 'Notificación marcada como leída', notificacion });
  } catch (error) {
    console.error('Error marcando notificación:', error);
    res.status(500).json({ error: error.message });
  }
};

// Marcar todas como leídas
export const marcarTodasLeidas = async (req, res) => {
  try {
    await Notificacion.update(
      { leida: true },
      { where: { usuarioId: req.usuario.id, leida: false } }
    );

    res.json({ msg: 'Todas las notificaciones marcadas como leídas' });
  } catch (error) {
    console.error('Error marcando notificaciones:', error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar notificación
export const eliminarNotificacion = async (req, res) => {
  try {
    const { id } = req.params;

    const notificacion = await Notificacion.findOne({
      where: {
        id,
        usuarioId: req.usuario.id
      }
    });

    if (!notificacion) {
      return res.status(404).json({ msg: 'Notificación no encontrada' });
    }

    await notificacion.destroy();
    res.json({ msg: 'Notificación eliminada' });
  } catch (error) {
    console.error('Error eliminando notificación:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener contador de notificaciones no leídas
export const contadorNoLeidas = async (req, res) => {
  try {
    const count = await Notificacion.count({
      where: {
        usuarioId: req.usuario.id,
        leida: false
      }
    });

    res.json({ noLeidas: count });
  } catch (error) {
    console.error('Error obteniendo contador:', error);
    res.status(500).json({ error: error.message });
  }
};
