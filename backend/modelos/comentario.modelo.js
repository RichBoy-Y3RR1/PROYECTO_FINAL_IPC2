// modelos/comentario.modelo.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Comentario = sequelize.define('Comentario', {
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
  texto: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

export default Comentario;
