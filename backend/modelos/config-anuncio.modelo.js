// modelos/config-anuncio.modelo.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const ConfigAnuncio = sequelize.define('ConfigAnuncio', {
  tipo: {
    type: DataTypes.ENUM('texto', 'imagen', 'video'),
    allowNull: false,
    unique: true
  },
  precioDiario: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 10
  },
  periodosPermitidos: {
    // CSV de días permitidos, ej: "1,3,7,14"
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '1,3,7,14'
  }
});

export default ConfigAnuncio;
