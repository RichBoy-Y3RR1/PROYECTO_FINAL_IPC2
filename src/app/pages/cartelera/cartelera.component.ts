import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { TrailerDialogComponent } from './dialogs/trailer-dialog.component';
import { ComprarBoletosDialogComponent } from './dialogs/comprar-boletos-dialog.component';

@Component({
  selector: 'app-cartelera',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatPaginatorModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatMenuModule,
    MatChipsModule
  ],
  template: `
    <div class="cartelera-container">
      <div class="cartelera-header">
        <div class="header-content">
          <h1>Cartelera Actual</h1>
          <p class="subtitle">Las mejores películas en la mejor experiencia cinematográfica</p>
        </div>
        <div class="filters">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Buscar películas</mat-label>
            <input matInput placeholder="Título, director, género..." [(ngModel)]="searchTerm">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
          <mat-button-toggle-group [(ngModel)]="selectedView" aria-label="Vista">
            <mat-button-toggle value="grid">
              <mat-icon>grid_view</mat-icon>
            </mat-button-toggle>
            <mat-button-toggle value="list">
              <mat-icon>view_list</mat-icon>
            </mat-button-toggle>
          </mat-button-toggle-group>
        </div>
      </div>

      <div class="peliculas-grid" [class.list-view]="selectedView === 'list'">
        <mat-card *ngFor="let pelicula of peliculas" class="pelicula-card"
                  [class.list-card]="selectedView === 'list'">
          <div class="poster-container">
            <img [src]="pelicula.posterUrl || 'assets/default-movie.jpg'" [alt]="pelicula.titulo"
                 class="poster-image">
            <div class="clasificacion-badge">{{pelicula.clasificacion}}</div>
          </div>

          <div class="pelicula-info">
            <mat-card-header>
              <mat-card-title>{{pelicula.titulo}}</mat-card-title>
              <mat-card-subtitle>
                <mat-chip-listbox>
                  <mat-chip-option *ngFor="let categoria of pelicula.categorias?.split(',') || []">
                    {{categoria.trim()}}
                  </mat-chip-option>
                </mat-chip-listbox>
              </mat-card-subtitle>
            </mat-card-header>

            <mat-card-content>
              <p class="sinopsis">{{pelicula.sinopsis}}</p>
              <div class="detalles">
                <div class="detalle-item">
                  <mat-icon>person</mat-icon>
                  <span>{{pelicula.director}}</span>
                </div>
                <div class="detalle-item">
                  <mat-icon>schedule</mat-icon>
                  <span>{{pelicula.duracionMinutos}} min</span>
                </div>
                <div class="detalle-item">
                  <mat-icon>event</mat-icon>
                  <span>{{pelicula.estreno | date}}</span>
                </div>
              </div>
            </mat-card-content>

            <mat-card-actions>
              <button mat-raised-button color="accent" class="trailer-btn" (click)="verTrailer(pelicula)">
                <mat-icon>play_circle</mat-icon>
                Ver Trailer
              </button>
              <button mat-raised-button color="primary" class="comprar-btn" (click)="comprarBoletos(pelicula)">
                <mat-icon>local_activity</mat-icon>
                Comprar Boletos
              </button>
            </mat-card-actions>
          </div>
        </mat-card>
      </div>

      <mat-paginator [length]="100"
                    [pageSize]="12"
                    [pageSizeOptions]="[6, 12, 24, 48]"
                    (page)="onPageChange($event)">
      </mat-paginator>
    </div>
  `,
  styles: [`
    .cartelera-container {
      padding: 24px;
      background: #f8f9fa;
      min-height: calc(100vh - 64px);
    }

    .cartelera-header {
      margin-bottom: 32px;
      background: white;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .header-content {
      text-align: center;
      margin-bottom: 24px;
    }

    h1 {
      color: #1a237e;
      margin: 0;
      font-size: 32px;
      font-weight: 600;
    }

    .subtitle {
      color: #666;
      margin: 8px 0 0;
      font-size: 16px;
    }

    .filters {
      display: flex;
      gap: 16px;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
    }

    .search-field {
      flex: 1;
      min-width: 280px;
      max-width: 400px;
    }

    .peliculas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
      margin-bottom: 24px;
    }

    .peliculas-grid.list-view {
      grid-template-columns: 1fr;
    }

    .pelicula-card {
      display: flex;
      flex-direction: column;
      height: 100%;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      overflow: hidden;
    }

    .pelicula-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    }

    .pelicula-card.list-card {
      flex-direction: row;
      align-items: stretch;
    }

    .poster-container {
      position: relative;
      padding-top: 150%;
      overflow: hidden;
      border-radius: 8px 8px 0 0;
    }

    .list-card .poster-container {
      padding-top: 0;
      width: 200px;
      flex-shrink: 0;
    }

    .poster-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .list-card .poster-image {
      position: relative;
      height: 100%;
    }

    .clasificacion-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: rgba(0,0,0,0.75);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .pelicula-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 16px;
    }

    mat-card-title {
      font-size: 20px;
      margin-bottom: 8px;
      color: #1a237e;
    }

    mat-chip {
      font-size: 12px;
      height: 24px;
      margin: 4px;
    }

    .sinopsis {
      color: #666;
      margin: 16px 0;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .detalles {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin: 16px 0;
    }

    .detalle-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
      font-size: 14px;
    }

    .detalle-item mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    mat-card-actions {
      display: flex;
      gap: 12px;
      padding: 16px;
      margin: 0;
    }

    .trailer-btn, .comprar-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    mat-paginator {
      background: white;
      border-radius: 8px;
      margin-top: 24px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    @media (max-width: 600px) {
      .filters {
        flex-direction: column;
        align-items: stretch;
      }

      .search-field {
        max-width: none;
      }

      .list-card {
        flex-direction: column;
      }

      .list-card .poster-container {
        width: 100%;
        padding-top: 150%;
      }

      .list-card .poster-image {
        position: absolute;
      }
    }
  `]
})
export class CarteleraComponent implements OnInit {
  peliculas: any[] = [];
  searchTerm: string = '';
  selectedView: 'grid' | 'list' = 'grid';
  loading = true;
  error: string | null = null;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadPeliculas();
  }

  loadPeliculas(page: number = 1) {
    this.loading = true;
    this.error = null;

    this.http.get<any[]>('http://localhost:4000/api/peliculas')
      .subscribe({
        next: (data) => {
          this.peliculas = data.map(pelicula => ({
            ...pelicula,
            posterUrl: pelicula.posterUrl || 'assets/images/movie-placeholder.jpg'
          }));
          this.loading = false;
        },
        error: (error) => {
          console.error('Error cargando películas:', error);
          this.error = 'No se pudieron cargar las películas. Por favor, intenta de nuevo más tarde.';
          this.loading = false;
          this.snackBar.open('Error al cargar las películas', 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  onPageChange(event: any) {
    this.loadPeliculas(event.pageIndex + 1);
  }

  verTrailer(pelicula: any) {
    // Aquí iría la lógica para mostrar el trailer
    this.dialog.open(TrailerDialogComponent, {
      data: { pelicula },
      width: '800px',
      maxHeight: '80vh'
    });
  }

  comprarBoletos(pelicula: any) {
    this.dialog.open(ComprarBoletosDialogComponent, {
      data: { pelicula },
      width: '600px',
      maxHeight: '90vh'
    });
  }
}
