// backend/agregar-salaId-boletos.js
import sequelize from './config/db.js';
import './modelos/asociaciones.js';
import Boleto from './modelos/boleto.modelo.js';
import Funcion from './modelos/funcion.modelo.js';

async function agregarSalaId() {
  try {
    console.log('🔄 Paso 1: Agregando columna salaId a tabla Boletos...');

    // Sincronizar modelo Boleto con alter: true
    await Boleto.sync({ alter: true });
    console.log('✅ Columna salaId agregada');

    console.log('\n🔄 Paso 2: Poblando salaId desde Funciones...');

    // Obtener todos los boletos
    const boletos = await Boleto.findAll({
      include: [{
        model: Funcion,
        as: 'funcion',
        attributes: ['salaId']
      }]
    });

    let actualizados = 0;
    for (const boleto of boletos) {
      if (boleto.funcion && boleto.funcion.salaId) {
        await boleto.update({ salaId: boleto.funcion.salaId });
        actualizados++;
      }
    }

    console.log(`✅ ${actualizados} boletos actualizados con salaId`);

    console.log('\n🔍 Verificando resultado...');
    const [columns] = await sequelize.query("DESCRIBE Boletos;");
    const tieneSalaId = columns.find(c => c.Field === 'salaId');

    if (tieneSalaId) {
      console.log('✅ Campo salaId existe en la tabla');
      console.log(`   Tipo: ${tieneSalaId.Type}`);
      console.log(`   Null: ${tieneSalaId.Null}`);
    }

    console.log('\n🎉 Migración completada exitosamente');
    console.log('   Ahora las calificaciones y comentarios de salas funcionarán correctamente');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en migración:', error);
    process.exit(1);
  }
}

agregarSalaId();
