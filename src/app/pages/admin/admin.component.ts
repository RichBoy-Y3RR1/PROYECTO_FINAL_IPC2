import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule
  ],
  template: `
    <mat-toolbar color="primary">
      <span>🎬 CineHub - Panel de Administración</span>
      <span class="spacer"></span>
      <button mat-button [matMenuTriggerFor]="menu">
        <mat-icon>account_circle</mat-icon>
        {{ currentUser?.nombre || 'Admin' }}
      </button>
      <mat-menu #menu="matMenu">
        <button mat-menu-item (click)="logout()">
          <mat-icon>exit_to_app</mat-icon>
          Cerrar Sesión
        </button>
      </mat-menu>
    </mat-toolbar>

    <div class="admin-container">
      <h1>Panel de Administración</h1>
      <router-outlet></router-outlet>
      <div class="cards-grid">
        <mat-card>
          <mat-card-header>
            <mat-icon mat-card-avatar color="primary">movie</mat-icon>
            <mat-card-title>Películas</mat-card-title>
            <mat-card-subtitle>Gestionar cartelera</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Administra las películas disponibles en el sistema</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" [routerLink]="['peliculas']">
              Ver Películas
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-icon mat-card-avatar color="accent">theaters</mat-icon>
            <mat-card-title>Cines</mat-card-title>
            <mat-card-subtitle>Gestionar cines</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Administra los cines y sus salas</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" [routerLink]="['cines']">
              Ver Cines
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-icon mat-card-avatar color="warn">confirmation_number</mat-icon>
            <mat-card-title>Boletos</mat-card-title>
            <mat-card-subtitle>Gestionar ventas</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Administra las ventas de boletos</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" [routerLink]="['boletos']">
              Ver Boletos
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-icon mat-card-avatar color="primary">assessment</mat-icon>
            <mat-card-title>Reportes</mat-card-title>
            <mat-card-subtitle>Estadísticas y análisis</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Visualiza reportes y estadísticas del sistema</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" [routerLink]="['reportes']">
              Ver Reportes
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-icon mat-card-avatar color="accent">campaign</mat-icon>
            <mat-card-title>Anuncios</mat-card-title>
            <mat-card-subtitle>Gestionar publicidad</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Administra los anuncios y promociones</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" [routerLink]="['anuncios']">
              Ver Anuncios
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-icon mat-card-avatar color="warn">people</mat-icon>
            <mat-card-title>Usuarios</mat-card-title>
            <mat-card-subtitle>Gestionar usuarios</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Administra los usuarios del sistema</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" [routerLink]="['usuarios']">
              Ver Usuarios
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }

    .admin-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    h1 {
      margin-bottom: 24px;
      color: #333;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }

    mat-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    mat-card-content {
      flex: 1;
    }

    mat-card-actions {
      padding: 16px;
      margin: 0;
    }

    mat-icon[mat-card-avatar] {
      width: 40px;
      height: 40px;
      font-size: 40px;
    }
  `]
})
export class AdminComponent implements OnInit {
  currentUser: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
