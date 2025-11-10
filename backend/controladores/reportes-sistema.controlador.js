import Cine from '../modelos/cine.modelo.js';
import Sala from '../modelos/sala.modelo.js';
import Anuncio from '../modelos/anuncio.modelo.js';
import Usuario from '../modelos/usuario.modelo.js';
import Pago from '../modelos/pago.modelo.js';
import Comentario from '../modelos/comentario.modelo.js';
import Calificacion from '../modelos/calificacion.modelo.js';
import Boleto from '../modelos/boleto.modelo.js';
import Funcion from '../modelos/funcion.modelo.js';
import { generateReport } from '../jasper/jasper-helper.js';
import { formatearTablaReporte } from '../utils/reportes-tabla.js';
import { Op } from 'sequelize';
import sequelize from '../config/db.js';

// ============================================
// ENDPOINT CONSOLIDADO: DASHBOARD ADMIN SISTEMA
// Devuelve en una sola llamada:
//  - resumenGanancias (conteo y métricas clave)
//  - anunciosComprados (últimos 10)
//  - gananciasPorAnunciante (top 5)
//  - salasPopulares (top 5)
//  - salasMasComentadas (top 5)
// Se consumen internamente consultas equivalentes a los reportes PDF.
// ============================================
export const dashboardConsolidado = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const wherePagosFechas = fechaInicio && fechaFin ? `AND p.fechaPago BETWEEN '${fechaInicio}' AND '${fechaFin}'` : '';

    // 1. Ganancias del sistema (agregado resumido)
    const [gananciasRows] = await sequelize.query(`
      SELECT
        COUNT(p.id) as total_transacciones,
        COALESCE(SUM(p.monto),0) as monto_total,
        COALESCE(SUM(p.monto * 0.10),0) as comision_sistema
      FROM Pagos p
      WHERE p.estado = 'completado' ${wherePagosFechas}
    `);
    const resumenGanancias = gananciasRows[0] || { total_transacciones:0, monto_total:0, comision_sistema:0 };

    // 2. Anuncios comprados (últimos 10)
    const anunciosComprados = await Anuncio.findAll({
      limit: 10,
      order: [['createdAt','DESC']],
      include: [{ model: Usuario, attributes: ['id','nombre','correo','email'] }]
    });
    const anunciosCompradosDTO = anunciosComprados.map(a => ({
      id: a.id,
      titulo: a.titulo,
      tipo: a.tipoAnuncio || a.tipo || 'banner',
      anunciante: a.Usuario ? (a.Usuario.nombre || 'N/A') : 'N/A',
      email: a.Usuario ? (a.Usuario.correo || a.Usuario.email || 'N/A') : 'N/A',
      costo: a.costoTotal || a.costo || 0,
      estado: a.estado || (a.activo ? 'activo' : 'pendiente'),
      creado: a.createdAt
    }));

    // 3. Ganancias por anunciante (top 5)
    const [gananciasAnunciantes] = await sequelize.query(`
      SELECT
        u.id,
        u.nombre,
        u.correo,
        u.email,
        COUNT(a.id) as total_anuncios,
        COALESCE(SUM(a.costoTotal),0) as total_invertido,
        COALESCE(AVG(a.costoTotal),0) as promedio
      FROM Usuarios u
      LEFT JOIN Anuncios a ON a.usuarioId = u.id
      WHERE u.tipo = 'anunciante'
      GROUP BY u.id, u.nombre, u.correo, u.email
      HAVING COUNT(a.id) > 0
      ORDER BY total_invertido DESC
      LIMIT 5
    `);
    const gananciasPorAnunciante = gananciasAnunciantes.map(r => ({
      id: r.id,
      nombre: r.nombre,
      correo: r.correo || r.email,
      totalAnuncios: parseInt(r.total_anuncios),
      totalInvertido: parseFloat(r.total_invertido),
      promedio: parseFloat(r.promedio)
    }));

    // 4. Salas populares (top 5) - misma lógica del reporte individual
    const [salasPopularesRaw] = await sequelize.query(`
      SELECT
        s.id,
        s.nombre as sala_nombre,
        c.nombre as cine_nombre,
        s.tipo as sala_tipo,
        s.capacidad as sala_capacidad,
        COUNT(DISTINCT b.id) as total_boletos,
        COUNT(DISTINCT f.id) as total_funciones,
        ROUND((COUNT(DISTINCT b.id) * 100.0) / NULLIF((s.capacidad * COUNT(DISTINCT f.id)),0), 2) as ocupacion_promedio
      FROM Salas s
      INNER JOIN Cines c ON c.id = s.cineId
      LEFT JOIN Funcions f ON f.salaId = s.id
      LEFT JOIN Boletos b ON b.funcionId = f.id
      GROUP BY s.id, s.nombre, c.nombre, s.tipo, s.capacidad
      HAVING COUNT(b.id) > 0
      ORDER BY total_boletos DESC
      LIMIT 5
    `);
    const salasPopulares = salasPopularesRaw.map(r => ({
      id: r.id,
      sala: r.sala_nombre,
      cine: r.cine_nombre,
      tipo: r.sala_tipo,
      capacidad: parseInt(r.sala_capacidad),
      boletos: parseInt(r.total_boletos),
      funciones: parseInt(r.total_funciones),
      ocupacion: parseFloat(r.ocupacion_promedio) || 0
    }));

    // 5. Salas más comentadas (top 5)
    const [salasComentadasRaw] = await sequelize.query(`
      SELECT
        s.id,
        s.nombre as sala_nombre,
        c.nombre as cine_nombre,
        s.tipo as sala_tipo,
        COUNT(DISTINCT com.id) as total_comentarios,
        COALESCE(AVG(cal.valor), 0) as calificacion_promedio,
        SUM(CASE WHEN cal.valor >= 4 THEN 1 ELSE 0 END) as comentarios_positivos,
        SUM(CASE WHEN cal.valor < 4 THEN 1 ELSE 0 END) as comentarios_negativos
      FROM Salas s
      INNER JOIN Cines c ON c.id = s.cineId
      LEFT JOIN Comentarios com ON com.salaId = s.id
      LEFT JOIN Calificacions cal ON cal.salaId = s.id
      GROUP BY s.id, s.nombre, c.nombre, s.tipo
      HAVING COUNT(com.id) > 0
      ORDER BY total_comentarios DESC
      LIMIT 5
    `);
    const salasMasComentadas = salasComentadasRaw.map(r => ({
      id: r.id,
      sala: r.sala_nombre,
      cine: r.cine_nombre,
      tipo: r.sala_tipo,
      comentarios: parseInt(r.total_comentarios),
      calificacion: parseFloat(r.calificacion_promedio).toFixed(2),
      positivos: parseInt(r.comentarios_positivos) || 0,
      negativos: parseInt(r.comentarios_negativos) || 0
    }));

    res.json({
      resumenGanancias: {
        totalTransacciones: parseInt(resumenGanancias.total_transacciones) || 0,
        montoTotal: parseFloat(resumenGanancias.monto_total) || 0,
        comisionSistema: parseFloat(resumenGanancias.comision_sistema) || 0
      },
      anunciosComprados: anunciosCompradosDTO,
      gananciasPorAnunciante,
      salasPopulares,
      salasMasComentadas
    });
  } catch (error) {
    console.error('Error dashboardConsolidado:', error);
    res.status(500).json({ msg: 'Error obteniendo dashboard consolidado', error: error.message });
  }
};

