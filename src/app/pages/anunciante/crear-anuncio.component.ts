import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-crear-anuncio',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatStepperModule,
    MatRadioModule
  ],
  template: `
    <div class="crear-container">
      <div class="header">
        <button mat-icon-button (click)="volver()">
          <mat-icon>arrow_back</mat-icon>
        </button>
  <h1>Crear Nuevo Anuncio</h1>
      </div>

      <mat-card>
        <mat-card-content>
          <mat-stepper [linear]="true" #stepper>
            <!-- Paso 1: Información Básica -->
            <mat-step [stepControl]="formBasico">
              <form [formGroup]="formBasico">
                <ng-template matStepLabel>Información Básica</ng-template>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Título del Anuncio</mat-label>
                  <input matInput formControlName="titulo" placeholder="Ej: Promoción de Verano">
                  <mat-error *ngIf="formBasico.get('titulo')?.hasError('required')">
                    El título es requerido
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Contenido</mat-label>
                  <textarea matInput formControlName="contenido" rows="4"
                            placeholder="Describe tu anuncio..."></textarea>
                  <mat-error *ngIf="formBasico.get('contenido')?.hasError('required')">
                    El contenido es requerido
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Tipo de Anuncio</mat-label>
                  <mat-select formControlName="tipo">
                    <mat-option value="texto">Solo Texto</mat-option>
                    <mat-option value="texto-imagen">Texto + Imagen</mat-option>
                    <mat-option value="video-texto">Video + Texto</mat-option>
                  </mat-select>
                </mat-form-field>

                <div class="step-actions">
                  <button mat-raised-button matStepperNext color="primary">Siguiente</button>
                </div>
              </form>
            </mat-step>

            <!-- Paso 2: Recursos Multimedia -->
            <mat-step [stepControl]="formMultimedia">
              <form [formGroup]="formMultimedia">
                <ng-template matStepLabel>Recursos Multimedia</ng-template>

                <mat-form-field appearance="outline" class="full-width"
                                *ngIf="tipoSeleccionado === 'texto-imagen'">
                  <mat-label>URL de Imagen</mat-label>
                  <input matInput formControlName="imagenUrl" placeholder="https://...">
                  <mat-hint>Ingresa la URL de tu imagen</mat-hint>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width"
                                *ngIf="tipoSeleccionado === 'video-texto'">
                  <mat-label>URL de Video</mat-label>
                  <input matInput formControlName="videoUrl" placeholder="https://youtube.com/...">
                  <mat-hint>Ingresa la URL de tu video</mat-hint>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Enlace de Destino (opcional)</mat-label>
                  <input matInput formControlName="enlaceUrl" placeholder="https://tu-sitio.com">
                  <mat-hint>¿A dónde quieres que vayan los usuarios al hacer clic?</mat-hint>
                </mat-form-field>

                <div class="preview-section" *ngIf="formMultimedia.get('imagenUrl')?.value">
                  <h3>Vista Previa:</h3>
                  <img [src]="formMultimedia.get('imagenUrl')?.value"
                       alt="Preview"
                       class="preview-image"
                       (error)="onImageError()">
                </div>

                <div class="step-actions">
                  <button mat-button matStepperPrevious>Atrás</button>
                  <button mat-raised-button matStepperNext color="primary">Siguiente</button>
                </div>
              </form>
            </mat-step>

            <!-- Paso 3: Configuración y Pago -->
            <mat-step [stepControl]="formConfiguracion">
              <form [formGroup]="formConfiguracion">
                <ng-template matStepLabel>Configuración y Pago</ng-template>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Duración</mat-label>
                  <mat-select formControlName="duracionDias" (selectionChange)="calcularCosto()">
                    <mat-option [value]="1">1 día</mat-option>
                    <mat-option [value]="3">3 días</mat-option>
                    <mat-option [value]="7">1 semana</mat-option>
                    <mat-option [value]="14">2 semanas</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Destinatarios</mat-label>
                  <mat-select formControlName="destinatarios">
                    <mat-option value="todos">Todos los usuarios</mat-option>
                    <mat-option value="usuarios">Solo usuarios clientes</mat-option>
                    <mat-option value="admin-cine">Administradores de cine</mat-option>
                    <mat-option value="admin-general">Administrador general</mat-option>
                  </mat-select>
                </mat-form-field>

                <div class="costo-card">
                  <h3>Resumen de Costos</h3>
                  <div class="costo-row">
                    <span>Tipo de anuncio:</span>
                    <strong>{{ nombreTipo }}</strong>
                  </div>
                  <div class="costo-row">
                    <span>Costo base:</span>
                    <strong>Q{{ costoBase }}/día</strong>
                  </div>
                  <div class="costo-row">
                    <span>Duración:</span>
                    <strong>{{ formConfiguracion.get('duracionDias')?.value || 0 }} días</strong>
                  </div>
                  <div class="costo-row total">
                    <span>COSTO TOTAL:</span>
                    <strong>Q{{ costoTotal | number:'1.2-2' }}</strong>
                  </div>
                  <div class="costo-row">
                    <span>Tu saldo:</span>
                    <strong [class.saldo-insuficiente]="saldo < costoTotal">
                      Q{{ saldo | number:'1.2-2' }}
                    </strong>
                  </div>
                  <div class="costo-row" *ngIf="saldo >= costoTotal">
                    <span>Saldo después:</span>
                    <strong>Q{{ (saldo - costoTotal) | number:'1.2-2' }}</strong>
                  </div>
                </div>

                <div class="warning-box" *ngIf="saldo < costoTotal">
                  <mat-icon>warning</mat-icon>
                  <span>Saldo insuficiente. Necesitas Q{{ (costoTotal - saldo) | number:'1.2-2' }} más.</span>
                </div>

                <div class="info-box">
                  <mat-icon>info</mat-icon>
                  <span>Tu anuncio será revisado por un administrador antes de publicarse.</span>
                </div>

                <div class="step-actions">
                  <button mat-button matStepperPrevious>Atrás</button>
                  <button mat-raised-button color="primary" (click)="crearAnuncio()"
                          [disabled]="creando || saldo < costoTotal">
                    <mat-icon>check</mat-icon>
                    {{ creando ? 'Creando...' : 'Crear Anuncio' }}
                  </button>
                </div>
              </form>
            </mat-step>
          </mat-stepper>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .crear-container {
      max-width: 900px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
    }

    .header h1 {
      margin: 0;
    }

    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }

    .step-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 20px;
    }

    .preview-section {
      margin: 20px 0;
      padding: 15px;
      border: 1px dashed #ccc;
      border-radius: 8px;
    }

    .preview-image {
      max-width: 100%;
      max-height: 300px;
      border-radius: 8px;
    }

    .costo-card {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }

    .costo-card h3 {
      margin: 0 0 15px 0;
      color: #333;
    }

    .costo-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #ddd;
    }

    .costo-row:last-child {
      border-bottom: none;
    }

    .costo-row.total {
      font-size: 1.2em;
      color: #1976d2;
      margin-top: 10px;
      padding-top: 15px;
      border-top: 2px solid #1976d2;
    }

    .saldo-insuficiente {
      color: #f44336 !important;
    }

    .warning-box {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 15px;
      background: #fff3e0;
      border-left: 4px solid #ff9800;
      border-radius: 4px;
      margin: 20px 0;
    }

    .warning-box mat-icon {
      color: #ff9800;
    }

    .info-box {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 15px;
      background: #e3f2fd;
      border-left: 4px solid #2196f3;
      border-radius: 4px;
      margin: 20px 0;
    }

    .info-box mat-icon {
      color: #2196f3;
    }
  `]
})
export class CrearAnuncioComponent implements OnInit {
  formBasico: FormGroup;
  formMultimedia: FormGroup;
  formConfiguracion: FormGroup;

