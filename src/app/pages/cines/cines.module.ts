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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CineDialogComponent } from './dialogs/cine-dialog.component';
import { SalaDialogComponent } from './dialogs/sala-dialog.component';
import { AsignarPeliculaDialogComponent } from './dialogs/asignar-pelicula-dialog.component';

@Component({
  selector: 'app-cines-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSnackBarModule, MatChipsModule, MatDialogModule],
  template: `
    <div class="admin-content">
      <div class="header">
        <h1><mat-icon>theaters</mat-icon> Gestión de Cines y Salas</h1>
        <button mat-raised-button color="primary" (click)="agregarCine()">
          <mat-icon>add</mat-icon>
          Nuevo Cine
        </button>
      </div>

      <div class="cines-grid">
        <mat-card *ngFor="let cine of cines" class="cine-card">
          <mat-card-header>
            <mat-icon mat-card-avatar color="primary">business</mat-icon>
            <mat-card-title>{{ cine.nombre }}</mat-card-title>
            <mat-card-subtitle>{{ cine.direccion }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p *ngIf="cine.telefono"><strong>Teléfono:</strong> {{ cine.telefono }}</p>
            <p *ngIf="cine.email"><strong>Email:</strong> {{ cine.email }}</p>

            <div class="salas-section">
              <h3>Salas ({{ cine.salas?.length || 0 }})</h3>
              <mat-chip-set *ngIf="cine.salas && cine.salas.length > 0">
                <mat-chip *ngFor="let sala of cine.salas" class="sala-chip" (click)="asignarPeliculaASala(cine, sala)">
                  {{ sala.nombre }} - {{ sala.tipo }} ({{ sala.capacidad }} asientos)
                  <mat-icon matChipTrailingIcon>movie</mat-icon>
                </mat-chip>
              </mat-chip-set>
              <p *ngIf="!cine.salas || cine.salas.length === 0" class="no-salas">
                Sin salas registradas
              </p>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" (click)="agregarSala(cine)">
              <mat-icon>add</mat-icon>
              Agregar Sala
            </button>
            <button mat-button (click)="editarCine(cine)">
              <mat-icon>edit</mat-icon>
              Editar
            </button>
            <button mat-button color="warn" (click)="eliminarCine(cine)">
              <mat-icon>delete</mat-icon>
              Eliminar
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <p *ngIf="cines.length === 0" class="no-data">
        No hay cines registrados. Haz clic en "Nuevo Cine" para crear uno.
      </p>
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

    .cines-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }

    .cine-card {
      display: flex;
      flex-direction: column;
    }

    mat-card-content {
      flex: 1;
    }

    .salas-section {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #eee;
    }

    .salas-section h3 {
      margin: 0 0 12px 0;
      font-size: 14px;
      color: #666;
    }

    mat-chip-set {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .sala-chip {
      font-size: 12px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .sala-chip:hover {
      background-color: #e3f2fd !important;
    }

    .no-salas {
      color: #999;
      font-style: italic;
      font-size: 14px;
    }

    mat-card-actions {
      padding: 8px 16px;
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      gap: 8px;
    }

    .no-data {
      text-align: center;
      color: #999;
      padding: 48px;
      font-size: 18px;
    }
  `]
})
export class CinesAdminComponent {
  cines: any[] = [];

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.cargarCines();
  }

  cargarCines() {
    this.http.get<any[]>('http://localhost:4000/api/cines').subscribe({
      next: (data) => {
        this.cines = data;
      },
      error: (err) => {
        console.error('Error cargando cines:', err);
        this.snackBar.open('Error al cargar cines', 'Cerrar', { duration: 3000 });
      }
    });
  }

  agregarCine() {
    const dialogRef = this.dialog.open(CineDialogComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.post('http://localhost:4000/api/cines', result).subscribe({
          next: () => {
            this.snackBar.open('Cine creado exitosamente', 'Cerrar', { duration: 3000 });
            this.cargarCines();
          },
          error: (err) => {
            console.error('Error creando cine:', err);
            this.snackBar.open('Error al crear cine', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  editarCine(cine: any) {
    const dialogRef = this.dialog.open(CineDialogComponent, {
      width: '500px',
      disableClose: true,
      data: cine
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.put(`http://localhost:4000/api/cines/${cine.id}`, result).subscribe({
          next: () => {
            this.snackBar.open('Cine actualizado exitosamente', 'Cerrar', { duration: 3000 });
            this.cargarCines();
          },
          error: (err) => {
            console.error('Error actualizando cine:', err);
            this.snackBar.open('Error al actualizar cine', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  eliminarCine(cine: any) {
    if (confirm(`¿Estás seguro de eliminar el cine "${cine.nombre}"? Esto también eliminará todas sus salas.`)) {
      this.http.delete(`http://localhost:4000/api/cines/${cine.id}`).subscribe({
        next: () => {
          this.snackBar.open('Cine eliminado exitosamente', 'Cerrar', { duration: 3000 });
          this.cargarCines();
        },
        error: (err) => {
          console.error('Error eliminando cine:', err);
          this.snackBar.open('Error al eliminar cine', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  agregarSala(cine: any) {
    const dialogRef = this.dialog.open(SalaDialogComponent, {
      width: '500px',
      disableClose: true,
      data: { cine }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.post('http://localhost:4000/api/salas', result).subscribe({
          next: () => {
            this.snackBar.open('Sala creada exitosamente', 'Cerrar', { duration: 3000 });
            this.cargarCines();
          },
          error: (err) => {
            console.error('Error creando sala:', err);
            this.snackBar.open('Error al crear sala', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  asignarPeliculaASala(cine: any, sala: any) {
    const dialogRef = this.dialog.open(AsignarPeliculaDialogComponent, {
      width: '600px',
      disableClose: true,
      data: { cine, sala }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.post('http://localhost:4000/api/funciones', result).subscribe({
          next: () => {
            this.snackBar.open(`Película asignada a ${sala.nombre} exitosamente`, 'Cerrar', { duration: 3000 });
            this.cargarCines();
          },
          error: (err) => {
            console.error('Error asignando película:', err);
            this.snackBar.open('Error al asignar película', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }
}

const routes: Routes = [
  { path: '', component: CinesAdminComponent }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), CinesAdminComponent],
})
export class CinesModule {}
