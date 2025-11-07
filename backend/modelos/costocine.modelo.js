// modelos/costocine.modelo.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const CostoCine = sequelize.define('CostoCine', {
  monto: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  desdeFecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
});
export default CostoCine;
