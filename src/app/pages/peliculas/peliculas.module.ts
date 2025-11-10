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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PeliculaDialogComponent } from './dialogs/pelicula-dialog.component';

@Component({
  selector: 'app-peliculas-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSnackBarModule, MatDialogModule],
  template: `
    <div class="admin-content">
      <div class="header">
        <h1><mat-icon>movie</mat-icon> Gestión de Películas</h1>
        <button mat-raised-button color="primary" (click)="agregarPelicula()">
          <mat-icon>add</mat-icon>
          Nueva Película
        </button>
      </div>

      <div class="search-bar">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Buscar películas</mat-label>
          <input matInput [(ngModel)]="searchTerm" placeholder="Buscar por título...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </div>

      <div class="peliculas-grid">
        <mat-card *ngFor="let pelicula of filtrarPeliculas()" class="pelicula-card">
          <img mat-card-image [src]="pelicula.imagen || pelicula.posterUrl || 'assets/default-movie.svg'"
               [alt]="pelicula.titulo"
               (error)="onImageError($event)">
          <mat-card-header>
            <mat-card-title>{{ pelicula.titulo }}</mat-card-title>
            <mat-card-subtitle>{{ pelicula.genero }} • {{ pelicula.duracion || pelicula.duracionMinutos }} min</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>{{ (pelicula.descripcion || pelicula.sinopsis) | slice:0:100 }}{{ (pelicula.descripcion || pelicula.sinopsis)?.length > 100 ? '...' : '' }}</p>
            <p *ngIf="pelicula.director"><strong>Director:</strong> {{ pelicula.director }}</p>
            <p *ngIf="pelicula.anio"><strong>Año:</strong> {{ pelicula.anio }}</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" (click)="editarPelicula(pelicula)">
              <mat-icon>edit</mat-icon>
              Editar
            </button>
            <button mat-button color="warn" (click)="eliminarPelicula(pelicula)">
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

    .peliculas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
    }

    .pelicula-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .pelicula-card img {
      height: 400px;
      object-fit: cover;
    }

    mat-card-content {
      flex: 1;
    }

    mat-card-actions {
      padding: 8px 16px;
      display: flex;
      justify-content: space-around;
    }
  `]
})
export class PeliculasAdminComponent {
  peliculas: any[] = [];
  searchTerm: string = '';

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.cargarPeliculas();
  }

  cargarPeliculas() {
    this.http.get<any[]>('http://localhost:4000/api/peliculas').subscribe({
      next: (data) => {
        this.peliculas = data;
      },
      error: (err) => {
        console.error('Error cargando películas:', err);
        this.snackBar.open('Error al cargar películas', 'Cerrar', { duration: 3000 });
      }
    });
  }

  filtrarPeliculas() {
    if (!this.searchTerm) {
      return this.peliculas;
    }
    const term = this.searchTerm.toLowerCase();
    return this.peliculas.filter(p =>
      p.titulo?.toLowerCase().includes(term) ||
      p.genero?.toLowerCase().includes(term)
    );
  }

  agregarPelicula() {
    const dialogRef = this.dialog.open(PeliculaDialogComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.post('http://localhost:4000/api/peliculas', result).subscribe({
          next: () => {
            this.snackBar.open('Película creada exitosamente', 'Cerrar', { duration: 3000 });
            this.cargarPeliculas();
          },
          error: (err) => {
            console.error('Error creando película:', err);
            this.snackBar.open('Error al crear película', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  editarPelicula(pelicula: any) {
    const dialogRef = this.dialog.open(PeliculaDialogComponent, {
      width: '600px',
      disableClose: true,
      data: pelicula
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.put(`http://localhost:4000/api/peliculas/${pelicula.id}`, result).subscribe({
          next: () => {
            this.snackBar.open('Película actualizada exitosamente', 'Cerrar', { duration: 3000 });
            this.cargarPeliculas();
          },
          error: (err) => {
            console.error('Error actualizando película:', err);
            this.snackBar.open('Error al actualizar película', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  eliminarPelicula(pelicula: any) {
    if (confirm(`¿Estás seguro de eliminar la película "${pelicula.titulo}"?`)) {
      this.http.delete(`http://localhost:4000/api/peliculas/${pelicula.id}`).subscribe({
        next: () => {
          this.snackBar.open('Película eliminada exitosamente', 'Cerrar', { duration: 3000 });
          this.cargarPeliculas();
        },
        error: (err) => {
          console.error('Error eliminando película:', err);
          this.snackBar.open('Error al eliminar película', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  onImageError(event: any) {
    event.target.src = 'assets/default-movie.svg';
  }
}

const routes: Routes = [
  { path: '', component: PeliculasAdminComponent }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), PeliculasAdminComponent],
})
export class PeliculasModule {}