// ============================================
// REPORTE 1: GANANCIAS DEL SISTEMA
// ============================================
export const reporteGananciasSistema = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, formato } = req.query;
    if (fechaInicio && fechaFin && new Date(fechaInicio) > new Date(fechaFin)) {
      return res.status(400).json({ msg: 'fechaInicio no puede ser mayor que fechaFin' });
    }
    const whereFecha = fechaInicio && fechaFin
      ? `AND p.fechaPago BETWEEN '${fechaInicio}' AND '${fechaFin}'`
      : '';
    const resultados = await sequelize.query(`
      SELECT
        c.nombre as cine_nombre,
        p.metodo as tipo_ingreso,
        DATE_FORMAT(p.fechaPago, '%Y-%m') as mes,
        COUNT(p.id) as total_transacciones,
        SUM(p.monto) as monto_total,
        SUM(p.monto * 0.10) as comision_sistema
      FROM Pagos p
      LEFT JOIN Boletos b ON b.id = p.boletoId
      LEFT JOIN Cines c ON c.id = b.cineId
      WHERE 1=1 ${whereFecha}
      GROUP BY c.nombre, p.metodo, DATE_FORMAT(p.fechaPago, '%Y-%m')
      ORDER BY mes DESC, monto_total DESC
    `, {
      type: sequelize.QueryTypes.SELECT
    });
    const columns = [
      { key: 'cine_nombre', label: 'Cine' },
      { key: 'tipo_ingreso', label: 'Tipo Ingreso' },
      { key: 'mes', label: 'Mes' },
      { key: 'total_transacciones', label: 'Transacciones' },
      { key: 'monto_total', label: 'Monto Total' },
      { key: 'comision_sistema', label: 'Comisión Sistema' }
    ];
    const rows = resultados.map(r => ({
      cine_nombre: r.cine_nombre,
      tipo_ingreso: r.tipo_ingreso || 'General',
      mes: r.mes,
      total_transacciones: parseInt(r.total_transacciones),
      monto_total: parseFloat(r.monto_total),
      comision_sistema: parseFloat(r.comision_sistema)
    }));
    if (formato === 'json') {
      return res.json(formatearTablaReporte(columns, rows));
    }

    // Calcular totales para el resumen
    const totalTransacciones = rows.reduce((sum, r) => sum + r.total_transacciones, 0);
    const totalMonto = rows.reduce((sum, r) => sum + r.monto_total, 0);
    const totalComision = rows.reduce((sum, r) => sum + r.comision_sistema, 0);

    const pdfPath = await generateReport('ganancias-sistema', {
      fechaInicio: fechaInicio || 'Inicio',
      fechaFin: fechaFin || 'Actual',
      totalTransacciones,
      totalMonto: totalMonto.toFixed(2),
      totalComision: totalComision.toFixed(2)
    }, rows);
    res.download(pdfPath, `ganancias-sistema-${Date.now()}.pdf`);
  } catch (error) {
    console.error('Error generando reporte:', error);
    res.status(500).json({ msg: 'Error generando reporte de ganancias del sistema' });
  }
};

