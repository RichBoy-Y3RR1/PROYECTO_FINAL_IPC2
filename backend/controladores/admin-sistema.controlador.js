import Cine from '../modelos/cine.modelo.js';
import Pelicula from '../modelos/pelicula.modelo.js';
import Anuncio from '../modelos/anuncio.modelo.js';
import ConfigAnuncio from '../modelos/config-anuncio.modelo.js';
// Unificar import para evitar esquemas contradictorios
import CostoCine from '../modelos/costocine.modelo.js';
import Usuario from '../modelos/usuario.modelo.js';
import Cartera from '../modelos/cartera.modelo.js';
import Pago from '../modelos/pago.modelo.js';
import Sala from '../modelos/sala.modelo.js';
import Funcion from '../modelos/funcion.modelo.js';
import { notificarAprobacionAnuncio, notificarRechazoAnuncio } from '../services/notificaciones.service.js';

// ============================================
// CRUD CINES (4 pts)
// ============================================

// Listar todos los cines
export const listarCines = async (req, res) => {
  try {
    const cines = await Cine.findAll({
      include: [
        {
          model: Sala,
          attributes: ['id', 'nombre']
        }
      ],
      order: [['nombre', 'ASC']]
    });

    res.json(cines);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al listar cines' });
  }
};

// Crear cine
export const crearCine = async (req, res) => {
  try {
    const { nombre, ubicacion, telefono, email } = req.body;

    if (!nombre || !ubicacion) {
      return res.status(400).json({ msg: 'Nombre y ubicación son requeridos' });
    }

    const cine = await Cine.create({
      nombre,
      ubicacion,
      telefono,
      email
    });

    res.json({ msg: 'Cine creado exitosamente', cine });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al crear cine' });
  }
};

// Actualizar cine
export const actualizarCine = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, ubicacion, telefono, email } = req.body;

    const cine = await Cine.findByPk(id);
    if (!cine) {
      return res.status(404).json({ msg: 'Cine no encontrado' });
    }

    await cine.update({ nombre, ubicacion, telefono, email });

    res.json({ msg: 'Cine actualizado exitosamente', cine });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar cine' });
  }
};

// Eliminar cine
export const eliminarCine = async (req, res) => {
  try {
    const { id } = req.params;

    const cine = await Cine.findByPk(id);
    if (!cine) {
      return res.status(404).json({ msg: 'Cine no encontrado' });
    }

    // Verificar que no tenga salas activas
    const salasCount = await Sala.count({ where: { cineId: id } });
    if (salasCount > 0) {
      return res.status(400).json({
        msg: `No se puede eliminar. El cine tiene ${salasCount} salas asociadas`
      });
    }

    await cine.destroy();

    res.json({ msg: 'Cine eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar cine' });
  }
};

// ============================================
// CRUD PELÍCULAS
// ============================================

// Listar todas las películas
export const listarPeliculas = async (req, res) => {
  try {
    const peliculas = await Pelicula.findAll({
      order: [['titulo', 'ASC']]
    });

    res.json(peliculas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al listar películas' });
  }
};

// Crear película
export const crearPelicula = async (req, res) => {
  try {
    const {
      titulo,
      sinopsis,
      duracion,
      genero,
      clasificacion,
      director,
      actores,
      fechaEstreno,
      imagenUrl,
      trailerUrl
    } = req.body;

    if (!titulo || !sinopsis || !duracion || !genero) {
      return res.status(400).json({ msg: 'Título, sinopsis, duración y género son requeridos' });
    }

    const pelicula = await Pelicula.create({
      titulo,
      sinopsis,
      duracion,
      genero,
      clasificacion: clasificacion || 'TE',
      director,
      actores,
      fechaEstreno,
      imagenUrl,
      trailerUrl
    });

    res.json({ msg: 'Película creada exitosamente', pelicula });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al crear película' });
  }
};

// Actualizar película
export const actualizarPelicula = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    const pelicula = await Pelicula.findByPk(id);
    if (!pelicula) {
      return res.status(404).json({ msg: 'Película no encontrada' });
    }

    await pelicula.update(datos);

    res.json({ msg: 'Película actualizada exitosamente', pelicula });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar película' });
  }
};

// Eliminar película
export const eliminarPelicula = async (req, res) => {
  try {
    const { id } = req.params;

    const pelicula = await Pelicula.findByPk(id);
    if (!pelicula) {
      return res.status(404).json({ msg: 'Película no encontrada' });
    }

    // Verificar que no tenga funciones programadas futuras
    const funcionesFuturas = await Funcion.count({
      where: {
        peliculaId: id,
        fecha: {
          [require('sequelize').Op.gte]: new Date()
        }
      }
    });

    if (funcionesFuturas > 0) {
      return res.status(400).json({
        msg: `No se puede eliminar. La película tiene ${funcionesFuturas} funciones programadas`
      });
    }

    await pelicula.destroy();

    res.json({ msg: 'Película eliminada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar película' });
  }
};

// ============================================
// GESTIONAR COSTOS OCULTACIÓN
// ============================================

