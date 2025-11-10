// backend/controladores/boletos.controlador.js
import Boleto from '../modelos/boleto.modelo.js';
import Funcion from '../modelos/funcion.modelo.js';
import Pelicula from '../modelos/pelicula.modelo.js';
import Cine from '../modelos/cine.modelo.js';
import Sala from '../modelos/sala.modelo.js';
import Cartera from '../modelos/cartera.modelo.js';
import Pago from '../modelos/pago.modelo.js';

export const crearBoleto = async (req, res) => {
  try {
    const { funcionId, cantidad = 1, peliculaId } = req.body;

    // Validar cantidad
    if (cantidad < 1 || cantidad > 10) {
      return res.status(400).json({ msg: 'La cantidad debe estar entre 1 y 10 boletos' });
    }

    // Buscar función
    const funcion = await Funcion.findByPk(funcionId);
    if (!funcion) {
      return res.status(404).json({ msg: 'Función no encontrada' });
    }

    // Verificar cartera y saldo
    const cartera = await Cartera.findOne({ where: { usuarioId: req.usuario.id } });
    if (!cartera) {
      return res.status(404).json({ msg: 'Cartera no encontrada' });
    }

    const costoTotal = funcion.precio * cantidad;
    if (cartera.saldo < costoTotal) {
      return res.status(400).json({
        msg: `Saldo insuficiente. Necesitas Q${costoTotal.toFixed(2)} pero tienes Q${cartera.saldo.toFixed(2)}`
      });
    }

    // Descontar del saldo
    cartera.saldo -= costoTotal;
    await cartera.save();

    // Crear los boletos
    const boletosCreados = [];
    for (let i = 0; i < cantidad; i++) {
      const boleto = await Boleto.create({
        usuarioId: req.usuario.id,
        funcionId,
        peliculaId: funcion.peliculaId,
        cineId: funcion.cineId,
        salaId: funcion.salaId,
        precio: funcion.precio,
        fechaCompra: new Date()
      });
      boletosCreados.push(boleto);
    }

    // Crear registro de pago
    await Pago.create({
      usuarioId: req.usuario.id,
      boletoId: boletosCreados[0].id,
      monto: costoTotal,
      metodo: 'cartera',
      fechaPago: new Date()
    });

    res.status(201).json({
      msg: `¡Compra exitosa! ${cantidad} boleto${cantidad > 1 ? 's' : ''} comprado${cantidad > 1 ? 's' : ''}`,
      boletos: boletosCreados,
      cantidad,
      costoTotal,
      saldoRestante: cartera.saldo
    });
  } catch (error) {
    console.error('Error al crear boleto:', error);
    res.status(500).json({
      msg: 'Error al procesar la compra',
      error: error.message
    });
  }
};

export const obtenerBoletos = async (req, res) => {
  try {
    const boletos = await Boleto.findAll({
      include: [
        { model: Funcion, as: 'funcion', include: [
          { model: Pelicula, as: 'pelicula', attributes: ['id','titulo'] },
          { model: Cine, as: 'cine', attributes: ['id','nombre'] },
          { model: Sala, as: 'sala', attributes: ['id','nombre'] }
        ]}
      ],
      order: [['createdAt','DESC']]
    });
    res.json(boletos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerMisBoletos = async (req, res) => {
  try {
    const boletos = await Boleto.findAll({
      where: { usuarioId: req.usuario.id },
      include: [
        { model: Funcion, as: 'funcion', include: [
          { model: Pelicula, as: 'pelicula', attributes: ['id','titulo'] },
          { model: Cine, as: 'cine', attributes: ['id','nombre'] },
          { model: Sala, as: 'sala', attributes: ['id','nombre'] }
        ]}
      ],
      order: [['createdAt','DESC']]
    });
    res.json(boletos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const actualizarBoleto = async (req, res) => {
  const { id } = req.params;
  try {
    const boleto = await Boleto.findByPk(id);
    if (!boleto) return res.status(404).json({ error: 'Boleto no encontrado' });

    await boleto.update(req.body);
    res.json(boleto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const eliminarBoleto = async (req, res) => {
  const { id } = req.params;
  try {
    const boleto = await Boleto.findByPk(id);
    if (!boleto) return res.status(404).json({ error: 'Boleto no encontrado' });

    await boleto.destroy();
    res.json({ mensaje: 'Boleto eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
