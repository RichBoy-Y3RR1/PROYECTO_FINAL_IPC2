// backend/modelos/pelicula.modelo.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Pelicula = sequelize.define('Pelicula', {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  sinopsis: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  duracion: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  duracionMinutos: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  genero: {
    type: DataTypes.STRING,
    allowNull: true
  },
  categorias: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  director: {
    type: DataTypes.STRING,
    allowNull: true
  },
  clasificacion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  anio: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  estreno: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  imagen: {
    type: DataTypes.STRING,
    allowNull: true
  },
  posterUrl: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

export default Pelicula;
