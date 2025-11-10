// Script para agregar películas variadas por género
import sequelize from './config/db.js';
import Pelicula from './modelos/pelicula.modelo.js';
import Funcion from './modelos/funcion.modelo.js';
import Sala from './modelos/sala.modelo.js';
import Cine from './modelos/cine.modelo.js';
import './modelos/asociaciones.js';

async function agregarPeliculasVariadas() {
  try {
    await sequelize.sync();
    console.log('✅ Conectado a la base de datos\n');
    console.log('🎬 Agregando películas variadas por género...\n');

    const peliculasNuevas = [
      // ACCIÓN
      {
        titulo: 'John Wick: Capítulo 5',
        sinopsis: 'John Wick continúa su lucha por la libertad enfrentándose a la Mesa Alta en una batalla épica final.',
        duracionMinutos: 150,
        categorias: 'Acción, Thriller',
        genero: 'Acción',
        director: 'Chad Stahelski',
        clasificacion: 'R',
        estreno: '2025-05-23',
        imagen: 'https://m.media-amazon.com/images/M/MV5BNzAwMzUzNjE4MV5BMl5BanBnXkFtZTgwMzE4MjkxNTE@._V1_FMjpg_UX1000_.jpg',
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BNzAwMzUzNjE4MV5BMl5BanBnXkFtZTgwMzE4MjkxNTE@._V1_FMjpg_UX1000_.jpg'
      },
      {
        titulo: 'Fast X: Parte 2',
        sinopsis: 'Dom Toretto y su familia deben enfrentar la amenaza más letal que han conocido: un enemigo del pasado sediento de venganza.',
        duracionMinutos: 145,
        categorias: 'Acción, Carreras',
        genero: 'Acción',
        director: 'Louis Leterrier',
        clasificacion: 'PG-13',
        estreno: '2025-04-04',
        imagen: 'https://m.media-amazon.com/images/M/MV5BYzI5ZmJkYjctYTFiOC00MDMyLTg4YWUtNzgwYmExNGFiODZjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BYzI5ZmJkYjctYTFiOC00MDMyLTg4YWUtNzgwYmExNGFiODZjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'
      },

      // COMEDIA
      {
        titulo: 'Deadpool & Wolverine 2',
        sinopsis: 'Wade Wilson y Logan se ven obligados a trabajar juntos nuevamente en una misión llena de caos, humor negro y acción desenfrenada.',
        duracionMinutos: 130,
        categorias: 'Comedia, Acción, Superhéroes',
        genero: 'Comedia',
        director: 'Shawn Levy',
        clasificacion: 'R',
        estreno: '2025-07-25',
        imagen: 'https://m.media-amazon.com/images/M/MV5BZTJjZjRkOWQtNzAxZS00OTg5LTk5ZjEtMDk1MWVmNDEyMDAwXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BZTJjZjRkOWQtNzAxZS00OTg5LTk5ZjEtMDk1MWVmNDEyMDAwXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'
      },
      {
        titulo: 'Shrek 5',
        sinopsis: 'Shrek y Burro regresan en una nueva aventura mágica llena de humor, donde deben salvar el Reino de Muy Muy Lejano una vez más.',
        duracionMinutos: 95,
        categorias: 'Comedia, Animación, Familiar',
        genero: 'Comedia',
        director: 'Walt Dohrn',
        clasificacion: 'PG',
        estreno: '2025-12-23',
        imagen: 'https://m.media-amazon.com/images/M/MV5BOTNhMjRjNDAtZDI1Ni00ZWM1LWE5ODEtZWMzMzRkMmE0NmI2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BOTNhMjRjNDAtZDI1Ni00ZWM1LWE5ODEtZWMzMzRkMmE0NmI2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'
      },

      // DRAMA
      {
        titulo: 'Oppenheimer: La Caída',
        sinopsis: 'Secuela sobre las consecuencias de la bomba atómica y los últimos años de J. Robert Oppenheimer enfrentando sus demonios.',
        duracionMinutos: 180,
        categorias: 'Drama, Historia',
        genero: 'Drama',
        director: 'Christopher Nolan',
        clasificacion: 'R',
        estreno: '2025-07-19',
        imagen: 'https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'
      },
      {
        titulo: 'The Son of El Cucuy',
        sinopsis: 'Drama guatemalteco sobre un joven que descubre el oscuro secreto de su familia relacionado con la guerra civil.',
        duracionMinutos: 120,
        categorias: 'Drama, Suspenso',
        genero: 'Drama',
        director: 'Jayro Bustamante',
        clasificacion: 'R',
        estreno: '2025-09-15',
        imagen: 'https://m.media-amazon.com/images/M/MV5BNDE4OTMxMTctNmRhYy00NWE2LTg3YzItYTk3M2UwOTU5Njg4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BNDE4OTMxMTctNmRhYy00NWE2LTg3YzItYTk3M2UwOTU5Njg4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'
      },

      // TERROR
      {
        titulo: 'El Sombrerón',
        sinopsis: 'Basada en la leyenda guatemalteca del Sombrerón, que seduce mujeres con su música y las lleva a la locura.',
        duracionMinutos: 105,
        categorias: 'Terror, Folklore',
        genero: 'Terror',
        director: 'Rodrigo García Chapetón',
        clasificacion: 'R',
        estreno: '2025-10-31',
        imagen: 'https://m.media-amazon.com/images/M/MV5BMTg4NzYzODY0MV5BMl5BanBnXkFtZTgwNjI1NzM5NzE@._V1_FMjpg_UX1000_.jpg',
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BMTg4NzYzODY0MV5BMl5BanBnXkFtZTgwNjI1NzM5NzE@._V1_FMjpg_UX1000_.jpg'
      },
      {
        titulo: 'A Quiet Place: Day One',
        sinopsis: 'Precuela que muestra el primer día de la invasión alienígena y cómo la humanidad aprendió a guardar silencio para sobrevivir.',
        duracionMinutos: 100,
        categorias: 'Terror, Ciencia Ficción',
        genero: 'Terror',
        director: 'Michael Sarnoski',
        clasificacion: 'PG-13',
        estreno: '2025-03-08',
        imagen: 'https://m.media-amazon.com/images/M/MV5BMjE0MjYyODI1Ml5BMl5BanBnXkFtZTgwNTE4MTAzNzE@._V1_FMjpg_UX1000_.jpg',
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BMjE0MjYyODI1Ml5BMl5BanBnXkFtZTgwNTE4MTAzNzE@._V1_FMjpg_UX1000_.jpg'
      },

      // AVENTURA
      {
        titulo: 'Indiana Jones y el Círculo del Destino',
        sinopsis: 'Indiana Jones se embarca en su última gran aventura para encontrar un artefacto que puede cambiar el curso de la historia.',
        duracionMinutos: 155,
        categorias: 'Aventura, Acción',
        genero: 'Aventura',
        director: 'James Mangold',
        clasificacion: 'PG-13',
        estreno: '2025-06-30',
        imagen: 'https://m.media-amazon.com/images/M/MV5BYjE4NzQzODItODYyNC00MzQ3LWI5YTUtNmMwZjBmNDZlYjgzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BYjE4NzQzODItODYyNC00MzQ3LWI5YTUtNmMwZjBmNDZlYjgzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'
      },

      // ANIMACIÓN/FAMILIAR
      {
        titulo: 'Toy Story 5',
        sinopsis: 'Woody, Buzz y los juguetes enfrentan su mayor desafío: adaptarse a la era digital mientras mantienen vivo el espíritu de jugar.',
        duracionMinutos: 100,
        categorias: 'Animación, Familiar, Aventura',
        genero: 'Animación',
        director: 'Andrew Stanton',
        clasificacion: 'G',
        estreno: '2025-06-19',
        imagen: 'https://m.media-amazon.com/images/M/MV5BMTA2NTI0NjYxMTheQTJeQWpwZ15BbWU3MDMyMTk3OTM@._V1_FMjpg_UX1000_.jpg',
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BMTA2NTI0NjYxMTheQTJeQWpwZ15BbWU3MDMyMTk3OTM@._V1_FMjpg_UX1000_.jpg'
      },
      {
        titulo: 'Coco 2: El Regreso',
        sinopsis: 'Miguel regresa a la Tierra de los Muertos para ayudar a un alma perdida a encontrar su camino a casa.',
        duracionMinutos: 105,
        categorias: 'Animación, Familiar, Musical',
        genero: 'Animación',
        director: 'Lee Unkrich',
        clasificacion: 'PG',
        estreno: '2025-11-02',
        imagen: 'https://m.media-amazon.com/images/M/MV5BYjQ5NjM0Y2YtNjZkNC00ZDhkLWJjMWItN2QyNzFkMDE3ZjAxXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BYjQ5NjM0Y2YtNjZkNC00ZDhkLWJjMWItN2QyNzFkMDE3ZjAxXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'
      },

      // ANIME
      {
        titulo: 'My Hero Academia: Final Mission',
        sinopsis: 'Deku y los héroes enfrentan la batalla final contra All For One en una guerra que decidirá el futuro de la sociedad.',
        duracionMinutos: 135,
        categorias: 'Anime, Acción, Superhéroes',
        genero: 'Anime',
        director: 'Kenji Nagasaki',
        clasificacion: 'PG-13',
        estreno: '2025-08-15',
        imagen: 'https://m.media-amazon.com/images/M/MV5BZjJjNzI5MDctY2Y4YS00NmM4LTljMmItZTFkOTExNGI3ODRhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BZjJjNzI5MDctY2Y4YS00NmM4LTljMmItZTFkOTExNGI3ODRhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'
      },
      {
        titulo: 'Attack on Titan: The Last Stand',
        sinopsis: 'La batalla final por la libertad de la humanidad. Eren debe tomar la decisión más difícil de su vida.',
        duracionMinutos: 160,
        categorias: 'Anime, Acción, Drama',
        genero: 'Anime',
        director: 'Hajime Isayama',
        clasificacion: 'R',
        estreno: '2025-11-05',
        imagen: 'https://m.media-amazon.com/images/M/MV5BNzc5MTczNDQtNjZkZC00Y2E0LTljYTItNzNhNmUwMGZkMzhhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BNzc5MTczNDQtNjZkZC00Y2E0LTljYTItNzNhNmUwMGZkMzhhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg'
      }
    ];

    let agregadas = 0;
    let actualizadas = 0;

    for (const peliculaData of peliculasNuevas) {
      const existente = await Pelicula.findOne({
        where: { titulo: peliculaData.titulo }
      });

      if (existente) {
        await existente.update(peliculaData);
        console.log(`   ✅ Actualizada: ${peliculaData.titulo} (${peliculaData.genero})`);
        actualizadas++;
      } else {
        await Pelicula.create(peliculaData);
        console.log(`   ✨ Nueva: ${peliculaData.titulo} (${peliculaData.genero})`);
        agregadas++;
      }
    }

    console.log('\n═══════════════════════════════════════════════');
    console.log('✅ PELÍCULAS AGREGADAS/ACTUALIZADAS');
    console.log('═══════════════════════════════════════════════\n');
    console.log(`   🎬 Películas nuevas: ${agregadas}`);
    console.log(`   🔄 Películas actualizadas: ${actualizadas}`);
    console.log(`   📊 Total procesadas: ${agregadas + actualizadas}`);

    // Resumen por género
    const totalPeliculas = await Pelicula.count();
    const porGenero = await sequelize.query(`
      SELECT genero, COUNT(*) as cantidad
      FROM Peliculas
      GROUP BY genero
      ORDER BY cantidad DESC
    `, { type: sequelize.QueryTypes.SELECT });

    console.log('\n📊 Películas por género:\n');
    porGenero.forEach(g => {
      console.log(`   ${g.genero}: ${g.cantidad} película${g.cantidad > 1 ? 's' : ''}`);
    });

    console.log(`\n   TOTAL: ${totalPeliculas} películas en la base de datos`);
    console.log('\n═══════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

agregarPeliculasVariadas();
