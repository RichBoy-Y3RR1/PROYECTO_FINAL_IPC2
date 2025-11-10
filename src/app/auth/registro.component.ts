import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule
  ],
  template: `
    <div class="registro-container">
      <mat-card class="registro-card">
        <mat-card-header>
          <div class="header-content">
            <mat-icon class="logo-icon">movie</mat-icon>
            <div>
              <mat-card-title>CineHub</mat-card-title>
              <mat-card-subtitle>Crea tu cuenta</mat-card-subtitle>
            </div>
          </div>
        </mat-card-header>

        <mat-card-content>
          <p class="welcome-text">
            Únete a CineHub y disfruta de:
          </p>
          <ul class="benefits-list">
            <li>Compra de boletos en línea</li>
            <li>Cartelera actualizada</li>
            <li>Cartera digital integrada</li>
            <li>Calificaciones y comentarios</li>
          </ul>

          <form [formGroup]="registroForm" (ngSubmit)="registrar()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nombre completo</mat-label>
              <input matInput formControlName="nombre" placeholder="Juan Pérez">
              <mat-icon matSuffix>person</mat-icon>
              <mat-error *ngIf="registroForm.get('nombre')?.hasError('required')">
                El nombre es requerido
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="correo" placeholder="usuario@ejemplo.com">
              <mat-icon matSuffix>email</mat-icon>
              <mat-error *ngIf="registroForm.get('correo')?.hasError('required')">
                El email es requerido
              </mat-error>
              <mat-error *ngIf="registroForm.get('correo')?.hasError('email')">
                Email inválido
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Contraseña</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'"
                     formControlName="contraseña" placeholder="Mínimo 6 caracteres">
              <button mat-icon-button matSuffix type="button"
                      (click)="hidePassword = !hidePassword">
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-error *ngIf="registroForm.get('contraseña')?.hasError('required')">
                La contraseña es requerida
              </mat-error>
              <mat-error *ngIf="registroForm.get('contraseña')?.hasError('minlength')">
                Mínimo 6 caracteres
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Edad</mat-label>
              <input matInput type="number" formControlName="edad" placeholder="18">
              <mat-icon matSuffix>cake</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Teléfono (opcional)</mat-label>
              <input matInput formControlName="telefono" placeholder="5555-5555">
              <mat-icon matSuffix>phone</mat-icon>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit"
                    [disabled]="!registroForm.valid || loading" class="full-width submit-btn">
              <mat-icon>{{ loading ? 'hourglass_empty' : 'person_add' }}</mat-icon>
              {{ loading ? 'Registrando...' : 'Crear cuenta' }}
            </button>
          </form>

          <div class="login-link">
            ¿Ya tienes cuenta?
            <a routerLink="/login">Inicia sesión aquí</a>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .registro-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .registro-card {
      max-width: 500px;
      width: 100%;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 16px;
      width: 100%;
    }

    .logo-icon {
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
      font-size: 16px;
      color: #666;
    }

    .welcome-text {
      margin: 24px 0 8px 0;
      font-size: 16px;
      color: #333;
      font-weight: 500;
    }

    .benefits-list {
      margin: 0 0 24px 0;
      padding-left: 20px;
      list-style: none;
    }

    .benefits-list li {
      padding: 4px 0;
      color: #555;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .submit-btn {
      height: 48px;
      font-size: 16px;
      margin-top: 8px;
    }

    .login-link {
      text-align: center;
      margin-top: 24px;
      color: #666;
    }

    .login-link a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .login-link a:hover {
      text-decoration: underline;
    }

    :host ::ng-deep .success-snackbar {
      background-color: #4caf50 !important;
      color: white !important;
    }

    :host ::ng-deep .error-snackbar {
      background-color: #f44336 !important;
      color: white !important;
    }

    mat-error {
      font-size: 12px;
      margin-top: -12px;
    }

    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    @media (max-width: 600px) {
      .registro-card {
        margin: 0;
      }
    }
  `]
})
export class RegistroComponent implements OnInit {
  registroForm!: FormGroup;
  hidePassword = true;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contraseña: ['', [Validators.required, Validators.minLength(6)]],
      edad: ['', [Validators.min(13), Validators.max(120)]],
      telefono: ['']
    });
  }

  registrar() {
    if (this.registroForm.invalid || this.loading) return;

    this.loading = true;
    const formValues = this.registroForm.value;
    
    // Limpiar y validar datos antes de enviar
    const nombre = formValues.nombre?.trim();
    const correo = formValues.correo?.trim().toLowerCase();
    const contraseña = formValues.contraseña;
    
    if (!nombre || !correo || !contraseña) {
      this.loading = false;
      this.snackBar.open('Por favor completa todos los campos requeridos', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    const payload = {
      nombre: nombre,
      correo: correo,
      contraseña: contraseña,
      edad: formValues.edad ? parseInt(formValues.edad) : null,
      telefono: formValues.telefono?.trim() || null,
      tipo: 'cliente'
    };

    console.log('Enviando registro:', { ...payload, contraseña: '***' });

    this.http.post('http://localhost:4000/api/auth/registro', payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        console.log('Registro exitoso:', res);
        this.snackBar.open('Cuenta creada exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        console.error('Error completo:', err);
        
        let mensaje = 'Error al crear la cuenta';
        
        if (err.status === 409) {
          mensaje = 'Este correo ya está registrado';
        } else if (err.status === 400) {
          if (err.error?.errores && Array.isArray(err.error.errores)) {
            mensaje = err.error.errores[0]?.msg || mensaje;
          } else if (err.error?.msg) {
            mensaje = err.error.msg;
          }
        } else if (err.status === 500) {
          mensaje = 'Error en el servidor. Intenta nuevamente.';
        } else if (err.status === 0) {
          mensaje = 'No se puede conectar al servidor. Verifica que esté corriendo.';
        }
        
        this.snackBar.open(mensaje, 'Cerrar', { 
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
