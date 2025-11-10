// Script para actualizar URLs de películas con placeholders válidos
import sequelize from './config/db.js';
import Pelicula from './modelos/pelicula.modelo.js';

const imagenDefault = 'https://image.tmdb.org/t/p/w500/fqv8v6AycXKsivp1T5yKtLbGXce.jpg';

async function actualizarImagenes() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL OK');

    const peliculas = await Pelicula.findAll();
    let actualizadas = 0;

    for (const peli of peliculas) {
      const img = peli.imagen || peli.posterUrl || '';
      // Si es vacío, MV5B (IMDb key rota), o placeholder viejo
      if (!img || img.startsWith('MV5B') || img.includes('placeholder')) {
        peli.imagen = imagenDefault;
        peli.posterUrl = imagenDefault;
        await peli.save();
        actualizadas++;
        console.log(`✅ Actualizada: ${peli.titulo}`);
      }
    }

    console.log(`🎉 ${actualizadas} películas actualizadas con imágenes válidas`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

actualizarImagenes();
