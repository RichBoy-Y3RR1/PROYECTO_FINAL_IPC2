import Sala from '../modelos/sala.modelo.js';
import Funcion from '../modelos/funcion.modelo.js';
import Pelicula from '../modelos/pelicula.modelo.js';
import Cine from '../modelos/cine.modelo.js';
import BloqueoAnuncio from '../modelos/bloqueoanuncio.modelo.js';
import Anuncio from '../modelos/anuncio.modelo.js';
import Cartera from '../modelos/cartera.modelo.js';
import Pago from '../modelos/pago.modelo.js';


export const listarMisSalas = async (req, res) => {
  try {
    const cineId = req.usuario.cineId;

    if (!cineId) {
      return res.status(400).json({ msg: 'Usuario no tiene cine asignado' });
    }

    const salas = await Sala.findAll({
      where: { cineId },
      include: [{
        model: Cine,
        attributes: ['nombre']
      }],
      order: [['numero', 'ASC']]
    });

    res.json(salas);
  } catch (error) {
    console.error('Error listando salas:', error);
    res.status(500).json({ error: error.message });
  }
};

export const crearSala = async (req, res) => {
  try {
    const cineId = req.usuario.cineId;
    const { nombre, capacidad, tipo, numero } = req.body;

    if (!cineId) {
      return res.status(400).json({ msg: 'Usuario no tiene cine asignado' });
    }

    if (!nombre || !capacidad) {
      return res.status(400).json({ msg: 'Nombre y capacidad son requeridos' });
    }

    const sala = await Sala.create({
      nombre,
      capacidad,
      tipo: tipo || 'Normal',
      numero: numero || 1,
      cineId,
      visiblePublica: true,
      bloquearComentarios: false,
      bloquearCalificaciones: false
    });

    res.json({ msg: 'Sala creada exitosamente', sala });
  } catch (error) {
    console.error('Error creando sala:', error);
    res.status(500).json({ error: error.message });
  }
};

export const actualizarSala = async (req, res) => {
  try {
    const { id } = req.params;
    const cineId = req.usuario.cineId;
    const { nombre, capacidad, tipo, numero, visiblePublica, bloquearComentarios, bloquearCalificaciones } = req.body;

    const sala = await Sala.findByPk(id);

    if (!sala) {
      return res.status(404).json({ msg: 'Sala no encontrada' });
    }

    if (sala.cineId !== cineId) {
      return res.status(403).json({ msg: 'No puedes editar salas de otros cines' });
    }

    await sala.update({
      nombre: nombre || sala.nombre,
      capacidad: capacidad || sala.capacidad,
      tipo: tipo || sala.tipo,
      numero: numero !== undefined ? numero : sala.numero,
      visiblePublica: visiblePublica !== undefined ? visiblePublica : sala.visiblePublica,
      bloquearComentarios: bloquearComentarios !== undefined ? bloquearComentarios : sala.bloquearComentarios,
      bloquearCalificaciones: bloquearCalificaciones !== undefined ? bloquearCalificaciones : sala.bloquearCalificaciones
    });

    res.json({ msg: 'Sala actualizada', sala });
  } catch (error) {
    console.error('Error actualizando sala:', error);
    res.status(500).json({ error: error.message });
  }
};

export const eliminarSala = async (req, res) => {
  try {
    const { id } = req.params;
    const cineId = req.usuario.cineId;

    const sala = await Sala.findByPk(id);

    if (!sala) {
      return res.status(404).json({ msg: 'Sala no encontrada' });
    }

    if (sala.cineId !== cineId) {
      return res.status(403).json({ msg: 'No puedes eliminar salas de otros cines' });
    }

    // Verificar si tiene funciones activas
    const funcionesActivas = await Funcion.count({
      where: { salaId: id }
    });

    if (funcionesActivas > 0) {
      return res.status(400).json({
        msg: 'No se puede eliminar una sala con funciones asignadas'
      });
    }

    await sala.destroy();
    res.json({ msg: 'Sala eliminada exitosamente' });
  } catch (error) {
    console.error('Error eliminando sala:', error);
    res.status(500).json({ error: error.message });
  }
};

// ASIGNAR PELÍCULAS A SALAS 
export const crearFuncion = async (req, res) => {
  try {
    const cineId = req.usuario.cineId;
    const { peliculaId, salaId, fecha, hora, precio } = req.body;

    if (!peliculaId || !salaId || !fecha || !hora || !precio) {
      return res.status(400).json({ msg: 'Faltan campos requeridos' });
    }

    // Verificar que la sala pertenezca al cine del admin
    const sala = await Sala.findByPk(salaId);
    if (!sala || sala.cineId !== cineId) {
      return res.status(403).json({ msg: 'Sala no válida para este cine' });
    }

    const funcion = await Funcion.create({
      peliculaId,
      salaId,
      cineId,
      fecha,
      hora,
      precio
    });

    const funcionCompleta = await Funcion.findByPk(funcion.id, {
      include: [
        { model: Pelicula, as: 'pelicula', attributes: ['titulo'] },
        { model: Sala, as: 'sala', attributes: ['nombre'] }
      ]
    });

    res.json({
      msg: 'Función creada exitosamente',
      funcion: funcionCompleta
    });
  } catch (error) {
    console.error('Error creando función:', error);
    res.status(500).json({ error: error.message });
  }
};

