// controladores/anuncio.controlador.js
import Anuncio from '../modelos/anuncio.modelo.js';
import Usuario from '../modelos/usuario.modelo.js';
import Cartera from '../modelos/cartera.modelo.js';
import Pago from '../modelos/pago.modelo.js';
import { Op } from 'sequelize';
import ConfigAnuncio from '../modelos/config-anuncio.modelo.js';

// Calcular costo de anuncio según tipo y duración
function mapTipo(tipo) {
  // Compatibilidad: mapear tipos legacy a los del requerimiento
  if (tipo === 'imagen' || tipo === 'banner' || tipo === 'mixto') return 'texto-imagen';
  if (tipo === 'video') return 'video-texto';
  return tipo; // 'texto' o ya normalizado
}

async function calcularCostoAnuncio(tipo, duracionDias) {
  const t = mapTipo(tipo);
  const config = await ConfigAnuncio.findOne();
  const precios = config?.preciosAnuncios || { texto: 25, ['texto-imagen']: 50, ['video-texto']: 100 };
  const precioTipo = precios[t] ?? precios['texto'];
  return (precioTipo || 25) * duracionDias;
}

// CREAR ANUNCIO (Usuario Anunciante)
export const crearAnuncio = async (req, res) => {
  try {
    const { titulo, contenido, tipo, imagenUrl, videoUrl, enlaceUrl, duracionDias, destinatarios } = req.body;

    if (!titulo || !contenido || !tipo || !duracionDias) {
      return res.status(400).json({ msg: 'Faltan campos requeridos' });
    }

    // Validar duración permitida
    const duracionesPermitidas = [1, 3, 7, 14];
    if (!duracionesPermitidas.includes(Number(duracionDias))) {
      return res.status(400).json({ msg: 'Duración inválida. Use 1, 3, 7 o 14 días.' });
    }

    // Normalizar tipo solicitado antes de calcular costo
    const tipoNormalizado = mapTipo(tipo);

    // Validar URLs según el tipo de anuncio
    if (tipoNormalizado === 'texto-imagen' && imagenUrl && imagenUrl.trim()) {
      const urlPattern = /^https?:\/\/.+/i;
      if (!urlPattern.test(imagenUrl.trim())) {
        return res.status(400).json({ msg: 'La URL de la imagen debe comenzar con http:// o https://' });
      }
    }

    if (tipoNormalizado === 'video-texto' && videoUrl && videoUrl.trim()) {
      const urlPattern = /^https?:\/\/.+/i;
      if (!urlPattern.test(videoUrl.trim())) {
        return res.status(400).json({ msg: 'La URL del video debe comenzar con http:// o https://' });
      }
    }

    // Calcular costo basado en configuración
    const costo = await calcularCostoAnuncio(tipoNormalizado, duracionDias);
    const costoOcultacion = 0; // Sin costo para bloquear

    // Verificar saldo
    const cartera = await Cartera.findOne({ where: { usuarioId: req.usuario.id } });
    if (!cartera || cartera.saldo < costo) {
      return res.status(400).json({
        msg: `Saldo insuficiente. Costo: Q${costo.toFixed(2)}, Saldo: Q${cartera?.saldo.toFixed(2) || 0}`
      });
    }

    // Descontar saldo
    cartera.saldo -= costo;
    await cartera.save();

    // Calcular fechas
    const fechaInicio = new Date();
    const fechaFin = new Date();
    fechaFin.setDate(fechaFin.getDate() + duracionDias);

    // Crear anuncio con campos opcionales manejados correctamente
    const anuncio = await Anuncio.create({
      titulo,
      contenido,
      tipo: tipoNormalizado,
      texto: contenido,
      imagenUrl: (imagenUrl && imagenUrl.trim()) ? imagenUrl.trim() : null,
      videoUrl: (videoUrl && videoUrl.trim()) ? videoUrl.trim() : null,
      enlaceUrl: (enlaceUrl && enlaceUrl.trim()) ? enlaceUrl.trim() : null,
      costo,
      costoOcultacion,
      duracionDias,
      fechaInicio,
      fechaFin,
      activo: true,
      aprobado: false, // Requiere aprobación de admin
      usuarioAnuncianteId: req.usuario.id,
      destinatarios: destinatarios || 'todos',
      impresiones: 0,
      clics: 0
    });

    // Registrar pago
    await Pago.create({
      usuarioId: req.usuario.id,
      boletoId: null,
      monto: costo,
      metodo: 'cartera',
      fechaPago: new Date(),
      concepto: `Anuncio: ${titulo}`
    });

    res.json({
      msg: 'Anuncio creado exitosamente. Pendiente de aprobación.',
      anuncio,
      costoTotal: costo,
      saldoRestante: cartera.saldo
    });
  } catch (error) {
    console.error('Error crearAnuncio:', error);
    res.status(500).json({ error: error.message });
  }
};

// LISTAR MIS ANUNCIOS (Usuario Anunciante)
export const misAnuncios = async (req, res) => {
  try {
    const anuncios = await Anuncio.findAll({
      where: { usuarioAnuncianteId: req.usuario.id },
      order: [['createdAt', 'DESC']],
      include: [{
        model: Usuario,
        as: 'anunciante',
        attributes: ['nombre', 'correo']
      }]
    });
    res.json(anuncios);
  } catch (error) {
    console.error('Error misAnuncios:', error);
    res.status(500).json({ error: error.message });
  }
};

