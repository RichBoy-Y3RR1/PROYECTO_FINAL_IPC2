import Sala from '../modelos/sala.modelo.js';
import Cine from '../modelos/cine.modelo.js';
import Comentario from '../modelos/comentario.modelo.js';
import Calificacion from '../modelos/calificacion.modelo.js';
import Usuario from '../modelos/usuario.modelo.js';
import Funcion from '../modelos/funcion.modelo.js';
import Pelicula from '../modelos/pelicula.modelo.js';
import Boleto from '../modelos/boleto.modelo.js';
import { generateReport } from '../jasper/jasper-helper.js';
import { Op } from 'sequelize';
import sequelize from '../config/db.js';

// Reporte de comentarios de salas
export const reporteComentariosSalas = async (req, res) => {
  try {
    const cineId = req.usuario.cineId;
    const { fechaInicio, fechaFin } = req.query;

    if (!cineId) {
      return res.status(403).json({ msg: 'Usuario no asociado a un cine' });
    }

    // Obtener información del cine
    const cine = await Cine.findByPk(cineId);
    if (!cine) {
      return res.status(404).json({ msg: 'Cine no encontrado' });
    }

    // Query SQL directa para obtener comentarios de salas del cine
    const whereFecha = fechaInicio && fechaFin
      ? `AND c.createdAt BETWEEN '${fechaInicio}' AND '${fechaFin}'`
      : '';

    const comentarios = await sequelize.query(`
      SELECT
        c.id,
        c.texto as comentario_texto,
        c.createdAt as comentario_fecha,
        s.nombre as sala_nombre,
        s.tipo as sala_tipo,
        u.nombre as usuario_nombre,
        u.email as usuario_email
      FROM Comentarios c
      INNER JOIN Salas s ON s.id = c.salaId
      INNER JOIN Usuarios u ON u.id = c.usuarioId
      WHERE s.cineId = :cineId
        AND c.salaId IS NOT NULL
        ${whereFecha}
      ORDER BY c.createdAt DESC
    `, {
      replacements: { cineId },
      type: sequelize.QueryTypes.SELECT
    });

    // Transformar datos para Jasper
    const dataSource = comentarios.map(c => ({
      sala_nombre: c.sala_nombre || 'N/A',
      sala_tipo: c.sala_tipo || 'Normal',
      usuario_nombre: c.usuario_nombre || 'Anónimo',
      usuario_email: c.usuario_email || 'N/A',
      comentario_texto: c.comentario_texto,
      comentario_fecha: new Date(c.comentario_fecha).toISOString().split('T')[0]
    }));

    // Generar PDF con Jasper
    const pdfPath = await generateReport('comentarios-salas', {
      cineId,
      cineNombre: cine.nombre,
      fechaInicio: fechaInicio || 'Inicio',
      fechaFin: fechaFin || 'Actual'
    }, dataSource);

    // Descargar PDF
    res.download(pdfPath, `comentarios-salas-${cine.nombre}-${Date.now()}.pdf`, (err) => {
      if (err) {
        console.error('Error descargando PDF:', err);
      }
    });

  } catch (error) {
    console.error('Error generando reporte:', error);
    res.status(500).json({ msg: 'Error generando reporte de comentarios', error: error.message });
  }
};

