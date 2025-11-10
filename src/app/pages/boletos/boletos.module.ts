import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-boletos-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSnackBarModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatTableModule, MatChipsModule],
  template: `
    <div class="admin-content">
      <div class="header">
        <h1><mat-icon>confirmation_number</mat-icon> Gestión de Boletos</h1>
      </div>

      <mat-card class="filtros-card">
        <mat-card-header>
          <mat-card-title>Filtros de Búsqueda</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="filtros-grid">
            <mat-form-field appearance="outline">
              <mat-label>Fecha Inicio</mat-label>
              <input matInput [matDatepicker]="pickerInicio" [(ngModel)]="fechaInicio">
              <mat-datepicker-toggle matSuffix [for]="pickerInicio"></mat-datepicker-toggle>
              <mat-datepicker #pickerInicio></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Fecha Fin</mat-label>
              <input matInput [matDatepicker]="pickerFin" [(ngModel)]="fechaFin">
              <mat-datepicker-toggle matSuffix [for]="pickerFin"></mat-datepicker-toggle>
              <mat-datepicker #pickerFin></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Cine</mat-label>
              <mat-select [(ngModel)]="cineSeleccionado">
                <mat-option [value]="null">Todos</mat-option>
                <mat-option *ngFor="let cine of cines" [value]="cine.id">{{ cine.nombre }}</mat-option>
              </mat-select>
            </mat-form-field>

            <button mat-raised-button color="primary" (click)="buscarBoletos()">
              <mat-icon>search</mat-icon>
              Buscar
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="resumen-card">
        <mat-card-content>
          <div class="resumen-stats">
            <div class="stat-item">
              <mat-icon color="primary">confirmation_number</mat-icon>
              <div class="stat-info">
                <h3>{{ totalBoletos }}</h3>
                <p>Boletos Vendidos</p>
              </div>
            </div>
            <div class="stat-item">
              <mat-icon color="accent">attach_money</mat-icon>
              <div class="stat-info">
                <h3>Q{{ totalIngresos.toFixed(2) }}</h3>
                <p>Ingresos Totales</p>
              </div>
            </div>
            <div class="stat-item">
              <mat-icon color="warn">trending_up</mat-icon>
              <div class="stat-info">
                <h3>Q{{ promedioVenta.toFixed(2) }}</h3>
                <p>Promedio por Boleto</p>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="tabla-card">
        <mat-card-header>
          <mat-card-title>Listado de Boletos</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="boletos" class="boletos-table">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef> ID </th>
              <td mat-cell *matCellDef="let boleto"> {{ boleto.id }} </td>
            </ng-container>

            <ng-container matColumnDef="usuario">
              <th mat-header-cell *matHeaderCellDef> Usuario </th>
              <td mat-cell *matCellDef="let boleto"> {{ boleto.usuario?.nombre || 'N/A' }} </td>
            </ng-container>

            <ng-container matColumnDef="pelicula">
              <th mat-header-cell *matHeaderCellDef> Película </th>
              <td mat-cell *matCellDef="let boleto"> {{ boleto.funcion?.pelicula?.titulo || 'N/A' }} </td>
            </ng-container>

            <ng-container matColumnDef="sala">
              <th mat-header-cell *matHeaderCellDef> Sala </th>
              <td mat-cell *matCellDef="let boleto">
                {{ boleto.funcion?.sala?.nombre || 'N/A' }}
                <mat-chip>{{ boleto.funcion?.sala?.cine?.nombre || 'N/A' }}</mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="asiento">
              <th mat-header-cell *matHeaderCellDef> Asiento </th>
              <td mat-cell *matCellDef="let boleto"> {{ boleto.asiento }} </td>
            </ng-container>

            <ng-container matColumnDef="precio">
              <th mat-header-cell *matHeaderCellDef> Precio </th>
              <td mat-cell *matCellDef="let boleto"> Q{{ boleto.precio }} </td>
            </ng-container>

            <ng-container matColumnDef="fecha">
              <th mat-header-cell *matHeaderCellDef> Fecha </th>
              <td mat-cell *matCellDef="let boleto"> {{ boleto.createdAt | date:'short' }} </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .admin-content {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 24px;
    }

    h1 {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0;
      color: #1a237e;
    }

    .filtros-card {
      margin-bottom: 24px;
    }

    .filtros-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      align-items: center;
    }

    .resumen-card {
      margin-bottom: 24px;
    }

    .resumen-stats {
      display: flex;
      justify-content: space-around;
      gap: 24px;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-item mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }

    .stat-info h3 {
      margin: 0;
      font-size: 28px;
      font-weight: bold;
    }

    .stat-info p {
      margin: 4px 0 0 0;
      color: #666;
    }

    .tabla-card {
      margin-bottom: 24px;
    }

    .boletos-table {
      width: 100%;
    }

    mat-chip {
      font-size: 10px;
      min-height: 20px;
      padding: 2px 8px;
    }
  `]
})
export class BoletosAdminComponent {
  boletos: any[] = [];
  cines: any[] = [];
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;
  cineSeleccionado: number | null = null;

  totalBoletos = 0;
  totalIngresos = 0;
  promedioVenta = 0;

  displayedColumns: string[] = ['id', 'usuario', 'pelicula', 'sala', 'asiento', 'precio', 'fecha'];

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
    this.cargarCines();
    this.cargarBoletos();
  }

  cargarCines() {
    this.http.get<any[]>('http://localhost:4000/api/cines').subscribe({
      next: (data) => {
        this.cines = data;
      },
      error: (err) => {
        console.error('Error cargando cines:', err);
      }
    });
  }

  cargarBoletos() {
    this.http.get<any[]>('http://localhost:4000/api/boletos').subscribe({
      next: (data) => {
        this.boletos = data;
        this.calcularEstadisticas();
      },
      error: (err) => {
        console.error('Error cargando boletos:', err);
        this.snackBar.open('Error al cargar boletos', 'Cerrar', { duration: 3000 });
      }
    });
  }

  buscarBoletos() {
    this.snackBar.open('Aplicando filtros...', 'Cerrar', { duration: 2000 });
    this.cargarBoletos();
  }

  calcularEstadisticas() {
    this.totalBoletos = this.boletos.length;
    this.totalIngresos = this.boletos.reduce((sum, b) => sum + (b.precio || 0), 0);
    this.promedioVenta = this.totalBoletos > 0 ? this.totalIngresos / this.totalBoletos : 0;
  }
}

const routes: Routes = [
  { path: '', component: BoletosAdminComponent }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), BoletosAdminComponent],
})
export class BoletosModule {}
