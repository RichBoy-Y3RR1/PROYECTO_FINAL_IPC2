import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'peliculas',
        loadChildren: () => import('../../peliculas/peliculas.module').then(m => m.PeliculasModule)
      },
      { path: 'cines', redirectTo: 'cartelera' },
      {
        path: 'cartelera',
        loadChildren: () => import('../cartelera/cartelera.module').then(m => m.CarteleraModule)
      },
      { path: 'mis-boletos', redirectTo: 'cartelera' },
      { path: '', redirectTo: 'cartelera', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    // Import the standalone DashboardComponent so it doesn't need to be declared
    DashboardComponent
  ]
})
export class DashboardModule { }
