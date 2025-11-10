// Sincronizar modelo ConfigAnuncio actualizado
import sequelize from './config/db.js';
import ConfigAnuncio from './modelos/config-anuncio.modelo.js';

async function sincronizarConfig() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión establecida');

    // Force sync para recrear la tabla con la nueva estructura
    await ConfigAnuncio.sync({ force: true });
    console.log('📦 Tabla ConfigAnuncios sincronizada (recreada)');

    // Crear configuración por defecto
    const config = await ConfigAnuncio.create({
      porcentajeOcultacion: 40.0,
      costoDiarioBase: 25.0,
      preciosAnuncios: {
        texto: 25,
        imagen: 50,
        video: 100,
        banner: 75,
        mixto: 80
      }
    });

    console.log('✅ Configuración por defecto creada:');
    console.log(`   - Porcentaje ocultación: ${config.porcentajeOcultacion}%`);
    console.log(`   - Costo base diario: Q${config.costoDiarioBase}`);
    console.log(`   - Precios: ${JSON.stringify(config.preciosAnuncios, null, 2)}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

sincronizarConfig();