// ============================================
// REPORTE 2: ANUNCIOS COMPRADOS
// ============================================
export const reporteAnunciosComprados = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, formato } = req.query;
    if (fechaInicio && fechaFin && new Date(fechaInicio) > new Date(fechaFin)) {
      return res.status(400).json({ msg: 'fechaInicio no puede ser mayor que fechaFin' });
    }
    const whereFecha = {};
    if (fechaInicio && fechaFin) {
      whereFecha.createdAt = {
        [Op.between]: [new Date(fechaInicio), new Date(fechaFin)]
      };
    }
    const anuncios = await Anuncio.findAll({
      where: whereFecha,
      include: [
        {
          model: Usuario,
          as: 'anunciante',
          attributes: ['nombre', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    const columns = [
      { key: 'anuncio_titulo', label: 'Título' },
      { key: 'anuncio_tipo', label: 'Tipo' },
      { key: 'anunciante_nombre', label: 'Anunciante' },
      { key: 'anunciante_email', label: 'Email' },
      { key: 'duracion_dias', label: 'Duración (días)' },
      { key: 'costo', label: 'Costo' },
      { key: 'fecha_compra', label: 'Fecha Compra' },
      { key: 'estado', label: 'Estado' }
    ];
    const rows = anuncios.map(a => ({
      anuncio_titulo: a.titulo,
      anuncio_tipo: a.tipo || 'banner',
      anunciante_nombre: a.anunciante?.nombre || 'N/A',
      anunciante_email: a.anunciante?.email || 'N/A',
      duracion_dias: parseInt(a.duracionDias) || 0,
      costo: parseFloat(a.costo) || 0,
      fecha_compra: a.createdAt.toISOString().split('T')[0],
      estado: a.activo ? 'Activo' : 'Inactivo'
    }));
    if (formato === 'json') {
      return res.json(formatearTablaReporte(columns, rows));
    }

    // Calcular totales para el resumen
    const totalAnuncios = rows.length;
    const totalCosto = rows.reduce((sum, r) => sum + r.costo, 0);
    const anunciosActivos = rows.filter(r => r.estado === 'Activo').length;

    const pdfPath = await generateReport('anuncios-comprados', {
      fechaInicio: fechaInicio || 'Inicio',
      fechaFin: fechaFin || 'Actual',
      totalAnuncios,
      totalCosto: totalCosto.toFixed(2),
      anunciosActivos
    }, rows);
    res.download(pdfPath, `anuncios-comprados-${Date.now()}.pdf`);
  } catch (error) {
    console.error('Error generando reporte:', error);
    res.status(500).json({ msg: 'Error generando reporte de anuncios' });
  }
};

// ============================================
// REPORTE 3: GANANCIAS POR ANUNCIANTE
// ============================================
export const reporteGananciasAnunciante = async (req, res) => {
  try {
    const { formato } = req.query;
    // Query con agregaciones por anunciante
    const resultados = await sequelize.query(`
      SELECT
        u.nombre as anunciante_nombre,
        u.email as anunciante_email,
        COUNT(a.id) as total_anuncios,
        SUM(CASE WHEN a.activo = 1 THEN 1 ELSE 0 END) as anuncios_activos,
        COALESCE(SUM(a.costo), 0) as total_invertido,
        COALESCE(AVG(a.costo), 0) as promedio_por_anuncio
      FROM Usuarios u
      LEFT JOIN Anuncios a ON a.usuarioAnuncianteId = u.id
      WHERE u.tipo = 'anunciante'
      GROUP BY u.id, u.nombre, u.email
      HAVING COUNT(a.id) > 0
      ORDER BY total_invertido DESC
    `, {
      type: sequelize.QueryTypes.SELECT
    });
    const columns = [
      { key: 'anunciante_nombre', label: 'Anunciante' },
      { key: 'anunciante_email', label: 'Email' },
      { key: 'total_anuncios', label: 'Total Anuncios' },
      { key: 'anuncios_activos', label: 'Activos' },
      { key: 'total_invertido', label: 'Total Invertido' },
      { key: 'promedio_por_anuncio', label: 'Promedio por Anuncio' }
    ];
    const rows = resultados.map(r => ({
      anunciante_nombre: r.anunciante_nombre,
      anunciante_email: r.anunciante_email,
      total_anuncios: parseInt(r.total_anuncios),
      anuncios_activos: parseInt(r.anuncios_activos),
      total_invertido: parseFloat(r.total_invertido),
      promedio_por_anuncio: parseFloat(r.promedio_por_anuncio)
    }));
    if (formato === 'json') {
      return res.json(formatearTablaReporte(columns, rows));
    }

    // Calcular totales para el resumen
    const totalAnunciantes = rows.length;
    const totalInvertido = rows.reduce((sum, r) => sum + r.total_invertido, 0);
    const totalAnuncios = rows.reduce((sum, r) => sum + r.total_anuncios, 0);
    const promedioGeneral = totalAnunciantes > 0 ? (totalInvertido / totalAnuncios) : 0;

    const pdfPath = await generateReport('ganancias-anunciante', {
      totalAnunciantes,
      totalInvertido: totalInvertido.toFixed(2),
      totalAnuncios,
      promedioGeneral: promedioGeneral.toFixed(2)
    }, rows);
    res.download(pdfPath, `ganancias-anunciante-${Date.now()}.pdf`);
  } catch (error) {
    console.error('Error generando reporte:', error);
    res.status(500).json({ msg: 'Error generando reporte de ganancias por anunciante' });
  }
};

// ============================================
// REPORTE 4: TOP 5 SALAS POPULARES
// ============================================
export const reporteSalasPopulares = async (req, res) => {
  try {
    // Query cross-cine: salas más populares de TODOS los cines
    const resultados = await sequelize.query(`
      SELECT
        s.nombre as sala_nombre,
        c.nombre as cine_nombre,
        s.tipo as sala_tipo,
        s.capacidad as sala_capacidad,
        COUNT(DISTINCT b.id) as total_boletos,
        COUNT(DISTINCT f.id) as total_funciones,
        ROUND((COUNT(DISTINCT b.id) * 100.0) / NULLIF((s.capacidad * COUNT(DISTINCT f.id)), 0), 2) as ocupacion_promedio
      FROM Salas s
      INNER JOIN Cines c ON c.id = s.cineId
      LEFT JOIN Funcions f ON f.salaId = s.id
      LEFT JOIN Boletos b ON b.funcionId = f.id
      GROUP BY s.id, s.nombre, c.nombre, s.tipo, s.capacidad
      HAVING COUNT(b.id) > 0
      ORDER BY total_boletos DESC
      LIMIT 5
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    const dataSource = resultados.map(r => ({
      sala_nombre: r.sala_nombre,
      cine_nombre: r.cine_nombre,
      sala_tipo: r.sala_tipo,
      sala_capacidad: parseInt(r.sala_capacidad),
      total_boletos: parseInt(r.total_boletos),
      total_funciones: parseInt(r.total_funciones),
      ocupacion_promedio: parseFloat(r.ocupacion_promedio) || 0
    }));

    const pdfPath = await generateReport('salas-populares', {}, dataSource);

    res.download(pdfPath, `salas-populares-${Date.now()}.pdf`);

  } catch (error) {
    console.error('Error generando reporte:', error);
    res.status(500).json({ msg: 'Error generando reporte de salas populares' });
  }
};

// ============================================
// REPORTE 5: TOP 5 SALAS MÁS COMENTADAS
// ============================================
export const reporteSalasMasComentadas = async (req, res) => {
  try {
    // Query cross-cine: salas más comentadas + análisis positivo/negativo
    const resultados = await sequelize.query(`
      SELECT
        s.nombre as sala_nombre,
        c.nombre as cine_nombre,
        s.tipo as sala_tipo,
        COUNT(DISTINCT com.id) as total_comentarios,
        COALESCE(AVG(cal.valor), 0) as calificacion_promedio,
        SUM(CASE WHEN cal.valor >= 4 THEN 1 ELSE 0 END) as comentarios_positivos,
        SUM(CASE WHEN cal.valor < 4 THEN 1 ELSE 0 END) as comentarios_negativos
      FROM Salas s
      INNER JOIN Cines c ON c.id = s.cineId
      LEFT JOIN Comentarios com ON com.salaId = s.id
      LEFT JOIN Calificacions cal ON cal.salaId = s.id
      GROUP BY s.id, s.nombre, c.nombre, s.tipo
      HAVING COUNT(com.id) > 0
      ORDER BY total_comentarios DESC
      LIMIT 5
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    const dataSource = resultados.map(r => ({
      sala_nombre: r.sala_nombre,
      cine_nombre: r.cine_nombre,
      sala_tipo: r.sala_tipo,
      total_comentarios: parseInt(r.total_comentarios),
      calificacion_promedio: parseFloat(r.calificacion_promedio).toFixed(2),
      comentarios_positivos: parseInt(r.comentarios_positivos) || 0,
      comentarios_negativos: parseInt(r.comentarios_negativos) || 0
    }));

    const pdfPath = await generateReport('salas-comentadas', {}, dataSource);

    res.download(pdfPath, `salas-comentadas-${Date.now()}.pdf`);

  } catch (error) {
    console.error('Error generando reporte:', error);
    res.status(500).json({ msg: 'Error generando reporte de salas comentadas' });
  }
};

// ============================================
// ESTADÍSTICAS GENERALES DEL SISTEMA
// ============================================
export const estadisticasGenerales = async (req, res) => {
  try {
    const [stats] = await sequelize.query(`
      SELECT
        (SELECT COUNT(*) FROM Cines WHERE estado = 'activo') as total_cines,
        (SELECT COUNT(*) FROM Usuarios WHERE tipo = 'anunciante') as total_anunciantes,
        (SELECT COUNT(*) FROM Anuncios WHERE estado = 'activo') as anuncios_activos,
        (SELECT COALESCE(SUM(costoTotal), 0) FROM Anuncios) as ingresos_anuncios,
        (SELECT COALESCE(SUM(monto), 0) FROM Pagos WHERE estado = 'completado') as ingresos_totales,
        (SELECT COALESCE(SUM(monto * 0.10), 0) FROM Pagos WHERE estado = 'completado') as comisiones_sistema
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    res.json(stats[0]);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ msg: 'Error obteniendo estadísticas' });
  }
};
