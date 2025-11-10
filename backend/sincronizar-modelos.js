// backend/sincronizar-modelos.js
// Script para aplicar los cambios de los modelos Comentario y Calificacion a la base de datos

import sequelize from './config/db.js';
import './modelos/asociaciones.js';
import Comentario from './modelos/comentario.modelo.js';
import Calificacion from './modelos/calificacion.modelo.js';

async function sincronizarModelos() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa a MySQL');

    console.log('\n📊 Sincronizando modelos Comentario y Calificacion...');
    console.log('   ⚠️  Usando { alter: true } para agregar columnas peliculaId y salaId');

    // Sincronizar solo los modelos modificados con alter: true
    await Comentario.sync({ alter: true });
    console.log('   ✅ Comentario sincronizado (agregadas columnas peliculaId, salaId)');

    await Calificacion.sync({ alter: true });
    console.log('   ✅ Calificacion sincronizado (agregadas columnas peliculaId, salaId)');

    console.log('\n✨ Sincronización completada exitosamente');
    console.log('\n📋 Cambios aplicados:');
    console.log('   • Tabla Comentario: columnas peliculaId, salaId agregadas');
    console.log('   • Tabla Calificacion: columnas peliculaId, salaId agregadas');
    console.log('   • Ambas tablas ahora soportan comentarios/calificaciones para películas Y salas');

    console.log('\n🎯 Puedes ahora:');
    console.log('   1. Calificar películas: POST /api/calificaciones/pelicula');
    console.log('   2. Calificar salas: POST /api/calificaciones/sala');
    console.log('   3. Comentar películas: POST /api/comentarios (tipo: "pelicula")');
    console.log('   4. Comentar salas: POST /api/comentarios (tipo: "sala")');

    await sequelize.close();
    console.log('\n🔌 Conexión cerrada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al sincronizar modelos:', error);
    process.exit(1);
  }
}

sincronizarModelos();
