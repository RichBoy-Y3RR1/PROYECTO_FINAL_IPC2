import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_produccion_2024';

export const verificarToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        msg: 'Token de autenticación requerido',
        error: 'UNAUTHORIZED'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token || token === 'null' || token === 'undefined') {
      return res.status(401).json({
        msg: 'Token inválido o no proporcionado',
        error: 'INVALID_TOKEN'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'cinehub-backend',
      audience: 'cinehub-app'
    });

    if (!decoded.id || !decoded.tipo) {
      return res.status(403).json({
        msg: 'Token con información incompleta',
        error: 'INVALID_PAYLOAD'
      });
    }

    req.usuario = decoded;
    next();

  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        msg: 'Token expirado. Por favor inicie sesión nuevamente',
        error: 'TOKEN_EXPIRED'
      });
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({
        msg: 'Token inválido o manipulado',
        error: 'INVALID_TOKEN'
      });
    }

    return res.status(500).json({
      msg: 'Error al verificar token',
      error: 'SERVER_ERROR'
    });
  }
};

export const soloRoles = (...tipos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        msg: 'Debe estar autenticado',
        error: 'NO_AUTH'
      });
    }

    if (!tipos.includes(req.usuario.tipo)) {
      return res.status(403).json({
        msg: `Acceso denegado. Roles permitidos: ${tipos.join(', ')}`,
        error: 'FORBIDDEN',
        userRole: req.usuario.tipo,
        allowedRoles: tipos
      });
    }

    next();
  };
};

export const soloAdminGeneral = (req, res, next) => {
  if (req.usuario.tipo !== 'admin-general') {
    return res.status(403).json({
      msg: 'Solo administradores generales pueden acceder',
      error: 'ADMIN_ONLY'
    });
  }
  next();
};

export const soloAdminCine = (req, res, next) => {
  if (req.usuario.tipo !== 'admin-cine' && req.usuario.tipo !== 'admin_cine') {
    return res.status(403).json({
      msg: 'Solo administradores de cine pueden acceder',
      error: 'ADMIN_CINE_ONLY'
    });
  }
  next();
};

export const soloAnunciante = (req, res, next) => {
  if (req.usuario.tipo !== 'anunciante') {
    return res.status(403).json({
      msg: 'Solo anunciantes pueden acceder',
      error: 'ANUNCIANTE_ONLY'
    });
  }
  next();
};
