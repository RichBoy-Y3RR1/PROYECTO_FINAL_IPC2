// Recargar saldo del anunciante de prueba
import sequelize from './config/db.js';
import Cartera from './modelos/cartera.modelo.js';
import Usuario from './modelos/usuario.modelo.js';

async function recargarAnunciante() {
  try {
    await sequelize.authenticate();
    console.log(' Conexión establecida');

    // Buscar usuario anunciante
    const usuario = await Usuario.findOne({
      where: { correo: 'anunciante@test.com' }
    });

    if (!usuario) {
      console.log(' Usuario anunciante no encontrado');
      process.exit(1);
    }

    console.log(` Usuario: ${usuario.nombre} (ID: ${usuario.id})`);

    // Buscar o crear cartera
    let cartera = await Cartera.findOne({ where: { usuarioId: usuario.id } });

    if (!cartera) {
      cartera = await Cartera.create({
        usuarioId: usuario.id,
        saldo: 5000.00
      });
      console.log(' Cartera creada con Q5000.00');
    } else {
      cartera.saldo = 5000.00;
      await cartera.save();
      console.log(` Saldo actualizado a Q${cartera.saldo.toFixed(2)}`);
    }

    console.log('\n Recarga exitosa. Ahora puedes crear anuncios.');
    process.exit(0);
  } catch (error) {
  console.error('Error:', error);
    process.exit(1);
  }
}

recargarAnunciante();
