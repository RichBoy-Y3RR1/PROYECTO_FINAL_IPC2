import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Usuario from '../modelos/usuario.modelo.js';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    // Buscar usuario
    const usuario = await Usuario.findOne({ where: { correo } });
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token
    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo },
      'tu_secreto_jwt',
      { expiresIn: '1d' }
    );

    res.json({ token, usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      tipo: usuario.tipo
    }});

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

export default router;
