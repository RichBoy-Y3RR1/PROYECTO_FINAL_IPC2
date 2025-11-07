// modelos/sala.modelo.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Sala = sequelize.define('Sala', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  capacidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tipo: {
    type: DataTypes.STRING,
    defaultValue: 'Normal'
  },
  bloquearComentarios: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  bloquearCalificaciones: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  visiblePublica: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  cineId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Cines',
      key: 'id'
    }
  },
  numero: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
});

export default Sala;
