# 🎬 El CineHub - Sistema de Gestión de Cines

Sistema completo de gestión de cines con múltiples roles, cartelera, venta de boletos, anuncios publicitarios y reportes.

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18+
- MySQL 8.0+
- Angular CLI 20+

### Instalación

1. **Clonar repositorio:**
```bash
git clone https://github.com/RichBoy-Y3RR1/PROYECTO_FINAL_IPC2.git
cd PROYECTO_FINAL_IPC2
```

2. **Configurar MySQL:**
```sql
CREATE DATABASE cinehub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. **Instalar dependencias:**
```bash
# Backend
cd backend
npm install

# Frontend
cd ..
npm install
```

4. **Cargar datos iniciales:**
```bash
cd backend
node seed-completo.js
```

5. **Iniciar aplicación:**
```bash
# Windows: doble clic en INICIAR.bat
# O manualmente:
# Terminal 1: cd backend && npm start
# Terminal 2: npm start
```

6. **Acceder:** http://localhost:4400

## 👥 Credenciales de Prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin Sistema | admin@sistema.com | 123456 |
| Admin Cine | admin@asdf.com | 123456 |
| Anunciante | anunciante@test.com | 123456 |
| Usuario | user@test.com | 123456 |

## 📚 Documentación Completa

Ver **[INSTALACION-COMPLETA.md](./INSTALACION-COMPLETA.md)** para instrucciones detalladas.

## ✨ Funcionalidades

- ✅ Sistema de roles (Admin Sistema, Admin Cine, Anunciante, Usuario)
- ✅ Gestión de películas y cartelera
- ✅ Venta de boletos con cartera virtual
- ✅ Sistema de anuncios publicitarios
- ✅ Bloqueo de anuncios por cine (gratuito)
- ✅ Comentarios y calificaciones
- ✅ Reportes PDF (JasperReports)
- ✅ Dashboard personalizado por rol
- ✅ Autenticación JWT
- ✅ Internacionalización (español)

## 🛠️ Tecnologías

**Backend:**
- Node.js + Express
- Sequelize ORM
- MySQL
- JWT Authentication
- JasperReports

**Frontend:**
- Angular 20
- Angular Material
- RxJS
- TypeScript

## 📁 Estructura del Proyecto

```
el-cineHub-proyecto/
├── backend/           # API REST Node.js
├── src/              # Aplicación Angular
├── INICIAR.bat       # Script de inicio
└── README.md         # Este archivo
```

## 🎯 Módulos Principales

1. **Autenticación:** Login/registro con JWT
2. **Cartelera:** Visualización de películas y funciones
3. **Boletos:** Compra con cartera virtual
4. **Anuncios:** Sistema publicitario con pago
5. **Reportes:** PDFs con JasperReports
6. **Dashboards:** Panel para cada rol

## 📝 Notas

- Primera ejecución: ejecutar `seed-completo.js` una sola vez
- Bloqueo de anuncios: ahora completamente gratuito
- Imágenes de películas: usan CDN de Amazon/IMDb

## 📞 Contacto

- **GitHub:** [RichBoy-Y3RR1](https://github.com/RichBoy-Y3RR1)
- **Email:** yerribamaca@gmail.com

---

**IPC2 - 2025 | Universidad de San Carlos de Guatemala**
