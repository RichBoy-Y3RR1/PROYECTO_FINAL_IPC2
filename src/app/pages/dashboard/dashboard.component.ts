import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../core/auth.service';

// Material modules used by the component (standalone)
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #drawer class="sidenav" fixedInViewport [mode]="'side'" [opened]="true">
        <div class="branding">
          <mat-icon class="logo-icon">movie_filter</mat-icon>
          <h1 class="brand-name">CineHub</h1>
        </div>

        <mat-nav-list>
          <div class="nav-section">
            <h3 class="nav-section-title">Principal</h3>
            <a mat-list-item routerLink="/cartelera" routerLinkActive="active-link">
              <mat-icon>movie</mat-icon>
              <span>Cartelera</span>
            </a>
            <a mat-list-item routerLink="/cines" routerLinkActive="active-link">
              <mat-icon>theater_comedy</mat-icon>
              <span>Cines</span>
            </a>
            <a mat-list-item routerLink="/mis-boletos" routerLinkActive="active-link">
              <mat-icon>confirmation_number</mat-icon>
              <span>Mis Boletos</span>
            </a>
          </div>

          <div class="nav-section">
            <h3 class="nav-section-title">Cuenta</h3>
            <a mat-list-item routerLink="/perfil" routerLinkActive="active-link">
              <mat-icon>person</mat-icon>
              <span>Mi Perfil</span>
            </a>
            <a mat-list-item routerLink="/cartera" routerLinkActive="active-link">
              <mat-icon>account_balance_wallet</mat-icon>
              <span>Mi Cartera</span>
            </a>
            <a mat-list-item (click)="logout()" class="logout-item">
              <mat-icon>exit_to_app</mat-icon>
              <span>Cerrar Sesión</span>
            </a>
          </div>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar>
          <div class="toolbar-content">
            <div class="toolbar-left">
              <span class="page-title">{{ getCurrentPageTitle() }}</span>
            </div>
            <div class="toolbar-right">
              <button mat-icon-button [matMenuTriggerFor]="notificationMenu" class="notification-btn">
                <mat-icon [matBadge]="3" matBadgeColor="warn" aria-hidden="false">notifications</mat-icon>
              </button>
              <button mat-button class="user-profile-btn" [matMenuTriggerFor]="profileMenu">
                <mat-icon>account_circle</mat-icon>
                <span>{{ userName }}</span>
              </button>
            </div>
          </div>
        </mat-toolbar>

        <mat-menu #notificationMenu="matMenu" class="notification-menu">
          <div class="notification-header">
            <h3>Notificaciones</h3>
          </div>
          <mat-divider></mat-divider>
          <button mat-menu-item>
            <mat-icon color="primary">local_movies</mat-icon>
            <span>Nueva película disponible</span>
          </button>
          <button mat-menu-item>
            <mat-icon color="accent">confirmation_number</mat-icon>
            <span>Boleto confirmado</span>
          </button>
          <button mat-menu-item>
            <mat-icon color="warn">card_giftcard</mat-icon>
            <span>¡Descuento especial!</span>
          </button>
        </mat-menu>

        <mat-menu #profileMenu="matMenu">
          <button mat-menu-item routerLink="/perfil">
            <mat-icon>person</mat-icon>
            <span>Mi Perfil</span>
          </button>
          <button mat-menu-item routerLink="/cartera">
            <mat-icon>account_balance_wallet</mat-icon>
            <span>Mi Cartera</span>
          </button>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="logout()" class="logout-menu-item">
            <mat-icon>exit_to_app</mat-icon>
            <span>Cerrar Sesión</span>
          </button>
        </mat-menu>

        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
      background: #f5f5f5;
    }

    .sidenav {
      width: 280px;
      background: #1a237e;
      color: white;
      border: none;
    }

    .branding {
      padding: 24px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(255, 255, 255, 0.1);
    }

    .logo-icon {
      font-size: 32px;
      height: 32px;
      width: 32px;
      color: #ffd700;
    }

    .brand-name {
      margin: 0;
      font-size: 24px;
      font-weight: 500;
      color: white;
    }

    .nav-section {
      margin: 16px 0;
    }

    .nav-section-title {
      padding: 0 16px;
      margin: 8px 0;
      font-size: 12px;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.7);
    }

    .mat-nav-list a {
      margin: 4px 8px;
      border-radius: 8px;
      color: white;
      transition: all 0.3s ease;
    }

    .mat-nav-list a:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .active-link {
      background: rgba(255, 255, 255, 0.15) !important;
    }

    .logout-item {
      color: #ff4081 !important;
    }

    mat-toolbar {
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .toolbar-content {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .page-title {
      font-size: 20px;
      color: #333;
    }

    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .notification-btn {
      margin-right: 8px;
    }

    .user-profile-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 12px;
      border-radius: 20px;
      background: rgba(0,0,0,0.05);
    }

    .content {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .notification-menu {
      min-width: 300px;
    }

    .notification-header {
      padding: 16px;
      color: #333;
    }

    .notification-header h3 {
      margin: 0;
      font-size: 16px;
    }

    ::ng-deep .mat-menu-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logout-menu-item {
      color: #f44336;
    }

    mat-icon {
      margin-right: 12px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  userName = 'Usuario';
  currentPage = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Obtener el nombre del usuario del servicio de autenticación
    const user = this.auth.getCurrentUser();
    if (user?.nombre) {
      this.userName = user.nombre;
    }

    // Actualizar el título de la página según la ruta actual
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateCurrentPage();
    });
  }

  getCurrentPageTitle(): string {
    switch (this.currentPage) {
      case 'cartelera':
        return '🎬 Cartelera';
      case 'cines':
        return '🏢 Nuestros Cines';
      case 'mis-boletos':
        return '🎟️ Mis Boletos';
      case 'perfil':
        return '👤 Mi Perfil';
      case 'cartera':
        return '💳 Mi Cartera';
      default:
        return 'CineHub';
    }
  }

  private updateCurrentPage() {
    let route = this.route;
    while (route.firstChild) {
      route = route.firstChild;
    }
    this.currentPage = route.snapshot.url[0]?.path || 'cartelera';
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
