import { Router } from 'express';
import Pelicula from '../modelos/pelicula.modelo.js';
import Funcion from '../modelos/funcion.modelo.js';
import { Op } from 'sequelize';

const router = Router();

// Obtener todas las películas con paginación y búsqueda
router.get('/peliculas', async (req, res) => {
  try {
    const { page = 1, limit = 12, search } = req.query;
    const offset = (page - 1) * limit;

    const where = search ? {
      [Op.or]: [
        { titulo: { [Op.like]: `%${search}%` } },
        { director: { [Op.like]: `%${search}%` } },
        { categorias: { [Op.like]: `%${search}%` } }
      ]
    } : {};

    const peliculas = await Pelicula.findAndCountAll({
      where,
      limit,
      offset,
      order: [['estreno', 'DESC']]
    });

    res.json({
      peliculas: peliculas.rows,
      total: peliculas.count,
      pages: Math.ceil(peliculas.count / limit)
    });
  } catch (error) {
    console.error('Error obteniendo películas:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Obtener funciones de una película
router.get('/funciones/pelicula/:id', async (req, res) => {
  try {
    const funciones = await Funcion.findAll({
      where: {
        peliculaId: req.params.id,
        fecha: {
          [Op.gte]: new Date()
        }
      },
      order: [
        ['fecha', 'ASC'],
        ['hora', 'ASC']
      ]
    });

    res.json(funciones);
  } catch (error) {
    console.error('Error obteniendo funciones:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Comprar boletos
router.post('/boletos', async (req, res) => {
  try {
    const { funcionId, cantidad, usuarioId } = req.body;

    // Aquí irían las validaciones de disponibilidad, saldo, etc.

    // Crear los boletos
    const boletos = await Promise.all(
      Array(cantidad).fill().map(() =>
        Boleto.create({
          funcionId,
          usuarioId,
          estado: 'ACTIVO',
          fechaCompra: new Date()
        })
      )
    );

    res.json(boletos);
  } catch (error) {
    console.error('Error creando boletos:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

export default router;