// EDITAR ANUNCIO (Solo si no está aprobado)
export const editarAnuncio = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, contenido, imagenUrl, videoUrl, enlaceUrl } = req.body;

    const anuncio = await Anuncio.findByPk(id);
    if (!anuncio) {
      return res.status(404).json({ msg: 'Anuncio no encontrado' });
    }

    if (anuncio.usuarioAnuncianteId !== req.usuario.id) {
      return res.status(403).json({ msg: 'No puedes editar anuncios de otros usuarios' });
    }

    if (anuncio.aprobado) {
      return res.status(400).json({ msg: 'No puedes editar anuncios ya aprobados' });
    }

    await anuncio.update({
      titulo: titulo || anuncio.titulo,
      contenido: contenido || anuncio.contenido,
      texto: contenido || anuncio.contenido,
      imagenUrl: imagenUrl !== undefined ? imagenUrl : anuncio.imagenUrl,
      videoUrl: videoUrl !== undefined ? videoUrl : anuncio.videoUrl,
      enlaceUrl: enlaceUrl !== undefined ? enlaceUrl : anuncio.enlaceUrl
    });

    res.json({ msg: 'Anuncio actualizado', anuncio });
  } catch (error) {
    console.error('Error editarAnuncio:', error);
    res.status(500).json({ error: error.message });
  }
};

// ELIMINAR ANUNCIO (Usuario Anunciante)
export const eliminarAnuncio = async (req, res) => {
  try {
    const { id } = req.params;
    const anuncio = await Anuncio.findByPk(id);

    if (!anuncio) {
      return res.status(404).json({ msg: 'Anuncio no encontrado' });
    }

    if (anuncio.usuarioAnuncianteId !== req.usuario.id) {
      return res.status(403).json({ msg: 'No puedes eliminar anuncios de otros usuarios' });
    }

    await anuncio.destroy();
    res.json({ msg: 'Anuncio eliminado' });
  } catch (error) {
    console.error('Error eliminarAnuncio:', error);
    res.status(500).json({ error: error.message });
  }
};

// ANUNCIOS VIGENTES (Público o filtrado por destinatario)
export const anunciosVigentes = async (req, res) => {
  try {
    const hoy = new Date();
    const { destinatario } = req.query;

    const whereClause = {
      activo: true,
      aprobado: true,
      fechaInicio: { [Op.lte]: hoy },
      fechaFin: { [Op.gte]: hoy }
    };

    if (destinatario && destinatario !== 'todos') {
      whereClause.destinatarios = {
        [Op.in]: [destinatario, 'todos']
      };
    }

    // Desactivar expirados en segundo plano simple
    await Anuncio.update({ activo: false }, { where: { fechaFin: { [Op.lt]: hoy } } });

    const anuncios = await Anuncio.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      include: [{
        model: Usuario,
        as: 'anunciante',
        attributes: ['nombre', 'correo']
      }]
    });

    res.json(anuncios);
  } catch (error) {
    console.error('Error anunciosVigentes:', error);
    res.status(500).json({ error: error.message });
  }
};

// Registrar clic en anuncio
export const registrarClick = async (req, res) => {
  try {
    const { id } = req.params;
    const anuncio = await Anuncio.findByPk(id);
    if (!anuncio) return res.status(404).json({ msg: 'Anuncio no encontrado' });
    anuncio.clics = (anuncio.clics || 0) + 1;
    await anuncio.save();
    res.json({ ok: true, clics: anuncio.clics });
  } catch (error) {
    console.error('Error registrarClick:', error);
    res.status(500).json({ error: error.message });
  }
};

// Registrar impresiones (batch)
export const registrarImpresiones = async (req, res) => {
  try {
    const { ids } = req.body; // [id]
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ msg: 'Debe enviar un arreglo de ids' });
    }
    await Anuncio.increment({ impresiones: 1 }, { where: { id: { [Op.in]: ids } } });
    res.json({ ok: true });
  } catch (error) {
    console.error('Error registrarImpresiones:', error);
    res.status(500).json({ error: error.message });
  }
};

// LISTAR TODOS LOS ANUNCIOS (Admin)
export const listarAnuncios = async (req, res) => {
  try {
    const anuncios = await Anuncio.findAll({
      order: [['createdAt', 'DESC']],
      include: [{
        model: Usuario,
        as: 'anunciante',
        attributes: ['nombre', 'correo']
      }]
    });
    res.json(anuncios);
  } catch (error) {
    console.error('Error listarAnuncios:', error);
    res.status(500).json({ error: error.message });
  }
};

// APROBAR ANUNCIO (Admin General)
export const aprobarAnuncio = async (req, res) => {
  try {
    const { id } = req.params;
    const anuncio = await Anuncio.findByPk(id);

    if (!anuncio) {
      return res.status(404).json({ msg: 'Anuncio no encontrado' });
    }

    await anuncio.update({ aprobado: true, activo: true });
    res.json({ msg: 'Anuncio aprobado', anuncio });
  } catch (error) {
    console.error('Error aprobarAnuncio:', error);
    res.status(500).json({ error: error.message });
  }
};

// DESACTIVAR ANUNCIO (Admin General)
export const desactivarAnuncio = async (req, res) => {
  try {
    const { id } = req.params;
    const { razon } = req.body;

    const anuncio = await Anuncio.findByPk(id);
    if (!anuncio) {
      return res.status(404).json({ msg: 'Anuncio no encontrado' });
    }

    // Seguridad: solo admin-general o propietario pueden desactivar
    const esAdminGeneral = req.usuario?.tipo === 'admin-general';
    const esPropietario = anuncio.usuarioAnuncianteId === req.usuario?.id;
    if (!esAdminGeneral && !esPropietario) {
      return res.status(403).json({ msg: 'No autorizado para desactivar este anuncio' });
    }

    await anuncio.update({ activo: false });
    res.json({ msg: `Anuncio desactivado${razon ? `: ${razon}` : ''}` });
  } catch (error) {
    console.error('Error desactivarAnuncio:', error);
    res.status(500).json({ error: error.message });
  }
};
