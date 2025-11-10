// controladores/bloqueoanuncio.controlador.js
import BloqueoAnuncio from '../modelos/bloqueoanuncio.modelo.js';
import Cartera from '../modelos/cartera.modelo.js';

export const bloquearAnuncios = async (req, res) => {
  try {
    const { dias, anuncioId } = req.body;
    const { cineId } = req.params;

    if (!anuncioId) {
      return res.status(400).json({ msg: 'anuncioId requerido' });
    }

    // Sin costo - bloqueo gratuito
    const fechaHoy = new Date().toISOString().split('T')[0];
    
    const bloqueo = await BloqueoAnuncio.create({
      cineId,
      anuncioId,
      fechaInicio: fechaHoy,
      dias: dias || 7,
      montoPagado: 0
    });

    res.json({ msg: 'Anuncio bloqueado sin costo', bloqueo });
  } catch (error) {
    console.error('Error bloqueando anuncio:', error);
    res.status(500).json({ error: error.message });
  }
};
