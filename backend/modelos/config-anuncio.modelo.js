// modelos/config-anuncio.modelo.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const ConfigAnuncio = sequelize.define('ConfigAnuncio', {
  porcentajeOcultacion: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 40.0,
    comment: 'Porcentaje del costo del anuncio que cobra el admin_cine por ocultar'
  },
  costoDiarioBase: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 25.0,
    comment: 'Costo base diario para anuncios (tipo texto)'
  },
  preciosAnuncios: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      texto: 25,
      imagen: 50,
      video: 100,
      banner: 75,
      mixto: 80
    },
    comment: 'Precios por tipo de anuncio por día'
  }
}, {
  tableName: 'ConfigAnuncios',
  timestamps: true
});

export default ConfigAnuncio;
