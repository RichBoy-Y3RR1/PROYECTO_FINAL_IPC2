import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Op } from 'sequelize';
import Anuncio from '../models/anuncio.model.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Configuración de multer para subida de imágenes
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const dir = 'uploads/anuncios';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max
    },
    fileFilter: function(req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Solo se permiten imágenes (jpeg, jpg, png)'));
    }
});

// Middleware para validar el período y calcular fechaFin
const validarPeriodo = (req, res, next) => {
    const { periodoTiempo, fechaInicio } = req.body;
    const inicio = new Date(fechaInicio);

    const periodos = {
        '1_DIA': 1,
        '3_DIAS': 3,
        '1_SEMANA': 7,
        '2_SEMANAS': 14
    };

    if (!periodos[periodoTiempo]) {
        return res.status(400).json({ error: 'Período de tiempo inválido' });
    }

    const fin = new Date(inicio);
    fin.setDate(fin.getDate() + periodos[periodoTiempo]);
    req.body.fechaFin = fin;
    next();
};

// Obtener todos los anuncios
router.get('/', verificarToken, async (req, res) => {
    try {
        const { estado } = req.query;
        const where = {};

        if (estado) {
            where.estado = estado;
        }

        const anuncios = await Anuncio.findAll({ where });
        res.json(anuncios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear nuevo anuncio
router.post('/', [verificarToken, upload.single('imagen'), validarPeriodo], async (req, res) => {
    try {
        const anuncioData = {
            ...req.body,
            anuncianteId: req.usuario.id
        };

        if (req.file) {
            anuncioData.imagen = req.file.path;
        }

        const anuncio = await Anuncio.create(anuncioData);
        res.status(201).json(anuncio);
    } catch (error) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(400).json({ error: error.message });
    }
});

// Actualizar anuncio
router.put('/:id', [verificarToken, upload.single('imagen'), validarPeriodo], async (req, res) => {
    try {
        const anuncio = await Anuncio.findByPk(req.params.id);
        if (!anuncio) {
            return res.status(404).json({ error: 'Anuncio no encontrado' });
        }

        if (anuncio.anuncianteId !== req.usuario.id && req.usuario.rol !== 'ADMIN') {
            return res.status(403).json({ error: 'No autorizado' });
        }

        const anuncioData = { ...req.body };
        if (req.file) {
            if (anuncio.imagen) {
                fs.unlinkSync(anuncio.imagen);
            }
            anuncioData.imagen = req.file.path;
        }

        await anuncio.update(anuncioData);
        res.json(anuncio);
    } catch (error) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(400).json({ error: error.message });
    }
});

// Desactivar anuncio
router.patch('/:id/desactivar', verificarToken, async (req, res) => {
    try {
        const anuncio = await Anuncio.findByPk(req.params.id);
        if (!anuncio) {
            return res.status(404).json({ error: 'Anuncio no encontrado' });
        }

        if (anuncio.anuncianteId !== req.usuario.id && req.usuario.rol !== 'ADMIN') {
            return res.status(403).json({ error: 'No autorizado' });
        }

        await anuncio.update({ estado: 'INACTIVO' });
        res.json({ mensaje: 'Anuncio desactivado exitosamente' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Obtener estadísticas
router.get('/estadisticas', verificarToken, async (req, res) => {
    try {
        const { desde, hasta } = req.query;
        const where = {};

        if (desde && hasta) {
            where.fechaInicio = {
                [Op.between]: [new Date(desde), new Date(hasta)]
            };
        }

        const estadisticas = await Anuncio.findAll({
            where,
            attributes: [
                'tipo',
                'estado',
                [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
                [sequelize.fn('SUM', sequelize.col('costo')), 'ingresos']
            ],
            group: ['tipo', 'estado']
        });

        res.json(estadisticas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
