// modelos/calificacion.modelo.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Calificacion = sequelize.define('Calificacion', {
  tipo: {
    type: DataTypes.ENUM('pelicula', 'sala'),
    allowNull: false
  },
  valor: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 5
    }
  }
});
export default Calificacion;
