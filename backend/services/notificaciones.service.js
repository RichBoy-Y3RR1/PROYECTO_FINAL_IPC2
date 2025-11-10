// services/notificaciones.service.js
import Notificacion from '../modelos/notificacion.modelo.js';

export const crearNotificacion = async (usuarioId, tipo, titulo, mensaje, anuncioId = null) => {
  try {
    const notificacion = await Notificacion.create({
      usuarioId,
      tipo,
      titulo,
      mensaje,
      anuncioId,
      leida: false
    });
    return notificacion;
  } catch (error) {
    console.error('Error creando notificación:', error);
    throw error;
  }
};

export const notificarAprobacionAnuncio = async (anuncio) => {
  return await crearNotificacion(
    anuncio.usuarioAnuncianteId,
    'anuncio_aprobado',
    '✅ Anuncio Aprobado',
    `Tu anuncio "${anuncio.titulo}" ha sido aprobado y ya está publicado.`,
    anuncio.id
  );
};

export const notificarRechazoAnuncio = async (anuncio, motivo = '') => {
  const mensaje = `Tu anuncio "${anuncio.titulo}" ha sido rechazado.${motivo ? ` Motivo: ${motivo}` : ''}`;
  return await crearNotificacion(
    anuncio.usuarioAnuncianteId,
    'anuncio_rechazado',
    '❌ Anuncio Rechazado',
    mensaje,
    anuncio.id
  );
};

export const notificarExpiracionAnuncio = async (anuncio) => {
  return await crearNotificacion(
    anuncio.usuarioAnuncianteId,
    'anuncio_expirado',
    '⏰ Anuncio Expirado',
    `Tu anuncio "${anuncio.titulo}" ha llegado a su fecha de finalización y ha sido desactivado.`,
    anuncio.id
  );
};