// Reporte de películas proyectadas
export const reportePeliculasProyectadas = async (req, res) => {
  try {
    const cineId = req.usuario.cineId;
    const { fechaInicio, fechaFin } = req.query;

    if (!cineId) {
      return res.status(403).json({ msg: 'Usuario no asociado a un cine' });
    }

    const cine = await Cine.findByPk(cineId);
    if (!cine) {
      return res.status(404).json({ msg: 'Cine no encontrado' });
    }

    // Query que muestra TODAS las películas proyectadas, incluso sin boletos vendidos
    const whereFecha = fechaInicio && fechaFin
      ? `AND f.fecha BETWEEN '${fechaInicio}' AND '${fechaFin}'`
      : '';

    const resultados = await sequelize.query(`
      SELECT
        p.titulo as pelicula_titulo,
        p.genero as pelicula_genero,
        p.duracion as pelicula_duracion,
        s.nombre as sala_nombre,
        COUNT(DISTINCT f.id) as total_funciones,
        COUNT(b.id) as boletos_vendidos,
        COALESCE(SUM(b.precio), 0) as ingresos_totales,
        CASE 
          WHEN COUNT(b.id) > 0 THEN 'Vendidos'
          ELSE 'Sin Ventas'
        END as estado_venta
      FROM Peliculas p
      INNER JOIN Funcions f ON f.peliculaId = p.id
      INNER JOIN Salas s ON s.id = f.salaId
      LEFT JOIN Boletos b ON b.funcionId = f.id
      WHERE s.cineId = :cineId ${whereFecha}
      GROUP BY p.id, p.titulo, p.genero, p.duracion, s.id, s.nombre
      ORDER BY total_funciones DESC, boletos_vendidos DESC
    `, {
      replacements: { cineId },
      type: sequelize.QueryTypes.SELECT
    });

    const dataSource = resultados.map(r => ({
      pelicula_titulo: r.pelicula_titulo,
      pelicula_genero: r.pelicula_genero,
      pelicula_duracion: parseInt(r.pelicula_duracion),
      sala_nombre: r.sala_nombre,
      total_funciones: parseInt(r.total_funciones),
      boletos_vendidos: parseInt(r.boletos_vendidos),
      ingresos_totales: parseFloat(r.ingresos_totales),
      estado_venta: r.estado_venta
    }));

    const pdfPath = await generateReport('peliculas-proyectadas', {
      cineId,
      cineNombre: cine.nombre,
      fechaInicio: fechaInicio || 'Inicio',
      fechaFin: fechaFin || 'Actual'
    }, dataSource);

    res.download(pdfPath, `peliculas-proyectadas-${cine.nombre}-${Date.now()}.pdf`);

  } catch (error) {
    console.error('Error generando reporte:', error);
    res.status(500).json({ msg: 'Error generando reporte de películas', error: error.message });
  }
};

// Reporte de salas más gustadas (basado en calificaciones de usuarios)
export const reporteSalasMasGustadas = async (req, res) => {
  try {
    const cineId = req.usuario.cineId;

    if (!cineId) {
      return res.status(403).json({ msg: 'Usuario no asociado a un cine' });
    }

    const cine = await Cine.findByPk(cineId);
    if (!cine) {
      return res.status(404).json({ msg: 'Cine no encontrado' });
    }

    // Query mejorada: incluye todas las salas y muestra calificaciones reales de usuarios
    const resultados = await sequelize.query(`
      SELECT
        s.id,
        s.nombre as sala_nombre,
        s.tipo as sala_tipo,
        s.capacidad as sala_capacidad,
        COALESCE(AVG(cal.valor), 0) as calificacion_promedio,
        COUNT(DISTINCT cal.id) as total_calificaciones,
        COUNT(DISTINCT com.id) as total_comentarios,
        COUNT(DISTINCT b.usuarioId) as usuarios_unicos,
        CASE 
          WHEN COUNT(cal.id) = 0 THEN 'Sin Calificar'
          WHEN AVG(cal.valor) >= 4 THEN 'Excelente'
          WHEN AVG(cal.valor) >= 3 THEN 'Buena'
          ELSE 'Regular'
        END as categoria
      FROM Salas s
      LEFT JOIN Calificacions cal ON cal.salaId = s.id AND cal.valor IS NOT NULL
      LEFT JOIN Comentarios com ON com.salaId = s.id
      LEFT JOIN Boletos b ON b.salaId = s.id
      WHERE s.cineId = :cineId
      GROUP BY s.id, s.nombre, s.tipo, s.capacidad
      ORDER BY calificacion_promedio DESC, total_calificaciones DESC
      LIMIT 5
    `, {
      replacements: { cineId },
      type: sequelize.QueryTypes.SELECT
    });

    const dataSource = resultados.map(r => ({
      sala_nombre: r.sala_nombre,
      sala_tipo: r.sala_tipo,
      sala_capacidad: parseInt(r.sala_capacidad),
      calificacion_promedio: parseFloat(r.calificacion_promedio).toFixed(2),
      total_calificaciones: parseInt(r.total_calificaciones),
      total_comentarios: parseInt(r.total_comentarios),
      usuarios_unicos: parseInt(r.usuarios_unicos),
      categoria: r.categoria
    }));

    const pdfPath = await generateReport('salas-mas-gustadas', {
      cineId,
      cineNombre: cine.nombre
    }, dataSource);

    res.download(pdfPath, `salas-mas-gustadas-${cine.nombre}-${Date.now()}.pdf`);

  } catch (error) {
    console.error('Error generando reporte:', error);
    res.status(500).json({ msg: 'Error generando reporte de salas más gustadas', error: error.message });
  }
};