export const configurarCostoOcultacion = async (req, res) => {
  try {
    const { porcentaje } = req.body;

    if (!porcentaje || porcentaje < 0 || porcentaje > 100) {
      return res.status(400).json({ msg: 'El porcentaje debe estar entre 0 y 100' });
    }

    // Buscar o crear configuración
    let config = await ConfigAnuncio.findOne();

    if (!config) {
      config = await ConfigAnuncio.create({
        porcentajeOcultacion: porcentaje,
        costoDiarioBase: 25
      });
    } else {
      await config.update({ porcentajeOcultacion: porcentaje });
    }

    res.json({
      msg: 'Costo de ocultación configurado exitosamente',
      porcentaje: config.porcentajeOcultacion
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al configurar costo de ocultación' });
  }
};

export const obtenerConfiguracion = async (req, res) => {
  try {
    let config = await ConfigAnuncio.findOne();

    if (!config) {
      config = await ConfigAnuncio.create({
        porcentajeOcultacion: 40,
        costoDiarioBase: 25
      });
    }

    res.json(config);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener configuración' });
  }
};

// ============================================
// CONFIGURAR PRECIOS ANUNCIOS
// ============================================

export const configurarPreciosAnuncios = async (req, res) => {
  try {
    const { precios } = req.body;
    // precios: { texto: 25, imagen: 50, video: 100, banner: 75, mixto: 80 }

    if (!precios || typeof precios !== 'object') {
      return res.status(400).json({ msg: 'Formato de precios inválido' });
    }

    let config = await ConfigAnuncio.findOne();

    if (!config) {
      config = await ConfigAnuncio.create({
        porcentajeOcultacion: 40,
        costoDiarioBase: 25,
        preciosAnuncios: precios
      });
    } else {
      await config.update({ preciosAnuncios: precios });
    }

    res.json({
      msg: 'Precios de anuncios configurados exitosamente',
      precios: config.preciosAnuncios
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al configurar precios de anuncios' });
  }
};

// ============================================
// GESTIONAR COSTOS DIARIOS
// ============================================

export const configurarCostoDiario = async (req, res) => {
  try {
    const { cineId, costo } = req.body;

    if (!cineId || !costo || costo < 0) {
      return res.status(400).json({ msg: 'Cine ID y costo válido son requeridos' });
    }

    const cine = await Cine.findByPk(cineId);
    if (!cine) {
      return res.status(404).json({ msg: 'Cine no encontrado' });
    }

    // Buscar o crear costo para el cine
    let costoCine = await CostoCine.findOne({ where: { cineId } });

    if (!costoCine) {
      costoCine = await CostoCine.create({
        cineId,
        costoDiario: costo
      });
    } else {
      await costoCine.update({ costoDiario: costo });
    }

    res.json({
      msg: 'Costo diario configurado exitosamente',
      cineId,
      costoDiario: costoCine.costoDiario
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al configurar costo diario' });
  }
};

export const listarCostosCines = async (req, res) => {
  try {
    const costos = await CostoCine.findAll({
      include: [
        {
          model: Cine,
          attributes: ['id', 'nombre', 'ubicacion']
        }
      ]
    });

    res.json(costos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al listar costos' });
  }
};

// ============================================
// DESACTIVAR ANUNCIOS
// ============================================

export const listarTodosAnuncios = async (req, res) => {
  try {
    const anuncios = await Anuncio.findAll({
      include: [
        {
          model: Usuario,
          as: 'anunciante',
          attributes: ['id', 'nombre', 'correo']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(anuncios);
  } catch (error) {
    console.error('Error listarTodosAnuncios:', error);
    res.status(500).json({ msg: 'Error al listar anuncios', error: error.message });
  }
};

export const aprobarAnuncio = async (req, res) => {
  try {
    const { id } = req.params;

    const anuncio = await Anuncio.findByPk(id);
    if (!anuncio) {
      return res.status(404).json({ msg: 'Anuncio no encontrado' });
    }

    await anuncio.update({ aprobado: true, activo: true });

    // Enviar notificación al anunciante
    try {
      await notificarAprobacionAnuncio(anuncio);
    } catch (notifError) {
      console.error('Error enviando notificación:', notifError);
      // No fallar la aprobación por error de notificación
    }

    res.json({ msg: 'Anuncio aprobado exitosamente', anuncio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al aprobar anuncio' });
  }
};

export const rechazarAnuncio = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body;

    const anuncio = await Anuncio.findByPk(id);
    if (!anuncio) {
      return res.status(404).json({ msg: 'Anuncio no encontrado' });
    }

    await anuncio.update({
      aprobado: false,
      activo: false
    });

    // Enviar notificación al anunciante con el motivo
    try {
      await notificarRechazoAnuncio(anuncio, motivo);
    } catch (notifError) {
      console.error('Error enviando notificación:', notifError);
      // No fallar el rechazo por error de notificación
    }

    res.json({
      msg: 'Anuncio rechazado',
      anuncio,
      motivo
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al rechazar anuncio' });
  }
};

export const desactivarAnuncio = async (req, res) => {
  try {
    const { id } = req.params;

    const anuncio = await Anuncio.findByPk(id);
    if (!anuncio) {
      return res.status(404).json({ msg: 'Anuncio no encontrado' });
    }

    await anuncio.update({ activo: false });

    res.json({ msg: 'Anuncio desactivado exitosamente', anuncio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al desactivar anuncio' });
  }
};

// ============================================
// ESTADÍSTICAS GENERALES
// ============================================

export const estadisticasGenerales = async (req, res) => {
  try {
    const totalCines = await Cine.count();
    const totalPeliculas = await Pelicula.count();
    const totalAnuncios = await Anuncio.count();
    const anunciosPendientes = await Anuncio.count({ where: { aprobado: false } });
    const anunciosActivos = await Anuncio.count({ where: { activo: true, aprobado: true } });
    const totalUsuarios = await Usuario.count();

    res.json({
      totalCines,
      totalPeliculas,
      totalAnuncios,
      anunciosPendientes,
      anunciosActivos,
      totalUsuarios
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener estadísticas' });
  }
};
