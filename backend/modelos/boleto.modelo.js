// backend/modelos/boleto.modelo.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Boleto = sequelize.define('Boleto', {
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  funcionId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  peliculaId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cineId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  salaId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Salas',
      key: 'id'
    }
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  fechaCompra: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, {
  timestamps: true
});

export default Boleto;
