// modelos/anuncio.modelo.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Anuncio = sequelize.define('Anuncio', {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contenido: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  tipo: {
    // Ajuste: alineado al requerimiento formal
    // 'texto' | 'texto-imagen' | 'video-texto'
    // Se mantienen valores legacy para compatibilidad y migración transparente
    type: DataTypes.ENUM('texto', 'texto-imagen', 'video-texto', 'imagen', 'video', 'banner', 'mixto'),
    allowNull: false,
    defaultValue: 'texto'
  },
  texto: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  imagenUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  enlaceUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  costo: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 50.0
  },
  costoOcultacion: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 20.0
  },
  fechaInicio: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  fechaFin: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  duracionDias: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 7
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  aprobado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  usuarioAnuncianteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Usuarios',
      key: 'id'
    }
  },
  destinatarios: {
    type: DataTypes.ENUM('admin-general', 'admin-cine', 'usuarios', 'todos'),
    defaultValue: 'todos'
  },
  // Métricas de interacción
  impresiones: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  clics: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  timestamps: true
});

export default Anuncio;