// Reporte de boletos vendidos (consolidado de TODOS los clientes del cine)
export const reporteBoletosVendidos = async (req, res) => {
  try {
    const cineId = req.usuario.cineId;
    const { fechaInicio, fechaFin } = req.query;

    if (!cineId) {
      return res.status(403).json({ msg: 'Usuario no asociado a un cine' });
    }

    const cine = await Cine.findByPk(cineId);
    if (!cine) {
      return res.status(404).json({ msg: 'Cine no encontrado' });
    }

    const whereFecha = fechaInicio && fechaFin
      ? `AND b.createdAt BETWEEN '${fechaInicio}' AND '${fechaFin}'`
      : '';

    // Query detallada: todos los boletos vendidos por TODOS los usuarios (tipo cliente)
    const resultados = await sequelize.query(`
      SELECT
        b.id as boleto_id,
        u.nombre as cliente_nombre,
        u.email as cliente_email,
        p.titulo as pelicula_titulo,
        s.nombre as sala_nombre,
        f.fecha as funcion_fecha,
        f.hora as funcion_hora,
        b.precio as precio_boleto,
        b.createdAt as fecha_compra,
        1 as cantidad_boletos,
        b.precio as total_compra
      FROM Boletos b
      INNER JOIN Usuarios u ON u.id = b.usuarioId
      INNER JOIN Funcions f ON f.id = b.funcionId
      INNER JOIN Peliculas p ON p.id = f.peliculaId
      INNER JOIN Salas s ON s.id = f.salaId
      WHERE s.cineId = :cineId 
        AND u.tipo = 'cliente'
        ${whereFecha}
      ORDER BY b.createdAt DESC
    `, {
      replacements: { cineId },
      type: sequelize.QueryTypes.SELECT
    });

    const dataSource = resultados.map(r => ({
      boleto_id: r.boleto_id,
      cliente_nombre: r.cliente_nombre,
      cliente_email: r.cliente_email,
      pelicula_titulo: r.pelicula_titulo,
      sala_nombre: r.sala_nombre,
      funcion_fecha: r.funcion_fecha ? new Date(r.funcion_fecha).toISOString().split('T')[0] : 'N/A',
      funcion_hora: r.funcion_hora || 'N/A',
      cantidad_boletos: 1,
      precio_boleto: parseFloat(r.precio_boleto),
      total_compra: parseFloat(r.total_compra),
      fecha_compra: r.fecha_compra ? new Date(r.fecha_compra).toISOString().split('T')[0] : 'N/A'
    }));

    // Calcular totales para resumen
    const totalBoletos = dataSource.length;
    const totalIngresos = dataSource.reduce((sum, r) => sum + r.total_compra, 0);

    const pdfPath = await generateReport('boletos-vendidos', {
      cineId,
      cineNombre: cine.nombre,
      fechaInicio: fechaInicio || 'Inicio',
      fechaFin: fechaFin || 'Actual',
      totalBoletos,
      totalIngresos: totalIngresos.toFixed(2)
    }, dataSource);

    res.download(pdfPath, `boletos-vendidos-${cine.nombre}-${Date.now()}.pdf`);

  } catch (error) {
    console.error('Error generando reporte:', error);
    res.status(500).json({ msg: 'Error generando reporte de boletos', error: error.message });
  }
};

// Vista previa de datos
export const previewComentarios = async (req, res) => {
  try {
    const cineId = req.usuario.cineId;
    const { fechaInicio, fechaFin } = req.query;

    const whereDate = {};
    if (fechaInicio && fechaFin) {
      whereDate.createdAt = {
        [Op.between]: [new Date(fechaInicio), new Date(fechaFin)]
      };
    }

    const comentarios = await Comentario.findAll({
      where: {
        salaId: { [Op.ne]: null },
        ...whereDate
      },
      include: [
        {
          model: Sala,
          where: { cineId },
          attributes: ['nombre', 'tipo']
        },
        {
          model: Usuario,
          attributes: ['nombre']
        }
      ],
      limit: 50,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      total: comentarios.length,
      datos: comentarios
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ msg: 'Error obteniendo preview' });
  }
};
