// modelos/anuncio.modelo.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Anuncio = sequelize.define('Anuncio', {
  tipo: {
    type: DataTypes.ENUM('texto', 'imagen', 'video'),
    allowNull: false
  },
  texto: DataTypes.STRING,
  imagenUrl: DataTypes.STRING,
  videoUrl: DataTypes.STRING,
  fechaInicio: DataTypes.DATEONLY,
  duracionDias: DataTypes.INTEGER,
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

export default Anuncio;
