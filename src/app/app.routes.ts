import { Routes } from '@angular/router';
// Ajuste: usar el login standalone correcto
import { LoginComponent } from './auth/login.component';
import { roleRedirectGuard } from './guards/role-redirect.guard';
import { RegistroComponent } from './auth/registro.component';
import { AuthGuard } from './core/auth.guard';
import { AdminComponent } from './pages/admin/admin.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { anuncianteGuard, adminCineGuard, adminSistemaGuard } from './guards/role.guards';

// Unificación de rutas para separar claramente el contexto Admin (/admin/...) del contexto Cliente
// Todas las gestiones del panel deben vivir dentro de /admin y mantener el router-outlet del AdminComponent
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard] },
  // Alias para acceder directamente a la sección de Cartera dentro de Perfil
  { path: 'cartera', component: PerfilComponent, canActivate: [AuthGuard] },
  // Ruta raíz: siempre llevar al login (evita que '' intente cargar el dashboard cuando no hay sesión)
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // Compatibilidad: rutas antiguas públicas hacia dashboard
  { path: 'cartelera', redirectTo: 'dashboard/cartelera', pathMatch: 'full' },
  { path: 'cines', redirectTo: 'dashboard/cines', pathMatch: 'full' },
  { path: 'mis-boletos', redirectTo: 'dashboard/mis-boletos', pathMatch: 'full' },

  // Rutas para Usuario Anunciante
  {
    path: 'anunciante',
    canActivate: [anuncianteGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/anunciante/anunciante-dashboard.component').then(m => m.AnuncianteDashboardComponent)
      },
      {
        path: 'crear',
        loadComponent: () => import('./pages/anunciante/crear-anuncio.component').then(m => m.CrearAnuncioComponent)
      }
    ]
  },

  // Rutas para Admin Cine
  {
    path: 'admin-cine',
    canActivate: [adminCineGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./pages/admin-cine/admin-cine-dashboard.component').then(m => m.AdminCineDashboardComponent) }
    ]
  },

  // Rutas para Admin Sistema
  {
    path: 'admin-sistema',
    canActivate: [adminSistemaGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./pages/admin-sistema/admin-sistema-dashboard.component').then(m => m.AdminSistemaDashboardComponent) }
    ]
  },

  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [adminSistemaGuard],
    children: [
      { path: 'peliculas', loadChildren: () => import('./pages/peliculas/peliculas.module').then(m => m.PeliculasModule) },
      { path: 'cines', loadChildren: () => import('./pages/cines/cines.module').then(m => m.CinesModule) },
      { path: 'boletos', loadChildren: () => import('./pages/boletos/boletos.module').then(m => m.BoletosModule) },
      { path: 'reportes', loadChildren: () => import('./pages/reportes/reportes.module').then(m => m.ReportesModule) },
      { path: 'anuncios', loadChildren: () => import('./pages/anuncios/anuncios.module').then(m => m.AnunciosModule) },
      { path: 'usuarios', loadChildren: () => import('./pages/usuarios/usuarios.module').then(m => m.UsuariosModule) },
      { path: '', redirectTo: 'peliculas', pathMatch: 'full' }
    ]
  },
  // Contexto cliente (dashboard/cartelera, etc.)
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard, roleRedirectGuard]
  },
  { path: '**', redirectTo: '' }
];
