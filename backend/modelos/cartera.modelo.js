// backend/modelos/cartera.modelo.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Cartera = sequelize.define('Cartera', {
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'Usuarios',
      key: 'id'
    }
  },
  saldo: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    allowNull: false,
    validate: {
      min: 0
    }
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['usuarioId']
    }
  ]
});

export default Cartera;
