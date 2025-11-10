// controladores/cartera.controlador.js
import Cartera from '../modelos/cartera.modelo.js';
import Pago from '../modelos/pago.modelo.js';
import sequelize from '../config/db.js';

export const verSaldo = async (req, res) => {
  try {
    const cartera = await Cartera.findOne({ where: { usuarioId: req.usuario.id } });
    
    if (!cartera) {
      return res.status(404).json({ msg: 'Cartera no encontrada' });
    }

    res.json({
      usuarioId: cartera.usuarioId,
      saldo: parseFloat(cartera.saldo).toFixed(2),
      saldoDisponible: cartera.saldo,
      ultimaActualizacion: cartera.updatedAt
    });
  } catch (error) {
    console.error('Error al consultar saldo:', error);
    res.status(500).json({ msg: 'Error al consultar saldo', error: error.message });
  }
};

export const recargarSaldo = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { monto, metodo = 'tarjeta' } = req.body;

    const montoNum = parseFloat(monto);
    if (isNaN(montoNum) || montoNum <= 0) {
      await transaction.rollback();
      return res.status(400).json({ msg: 'El monto debe ser mayor a 0' });
    }

    if (montoNum > 10000) {
      await transaction.rollback();
      return res.status(400).json({ msg: 'El monto máximo de recarga es Q10,000' });
    }

    const cartera = await Cartera.findOne({ 
      where: { usuarioId: req.usuario.id },
      transaction
    });

    if (!cartera) {
      await transaction.rollback();
      return res.status(404).json({ msg: 'Cartera no encontrada' });
    }

    const saldoAnterior = parseFloat(cartera.saldo);
    cartera.saldo = parseFloat(cartera.saldo) + montoNum;
    await cartera.save({ transaction });

    await Pago.create({
      usuarioId: req.usuario.id,
      boletoId: null,
      monto: montoNum,
      metodo: metodo,
      fechaPago: new Date(),
      concepto: 'Recarga de cartera',
      estado: 'completado',
      tipoTransaccion: 'recarga',
      cineId: null
    }, { transaction });

    await transaction.commit();

    res.json({
      msg: 'Recarga exitosa',
      saldoAnterior: saldoAnterior.toFixed(2),
      montoRecargado: montoNum.toFixed(2),
      saldoNuevo: parseFloat(cartera.saldo).toFixed(2),
      fecha: new Date()
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error al recargar saldo:', error);
    res.status(500).json({ 
      msg: 'Error al recargar saldo', 
      error: error.message 
    });
  }
};

export const obtenerHistorialMovimientos = async (req, res) => {
  try {
    const { limite = 20, offset = 0 } = req.query;

    const movimientos = await Pago.findAll({
      where: { usuarioId: req.usuario.id },
      order: [['fechaPago', 'DESC']],
      limit: parseInt(limite),
      offset: parseInt(offset),
      attributes: ['id', 'monto', 'metodo', 'fechaPago', 'concepto', 'estado', 'tipoTransaccion']
    });

    const total = await Pago.count({
      where: { usuarioId: req.usuario.id }
    });

    res.json({
      movimientos,
      total,
      pagina: Math.floor(offset / limite) + 1,
      totalPaginas: Math.ceil(total / limite)
    });

  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({ 
      msg: 'Error al obtener historial', 
      error: error.message 
    });
  }
};
