// backend/modelos/cartera.modelo.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Cartera = sequelize.define('Cartera', {
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  saldo: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    allowNull: false
  }
}, {
  timestamps: true
});

export default Cartera;
