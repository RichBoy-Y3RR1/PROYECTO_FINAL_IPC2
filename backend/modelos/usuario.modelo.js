// backend/modelos/usuario.modelo.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Usuario = sequelize.define('Usuario', {
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  correo: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  contraseña: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [6, 255]
    }
  },
  tipo: {
    type: DataTypes.ENUM('cliente', 'admin', 'admin_cine', 'admin-general', 'admin-cine', 'anunciante'),
    defaultValue: 'cliente',
    allowNull: false
  },
  cineId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Cines',
      key: 'id'
    }
  },
  edad: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 13,
      max: 120
    }
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['correo']
    },
    {
      fields: ['tipo']
    }
  ]
});

export default Usuario;
