import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-admin-sistema-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="header">
        <h1>Panel Administrador del Sistema</h1>
        <button mat-raised-button color="warn" (click)="cerrarSesion()">
          <mat-icon>exit_to_app</mat-icon>
          Cerrar Sesión
        </button>
      </div>

      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-value">{{ estadisticas.totalCines }}</div>
            <div class="stat-label">Total Cines</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-value">{{ estadisticas.totalPeliculas }}</div>
            <div class="stat-label">Total Películas</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-value">{{ estadisticas.totalAnuncios }}</div>
            <div class="stat-label">Total Anuncios</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card pending">
          <mat-card-content>
            <div class="stat-value">{{ estadisticas.anunciosPendientes }}</div>
            <div class="stat-label">Anuncios Pendientes</div>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-tab-group>
        <!-- Tab: Gestión de Cines -->
        <mat-tab label="Cines">
          <div class="tab-content">
            <div class="tab-header">
              <h2>Gestión de Cines</h2>
              <button mat-raised-button color="primary" (click)="mostrarFormCine()">
                <mat-icon>add</mat-icon>
                Nuevo Cine
              </button>
            </div>

            <div *ngIf="mostrandoFormCine" class="form-container">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>{{ editandoCine ? 'Editar Cine' : 'Nuevo Cine' }}</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <form [formGroup]="formCine">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Nombre del Cine</mat-label>
                      <input matInput formControlName="nombre">
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Ubicación</mat-label>
                      <input matInput formControlName="ubicacion">
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Teléfono</mat-label>
                      <input matInput formControlName="telefono">
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Email</mat-label>
                      <input matInput type="email" formControlName="email">
                    </mat-form-field>

                    <div class="form-actions">
                      <button mat-button (click)="cancelarFormCine()">Cancelar</button>
                      <button mat-raised-button color="primary" (click)="guardarCine()">
                        {{ editandoCine ? 'Actualizar' : 'Crear' }}
                      </button>
                    </div>
                  </form>
                </mat-card-content>
              </mat-card>
            </div>

            <div class="cines-list">
              <mat-card *ngFor="let cine of cines" class="cine-card">
                <mat-card-header>
                  <mat-card-title>{{ cine.nombre }}</mat-card-title>
                  <mat-card-subtitle>{{ cine.ubicacion }}</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <p>{{ cine.telefono }}</p>
                  <p>✉️ {{ cine.email }}</p>
            <p class="salas-count">{{ cine.Salas?.length || 0 }} salas</p>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-icon-button (click)="editarCine(cine)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="eliminarCine(cine)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </mat-card-actions>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <!-- Tab: Gestión de Películas -->
        <mat-tab label="Películas">
          <div class="tab-content">
            <div class="tab-header">
              <h2>Gestión de Películas</h2>
              <button mat-raised-button color="primary" (click)="mostrarFormPelicula()">
                <mat-icon>add</mat-icon>
                Nueva Película
              </button>
            </div>

            <div *ngIf="mostrandoFormPelicula" class="form-container">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>{{ editandoPelicula ? 'Editar Película' : 'Nueva Película' }}</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <form [formGroup]="formPelicula">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Título</mat-label>
                      <input matInput formControlName="titulo">
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Sinopsis</mat-label>
                      <textarea matInput rows="4" formControlName="sinopsis"></textarea>
                    </mat-form-field>

                    <div class="form-row">
                      <mat-form-field appearance="outline">
                        <mat-label>Duración (min)</mat-label>
                        <input matInput type="number" formControlName="duracion">
                      </mat-form-field>

                      <mat-form-field appearance="outline">
                        <mat-label>Género</mat-label>
                        <mat-select formControlName="genero">
                          <mat-option value="Acción">Acción</mat-option>
                          <mat-option value="Comedia">Comedia</mat-option>
                          <mat-option value="Drama">Drama</mat-option>
                          <mat-option value="Terror">Terror</mat-option>
                          <mat-option value="Ciencia Ficción">Ciencia Ficción</mat-option>
                          <mat-option value="Romance">Romance</mat-option>
                          <mat-option value="Animación">Animación</mat-option>
                        </mat-select>
                      </mat-form-field>

                      <mat-form-field appearance="outline">
                        <mat-label>Clasificación</mat-label>
                        <mat-select formControlName="clasificacion">
                          <mat-option value="TE">TE</mat-option>
                          <mat-option value="7+">7+</mat-option>
                          <mat-option value="12+">12+</mat-option>
                          <mat-option value="15+">15+</mat-option>
                          <mat-option value="18+">18+</mat-option>
                        </mat-select>
                      </mat-form-field>
                    </div>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Director</mat-label>
                      <input matInput formControlName="director">
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Actores</mat-label>
                      <input matInput formControlName="actores">
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Fecha de Estreno</mat-label>
                      <input matInput type="date" formControlName="fechaEstreno">
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>URL Imagen</mat-label>
                      <input matInput formControlName="imagenUrl">
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>URL Trailer</mat-label>
                      <input matInput formControlName="trailerUrl">
                    </mat-form-field>

                    <div class="form-actions">
                      <button mat-button (click)="cancelarFormPelicula()">Cancelar</button>
                      <button mat-raised-button color="primary" (click)="guardarPelicula()">
                        {{ editandoPelicula ? 'Actualizar' : 'Crear' }}
                      </button>
                    </div>
                  </form>
                </mat-card-content>
              </mat-card>
            </div>

            <div class="peliculas-grid">
              <mat-card *ngFor="let pelicula of peliculas" class="pelicula-card">
                <img mat-card-image [src]="pelicula.imagenUrl || 'assets/images/movie-placeholder.jpg'"
                     [alt]="pelicula.titulo"
                     (error)="onImagenError($event)">
                <mat-card-header>
                  <mat-card-title>{{ pelicula.titulo }}</mat-card-title>
                  <mat-card-subtitle>{{ pelicula.genero }} | {{ pelicula.clasificacion }}</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <p> {{ pelicula.duracion }} min</p>
                  <p> {{ pelicula.director }}</p>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-icon-button (click)="editarPelicula(pelicula)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="eliminarPelicula(pelicula)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </mat-card-actions>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <!-- Tab: Configuración Anuncios -->
        <mat-tab label="Config Anuncios">
          <div class="tab-content">
            <h2>Configuración de Anuncios</h2>

            <!-- Configurar porcentaje ocultación -->
            <mat-card class="config-card">
              <mat-card-header>
                <mat-card-title>Costo de Ocultación</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p>Define el porcentaje del costo del anuncio que se cobra por ocultarlo</p>
                <form [formGroup]="formConfigOcultacion">
                  <mat-form-field appearance="outline">
                    <mat-label>Porcentaje (%)</mat-label>
                    <input matInput type="number" formControlName="porcentaje" min="0" max="100">
                    <mat-hint>Valor actual: {{ configuracion.porcentajeOcultacion }}%</mat-hint>
                  </mat-form-field>
                  <button mat-raised-button color="primary" (click)="guardarConfigOcultacion()">
                    Guardar
                  </button>
                </form>
              </mat-card-content>
            </mat-card>

            <!-- Configurar precios anuncios -->
            <mat-card class="config-card">
              <mat-card-header>
                <mat-card-title>Precios de Anuncios</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p>Define el costo base diario por tipo de anuncio</p>
                <form [formGroup]="formPreciosAnuncios" class="precios-form">
                  <mat-form-field appearance="outline">
                    <mat-label>Texto (Q/día)</mat-label>
                    <input matInput type="number" formControlName="texto">
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Texto + Imagen (Q/día)</mat-label>
                    <input matInput type="number" formControlName="textoImagen">
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Video + Texto (Q/día)</mat-label>
                    <input matInput type="number" formControlName="videoTexto">
                  </mat-form-field>

                  <button mat-raised-button color="primary" (click)="guardarPreciosAnuncios()">
                    Guardar Precios
                  </button>
                </form>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- Tab: Moderar Anuncios -->
        <mat-tab label="Moderar Anuncios">
          <div class="tab-content">
            <h2>Moderación de Anuncios</h2>
            <p class="info-text">Aprueba o rechaza anuncios creados por anunciantes</p>

            <div class="anuncios-moderacion">
              <mat-card *ngFor="let anuncio of anunciosPendientes" class="anuncio-mod-card">
                <mat-card-header>
                  <mat-card-title>{{ anuncio.titulo }}</mat-card-title>
                  <mat-card-subtitle>
                    Por: {{ anuncio.usuarioAnunciante?.nombre || 'Desconocido' }}
                  </mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <p>{{ anuncio.contenido }}</p>
                  <div class="anuncio-info">
                    <mat-chip-set>
                      <mat-chip>{{ anuncio.tipo }}</mat-chip>
                      <mat-chip>Q{{ anuncio.costo }}</mat-chip>
                      <mat-chip>{{ anuncio.duracionDias }} días</mat-chip>
                    </mat-chip-set>
                  </div>
                  <div class="anuncio-status">
                    <span [class.aprobado]="anuncio.aprobado" [class.pendiente]="!anuncio.aprobado">
                      {{ anuncio.aprobado ? ' Aprobado' : ' Pendiente' }}
                    </span>
                    <span [class.activo]="anuncio.activo" [class.inactivo]="!anuncio.activo">
                      {{ anuncio.activo ? '🟢 Activo' : '🔴 Inactivo' }}
                    </span>
                  </div>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-raised-button color="primary" (click)="aprobarAnuncio(anuncio)"
                          [disabled]="anuncio.aprobado">
                    <mat-icon>check_circle</mat-icon>
                    Aprobar
                  </button>
                  <button mat-raised-button color="accent" (click)="rechazarAnuncio(anuncio)">
                    <mat-icon>cancel</mat-icon>
                    Rechazar
                  </button>
                  <button mat-raised-button color="warn" (click)="desactivarAnuncio(anuncio)"
                          [disabled]="!anuncio.activo">
                    <mat-icon>block</mat-icon>
                    Desactivar
                  </button>
                </mat-card-actions>
              </mat-card>
            </div>

            <h3 style="margin-top: 30px;">Todos los Anuncios</h3>
            <div class="anuncios-list">
              <mat-card *ngFor="let anuncio of todosAnuncios" class="anuncio-small-card">
                <mat-card-content>
                  <h4>{{ anuncio.titulo }}</h4>
                  <p class="small-text">{{ anuncio.contenido | slice:0:80 }}...</p>
                  <mat-chip-set>
                    <mat-chip [class.aprobado-chip]="anuncio.aprobado" [class.pendiente-chip]="!anuncio.aprobado">
                      {{ anuncio.aprobado ? 'Aprobado' : 'Pendiente' }}
                    </mat-chip>
                    <mat-chip [class.activo-chip]="anuncio.activo" [class.inactivo-chip]="!anuncio.activo">
                      {{ anuncio.activo ? 'Activo' : 'Inactivo' }}
                    </mat-chip>
                  </mat-chip-set>
                </mat-card-content>
              </mat-card>
            </div>
          </div>
        </mat-tab>
        <!-- Tab: Reportes Sistema -->
        <mat-tab label="Reportes Sistema">
          <div class="tab-content">
            <h2>Reportes del Sistema</h2>
            <div class="reportes-grid">
              <button mat-raised-button color="primary" (click)="descargarReporteSistema('ganancias','ganancias-sistema.pdf')">
                <mat-icon>download</mat-icon>
                Ganancias del Sistema
              </button>
              <button mat-raised-button color="primary" (click)="descargarReporteSistema('anuncios-comprados','anuncios-comprados.pdf')">
                <mat-icon>download</mat-icon>
                Anuncios Comprados
              </button>
              <button mat-raised-button color="primary" (click)="descargarReporteSistema('ganancias-anunciante','ganancias-anunciante.pdf')">
                <mat-icon>download</mat-icon>
                Ganancias por Anunciante
              </button>
              <button mat-raised-button color="primary" (click)="descargarReporteSistema('salas-populares','salas-populares.pdf')">
                <mat-icon>download</mat-icon>
                Salas Populares
              </button>
              <button mat-raised-button color="primary" (click)="descargarReporteSistema('salas-comentadas','salas-mas-comentadas.pdf')">
                <mat-icon>download</mat-icon>
                Salas más Comentadas
              </button>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      text-align: center;
    }

    .stat-card.pending {
      background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
    }

    .stat-icon {
      font-size: 3em;
    }

    .stat-value {
      font-size: 2.5em;
      font-weight: bold;
      color: #1976d2;
    }

    .tab-content {
      padding: 20px;
    }

    .tab-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .form-container {
      margin-bottom: 30px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-bottom: 15px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }

    .cines-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .cine-card {
      transition: transform 0.2s;
    }

    .cine-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    .salas-count {
      font-weight: bold;
      color: #4caf50;
    }

    .peliculas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
    }

    .pelicula-card {
      transition: transform 0.2s;
    }

    .pelicula-card:hover {
      transform: scale(1.05);
    }

    .pelicula-card img {
      height: 300px;
      object-fit: cover;
    }

    .config-card {
      margin-bottom: 20px;
    }

    .precios-form {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
      align-items: start;
    }

    .info-text {
      background: #e3f2fd;
      padding: 12px;
      border-radius: 4px;
      border-left: 4px solid #2196f3;
      margin-bottom: 20px;
    }

    .anuncios-moderacion {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }

    .anuncio-mod-card {
      border-left: 4px solid #ff9800;
    }

    .anuncio-info {
      margin: 15px 0;
    }

    .anuncio-status {
      display: flex;
      gap: 15px;
      margin: 10px 0;
    }

    .aprobado {
      color: #4caf50;
      font-weight: bold;
    }

    .pendiente {
      color: #ff9800;
      font-weight: bold;
    }

    .activo {
      color: #4caf50;
    }

    .inactivo {
      color: #f44336;
    }

    .anuncios-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 15px;
    }

    .anuncio-small-card {
      border-left: 3px solid #e0e0e0;
    }

    .small-text {
      font-size: 0.9em;
      color: #666;
    }

    .aprobado-chip {
      background-color: #c8e6c9 !important;
    }

    .pendiente-chip {
      background-color: #ffe0b2 !important;
    }

    .activo-chip {
      background-color: #b2dfdb !important;
    }

    .inactivo-chip {
      background-color: #ffcdd2 !important;
    }

    .reportes-grid { display:flex; flex-wrap:wrap; gap:12px; }
  `]
})
export class AdminSistemaDashboardComponent implements OnInit {
  cines: any[] = [];
  peliculas: any[] = [];
  todosAnuncios: any[] = [];
  anunciosPendientes: any[] = [];
  configuracion: any = { porcentajeOcultacion: 40 };

  estadisticas = {
    totalCines: 0,
    totalPeliculas: 0,
    totalAnuncios: 0,
    anunciosPendientes: 0,
    anunciosActivos: 0,
    totalUsuarios: 0
  };

  mostrandoFormCine = false;
  mostrandoFormPelicula = false;
  editandoCine: any = null;
  editandoPelicula: any = null;

  formCine: FormGroup;
  formPelicula: FormGroup;
  formConfigOcultacion: FormGroup;
  formPreciosAnuncios: FormGroup;

  token = localStorage.getItem('token');

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private snack: MatSnackBar,
    private router: Router
  ) {
    this.formCine = this.fb.group({
      nombre: ['', Validators.required],
      ubicacion: ['', Validators.required],
      telefono: [''],
      email: ['', Validators.email]
    });

    this.formPelicula = this.fb.group({
      titulo: ['', Validators.required],
      sinopsis: ['', Validators.required],
      duracion: [120, [Validators.required, Validators.min(1)]],
      genero: ['', Validators.required],
      clasificacion: ['TE', Validators.required],
      director: [''],
      actores: [''],
      fechaEstreno: [''],
      imagenUrl: [''],
      trailerUrl: ['']
    });

    this.formConfigOcultacion = this.fb.group({
      porcentaje: [40, [Validators.required, Validators.min(0), Validators.max(100)]]
    });

    this.formPreciosAnuncios = this.fb.group({
      texto: [25, [Validators.required, Validators.min(1)]],
      textoImagen: [50, [Validators.required, Validators.min(1)]],
      videoTexto: [100, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargarEstadisticas();
    this.cargarCines();
    this.cargarPeliculas();
    this.cargarAnuncios();
    this.cargarConfiguracion();
  }

  cargarEstadisticas() {
    this.http.get<any>('http://localhost:4000/api/admin-sistema/estadisticas', {
      headers: { Authorization: `Bearer ${this.token}` }
    }).subscribe({
      next: (data) => {
        this.estadisticas = data;
      },
      error: (err) => console.error('Error:', err)
    });
  }

  cargarCines() {
    this.http.get<any[]>('http://localhost:4000/api/admin-sistema/cines', {
      headers: { Authorization: `Bearer ${this.token}` }
    }).subscribe({
      next: (data) => {
        this.cines = data;
      },
      error: (err) => this.snack.open('Error al cargar cines', 'Cerrar', { duration: 3000 })
    });
  }

  cargarPeliculas() {
    this.http.get<any[]>('http://localhost:4000/api/admin-sistema/peliculas', {
      headers: { Authorization: `Bearer ${this.token}` }
    }).subscribe({
      next: (data) => {
        this.peliculas = data;
      },
      error: (err) => this.snack.open('Error al cargar películas', 'Cerrar', { duration: 3000 })
    });
  }

  cargarAnuncios() {
    this.http.get<any[]>('http://localhost:4000/api/admin-sistema/anuncios', {
      headers: { Authorization: `Bearer ${this.token}` }
    }).subscribe({
      next: (data) => {
        this.todosAnuncios = data;
        this.anunciosPendientes = data.filter((a: any) => !a.aprobado);
      },
      error: (err) => console.error('Error:', err)
    });
  }

  cargarConfiguracion() {
    this.http.get<any>('http://localhost:4000/api/admin-sistema/configuracion', {
      headers: { Authorization: `Bearer ${this.token}` }
    }).subscribe({
      next: (data) => {
        this.configuracion = data;
        this.formConfigOcultacion.patchValue({ porcentaje: data.porcentajeOcultacion });
        if (data.preciosAnuncios) {
          const p = data.preciosAnuncios;
          this.formPreciosAnuncios.patchValue({
            texto: p.texto ?? 25,
            textoImagen: p['texto-imagen'] ?? p.imagen ?? p.mixto ?? 50,
            videoTexto: p['video-texto'] ?? p.video ?? 100
          });
        }
      },
      error: (err) => console.error('Error:', err)
    });
  }

  // ============ CINES ============
  mostrarFormCine() {
    this.mostrandoFormCine = true;
    this.editandoCine = null;
    this.formCine.reset();
  }

  editarCine(cine: any) {
    this.editandoCine = cine;
    this.mostrandoFormCine = true;
    this.formCine.patchValue(cine);
  }

  cancelarFormCine() {
    this.mostrandoFormCine = false;
    this.editandoCine = null;
  }

  guardarCine() {
    if (this.formCine.invalid) return;

    const url = this.editandoCine
      ? `http://localhost:4000/api/admin-sistema/cines/${this.editandoCine.id}`
      : 'http://localhost:4000/api/admin-sistema/cines';

    const metodo = this.editandoCine ? 'put' : 'post';

    this.http.request(metodo, url, {
      body: this.formCine.value,
      headers: { Authorization: `Bearer ${this.token}` }
    }).subscribe({
      next: () => {
        this.snack.open(this.editandoCine ? 'Cine actualizado' : 'Cine creado', 'Cerrar', { duration: 2000 });
        this.cancelarFormCine();
        this.cargarCines();
        this.cargarEstadisticas();
      },
      error: (err) => {
        this.snack.open(err.error?.msg || 'Error', 'Cerrar', { duration: 3000 });
      }
    });
  }

  eliminarCine(cine: any) {
    if (confirm(`¿Eliminar cine "${cine.nombre}"?`)) {
      this.http.delete(`http://localhost:4000/api/admin-sistema/cines/${cine.id}`, {
        headers: { Authorization: `Bearer ${this.token}` }
      }).subscribe({
        next: () => {
          this.snack.open('Cine eliminado', 'Cerrar', { duration: 2000 });
          this.cargarCines();
          this.cargarEstadisticas();
        },
        error: (err) => {
          this.snack.open(err.error?.msg || 'Error', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  // ============ PELÍCULAS ============
  mostrarFormPelicula() {
    this.mostrandoFormPelicula = true;
    this.editandoPelicula = null;
    this.formPelicula.reset({ duracion: 120, clasificacion: 'TE' });
  }

  editarPelicula(pelicula: any) {
    this.editandoPelicula = pelicula;
    this.mostrandoFormPelicula = true;
    this.formPelicula.patchValue(pelicula);
  }

  cancelarFormPelicula() {
    this.mostrandoFormPelicula = false;
    this.editandoPelicula = null;
  }

  guardarPelicula() {
    if (this.formPelicula.invalid) return;

    const url = this.editandoPelicula
      ? `http://localhost:4000/api/admin-sistema/peliculas/${this.editandoPelicula.id}`
      : 'http://localhost:4000/api/admin-sistema/peliculas';

    const metodo = this.editandoPelicula ? 'put' : 'post';

    this.http.request(metodo, url, {
      body: this.formPelicula.value,
      headers: { Authorization: `Bearer ${this.token}` }
    }).subscribe({
      next: () => {
        this.snack.open(this.editandoPelicula ? 'Película actualizada' : 'Película creada', 'Cerrar', { duration: 2000 });
        this.cancelarFormPelicula();
        this.cargarPeliculas();
        this.cargarEstadisticas();
      },
      error: (err) => {
        this.snack.open(err.error?.msg || 'Error', 'Cerrar', { duration: 3000 });
      }
    });
  }

  eliminarPelicula(pelicula: any) {
    if (confirm(`¿Eliminar película "${pelicula.titulo}"?`)) {
      this.http.delete(`http://localhost:4000/api/admin-sistema/peliculas/${pelicula.id}`, {
        headers: { Authorization: `Bearer ${this.token}` }
      }).subscribe({
        next: () => {
          this.snack.open('Película eliminada', 'Cerrar', { duration: 2000 });
          this.cargarPeliculas();
          this.cargarEstadisticas();
        },
        error: (err) => {
          this.snack.open(err.error?.msg || 'Error', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  // ============ CONFIGURACIÓN ============
  guardarConfigOcultacion() {
    if (this.formConfigOcultacion.invalid) return;

    this.http.post('http://localhost:4000/api/admin-sistema/configuracion/ocultacion',
      this.formConfigOcultacion.value,
      { headers: { Authorization: `Bearer ${this.token}` } }
    ).subscribe({
      next: () => {
        this.snack.open('Configuración guardada', 'Cerrar', { duration: 2000 });
        this.cargarConfiguracion();
      },
      error: (err) => {
        this.snack.open('Error al guardar', 'Cerrar', { duration: 3000 });
      }
    });
  }

  guardarPreciosAnuncios() {
    if (this.formPreciosAnuncios.invalid) return;

    const valores = this.formPreciosAnuncios.value;
    const precios = {
      texto: valores.texto,
      'texto-imagen': valores.textoImagen,
      'video-texto': valores.videoTexto
    };

    this.http.post('http://localhost:4000/api/admin-sistema/configuracion/precios-anuncios',
      { precios },
      { headers: { Authorization: `Bearer ${this.token}` } }
    ).subscribe({
      next: () => {
        this.snack.open('Precios actualizados', 'Cerrar', { duration: 2000 });
        this.cargarConfiguracion();
      },
      error: (err) => {
        this.snack.open('Error al guardar', 'Cerrar', { duration: 3000 });
      }
    });
  }

  // ============ MODERAR ANUNCIOS ============
  aprobarAnuncio(anuncio: any) {
    this.http.patch(`http://localhost:4000/api/admin-sistema/anuncios/${anuncio.id}/aprobar`, {}, {
      headers: { Authorization: `Bearer ${this.token}` }
    }).subscribe({
      next: () => {
        this.snack.open('Anuncio aprobado', 'Cerrar', { duration: 2000 });
        this.cargarAnuncios();
        this.cargarEstadisticas();
      },
      error: (err) => {
        this.snack.open('Error al aprobar', 'Cerrar', { duration: 3000 });
      }
    });
  }

  rechazarAnuncio(anuncio: any) {
    const motivo = prompt('Motivo del rechazo (opcional):');

    this.http.patch(`http://localhost:4000/api/admin-sistema/anuncios/${anuncio.id}/rechazar`,
      { motivo },
      { headers: { Authorization: `Bearer ${this.token}` } }
    ).subscribe({
      next: () => {
        this.snack.open('Anuncio rechazado', 'Cerrar', { duration: 2000 });
        this.cargarAnuncios();
        this.cargarEstadisticas();
      },
      error: (err) => {
        this.snack.open('Error al rechazar', 'Cerrar', { duration: 3000 });
      }
    });
  }

  desactivarAnuncio(anuncio: any) {
    if (confirm(`¿Desactivar anuncio "${anuncio.titulo}"?`)) {
      this.http.patch(`http://localhost:4000/api/admin-sistema/anuncios/${anuncio.id}/desactivar`, {}, {
        headers: { Authorization: `Bearer ${this.token}` }
      }).subscribe({
        next: () => {
          this.snack.open('Anuncio desactivado', 'Cerrar', { duration: 2000 });
          this.cargarAnuncios();
        },
        error: (err) => {
          this.snack.open('Error al desactivar', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  // Reportes Sistema
  descargarReporteSistema(segmento: string, filename: string) {
    const url = `http://localhost:4000/api/reportes-sistema/${segmento}`;
    this.http.get(url, {
      headers: { Authorization: `Bearer ${this.token}` },
      responseType: 'blob'
    }).subscribe({
      next: (blob: Blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
        this.snack.open('Reporte descargado', 'Cerrar', { duration: 2000 });
      },
      error: (err) => {
        console.error('Error descargando reporte', err);
        this.snack.open(err.error?.msg || 'No se pudo generar el reporte', 'Cerrar', { duration: 3000 });
      }
    });
  }

  onImagenError(event: any) {
    event.target.src = 'assets/images/movie-placeholder.jpg';
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
