import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CrearAnuncioComponent } from './dialogs/crear-anuncio.component';

@Component({
  selector: 'app-anuncios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    MatInputModule,
    MatSelectModule
  ],
  template: `
    <div class="anuncios-container">
      <div class="header">
        <h1>Gestión de Anuncios</h1>
        <div class="actions">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Buscar anuncios</mat-label>
            <input matInput [(ngModel)]="searchTerm" placeholder="Buscar...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>

          <button mat-raised-button color="primary" (click)="crearAnuncio()">
            <mat-icon>add</mat-icon>
            Nuevo Anuncio
          </button>
        </div>
      </div>

      <mat-tab-group>
        <!-- Anuncios Activos -->
        <mat-tab label="Anuncios Activos">
          <div class="anuncios-grid">
            <mat-card *ngFor="let anuncio of anunciosActivos" class="anuncio-card">
              <mat-card-header>
                <mat-card-title>{{getTipoAnuncio(anuncio.tipo)}}</mat-card-title>
                <mat-card-subtitle>
                  Vigencia: {{getPeriodo(anuncio.periodoTiempo)}}
                </mat-card-subtitle>
              </mat-card-header>

              <mat-card-content>
                <!-- Contenido según tipo -->
                <div [ngSwitch]="anuncio.tipo">
                  <!-- Anuncio de Texto -->
                  <div *ngSwitchCase="'TEXTO'" class="texto-anuncio">
                    <p>{{anuncio.contenido}}</p>
                  </div>

                  <!-- Anuncio de Texto e Imagen -->
                  <div *ngSwitchCase="'TEXTO_IMAGEN'" class="imagen-anuncio">
                    <img [src]="anuncio.imagen" [alt]="anuncio.contenido">
                    <p>{{anuncio.contenido}}</p>
                  </div>

                  <!-- Anuncio de Video -->
                  <div *ngSwitchCase="'VIDEO_TEXTO'" class="video-anuncio">
                    <iframe [src]="getSafeUrl(anuncio.videoUrl)"
                            frameborder="0"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen>
                    </iframe>
                    <p>{{anuncio.contenido}}</p>
                  </div>
                </div>

                <div class="anuncio-info">
                  <div class="info-item">
                    <mat-icon>event</mat-icon>
                    <span>Inicio: {{anuncio.fechaInicio | date}}</span>
                  </div>
                  <div class="info-item">
                    <mat-icon>event_busy</mat-icon>
                    <span>Fin: {{anuncio.fechaFin | date}}</span>
                  </div>
                  <div class="info-item">
                    <mat-icon>attach_money</mat-icon>
                    <span>Costo: Q{{anuncio.costo}}</span>
                  </div>
                </div>
              </mat-card-content>

              <mat-card-actions>
                <button mat-button color="warn" (click)="desactivarAnuncio(anuncio)">
                  <mat-icon>cancel</mat-icon>
                  Desactivar
                </button>
                <button mat-button color="primary" (click)="editarAnuncio(anuncio)">
                  <mat-icon>edit</mat-icon>
                  Editar
                </button>
              </mat-card-actions>
            </mat-card>
          </div>
        </mat-tab>

        <!-- Anuncios Inactivos -->
        <mat-tab label="Anuncios Inactivos">
          <!-- Similar grid pero con anuncios inactivos -->
        </mat-tab>

        <!-- Estadísticas -->
        <mat-tab label="Estadísticas">
          <div class="estadisticas-container">
            <!-- Gráficos y estadísticas -->
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .anuncios-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 24px;
    }

    .actions {
      display: flex;
      gap: 16px;
      align-items: center;
      margin-top: 16px;
    }

    .search-field {
      flex: 1;
      max-width: 400px;
    }

    .anuncios-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
      padding: 24px;
    }

    .anuncio-card {
      display: flex;
      flex-direction: column;
    }

    .texto-anuncio,
    .imagen-anuncio,
    .video-anuncio {
      margin-bottom: 16px;
    }

    .imagen-anuncio img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 4px;
      margin-bottom: 8px;
    }

    .video-anuncio iframe {
      width: 100%;
      height: 200px;
      border-radius: 4px;
      margin-bottom: 8px;
    }

    .anuncio-info {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #eee;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      color: #666;
    }

    mat-card-actions {
      display: flex;
      justify-content: flex-end;
      padding: 16px;
      gap: 8px;
    }
  `]
})
export class AnunciosComponent implements OnInit {
  searchTerm = '';
  anunciosActivos: any[] = [];
  anunciosInactivos: any[] = [];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.cargarAnuncios();
  }

  cargarAnuncios() {
    // Implementar llamada al servicio
  }

  crearAnuncio() {
    const dialogRef = this.dialog.open(CrearAnuncioComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarAnuncios();
      }
    });
  }

  editarAnuncio(anuncio: any) {
    // Implementar edición
  }

  desactivarAnuncio(anuncio: any) {
    // Implementar desactivación
  }

  getTipoAnuncio(tipo: string): string {
    const tipos: Record<string, string> = {
      'TEXTO': 'Anuncio de Texto',
      'TEXTO_IMAGEN': 'Anuncio de Texto e Imagen',
      'VIDEO_TEXTO': 'Anuncio de Video y Texto'
    };
    return tipos[tipo] ?? tipo;
  }

  getPeriodo(periodo: string): string {
    const periodos: Record<string, string> = {
      '1_DIA': '1 día',
      '3_DIAS': '3 días',
      '1_SEMANA': '1 semana',
      '2_SEMANAS': '2 semanas'
    };
    return periodos[periodo] ?? periodo;
  }

  getSafeUrl(url: string) {
    // Implementar sanitización de URL para videos
  }
}
