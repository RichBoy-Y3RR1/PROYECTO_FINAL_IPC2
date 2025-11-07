// backend/seeders/add_tron_ares.js
import './seed.js';
import Pelicula from '../modelos/pelicula.modelo.js';

async function run() {
  try {
    const existing = await Pelicula.findOne({ where: { titulo: 'Tron: Ares' } });
    if (existing) {
      console.log('Tron: Ares ya existe, id=', existing.id);
      process.exit(0);
    }
    const pelicula = await Pelicula.create({
      titulo: 'Tron: Ares',
      descripcion: 'Tercera entrega de Tron donde Ares cruza al mundo real.',
      genero: 'Ciencia Ficción',
      director: 'Joachim Rønning',
      anio: 2025,
      duracion: 125,
      duracionMinutos: 125,
      imagen: 'https://m.media-amazon.com/images/M/MV5BMmRlMzYzZDMtYTQ0Yy00YTJiLWFiMTItYWIzODdlZTc3ZTU4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
      posterUrl: 'https://m.media-amazon.com/images/M/MV5BMmRlMzYzZDMtYTQ0Yy00YTJiLWFiMTItYWIzODdlZTc3ZTU4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
      clasificacion: 'PG-13',
      categorias: 'Acción, Ciencia Ficción',
      estreno: '2025-01-01'
    });
    console.log('Creada película Tron: Ares con id', pelicula.id);
  } catch (e) {
    console.error('Error creando Tron: Ares', e);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

run();
