// middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'secreto_super_seguro';

export const verificarToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ msg: 'Token requerido' });

  try {
    const decoded = jwt.verify(token.split(' ')[1], JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    res.status(403).json({ msg: 'Token inválido' });
  }
};

export const soloRoles = (...tipos) => {
  return (req, res, next) => {
    if (!tipos.includes(req.usuario.tipo)) {
      return res.status(403).json({ msg: 'No autorizado para este recurso' });
    }
    next();
  };
};
