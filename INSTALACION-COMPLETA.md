# 🎬 El CineHub - Guía de Instalación Completa

## 📋 Requisitos Previos

### Software Necesario:
1. **Node.js** v18 o superior
   - Descargar de: https://nodejs.org/
   - Verificar instalación: `node --version` y `npm --version`

2. **MySQL** 8.0 o superior
   - Descargar de: https://dev.mysql.com/downloads/mysql/
   - Usuario root con contraseña conocida

3. **Angular CLI** v20 o superior
   - Instalar globalmente: `npm install -g @angular/cli`
   - Verificar: `ng version`

4. **Git** (para clonar el repositorio)
   - Descargar de: https://git-scm.com/

## 🚀 Instalación Paso a Paso

### 1. Clonar el Repositorio

```bash
git clone https://github.com/RichBoy-Y3RR1/PROYECTO_FINAL_IPC2.git
cd PROYECTO_FINAL_IPC2
```

### 2. Configurar Base de Datos MySQL

Abrir MySQL Workbench o línea de comandos MySQL:

```sql
-- Crear base de datos
CREATE DATABASE cinehub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crear usuario (opcional, o usar root)
CREATE USER 'cinehub_user'@'localhost' IDENTIFIED BY 'cinehub_password';
GRANT ALL PRIVILEGES ON cinehub.* TO 'cinehub_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Configurar Backend

```bash
# Navegar a la carpeta backend
cd backend

# Instalar dependencias
npm install

# Configurar conexión a base de datos
# Editar archivo: backend/config/db.js
# Asegurarse de que las credenciales coincidan:
# - database: 'cinehub'
# - username: 'root' (o el usuario creado)
# - password: 'tu_contraseña_mysql'
```

### 4. Inicializar Base de Datos con Datos

```bash
# Desde la carpeta backend
node seed-completo.js
```

Este comando creará todas las tablas y cargará datos de prueba:
- Usuarios de todos los roles
- Películas
- Cines
- Salas
- Funciones
- Anuncios

### 5. Configurar Frontend

```bash
# Volver a la raíz del proyecto
cd ..

# Instalar dependencias de Angular
npm install
```

### 6. Iniciar la Aplicación

**Opción A: Usar el archivo INICIAR.bat (Windows)**
```bash
# Doble clic en INICIAR.bat
# O desde terminal:
INICIAR.bat
```

**Opción B: Iniciar manualmente en dos terminales**

Terminal 1 - Backend:
```bash
cd backend
npm start
# O: node index.js
```

Terminal 2 - Frontend:
```bash
npm start
# O: ng serve
```

### 7. Acceder a la Aplicación

Abrir navegador en: **http://localhost:4400**

## 👥 Credenciales de Prueba

### Administrador del Sistema
- **Email:** `admin@sistema.com`
- **Contraseña:** `123456`
- **Funciones:** Gestión completa del sistema, aprobar anuncios, ver reportes globales

### Administrador de Cine
- **Email:** `admin@asdf.com`
- **Contraseña:** `123456`
- **Cine asignado:** asdf
- **Funciones:** Gestionar salas, funciones, bloquear anuncios, ver reportes del cine

### Usuario Anunciante
- **Email:** `anunciante@test.com`
- **Contraseña:** `123456`
- **Funciones:** Crear y gestionar anuncios publicitarios

### Usuario Común
- **Email:** `user@test.com`
- **Contraseña:** `123456`
- **Funciones:** Comprar boletos, ver películas, comentar, calificar

## 🔧 Solución de Problemas

### Error: "Cannot connect to MySQL"
- Verificar que MySQL esté corriendo
- Revisar credenciales en `backend/config/db.js`
- Verificar que la base de datos `cinehub` exista

### Error: "Port 4000 already in use"
```bash
# Windows
taskkill /F /IM node.exe

# Linux/Mac
killall node
```

### Error: "Port 4400 already in use"
- Cerrar otros servidores Angular
- Cambiar puerto en `angular.json` si es necesario

### Problemas con node_modules
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd ..
rm -rf node_modules package-lock.json
npm install
```

## 📊 Estructura del Proyecto

```
el-cineHub-proyecto/
├── backend/                 # Servidor Node.js + Express
│   ├── config/             # Configuración DB
│   ├── controladores/      # Lógica de negocio
│   ├── modelos/           # Modelos Sequelize
│   ├── rutas/             # Endpoints API
│   ├── middlewares/       # Autenticación JWT
│   ├── jasper/            # Generación de reportes PDF
│   └── index.js           # Punto de entrada
├── src/                    # Aplicación Angular
│   ├── app/
│   │   ├── pages/         # Componentes de páginas
│   │   ├── guards/        # Protección de rutas
│   │   └── services/      # Servicios HTTP
│   └── assets/            # Imágenes y recursos
└── INICIAR.bat            # Script de inicio rápido
```

## 🎯 Funcionalidades Principales

### Sistema de Roles
- **Admin Sistema:** Control total, aprobar anuncios, reportes generales
- **Admin Cine:** Gestión de su cine específico, salas, funciones, reportes propios
- **Anunciante:** Crear y publicar anuncios pagados
- **Usuario:** Comprar boletos, ver cartelera, calificar películas

### Módulos Implementados
- ✅ Autenticación JWT con roles
- ✅ Gestión de películas y cartelera
- ✅ Sistema de boletos y pagos (cartera virtual)
- ✅ Anuncios publicitarios con costos
- ✅ Bloqueo de anuncios por cine (sin costo)
- ✅ Comentarios y calificaciones
- ✅ Reportes en PDF (JasperReports)
- ✅ Dashboard para cada rol
- ✅ Internacionalización (español)

## 📞 Soporte

Para problemas o dudas:
- **GitHub:** https://github.com/RichBoy-Y3RR1/PROYECTO_FINAL_IPC2
- **Email:** yerribamaca@gmail.com

## 📝 Notas Importantes

1. **Primera ejecución:** Ejecutar `seed-completo.js` solo una vez
2. **Bloqueo de anuncios:** Ahora es completamente gratuito para admins de cine
3. **Reportes:** Requieren datos en la BD para generarse correctamente
4. **Imágenes:** Las URLs de películas usan CDN de Amazon/IMDb

## ✅ Verificación de Instalación

Después de instalar, verificar:

1. ✅ Backend corriendo en http://localhost:4000
2. ✅ Frontend corriendo en http://localhost:4400
3. ✅ Login exitoso con credenciales de prueba
4. ✅ Navegación entre diferentes roles
5. ✅ Cartelera mostrando películas con imágenes
6. ✅ Compra de boletos funcional
7. ✅ Reportes PDF generándose correctamente

---

**Proyecto desarrollado para el curso IPC2 - 2025**
**Sistema completo de gestión de cines y entretenimiento**
