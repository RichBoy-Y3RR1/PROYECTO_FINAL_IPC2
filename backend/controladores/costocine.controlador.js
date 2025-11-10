// controladores/costocine.controlador.js
import CostoCine from '../modelos/costocine.modelo.js';
import Cine from '../modelos/cine.modelo.js';
import { Op } from 'sequelize';

// Cambiar costo diario de un cine (Admin Sistema)
export const cambiarCosto = async (req, res) => {
  try {
    const { cineId } = req.params;
    const { costoDiario, fechaInicio } = req.body;

    if (!costoDiario || costoDiario <= 0) {
      return res.status(400).json({ msg: 'Costo diario debe ser mayor a 0' });
    }

    // Verificar que el cine existe
    const cine = await Cine.findByPk(cineId);
    if (!cine) {
      return res.status(404).json({ msg: 'Cine no encontrado' });
    }

    // Crear nuevo registro de costo
    const nuevo = await CostoCine.create({
      cineId,
      costoDiario,
      fechaInicio: fechaInicio || new Date(),
      // Compatibilidad con campos legacy
      monto: costoDiario,
      desdeFecha: fechaInicio || new Date()
    });

    res.json({
      msg: 'Costo actualizado exitosamente',
      costoCine: nuevo,
      cineNombre: cine.nombre
    });
  } catch (error) {
    console.error('Error cambiando costo:', error);
    res.status(500).json({ error: error.message });
  }
};

// Calcular costo total de un cine en un periodo
export const calcularCosto = async (req, res) => {
  try {
    const { cineId } = req.params;
    const { desde, hasta } = req.query;

    if (!desde || !hasta) {
      return res.status(400).json({ msg: 'Fechas desde y hasta requeridas' });
    }

    const cine = await Cine.findByPk(cineId);
    if (!cine) {
      return res.status(404).json({ msg: 'Cine no encontrado' });
    }

    // Obtener todos los costos ordenados por fecha
    const costos = await CostoCine.findAll({
      where: { cineId },
      order: [['fechaInicio', 'ASC'], ['desdeFecha', 'ASC']]
    });

    if (costos.length === 0) {
      return res.json({
        cineNombre: cine.nombre,
        total: 0,
        dias: 0,
        moneda: 'GTQ',
        msg: 'No hay costos registrados para este cine'
      });
    }

    // Cálculo de costos entre fechas
    let total = 0;
    let diasCalculados = 0;
    const fechaInicio = new Date(desde);
    const fechaFin = new Date(hasta);

    for (let i = 0; i < costos.length; i++) {
      const costoActual = costos[i];
      const costoSiguiente = costos[i + 1];

      // Fecha de inicio de este costo
      const inicioCosto = new Date(costoActual.fechaInicio || costoActual.desdeFecha);
      
      // Fecha de fin de este costo (inicio del siguiente o fecha final del rango)
      const finCosto = costoSiguiente 
        ? new Date(costoSiguiente.fechaInicio || costoSiguiente.desdeFecha)
        : fechaFin;

      // Determinar rango efectivo de días con este costo
      const inicioEfectivo = inicioCosto > fechaInicio ? inicioCosto : fechaInicio;
      const finEfectivo = finCosto < fechaFin ? finCosto : fechaFin;

      if (inicioEfectivo < finEfectivo) {
        const dias = Math.ceil((finEfectivo - inicioEfectivo) / (1000 * 60 * 60 * 24));
        const costoDiario = costoActual.costoDiario || costoActual.monto || 0;
        total += dias * costoDiario;
        diasCalculados += dias;
      }
    }

    res.json({
      cineId,
      cineNombre: cine.nombre,
      fechaDesde: desde,
      fechaHasta: hasta,
      diasCalculados,
      totalCosto: parseFloat(total.toFixed(2)),
      moneda: 'GTQ',
      costosRegistrados: costos.length
    });
  } catch (error) {
    console.error('Error calculando costo:', error);
    res.status(500).json({ error: error.message });
  }
};

// Listar histórico de costos de un cine
export const listarCostos = async (req, res) => {
  try {
    const { cineId } = req.params;

    const costos = await CostoCine.findAll({
      where: { cineId },
      include: [{
        model: Cine,
        attributes: ['nombre']
      }],
      order: [['fechaInicio', 'DESC'], ['desdeFecha', 'DESC']]
    });

    res.json(costos);
  } catch (error) {
    console.error('Error listando costos:', error);
    res.status(500).json({ error: error.message });
  }
};
