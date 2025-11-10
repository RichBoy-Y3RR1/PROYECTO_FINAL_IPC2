// modelos/costocine.modelo.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const CostoCine = sequelize.define('CostoCine', {
  cineId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Cines',
      key: 'id'
    }
  },
  costoDiario: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: 'Costo diario de funcionamiento del cine'
  },
  fechaInicio: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: 'Fecha desde la cual aplica este costo (puede ser nula para registros legacy)'
  },
  // Campos legacy para compatibilidad
  monto: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  desdeFecha: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'CostoCines'
});

export default CostoCine;
