-- Script SQL para crear un anuncio de prueba directamente
-- Ejecutar este script si hay problemas con el endpoint

-- 1. Obtener el ID del usuario anunciante
SET @anuncianteId = (SELECT id FROM Usuarios WHERE correo = 'anunciante@empresa.com' LIMIT 1);

-- 2. Verificar saldo
SELECT 
    u.nombre, 
    u.correo, 
    c.saldo as 'Saldo Actual'
FROM Usuarios u
JOIN Carteras c ON u.id = c.usuarioId
WHERE u.correo = 'anunciante@empresa.com';

-- 3. Crear anuncio de prueba
INSERT INTO Anuncios (
    titulo,
    contenido,
    tipo,
    texto,
    imagenUrl,
    enlaceUrl,
    costo,
    costoOcultacion,
    duracionDias,
    fechaInicio,
    fechaFin,
    activo,
    aprobado,
    usuarioAnuncianteId,
    destinatarios,
    impresiones,
    clics,
    createdAt,
    updatedAt
) VALUES (
    '🎉 Promoción de Prueba',
    'Descuento del 20% en todas las películas',
    'texto-imagen',
    'Descuento del 20% en todas las películas',
    'https://picsum.photos/400/300',
    'https://cinehub.com',
    350.00,
    140.00,
    7,
    CURDATE(),
    DATE_ADD(CURDATE(), INTERVAL 7 DAY),
    1,
    0,
    @anuncianteId,
    'todos',
    0,
    0,
    NOW(),
    NOW()
);

-- 4. Descontar del saldo
UPDATE Carteras 
SET saldo = saldo - 350
WHERE usuarioId = @anuncianteId;

-- 5. Registrar pago
INSERT INTO Pagos (usuarioId, boletoId, monto, metodo, fechaPago, concepto, createdAt, updatedAt)
VALUES (
    @anuncianteId,
    NULL,
    350.00,
    'cartera',
    NOW(),
    'Anuncio: Promoción de Prueba',
    NOW(),
    NOW()
);

-- 6. Verificar anuncio creado
SELECT 
    a.id,
    a.titulo,
    a.tipo,
    a.costo,
    a.fechaInicio,
    a.fechaFin,
    a.activo,
    a.aprobado,
    u.nombre as 'Anunciante'
FROM Anuncios a
JOIN Usuarios u ON a.usuarioAnuncianteId = u.id
WHERE u.correo = 'anunciante@empresa.com'
ORDER BY a.createdAt DESC
LIMIT 1;

-- 7. Verificar saldo actualizado
SELECT 
    u.nombre,
    u.correo,
    c.saldo as 'Saldo Después de Crear Anuncio'
FROM Usuarios u
JOIN Carteras c ON u.id = c.usuarioId
WHERE u.correo = 'anunciante@empresa.com';

-- 8. Para aprobar el anuncio (ejecutar como admin):
-- UPDATE Anuncios SET aprobado = 1 WHERE id = (SELECT MAX(id) FROM (SELECT id FROM Anuncios WHERE usuarioAnuncianteId = @anuncianteId) as temp);
