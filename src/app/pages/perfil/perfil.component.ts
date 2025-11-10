import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDividerModule,
    MatChipsModule
  ],
  template: `
    <div class="perfil-container">
      <mat-card class="perfil-card">
        <mat-card-header>
          <div class="header-content">
            <mat-icon class="profile-icon">account_circle</mat-icon>
            <div>
              <mat-card-title>Mi Perfil</mat-card-title>
              <mat-card-subtitle>Gestiona tu información personal</mat-card-subtitle>
            </div>
          </div>
        </mat-card-header>

        <mat-card-content>
          <!-- Sección de Cartera -->
          <div class="cartera-section">
            <div class="cartera-header">
              <mat-icon>account_balance_wallet</mat-icon>
              <h3>Cartera Digital</h3>
            </div>
            <div class="saldo-display">
              <span class="saldo-label">Saldo actual:</span>
              <span class="saldo-amount">Q{{ cartera?.saldo || 0 | number:'1.2-2' }}</span>
            </div>
            <div class="recarga-form">
              <mat-form-field appearance="outline">
                <mat-label>Monto a recargar</mat-label>
                <input matInput type="number" [(ngModel)]="montoRecarga" placeholder="100.00">
                <span matPrefix>Q&nbsp;</span>
                <mat-icon matSuffix>attach_money</mat-icon>
              </mat-form-field>
              <button mat-raised-button color="primary" (click)="recargarCartera()"
                      [disabled]="!montoRecarga || montoRecarga <= 0">
                <mat-icon>add_circle</mat-icon>
                Recargar
              </button>
            </div>
          </div>

          <mat-divider></mat-divider>

          <!-- Formulario de perfil -->
          <form [formGroup]="perfilForm" (ngSubmit)="actualizarPerfil()" class="perfil-form">
            <h3>Información Personal</h3>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nombre</mat-label>
              <input matInput formControlName="nombre">
              <mat-icon matSuffix>person</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" readonly>
              <mat-icon matSuffix>email</mat-icon>
            </mat-form-field>

            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Edad</mat-label>
                <input matInput type="number" formControlName="edad">
                <mat-icon matSuffix>cake</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Teléfono</mat-label>
                <input matInput formControlName="telefono">
                <mat-icon matSuffix>phone</mat-icon>
              </mat-form-field>
            </div>

            <div class="user-type">
              <mat-chip-set>
                <mat-chip [highlighted]="true">
                  <mat-icon>{{ usuario?.tipo === 'admin' ? 'admin_panel_settings' : 'person' }}</mat-icon>
                  {{ usuario?.tipo === 'admin' ? 'Administrador' : 'Cliente' }}
                </mat-chip>
              </mat-chip-set>
            </div>

            <div class="actions">
              <button mat-raised-button color="primary" type="submit"
                      [disabled]="!perfilForm.valid || !perfilForm.dirty">
                <mat-icon>save</mat-icon>
                Guardar Cambios
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .perfil-container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }

    .perfil-card {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 16px;
      width: 100%;
    }

    .profile-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #667eea;
    }

    mat-card-title {
      font-size: 28px;
      margin: 0;
      color: #1a237e;
    }

    mat-card-subtitle {
      font-size: 14px;
      color: #666;
    }

    .cartera-section {
      padding: 24px 0;
    }

    .cartera-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;

      mat-icon {
        color: #4caf50;
        font-size: 28px;
        width: 28px;
        height: 28px;
      }

      h3 {
        margin: 0;
        color: #333;
      }
    }

    .saldo-display {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 24px;
      border-radius: 12px;
      text-align: center;
      color: white;
      margin-bottom: 16px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    .saldo-label {
      display: block;
      font-size: 14px;
      opacity: 0.9;
      margin-bottom: 8px;
    }

    .saldo-amount {
      display: block;
      font-size: 36px;
      font-weight: bold;
    }

    .recarga-form {
      display: flex;
      gap: 16px;
      align-items: flex-start;

      mat-form-field {
        flex: 1;
      }

      button {
        margin-top: 8px;
        height: 48px;
      }
    }

    mat-divider {
      margin: 24px 0;
    }

    .perfil-form {
      padding-top: 16px;

      h3 {
        margin: 0 0 16px 0;
        color: #333;
      }
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    .half-width {
      flex: 1;
    }

    .user-type {
      margin: 16px 0;

      mat-chip {
        font-size: 14px;
      }
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 24px;

      button {
        min-width: 180px;
      }
    }
  `]
})
export class PerfilComponent implements OnInit {
  perfilForm!: FormGroup;
  usuario: any;
  cartera: any;
  montoRecarga: number = 0;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.usuario = this.authService.getCurrentUser();

    this.perfilForm = this.fb.group({
      nombre: [this.usuario?.nombre || '', Validators.required],
      email: [this.usuario?.email || this.usuario?.correo || '', [Validators.required, Validators.email]],
      edad: [this.usuario?.edad || ''],
      telefono: [this.usuario?.telefono || '']
    });

    this.cargarCartera();
  }

  cargarCartera() {
    const token = this.authService.getToken();
    this.http.get('http://localhost:4000/api/cartera/saldo', {
      headers: { 'Authorization': `Bearer ${token}` }
    }).subscribe({
      next: (data: any) => {
        this.cartera = data;
      },
      error: (err) => {
        console.error('Error cargando cartera:', err);
        // Si no existe cartera, la creamos
        if (err.status === 404) {
          this.http.post('http://localhost:4000/api/cartera', {}, {
            headers: { 'Authorization': `Bearer ${token}` }
          }).subscribe({
            next: () => this.cargarCartera()
          });
        }
      }
    });
  }

  recargarCartera() {
    if (!this.montoRecarga || this.montoRecarga <= 0) return;

    const token = this.authService.getToken();
    this.http.post('http://localhost:4000/api/cartera/recargar',
      { monto: this.montoRecarga },
      { headers: { 'Authorization': `Bearer ${token}` } }
    ).subscribe({
      next: (res: any) => {
  this.snackBar.open('Recarga exitosa', 'Cerrar', { duration: 3000 });
        this.cartera.saldo = res.saldo;
        this.montoRecarga = 0;
      },
      error: (err) => {
        console.error('Error recargando cartera:', err);
  this.snackBar.open('Error al recargar', 'Cerrar', { duration: 3000 });
      }
    });
  }

  actualizarPerfil() {
    if (this.perfilForm.invalid || !this.perfilForm.dirty) return;

    const token = this.authService.getToken();
    const payload = this.perfilForm.value;

    this.http.put(`http://localhost:4000/api/usuarios/${this.usuario.id}`, payload, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).subscribe({
      next: () => {
  this.snackBar.open('Perfil actualizado', 'Cerrar', { duration: 3000 });
        // Actualizar usuario en localStorage
        const updatedUser = { ...this.usuario, ...payload };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        this.usuario = updatedUser;
        this.perfilForm.markAsPristine();
      },
      error: (err) => {
        console.error('Error actualizando perfil:', err);
  this.snackBar.open('Error al actualizar', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
