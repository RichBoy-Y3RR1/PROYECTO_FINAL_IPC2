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
