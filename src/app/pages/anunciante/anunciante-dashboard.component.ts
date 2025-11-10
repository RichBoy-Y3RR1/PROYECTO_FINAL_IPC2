import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-anunciante-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="header">
        <div class="header-left">
          <button mat-icon-button (click)="irMenuPrincipal()" matTooltip="Volver al menú principal">
            <mat-icon>home</mat-icon>
          </button>
            <h1>Panel de Anunciante</h1>
        </div>
        <div class="header-right">
          <button mat-raised-button (click)="irMenuPrincipal()" color="accent">
            <mat-icon>arrow_back</mat-icon>
            Menú Principal
          </button>
          <button mat-raised-button color="primary" (click)="irCrearAnuncio()">
            <mat-icon>add</mat-icon>
            Crear Nuevo Anuncio
          </button>
        </div>
      </div>

      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon"></div>
            <div class="stat-value">{{ estadisticas.total }}</div>
            <div class="stat-label">Total Anuncios</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card active">
          <mat-card-content>
            <div class="stat-icon"></div>
            <div class="stat-value">{{ estadisticas.activos }}</div>
            <div class="stat-label">Anuncios Activos</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card pending">
          <mat-card-content>
            <div class="stat-icon"></div>
            <div class="stat-value">{{ estadisticas.pendientes }}</div>
            <div class="stat-label">Pendientes Aprobación</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card balance">
          <mat-card-content>
            <div class="stat-icon"></div>
            <div class="stat-value">Q{{ saldo | number:'1.2-2' }}</div>
            <div class="stat-label">Saldo Disponible</div>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-card class="anuncios-card">
        <mat-card-header>
          <mat-card-title>Mis Anuncios</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="anuncios-list" *ngIf="anuncios.length > 0; else noAnuncios">
            <div class="anuncio-item" *ngFor="let anuncio of anuncios">
              <div class="anuncio-info">
                <h3>{{ anuncio.titulo }}</h3>
                <p>{{ anuncio.contenido | slice:0:100 }}...</p>
                <div class="anuncio-meta">
                  <mat-chip [class]="'chip-' + anuncio.tipo">{{ anuncio.tipo }}</mat-chip>
                  <mat-chip [class]="anuncio.activo ? 'chip-activo' : 'chip-inactivo'">
                    {{ anuncio.activo ? 'Activo' : 'Inactivo' }}
                  </mat-chip>
                  <mat-chip [class]="anuncio.aprobado ? 'chip-aprobado' : 'chip-pendiente'">
                    {{ anuncio.aprobado ? 'Aprobado' : 'Pendiente' }}
                  </mat-chip>
                  <span class="fecha">{{ anuncio.fechaInicio }} - {{ anuncio.fechaFin }}</span>
                  <span class="costo">Q{{ anuncio.costo }}</span>
                </div>
              </div>
              <div class="anuncio-actions">
                <button mat-icon-button color="primary" (click)="verAnuncio(anuncio)"
                        matTooltip="Ver detalles">
                  <mat-icon>visibility</mat-icon>
                </button>
                <button mat-icon-button color="accent" (click)="editarAnuncio(anuncio)"
                        *ngIf="!anuncio.aprobado" matTooltip="Editar">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="eliminarAnuncio(anuncio)"
                        matTooltip="Eliminar">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
          </div>

          <ng-template #noAnuncios>
            <div class="empty-state">
              <mat-icon>campaign</mat-icon>
              <h3>No tienes anuncios aún</h3>
              <p>Crea tu primer anuncio para promocionar tu empresa</p>
              <button mat-raised-button color="primary" (click)="irCrearAnuncio()">
                Crear Anuncio
              </button>
            </div>
          </ng-template>
        </mat-card-content>
      </mat-card>
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

    .header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .header h1 {
      margin: 0;
      font-size: 2em;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      text-align: center;
      transition: transform 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-5px);
    }

    .stat-card.active { border-left: 4px solid #4caf50; }
    .stat-card.pending { border-left: 4px solid #ff9800; }
    .stat-card.balance { border-left: 4px solid #2196f3; }

    .stat-icon {
      font-size: 3em;
      margin-bottom: 10px;
    }

    .stat-value {
      font-size: 2em;
      font-weight: bold;
      color: #333;
    }

    .stat-label {
      color: #666;
      margin-top: 5px;
    }

    .anuncios-card {
      margin-top: 20px;
    }

    .anuncios-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .anuncio-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 8px;
      transition: box-shadow 0.2s;
    }

    .anuncio-item:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .anuncio-info {
      flex: 1;
    }

    .anuncio-info h3 {
      margin: 0 0 10px 0;
      color: #333;
    }

    .anuncio-info p {
      margin: 0 0 10px 0;
      color: #666;
    }

    .anuncio-meta {
      display: flex;
      gap: 10px;
      align-items: center;
      flex-wrap: wrap;
    }

    .anuncio-meta .fecha,
    .anuncio-meta .costo {
      font-size: 0.9em;
      color: #666;
    }

    .anuncio-actions {
      display: flex;
      gap: 5px;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
    }

    .empty-state mat-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: #ccc;
    }

    .empty-state h3 {
      margin: 20px 0 10px 0;
    }

    .empty-state p {
      color: #666;
      margin-bottom: 20px;
    }

    mat-chip.chip-texto { background-color: #e3f2fd; }
    mat-chip.chip-imagen { background-color: #f3e5f5; }
    mat-chip.chip-video { background-color: #fce4ec; }
    mat-chip.chip-banner { background-color: #fff3e0; }
    mat-chip.chip-mixto { background-color: #e8f5e9; }

    mat-chip.chip-activo { background-color: #c8e6c9; color: #2e7d32; }
    mat-chip.chip-inactivo { background-color: #ffccbc; color: #d84315; }
    mat-chip.chip-aprobado { background-color: #b2dfdb; color: #00695c; }
    mat-chip.chip-pendiente { background-color: #ffe0b2; color: #e65100; }
  `]
})
export class AnuncianteDashboardComponent implements OnInit {
  anuncios: any[] = [];
  estadisticas = {
    total: 0,
    activos: 0,
    pendientes: 0
  };
  saldo: number = 0;
  token: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private snack: MatSnackBar
  ) {
    this.token = localStorage.getItem('token');
  }

  ngOnInit() {
    this.cargarAnuncios();
    this.cargarSaldo();
  }

  cargarAnuncios() {
    this.http.get<any[]>('http://localhost:4000/api/anuncios/mis-anuncios', {
      headers: { Authorization: `Bearer ${this.token}` }
    }).subscribe({
      next: (data) => {
        this.anuncios = data;
        this.calcularEstadisticas();
      },
      error: (err) => {
        console.error('Error cargando anuncios:', err);
        this.snack.open('Error al cargar anuncios', 'Cerrar', { duration: 3000 });
      }
    });
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

  calcularEstadisticas() {
    this.estadisticas.total = this.anuncios.length;
    this.estadisticas.activos = this.anuncios.filter(a => a.activo && a.aprobado).length;
    this.estadisticas.pendientes = this.anuncios.filter(a => !a.aprobado).length;
  }

  irCrearAnuncio() {
    this.router.navigate(['/anunciante/crear']);
  }

  verAnuncio(anuncio: any) {
    this.snack.open(`Viendo: ${anuncio.titulo}`, 'Cerrar', { duration: 2000 });
  }

  editarAnuncio(anuncio: any) {
    this.router.navigate(['/anunciante/editar', anuncio.id]);
  }

  eliminarAnuncio(anuncio: any) {
    if (confirm(`¿Eliminar "${anuncio.titulo}"?`)) {
      this.http.delete(`http://localhost:4000/api/anuncios/${anuncio.id}`, {
        headers: { Authorization: `Bearer ${this.token}` }
      }).subscribe({
        next: () => {
          this.snack.open('Anuncio eliminado', 'Cerrar', { duration: 2000 });
          this.cargarAnuncios();
        },
        error: (err) => {
          this.snack.open(err.error?.msg || 'Error al eliminar', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  irMenuPrincipal() {
    this.router.navigate(['/']);
  }
}
