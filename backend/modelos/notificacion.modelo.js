// modelos/notificacion.modelo.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Notificacion = sequelize.define('Notificacion', {
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Usuarios',
      key: 'id'
    }
  },
  tipo: {
    type: DataTypes.ENUM('anuncio_aprobado', 'anuncio_rechazado', 'anuncio_expirado', 'sistema'),
    allowNull: false
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  anuncioId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Anuncios',
      key: 'id'
    }
  },
  leida: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true
});

export default Notificacion;
