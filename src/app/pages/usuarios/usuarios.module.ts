import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-usuarios-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSnackBarModule, MatChipsModule, MatBadgeModule],
  template: `
    <div class="admin-content">
      <div class="header">
        <h1><mat-icon>people</mat-icon> Gestión de Usuarios</h1>
        <button mat-raised-button color="primary" (click)="agregarUsuario()">
          <mat-icon>person_add</mat-icon>
          Nuevo Usuario
        </button>
      </div>

      <div class="search-bar">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar usuarios</mat-label>
          <input matInput [(ngModel)]="searchTerm" placeholder="Nombre, email o tipo...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </div>

      <div class="usuarios-grid">
        <mat-card *ngFor="let usuario of filtrarUsuarios()" class="usuario-card">
          <mat-card-header>
            <mat-icon mat-card-avatar [color]="usuario.tipo === 'admin' ? 'warn' : 'primary'">
              {{ usuario.tipo === 'admin' ? 'admin_panel_settings' : 'person' }}
            </mat-icon>
            <mat-card-title>{{ usuario.nombre }}</mat-card-title>
            <mat-card-subtitle>{{ usuario.email }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="usuario-info">
              <mat-chip-set>
                <mat-chip [color]="usuario.tipo === 'admin' ? 'warn' : 'primary'" selected>
                  {{ usuario.tipo }}
                </mat-chip>
              </mat-chip-set>
              <p><strong>Teléfono:</strong> {{ usuario.telefono || 'N/A' }}</p>
              <p><strong>Edad:</strong> {{ usuario.edad || 'N/A' }} años</p>
              <p *ngIf="usuario.cartera">
                <strong>Cartera:</strong> Q{{ usuario.cartera.saldo || 0 }}
                <mat-icon [matBadge]="usuario.cartera.saldo" matBadgeColor="accent" [attr.aria-hidden]="false">account_balance_wallet</mat-icon>
              </p>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" (click)="editarUsuario(usuario)">
              <mat-icon>edit</mat-icon>
              Editar
            </button>
            <button mat-button color="accent" (click)="gestionarCartera(usuario)">
              <mat-icon>account_balance_wallet</mat-icon>
              Cartera
            </button>
            <button mat-button color="warn" (click)="eliminarUsuario(usuario)">
              <mat-icon>delete</mat-icon>
              Eliminar
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .admin-content {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    h1 {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0;
      color: #1a237e;
    }

    .search-bar {
      margin-bottom: 24px;
    }

    .search-field {
      width: 100%;
      max-width: 500px;
    }

    .usuarios-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
    }

    .usuario-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    mat-card-content {
      flex: 1;
    }

    .usuario-info {
      margin-top: 12px;
    }

    .usuario-info p {
      margin: 8px 0;
    }

    mat-chip-set {
      margin-bottom: 12px;
    }

    mat-card-actions {
      padding: 8px 16px;
      display: flex;
      justify-content: space-around;
    }
  `]
})
export class UsuariosAdminComponent {
  usuarios: any[] = [];
  searchTerm: string = '';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.http.get<any[]>('http://localhost:4000/api/usuarios').subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (err) => {
        console.error('Error cargando usuarios:', err);
        this.snackBar.open('Error al cargar usuarios', 'Cerrar', { duration: 3000 });
      }
    });
  }

  filtrarUsuarios() {
    if (!this.searchTerm) {
      return this.usuarios;
    }
    const term = this.searchTerm.toLowerCase();
    return this.usuarios.filter(u =>
      u.nombre?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.tipo?.toLowerCase().includes(term)
    );
  }

  agregarUsuario() {
    this.snackBar.open('Funcionalidad en desarrollo: Agregar usuario', 'Cerrar', { duration: 3000 });
  }

  editarUsuario(usuario: any) {
    this.snackBar.open(`Editar usuario: ${usuario.nombre}`, 'Cerrar', { duration: 3000 });
  }

  gestionarCartera(usuario: any) {
    this.snackBar.open(`Gestionar cartera de: ${usuario.nombre}`, 'Cerrar', { duration: 3000 });
  }

  eliminarUsuario(usuario: any) {
    if (confirm(`¿Estás seguro de eliminar a ${usuario.nombre}?`)) {
      this.snackBar.open('Funcionalidad en desarrollo: Eliminar usuario', 'Cerrar', { duration: 3000 });
    }
  }
}

const routes: Routes = [
  { path: '', component: UsuariosAdminComponent }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), UsuariosAdminComponent],
})
export class UsuariosModule {}
