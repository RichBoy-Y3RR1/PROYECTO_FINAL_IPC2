// Sincronizar modelo Pago con allowNull en boletoId
import sequelize from './config/db.js';
import Pago from './modelos/pago.modelo.js';

async function sincronizarPago() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión establecida');

    // Alter table para permitir null en boletoId
    await Pago.sync({ alter: true });
    console.log('📦 Tabla Pagos sincronizada (boletoId ahora acepta NULL)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

sincronizarPago();
