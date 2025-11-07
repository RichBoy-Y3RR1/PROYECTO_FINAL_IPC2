// Modelo de CostoCine
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const CostoCine = sequelize.define('CostoCine', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  costoDiario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  fechaInicio: {
    type: DataTypes.DATE,
    allowNull: false
  },
  fechaFin: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

export default CostoCine;
