// backend/jobs/limpiar-anuncios.js
import cron from 'node-cron';
import Anuncio from '../modelos/anuncio.modelo.js';
import { Op } from 'sequelize';

// Función para limpiar anuncios expirados
export const limpiarAnunciosExpirados = async () => {
  try {
    const hoy = new Date();
    
    // Desactivar anuncios expirados
    const resultado = await Anuncio.update(
      { activo: false },
      {
        where: {
          fechaFin: { [Op.lt]: hoy },
          activo: true
        }
      }
    );

    if (resultado[0] > 0) {
      console.log(`Se desactivaron ${resultado[0]} anuncios expirados el ${hoy.toLocaleString()}`);
    }
  } catch (error) {
  console.error('Error limpiando anuncios expirados:', error);
  }
};

// Programar tarea para ejecutarse diariamente a las 3 AM
export const iniciarJobLimpiezaAnuncios = () => {
  // Ejecutar cada día a las 3:00 AM
  cron.schedule('0 3 * * *', async () => {
  console.log('Ejecutando limpieza automática de anuncios expirados...');
    await limpiarAnunciosExpirados();
  });

  // También cada 12 horas como respaldo
  cron.schedule('0 */12 * * *', async () => {
  console.log('Verificación programada de anuncios expirados...');
    await limpiarAnunciosExpirados();
  });

  console.log('Jobs de limpieza de anuncios iniciados');
};

// Endpoint manual para forzar limpieza (útil para testing)
export const limpiarAnunciosManual = async (req, res) => {
  try {
    await limpiarAnunciosExpirados();
    res.json({
      msg: 'Limpieza de anuncios ejecutada exitosamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error en limpieza manual:', error);
    res.status(500).json({
      error: 'Error al ejecutar limpieza de anuncios',
      details: error.message
    });
  }
};
