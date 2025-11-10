import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [ { path: '', loadComponent: () => import('./mis-boletos.component').then(m => m.MisBoletosComponent) } ];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class MisBoletosModule {}
