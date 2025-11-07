// modelos/bloqueoanuncio.modelo.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const BloqueoAnuncio = sequelize.define('BloqueoAnuncio', {
  fechaInicio: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  dias: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  montoPagado: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
});

export default BloqueoAnuncio;
