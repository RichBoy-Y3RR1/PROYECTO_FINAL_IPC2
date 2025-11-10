// controladores/auth.controlador.js
import Usuario from '../modelos/usuario.modelo.js';
import Cartera from '../modelos/cartera.modelo.js';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sequelize from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_produccion_2024';

export const registrar = [
  // Validaciones relajadas para asegurar registro exitoso
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),

  body('correo')
    .trim()
    .notEmpty().withMessage('El correo es obligatorio')
    .isEmail().withMessage('Debe ser un correo válido')
    .normalizeEmail(),

  body('contraseña')
    .isLength({ min: 6, max: 100 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

  body('telefono')
    .optional({ checkFalsy: true })
    .isLength({ max: 20 }).withMessage('Teléfono demasiado largo'),
  body('edad').optional({ checkFalsy: true }).isInt({ min: 13, max: 120 }).withMessage('La edad debe estar entre 13 y 120 años'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Log detallado para depuración de por qué falla el registro
      console.warn('Validación registro falló:', errors.array());
      return res.status(400).json({ errores: errors.array(), msg: 'Datos inválidos' });
    }

    const transaction = await sequelize.transaction();

    try {
      const { nombre, correo, contraseña, tipo, edad, telefono } = req.body;

      if (!nombre || !correo || !contraseña) {
        await transaction.rollback();
        return res.status(400).json({ msg: 'Nombre, correo y contraseña son requeridos' });
      }

      const usuarioExistente = await Usuario.findOne({ where: { correo: correo.toLowerCase().trim() } });
      if (usuarioExistente) {
        await transaction.rollback();
        return res.status(409).json({ msg: 'El correo ya está registrado' });
      }

      const hash = await bcrypt.hash(contraseña, 10);

      const usuario = await Usuario.create({
        nombre: nombre.trim(),
        correo: correo.toLowerCase().trim(),
        email: correo.toLowerCase().trim(),
        contraseña: hash,
        tipo: tipo || 'cliente',
        edad: edad || null,
        telefono: telefono || null,
        cineId: null
      }, { transaction });

      // Crear cartera inicial siempre que sea cliente/anunciante/admin-cine
      if (['cliente','anunciante','admin-cine','admin_cine'].includes(usuario.tipo)) {
        await Cartera.create({
          usuarioId: usuario.id,
          saldo: 0
        }, { transaction });
      }

      await transaction.commit();

      const usuarioSinPassword = {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        tipo: usuario.tipo
      };

      res.status(201).json({
        msg: 'Usuario registrado exitosamente',
        usuario: usuarioSinPassword
      });

    } catch (error) {
      await transaction.rollback();
      console.error('Error al registrar:', error);
      res.status(500).json({ msg: 'Error al registrar usuario', error: error.message });
    }
  }
];

export const login = [
  body('correo')
    .trim()
    .notEmpty().withMessage('El correo es obligatorio')
    .isEmail().withMessage('Debe ser un correo válido')
    .normalizeEmail(),

  body('contraseña')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }

    try {
      const { correo, contraseña } = req.body;

      if (!correo || !contraseña) {
        return res.status(400).json({ msg: 'Correo y contraseña son requeridos' });
      }

      const usuario = await Usuario.findOne({
        where: { correo: correo.toLowerCase().trim() }
      });

      if (!usuario) {
        return res.status(404).json({ msg: 'Usuario no encontrado' });
      }

      const valido = await bcrypt.compare(contraseña, usuario.contraseña);
      if (!valido) {
        return res.status(401).json({ msg: 'Contraseña incorrecta' });
      }

      const payload = {
        id: usuario.id,
        tipo: usuario.tipo,
        cineId: usuario.cineId || null
      };

      const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: '8h',
        issuer: 'cinehub-backend',
        audience: 'cinehub-app'
      });

      const usuarioSeguro = {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        tipo: usuario.tipo,
        cineId: usuario.cineId
      };

      res.json({
        token,
        usuario: usuarioSeguro,
        msg: 'Login exitoso'
      });

    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ msg: 'Error en el servidor', error: error.message });
    }
  }
];
