// modelos/calificacion.modelo.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Calificacion = sequelize.define('Calificacion', {
  tipo: {
    type: DataTypes.ENUM('pelicula', 'sala'),
    allowNull: false
  },
  peliculaId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Peliculas',
      key: 'id'
    }
  },
  salaId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Salas',
      key: 'id'
    }
  },
  valor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  }
});

export default Calificacion;
