import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './auth/login.component';
import { AuthGuard } from './core/auth.guard';
import { AdminComponent } from './pages/admin/admin.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
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
  {
    path: '',
    loadChildren: () =>
      import('./pages/dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
