// backend/config/db.js
import { Sequelize } from 'sequelize';

// Único punto de inicialización de Sequelize (sin auto-sync destructivo)
// Usa variables de entorno si existen, con fallback seguro.
const DB_NAME = process.env.DB_NAME || 'cinehub_db';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || '12345';
const DB_HOST = process.env.DB_HOST || 'localhost';

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: 'mysql',
  logging: false
});

export const inicializarConexion = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL establecida con éxito');
  } catch (error) {
    console.error('❌ Error al conectar a MySQL:', error);
    throw error;
  }
};

export default sequelize;
