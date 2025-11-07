// modelos/comentario.modelo.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Comentario = sequelize.define('Comentario', {
  tipo: {
    type: DataTypes.ENUM('pelicula', 'sala'),
    allowNull: false
  },
  texto: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});
export default Comentario;
