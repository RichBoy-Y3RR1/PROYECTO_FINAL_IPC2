// Script para verificar películas
import sequelize from './config/db.js';
import Pelicula from './modelos/pelicula.modelo.js';

async function checkPeliculas() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos\n');

    const peliculas = await Pelicula.findAll({
      attributes: ['id', 'titulo', 'director', 'duracionMinutos', 'clasificacion', 'imagen'],
      raw: true
    });

    console.log('🎬 Películas en la base de datos:');
    console.table(peliculas);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkPeliculas();
