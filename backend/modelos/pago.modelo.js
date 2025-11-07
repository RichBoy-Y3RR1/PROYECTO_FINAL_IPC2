// backend/modelos/pago.modelo.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Pago = sequelize.define('Pago', {
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  boletoId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  monto: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  metodo: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'cartera' // 👈 método de pago por defecto
  },
  fechaPago: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  timestamps: true
});

export default Pago;