  saldo: number = 0;
  costoBase: number = 25;
  costoTotal: number = 0;
  creando: boolean = false;
  token: string | null = null;

  tiposCosto: any = {
    'texto': 25,
    'texto-imagen': 50,
    'video-texto': 100
  };

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snack: MatSnackBar
  ) {
    this.token = localStorage.getItem('token');

    this.formBasico = this.fb.group({
      titulo: ['', Validators.required],
      contenido: ['', Validators.required],
  tipo: ['texto', Validators.required]
    });

    this.formMultimedia = this.fb.group({
      imagenUrl: [''],
      videoUrl: [''],
      enlaceUrl: ['']
    });

    this.formConfiguracion = this.fb.group({
      duracionDias: [7, [Validators.required]],
      destinatarios: ['todos', Validators.required]
    });
  }

  ngOnInit() {
    this.cargarSaldo();
    this.cargarConfigPrecios();
    this.formBasico.get('tipo')?.valueChanges.subscribe(() => {
      this.calcularCosto();
    });
    this.formConfiguracion.get('duracionDias')?.valueChanges.subscribe(() => {
      this.calcularCosto();
    });
    this.calcularCosto();
  }

  cargarConfigPrecios() {
    this.http.get<any>('http://localhost:4000/api/admin-sistema/configuracion', {
      headers: { Authorization: `Bearer ${this.token}` }
    }).subscribe({
      next: (data) => {
        const p = data?.preciosAnuncios || {};
        this.tiposCosto = {
          'texto': p.texto ?? 25,
          'texto-imagen': p['texto-imagen'] ?? p.imagen ?? p.mixto ?? 50,
          'video-texto': p['video-texto'] ?? p.video ?? 100
        };
        this.calcularCosto();
      },
      error: (err) => {
        // Fallback con defaults ya definidos
        console.warn('No se pudo cargar configuración de precios', err);
      }
    });
  }

  get tipoSeleccionado(): string {
    return this.formBasico.get('tipo')?.value || 'texto';
  }

  get nombreTipo(): string {
    const tipos: any = {
      'texto': 'Solo Texto',
      'texto-imagen': 'Texto + Imagen',
      'video-texto': 'Video + Texto'
    };
    return tipos[this.tipoSeleccionado] || 'Texto';
  }

  cargarSaldo() {
    this.http.get<any>('http://localhost:4000/api/cartera/saldo', {
      headers: { Authorization: `Bearer ${this.token}` }
    }).subscribe({
      next: (data) => {
        this.saldo = data.saldo || 0;
      },
      error: (err) => console.error('Error cargando saldo:', err)
    });
  }

  calcularCosto() {
    const tipo = this.formBasico.get('tipo')?.value || 'texto';
    this.costoBase = this.tiposCosto[tipo] || 25;
    const dias = this.formConfiguracion.get('duracionDias')?.value || 7;
    this.costoTotal = this.costoBase * dias;
  }

  onImageError() {
    this.snack.open('Error al cargar la imagen', 'Cerrar', { duration: 2000 });
  }

  crearAnuncio() {
    if (this.formBasico.invalid || this.formConfiguracion.invalid) {
      this.snack.open('Por favor completa todos los campos requeridos', 'Cerrar', { duration: 3000 });
      return;
    }

    if (this.saldo < this.costoTotal) {
      this.snack.open('Saldo insuficiente', 'Cerrar', { duration: 3000 });
      return;
    }

    this.creando = true;

    // Preparar datos limpiando campos vacíos
    const basicoValues = this.formBasico.value;
    const multimediaValues = this.formMultimedia.value;
    const configValues = this.formConfiguracion.value;

    const anuncioData: any = {
      titulo: basicoValues.titulo,
      contenido: basicoValues.contenido,
      tipo: basicoValues.tipo,
      duracionDias: configValues.duracionDias,
      destinatarios: configValues.destinatarios
    };

    // Solo incluir URLs si tienen contenido
    if (multimediaValues.imagenUrl && multimediaValues.imagenUrl.trim()) {
      anuncioData.imagenUrl = multimediaValues.imagenUrl.trim();
    }
    if (multimediaValues.videoUrl && multimediaValues.videoUrl.trim()) {
      anuncioData.videoUrl = multimediaValues.videoUrl.trim();
    }
    if (multimediaValues.enlaceUrl && multimediaValues.enlaceUrl.trim()) {
      anuncioData.enlaceUrl = multimediaValues.enlaceUrl.trim();
    }

    this.http.post('http://localhost:4000/api/anuncios', anuncioData, {
      headers: { Authorization: `Bearer ${this.token}` }
    }).subscribe({
      next: (response: any) => {
        this.snack.open('¡Anuncio creado exitosamente! Pendiente de aprobación.', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/anunciante']);
      },
      error: (err) => {
        this.creando = false;
        console.error('Error al crear anuncio:', err);
        this.snack.open(err.error?.msg || 'Error al crear anuncio', 'Cerrar', { duration: 4000 });
      }
    });
  }

  volver() {
    this.router.navigate(['/anunciante']);
  }
}
