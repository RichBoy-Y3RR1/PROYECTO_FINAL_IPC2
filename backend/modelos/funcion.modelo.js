// backend/modelos/funcion.modelo.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Funcion = sequelize.define('Funcion', {
  peliculaId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  salaId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  cineId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  hora: {
    type: DataTypes.STRING,
    allowNull: false
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  timestamps: true
});

export default Funcion;
