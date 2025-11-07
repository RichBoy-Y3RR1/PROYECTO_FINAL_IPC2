// controladores/auth.controlador.js
import Usuario from '../modelos/usuario.modelo.js';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'secreto_super_seguro'; // 🔐 cámbialo en producción

export const registrar = [
  // Validaciones
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('correo').isEmail().withMessage('Debe ser un correo válido'),
  body('contraseña').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }

    try {
      const { nombre, correo, contraseña, tipo } = req.body;
      const hash = await bcrypt.hash(contraseña, 10);
      const usuario = await Usuario.create({ nombre, correo, contraseña: hash, tipo });
      res.json({ msg: 'Usuario registrado', usuario });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
];

export const login = [
  // Validaciones
  body('correo').isEmail().withMessage('Debe ser un correo válido'),
  body('contraseña').notEmpty().withMessage('La contraseña es obligatoria'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }

    try {
      const { correo, contraseña } = req.body;
      const usuario = await Usuario.findOne({ where: { correo } });

      if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' });

      const valido = await bcrypt.compare(contraseña, usuario.contraseña);
      if (!valido) return res.status(401).json({ msg: 'Contraseña incorrecta' });

      const token = jwt.sign({ id: usuario.id, tipo: usuario.tipo }, JWT_SECRET, { expiresIn: '8h' });
      res.json({ token, usuario });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
];
