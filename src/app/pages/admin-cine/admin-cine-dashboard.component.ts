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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-admin-cine-dashboard',
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
    MatSlideToggleModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="header">
  <h1>Panel Administrador de Cine</h1>
        <button mat-raised-button color="warn" (click)="cerrarSesion()">
          <mat-icon>exit_to_app</mat-icon>
          Cerrar Sesión
        </button>
      </div>

      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon"></div>
            <div class="stat-value">{{ estadisticas.totalSalas }}</div>
            <div class="stat-label">Total Salas</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon"></div>
            <div class="stat-value">{{ estadisticas.totalFunciones }}</div>
            <div class="stat-label">Funciones Programadas</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon"></div>
            <div class="stat-value">{{ estadisticas.anunciosBloqueados }}</div>
            <div class="stat-label">Anuncios Bloqueados</div>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-tab-group>
        <!-- Tab: Gestión de Salas -->
        <mat-tab label="Salas">
          <div class="tab-content">
            <div class="tab-header">
              <h2>Gestión de Salas</h2>
              <button mat-raised-button color="primary" (click)="mostrarFormSala()">
                <mat-icon>add</mat-icon>
                Nueva Sala
              </button>
            </div>

            <div *ngIf="mostrandoFormSala" class="form-container">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>{{ editandoSala ? 'Editar Sala' : 'Nueva Sala' }}</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <form [formGroup]="formSala">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Nombre de la Sala</mat-label>
                      <input matInput formControlName="nombre">
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Capacidad</mat-label>
                      <input matInput type="number" formControlName="capacidad">
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Tipo</mat-label>
                      <mat-select formControlName="tipo">
                        <mat-option value="Normal">Normal</mat-option>
                        <mat-option value="VIP">VIP</mat-option>
                        <mat-option value="IMAX">IMAX</mat-option>
                        <mat-option value="3D">3D</mat-option>
                        <mat-option value="Premium">Premium</mat-option>
                      </mat-select>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Número</mat-label>
                      <input matInput type="number" formControlName="numero">
                    </mat-form-field>

                    <div class="toggle-group">
                      <mat-slide-toggle formControlName="visiblePublica">
                        Visible al público
                      </mat-slide-toggle>
                      <mat-slide-toggle formControlName="bloquearComentarios">
                        Bloquear comentarios
                      </mat-slide-toggle>
                    </div>

                    <div class="form-actions">
                      <button mat-button (click)="cancelarFormSala()">Cancelar</button>
                      <button mat-raised-button color="primary" (click)="guardarSala()">
                        {{ editandoSala ? 'Actualizar' : 'Crear' }}
                      </button>
                    </div>
                  </form>
                </mat-card-content>
              </mat-card>
            </div>

            <div class="salas-list">
              <mat-card *ngFor="let sala of salas" class="sala-card">
                <mat-card-header>
                  <mat-card-title>{{ sala.nombre }}</mat-card-title>
                  <mat-card-subtitle>{{ sala.tipo }} | Capacidad: {{ sala.capacidad }}</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <div class="sala-info">
                    <span>Número: {{ sala.numero }}</span>
                    <span [class.visible]="sala.visiblePublica" [class.oculta]="!sala.visiblePublica">
                      {{ sala.visiblePublica ? 'Visible' : ' Oculta' }}
                    </span>
                    <span [class.comentarios-bloqueados]="sala.bloquearComentarios">
                      {{ sala.bloquearComentarios ? ' Comentarios bloqueados' : 'Comentarios activos' }}
                    </span>
                  </div>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-icon-button (click)="editarSala(sala)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="eliminarSala(sala)">
                    <mat-icon>delete</mat-icon>
                  </button>
                  <button mat-icon-button (click)="toggleVisibilidad(sala)">
                    <mat-icon>{{ sala.visiblePublica ? 'visibility_off' : 'visibility' }}</mat-icon>
                  </button>
                  <button mat-icon-button (click)="toggleComentarios(sala)">
                    <mat-icon>{{ sala.bloquearComentarios ? 'comment' : 'comments_disabled' }}</mat-icon>
                  </button>
                </mat-card-actions>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <!-- Tab: Asignar Funciones -->
        <mat-tab label="Funciones">
          <div class="tab-content">
            <div class="tab-header">
              <h2>Asignar Películas a Salas</h2>
              <button mat-raised-button color="primary" (click)="mostrarFormFuncion()">
                <mat-icon>add</mat-icon>
                Nueva Función
              </button>
            </div>

            <div *ngIf="mostrandoFormFuncion" class="form-container">
              <mat-card>
                <mat-card-header>
                  <mat-card-title>Nueva Función</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <form [formGroup]="formFuncion">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Película</mat-label>
                      <mat-select formControlName="peliculaId">
                        <mat-option *ngFor="let p of peliculas" [value]="p.id">
                          {{ p.titulo }}
                        </mat-option>
                      </mat-select>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Sala</mat-label>
                      <mat-select formControlName="salaId">
                        <mat-option *ngFor="let s of salas" [value]="s.id">
                          {{ s.nombre }} ({{ s.tipo }})
                        </mat-option>
                      </mat-select>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Fecha</mat-label>
                      <input matInput type="date" formControlName="fecha">
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Hora</mat-label>
                      <input matInput type="time" formControlName="hora">
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Precio (Q)</mat-label>
                      <input matInput type="number" formControlName="precio">
                    </mat-form-field>

                    <div class="form-actions">
                      <button mat-button (click)="cancelarFormFuncion()">Cancelar</button>
                      <button mat-raised-button color="primary" (click)="guardarFuncion()">
                        Crear Función
                      </button>
                    </div>
                  </form>
                </mat-card-content>
              </mat-card>
            </div>

            <div class="funciones-list">
              <mat-card *ngFor="let funcion of funciones" class="funcion-card">
                <mat-card-content>
                  <div class="funcion-info">
                    <h3>{{ funcion.pelicula?.titulo || 'Película' }}</h3>
                    <p>Sala: {{ funcion.sala?.nombre || 'N/A' }}</p>
                    <p> {{ funcion.fecha }}  {{ funcion.hora }}</p>
                    <p class="precio">Q{{ funcion.precio }}</p>
                  </div>
                </mat-card-content>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <!-- Tab: Bloquear Anuncios -->
        <mat-tab label="Bloquear Anuncios">
          <div class="tab-content">
            <h2>Gestionar Anuncios</h2>
            <p>Puedes bloquear anuncios que no deseas mostrar en tu cine</p>
            <p class="info-text">Bloqueo sin costo</p>

            <div class="anuncios-grid">
              <mat-card *ngFor="let anuncio of anunciosDisponibles" class="anuncio-card">
                <mat-card-header>
                  <mat-card-title>{{ anuncio.titulo }}</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <p>{{ anuncio.contenido | slice:0:100 }}...</p>
                  <p class="costo">Costo bloqueo: Q0.00</p>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-raised-button color="warn" (click)="bloquearAnuncio(anuncio)">
                    Bloquear
                  </button>
                </mat-card-actions>
              </mat-card>
            </div>

            <h3>Anuncios Bloqueados</h3>
            <div class="bloqueados-list">
              <mat-card *ngFor="let bloqueado of anunciosBloqueados">
                <mat-card-content>
              <p>{{ bloqueado.Anuncio?.titulo || 'Anuncio bloqueado' }}</p>
                  <p class="fecha">{{ bloqueado.fechaInicio || bloqueado.fechaBloqueo | date:'short' }}</p>
                </mat-card-content>
              </mat-card>
            </div>
          </div>
        </mat-tab>

        <!-- Tab: Reportes -->
        <mat-tab label="Reportes">
          <div class="tab-content">
          <h2>Reportes del Cine</h2>
            <div class="reportes-grid">
              <button mat-raised-button color="primary" (click)="descargarReporteCine('comentarios','comentarios-por-sala.pdf')">
                <mat-icon>download</mat-icon>
                Comentarios por Sala
              </button>
              <button mat-raised-button color="primary" (click)="descargarReporteCine('peliculas-proyectadas','peliculas-proyectadas.pdf')">
                <mat-icon>download</mat-icon>
                Películas Proyectadas
              </button>
              <button mat-raised-button color="primary" (click)="descargarReporteCine('salas-gustadas','salas-mas-gustadas.pdf')">
                <mat-icon>download</mat-icon>
                Salas más Gustadas
              </button>
              <button mat-raised-button color="primary" (click)="descargarReporteCine('boletos','boletos-vendidos.pdf')">
                <mat-icon>download</mat-icon>
                Boletos Vendidos
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
      margin-bottom: 20px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }

    .toggle-group {
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin: 20px 0;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }

    .salas-list,
    .funciones-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 15px;
      margin-top: 20px;
    }

    .sala-card, .funcion-card {
      transition: transform 0.2s;
    }

    .sala-card:hover, .funcion-card:hover {
      transform: translateY(-5px);
    }

    .sala-info {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .visible {
      color: #4caf50;
    }

    .oculta {
      color: #f44336;
    }

    .comentarios-bloqueados {
      color: #ff9800;
    }

    .anuncios-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 15px;
      margin: 20px 0;
    }

    .info-text {
      background: #e3f2fd;
      padding: 10px;
      border-radius: 4px;
      border-left: 4px solid #2196f3;
    }

    .reportes-grid { display:flex; flex-wrap:wrap; gap:12px; }

    .precio {
      font-size: 1.2em;
      font-weight: bold;
      color: #4caf50;
    }

    .costo {
      color: #ff9800;
      font-weight: bold;
    }

    .funcion-info h3 {
      margin: 0 0 10px 0;
      color: #333;
    }

    .funcion-info p {
      margin: 5px 0;
    }
  `]
})
export class AdminCineDashboardComponent implements OnInit {
  salas: any[] = [];
  funciones: any[] = [];
  peliculas: any[] = [];
  anunciosDisponibles: any[] = [];
  anunciosBloqueados: any[] = [];
  estadisticas = {
    totalSalas: 0,
    totalFunciones: 0,
    anunciosBloqueados: 0
  };

  mostrandoFormSala = false;
  mostrandoFormFuncion = false;
  editandoSala: any = null;

  formSala: FormGroup;
  formFuncion: FormGroup;

  token = localStorage.getItem('token');

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private snack: MatSnackBar,
    private router: Router
  ) {
    this.formSala = this.fb.group({
      nombre: ['', Validators.required],
      capacidad: [100, [Validators.required, Validators.min(1)]],
      tipo: ['Normal', Validators.required],
      numero: [1, Validators.required],
      visiblePublica: [true],
      bloquearComentarios: [false]
    });

    this.formFuncion = this.fb.group({
      peliculaId: ['', Validators.required],
      salaId: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      precio: [45, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargarEstadisticas();
    this.cargarSalas();
    this.cargarFunciones();
    this.cargarPeliculas();
    this.cargarAnuncios();
    this.cargarAnunciosBloqueados();
  }

  cargarEstadisticas() {
    this.http.get<any>('http://localhost:4000/api/admin-cine/estadisticas', {
      headers: { Authorization: `Bearer ${this.token}` }
    }).subscribe({
      next: (data) => {
        this.estadisticas = data;
      },
      error: (err) => console.error('Error:', err)
    });
  }

  cargarSalas() {
    this.http.get<any[]>('http://localhost:4000/api/admin-cine/salas', {
      headers: { Authorization: `Bearer ${this.token}` }
    }).subscribe({
      next: (data) => {
        this.salas = data;
      },
      error: (err) => this.snack.open('Error al cargar salas', 'Cerrar', { duration: 3000 })
    });
  }

  cargarFunciones() {
    this.http.get<any[]>('http://localhost:4000/api/admin-cine/funciones', {
      headers: { Authorization: `Bearer ${this.token}` }
    }).subscribe({
      next: (data) => {
        this.funciones = data;
      },
      error: (err) => console.error('Error:', err)
    });
  }

  cargarPeliculas() {
    this.http.get<any[]>('http://localhost:4000/api/peliculas').subscribe({
      next: (data) => {
        this.peliculas = data;
      },
      error: (err) => console.error('Error:', err)
    });
  }

  cargarAnuncios() {
    this.http.get<any[]>('http://localhost:4000/api/anuncios/vigentes').subscribe({
      next: (data) => {
        this.anunciosDisponibles = data.filter((a: any) => a.activo && a.aprobado);
      },
      error: (err) => console.error('Error:', err)
    });
  }

  cargarAnunciosBloqueados() {
    this.http.get<any[]>('http://localhost:4000/api/admin-cine/anuncios-bloqueados', {
      headers: { Authorization: `Bearer ${this.token}` }
    }).subscribe({
      next: (data) => {
        this.anunciosBloqueados = data;
      },
      error: (err) => console.error('Error:', err)
    });
  }

  mostrarFormSala() {
    this.mostrandoFormSala = true;
    this.editandoSala = null;
    this.formSala.reset({
      tipo: 'Normal',
      numero: 1,
      capacidad: 100,
      visiblePublica: true,
      bloquearComentarios: false
    });
  }

  editarSala(sala: any) {
    this.editandoSala = sala;
    this.mostrandoFormSala = true;
    this.formSala.patchValue(sala);
  }

  cancelarFormSala() {
    this.mostrandoFormSala = false;
    this.editandoSala = null;
  }

  guardarSala() {
    if (this.formSala.invalid) {
      return;
    }

    const url = this.editandoSala
      ? `http://localhost:4000/api/admin-cine/salas/${this.editandoSala.id}`
      : 'http://localhost:4000/api/admin-cine/salas';

    const metodo = this.editandoSala ? 'put' : 'post';

    this.http.request(metodo, url, {
      body: this.formSala.value,
      headers: { Authorization: `Bearer ${this.token}` }
    }).subscribe({
      next: () => {
        this.snack.open(
          this.editandoSala ? 'Sala actualizada' : 'Sala creada',
          'Cerrar',
          { duration: 2000 }
        );
        this.cancelarFormSala();
        this.cargarSalas();
        this.cargarEstadisticas();
      },
      error: (err) => {
        this.snack.open(err.error?.msg || 'Error', 'Cerrar', { duration: 3000 });
      }
    });
  }

  eliminarSala(sala: any) {
    if (confirm(`¿Eliminar sala "${sala.nombre}"?`)) {
      this.http.delete(`http://localhost:4000/api/admin-cine/salas/${sala.id}`, {
        headers: { Authorization: `Bearer ${this.token}` }
      }).subscribe({
        next: () => {
          this.snack.open('Sala eliminada', 'Cerrar', { duration: 2000 });
          this.cargarSalas();
          this.cargarEstadisticas();
        },
        error: (err) => {
          this.snack.open(err.error?.msg || 'Error al eliminar', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  toggleVisibilidad(sala: any) {
    this.http.patch(`http://localhost:4000/api/admin-cine/salas/${sala.id}/visibilidad`, {
      visible: !sala.visiblePublica
    }, {
      headers: { Authorization: `Bearer ${this.token}` }
    }).subscribe({
      next: () => {
        sala.visiblePublica = !sala.visiblePublica;
        this.snack.open('Visibilidad actualizada', 'Cerrar', { duration: 2000 });
      },
      error: (err) => {
        this.snack.open('Error', 'Cerrar', { duration: 3000 });
      }
    });
  }

  toggleComentarios(sala: any) {
    this.http.patch(`http://localhost:4000/api/admin-cine/salas/${sala.id}/comentarios`, {
      bloquear: !sala.bloquearComentarios
    }, {
      headers: { Authorization: `Bearer ${this.token}` }
    }).subscribe({
      next: () => {
        sala.bloquearComentarios = !sala.bloquearComentarios;
        this.snack.open('Configuración actualizada', 'Cerrar', { duration: 2000 });
      },
      error: (err) => {
        this.snack.open('Error', 'Cerrar', { duration: 3000 });
      }
    });
  }

  mostrarFormFuncion() {
    this.mostrandoFormFuncion = true;
    this.formFuncion.reset({ precio: 45 });
  }

  cancelarFormFuncion() {
    this.mostrandoFormFuncion = false;
  }

  guardarFuncion() {
    if (this.formFuncion.invalid) {
      return;
    }

    this.http.post('http://localhost:4000/api/admin-cine/funciones', this.formFuncion.value, {
      headers: { Authorization: `Bearer ${this.token}` }
    }).subscribe({
      next: () => {
        this.snack.open('Función creada', 'Cerrar', { duration: 2000 });
        this.cancelarFormFuncion();
        this.cargarFunciones();
        this.cargarEstadisticas();
      },
      error: (err) => {
        this.snack.open(err.error?.msg || 'Error', 'Cerrar', { duration: 3000 });
      }
    });
  }

  bloquearAnuncio(anuncio: any) {
    if (confirm(`¿Bloquear anuncio "${anuncio.titulo}" sin costo?`)) {
      this.http.post('http://localhost:4000/api/admin-cine/bloquear-anuncio', {
        anuncioId: anuncio.id
      }, {
        headers: { Authorization: `Bearer ${this.token}` }
      }).subscribe({
        next: () => {
          this.snack.open('Anuncio bloqueado sin costo', 'Cerrar', { duration: 2000 });
          this.cargarAnuncios();
          this.cargarAnunciosBloqueados();
          this.cargarEstadisticas();
        },
        error: (err) => {
          this.snack.open(err.error?.msg || 'Error', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  // Reportes Cine
  descargarReporteCine(segmento: string, filename: string) {
    const url = `http://localhost:4000/api/reportes-cine/${segmento}`;
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

  cerrarSesion() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
