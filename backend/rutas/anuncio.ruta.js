import express from 'express';
import {
  crearAnuncio,
  misAnuncios,
  editarAnuncio,
  eliminarAnuncio,
  anunciosVigentes,
  listarAnuncios,
  aprobarAnuncio,
  desactivarAnuncio,
  registrarClick,
  registrarImpresiones
} from '../controladores/anuncio.controlador.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Rutas públicas
router.get('/vigentes', anunciosVigentes);
router.post('/:id/click', registrarClick);
router.post('/impresiones', registrarImpresiones);

// Rutas para usuario anunciante
router.post('/', verificarToken, crearAnuncio);
router.get('/mis-anuncios', verificarToken, misAnuncios);
router.put('/:id', verificarToken, editarAnuncio);
router.delete('/:id', verificarToken, eliminarAnuncio);

// Rutas para admin (requieren verificación de rol en el controlador o middleware adicional)
router.get('/', verificarToken, listarAnuncios);
router.patch('/:id/aprobar', verificarToken, aprobarAnuncio);
router.patch('/:id/desactivar', verificarToken, desactivarAnuncio);

export default router;