// Listar funciones del cine
export const listarMisFunciones = async (req, res) => {
  try {
    const cineId = req.usuario.cineId;

    const funciones = await Funcion.findAll({
      where: { cineId },
      include: [
        { model: Pelicula, as: 'pelicula', attributes: ['titulo', 'clasificacion'] },
        { model: Sala, as: 'sala', attributes: ['nombre', 'tipo'] }
      ],
      order: [['fecha', 'ASC'], ['hora', 'ASC']]
    });

    res.json(funciones);
  } catch (error) {
    console.error('Error listando funciones:', error);
    res.status(500).json({ error: error.message });
  }
};

// BLOQUEAR ANUNCIOS 
export const bloquearAnuncio = async (req, res) => {
  try {
    console.log('=== BLOQUEAR ANUNCIO ===');
    console.log('Usuario:', req.usuario);
    console.log('Body:', req.body);
    
    const cineId = req.usuario.cineId;
    const { anuncioId, dias = 7 } = req.body;

    console.log('CineId:', cineId, 'AnuncioId:', anuncioId, 'Dias:', dias);

    if (!cineId) {
      console.log('ERROR: Cine no asociado');
      return res.status(400).json({ msg: 'Cine no asociado al usuario', codigo: 'CINE_NO_ASIGNADO' });
    }
    if (!anuncioId) {
      console.log('ERROR: anuncioId faltante');
      return res.status(400).json({ msg: 'anuncioId requerido', codigo: 'ANUNCIO_ID_FALTANTE' });
    }
    if (dias <= 0) {
      console.log('ERROR: dias invalidos');
      return res.status(400).json({ msg: 'Cantidad de días inválida', codigo: 'DIAS_INVALIDOS' });
    }

    console.log('Buscando anuncio...');
    const anuncio = await Anuncio.findByPk(anuncioId);
    console.log('Anuncio encontrado:', anuncio ? 'SI' : 'NO');
    
    if (!anuncio) {
      return res.status(404).json({ msg: 'Anuncio no encontrado', codigo: 'ANUNCIO_NO_EXISTE' });
    }

    console.log('Verificando si ya está bloqueado...');
    const yaBloqueado = await BloqueoAnuncio.findOne({ where: { cineId, anuncioId } });
    console.log('Ya bloqueado:', yaBloqueado ? 'SI' : 'NO');
    
    if (yaBloqueado) {
      return res.status(400).json({ msg: 'Este anuncio ya está bloqueado para tu cine', codigo: 'ANUNCIO_YA_BLOQUEADO' });
    }

   
    const fechaHoy = new Date().toISOString().split('T')[0]; // Solo fecha YYYY-MM-DD
    console.log('Creando bloqueo con fecha:', fechaHoy);

    const bloqueo = await BloqueoAnuncio.create({
      cineId,
      anuncioId,
      fechaInicio: fechaHoy,
      dias,
      montoPagado: 0
    });

    console.log('Bloqueo creado exitosamente:', bloqueo.id);

    res.json({
      msg: 'Anuncio bloqueado sin costo',
      bloqueo,
      costoDia: 0,
      montoPagado: 0
    });
  } catch (error) {
    console.error('ERROR COMPLETO bloqueando anuncio:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({ error: error.message, codigo: 'ERROR_INTERNO_BLOQUEO' });
  }
};


export const verAnunciosBloqueados = async (req, res) => {
  try {
    const cineId = req.usuario.cineId;
    if (!cineId) {
      return res.status(400).json({ msg: 'Cine no asociado al usuario' });
    }
    const bloqueados = await BloqueoAnuncio.findAll({
      where: { cineId },
      include: [
        {
          model: Anuncio,
          as: 'anuncio',
          attributes: ['id', 'titulo', 'tipo', 'activo', 'usuarioAnuncianteId']
        }
      ],
      order: [['fechaInicio', 'DESC']]
    });

    res.json(bloqueados);
  } catch (error) {
    console.error('Error listando anuncios bloqueados:', error);
    res.status(500).json({ error: error.message });
  }
};

export const toggleBloqueoComentarios = async (req, res) => {
  try {
    const { id } = req.params;
    const cineId = req.usuario.cineId;
    const { bloquear } = req.body;

    const sala = await Sala.findByPk(id);

    if (!sala || sala.cineId !== cineId) {
      return res.status(403).json({ msg: 'Sala no válida' });
    }

    await sala.update({ bloquearComentarios: bloquear });

    res.json({
      msg: `Comentarios ${bloquear ? 'bloqueados' : 'desbloqueados'}`,
      sala
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// CONTROLAR VISIBILIDAD
export const toggleVisibilidad = async (req, res) => {
  try {
    const { id } = req.params;
    const cineId = req.usuario.cineId;
    const { visible } = req.body;

    const sala = await Sala.findByPk(id);

    if (!sala || sala.cineId !== cineId) {
      return res.status(403).json({ msg: 'Sala no válida' });
    }

    await sala.update({ visiblePublica: visible });

    res.json({
      msg: `Sala ${visible ? 'visible' : 'oculta'} al público`,
      sala
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};


export const estadisticasCine = async (req, res) => {
  try {
    const cineId = req.usuario.cineId;

    const totalSalas = await Sala.count({ where: { cineId } });
    const totalFunciones = await Funcion.count({ where: { cineId } });
    const anunciosBloqueados = await BloqueoAnuncio.count({ where: { cineId } });

    res.json({
      totalSalas,
      totalFunciones,
      anunciosBloqueados
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};
