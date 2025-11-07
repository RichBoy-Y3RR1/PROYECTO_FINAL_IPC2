// backend/modelos/asociaciones.js

import Usuario from './usuario.modelo.js';
import Pelicula from './pelicula.modelo.js';
import Cine from './cine.modelo.js';
import Sala from './sala.modelo.js';
import Funcion from './funcion.modelo.js';
import Boleto from './boleto.modelo.js';
import Pago from './pago.modelo.js';
import Cartera from './cartera.modelo.js';
import BloqueoAnuncio from './bloqueoanuncio.modelo.js';
import CostoCine from './costocine.modelo.js';
import Comentario from './comentario.modelo.js';
import Calificacion from './calificacion.modelo.js';

/* ---- CINE Y SALAS ---- */
Cine.hasMany(Sala, { foreignKey: 'cineId' });
Sala.belongsTo(Cine, { foreignKey: 'cineId' });

/* ---- FUNCION RELACIONES ---- */
Funcion.belongsTo(Pelicula, { foreignKey: 'peliculaId', as: 'pelicula' });
Funcion.belongsTo(Cine, { foreignKey: 'cineId', as: 'cine' });
Funcion.belongsTo(Sala, { foreignKey: 'salaId', as: 'sala' });

Pelicula.hasMany(Funcion, { foreignKey: 'peliculaId', as: 'funciones' });
Cine.hasMany(Funcion, { foreignKey: 'cineId', as: 'funciones' });
Sala.hasMany(Funcion, { foreignKey: 'salaId', as: 'funciones' });

/* ---- BOLETOS ---- */
Boleto.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'comprador' });
Boleto.belongsTo(Funcion, { foreignKey: 'funcionId', as: 'funcion' });
Boleto.belongsTo(Pelicula, { foreignKey: 'peliculaId', as: 'peliculaComprada' });
Boleto.belongsTo(Cine, { foreignKey: 'cineId', as: 'cineComprado' });

Usuario.hasMany(Boleto, { foreignKey: 'usuarioId', as: 'boletos' });

/* ---- PAGOS ---- */
Pago.belongsTo(Usuario, { foreignKey: 'usuarioId' });
Pago.belongsTo(Boleto, { foreignKey: 'boletoId' });

Usuario.hasMany(Pago, { foreignKey: 'usuarioId' });
Boleto.hasMany(Pago, { foreignKey: 'boletoId' });

/* ---- CARTERA ---- */
Usuario.hasOne(Cartera, { foreignKey: 'usuarioId' });
Cartera.belongsTo(Usuario, { foreignKey: 'usuarioId' });

/* ---- BLOQUEO ANUNCIOS ---- */
Cine.hasMany(BloqueoAnuncio, { foreignKey: 'cineId' });
BloqueoAnuncio.belongsTo(Cine, { foreignKey: 'cineId' });

/* ---- COSTOS CINE ---- */
Cine.hasMany(CostoCine, { foreignKey: 'cineId' });
CostoCine.belongsTo(Cine, { foreignKey: 'cineId' });

/* ---- COMENTARIOS & CALIFICACIONES ---- */
Usuario.hasMany(Comentario, { foreignKey: 'usuarioId' });
Comentario.belongsTo(Usuario, { foreignKey: 'usuarioId' });
Sala.hasMany(Comentario, { foreignKey: 'salaId' });
Comentario.belongsTo(Sala, { foreignKey: 'salaId' });

Usuario.hasMany(Calificacion, { foreignKey: 'usuarioId' });
Calificacion.belongsTo(Usuario, { foreignKey: 'usuarioId' });
Sala.hasMany(Calificacion, { foreignKey: 'salaId' });
Calificacion.belongsTo(Sala, { foreignKey: 'salaId' });

/* ✅ Exportar todos los modelos juntos */
export default {
  Usuario,
  Pelicula,
  Cine,
  Sala,
  Funcion,
  Boleto,
  Pago,
  Cartera,
  BloqueoAnuncio,
  CostoCine,
  Comentario,
  Calificacion
};
