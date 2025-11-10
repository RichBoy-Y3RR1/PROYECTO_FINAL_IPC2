import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  { path: '', loadComponent: () => import('./cines-public.component').then(m => m.CinesPublicComponent) }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class CinesPublicModule {}
