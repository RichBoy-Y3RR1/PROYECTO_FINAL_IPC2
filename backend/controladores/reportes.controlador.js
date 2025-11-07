import { Op } from 'sequelize';
import Sala from '../modelos/sala.modelo.js';
import Pelicula from '../modelos/pelicula.modelo.js';
import Boleto from '../modelos/boleto.modelo.js';
import Comentario from '../modelos/comentario.modelo.js';
import Anuncio from '../modelos/anuncio.modelo.js';
import Cine from '../modelos/cine.modelo.js';
import Funcion from '../modelos/funcion.modelo.js';
import Usuario from '../modelos/usuario.modelo.js';
import Calificacion from '../modelos/calificacion.modelo.js';

// Reporte de comentarios de salas
export const reporteComentariosSalas = async (req, res) => {
  try {
    const comentarios = await Comentario.findAll({
      include: [
        { model: Usuario, attributes: ['nombre', 'email'] },
        { model: Sala, include: [{ model: Cine, attributes: ['nombre'] }] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: comentarios });
  } catch (error) {
    console.error('Error en reporte comentarios:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Reporte de películas proyectadas en salas
export const reportePeliculasProyectadas = async (req, res) => {
  try {
    const funciones = await Funcion.findAll({
      include: [
        { model: Pelicula, as: 'pelicula', attributes: ['titulo', 'duracion', 'genero'] },
        { model: Sala, as: 'sala', include: [{ model: Cine, attributes: ['nombre'] }] }
      ],
      order: [['fecha', 'DESC']]
    });
    res.json({ success: true, data: funciones });
  } catch (error) {
    console.error('Error en reporte películas proyectadas:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Reporte top 5 salas más gustadas
export const reporteTopSalas = async (req, res) => {
  try {
    const salas = await Sala.findAll({
      include: [
        { model: Cine, attributes: ['nombre'] },
        { model: Calificacion }
      ]
    });

    // Calcular promedio de calificaciones por sala
    const salasConPromedio = salas.map(sala => {
      const calificaciones = sala.Calificacions || [];
      const promedio = calificaciones.length > 0
        ? calificaciones.reduce((sum, c) => sum + c.puntuacion, 0) / calificaciones.length
        : 0;
      
      return {
        id: sala.id,
        nombre: sala.nombre,
        cine: sala.Cine?.nombre,
        capacidad: sala.capacidad,
        tipo: sala.tipo,
        promedio: promedio.toFixed(2),
        totalCalificaciones: calificaciones.length
      };
    });

    // Ordenar y tomar top 5
    const top5 = salasConPromedio
      .sort((a, b) => parseFloat(b.promedio) - parseFloat(a.promedio))
      .slice(0, 5);

    res.json({ success: true, data: top5 });
  } catch (error) {
    console.error('Error en reporte top salas:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Reporte de boletos vendidos
export const reporteBoletosVendidos = async (req, res) => {
  try {
    const boletos = await Boleto.findAll({
      include: [
        { model: Usuario, as: 'comprador', attributes: ['nombre', 'email'] },
        { 
          model: Funcion,
          as: 'funcion',
          include: [
            { model: Pelicula, as: 'pelicula', attributes: ['titulo'] },
            { model: Cine, as: 'cine', attributes: ['nombre'] }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const totalIngresos = boletos.reduce((sum, b) => sum + (parseFloat(b.precio) || 0), 0);
    const totalBoletos = boletos.length;

    res.json({ 
      success: true, 
      data: boletos,
      estadisticas: {
        totalBoletos,
        totalIngresos: totalIngresos.toFixed(2),
        promedioVenta: totalBoletos > 0 ? (totalIngresos / totalBoletos).toFixed(2) : 0
      }
    });
  } catch (error) {
    console.error('Error en reporte boletos:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Reporte de ganancias
export const reporteGanancias = async (req, res) => {
  try {
    // Ingresos por boletos
    const boletos = await Boleto.findAll();
    const ingresosBoletos = boletos.reduce((sum, b) => sum + (parseFloat(b.precio) || 0), 0);

    // Ingresos por anuncios
    const anuncios = await Anuncio.findAll();
    const ingresosAnuncios = anuncios.reduce((sum, a) => sum + (parseFloat(a.costo) || 0), 0);

    // Costos estimados (puedes agregar más detalles)
    const costosOperativos = ingresosBoletos * 0.3; // 30% de costos estimados

    const totalIngresos = ingresosBoletos + ingresosAnuncios;
    const gananciaNeta = totalIngresos - costosOperativos;

    res.json({
      success: true,
      data: {
        ingresosBoletos: ingresosBoletos.toFixed(2),
        ingresosAnuncios: ingresosAnuncios.toFixed(2),
        totalIngresos: totalIngresos.toFixed(2),
        costosOperativos: costosOperativos.toFixed(2),
        gananciaNeta: gananciaNeta.toFixed(2),
        margenGanancia: ((gananciaNeta / totalIngresos) * 100).toFixed(2) + '%'
      }
    });
  } catch (error) {
    console.error('Error en reporte ganancias:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Reporte de anuncios
export const reporteAnuncios = async (req, res) => {
  try {
    const anuncios = await Anuncio.findAll({
      include: [
        { model: Cine, attributes: ['nombre'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    const totalAnuncios = anuncios.length;
    const totalIngresos = anuncios.reduce((sum, a) => sum + (parseFloat(a.costo) || 0), 0);

    // Estadísticas por tipo
    const porTipo = anuncios.reduce((acc, a) => {
      const tipo = a.tipo || 'DESCONOCIDO';
      if (!acc[tipo]) {
        acc[tipo] = { cantidad: 0, ingresos: 0 };
      }
      acc[tipo].cantidad++;
      acc[tipo].ingresos += parseFloat(a.costo) || 0;
      return acc;
    }, {});

    res.json({
      success: true,
      data: anuncios,
      estadisticas: {
        totalAnuncios,
        totalIngresos: totalIngresos.toFixed(2),
        porTipo
      }
    });
  } catch (error) {
    console.error('Error en reporte anuncios:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};