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

@Component({
  selector: 'app-reportes-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSnackBarModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule],
  template: `
    <div class="admin-content">
      <div class="header">
        <h1><mat-icon>assessment</mat-icon> Reportes y Estadísticas</h1>
      </div>

      <div class="reportes-grid">
        <mat-card class="reporte-card">
          <mat-card-header>
            <mat-icon mat-card-avatar color="primary">theaters</mat-icon>
            <mat-card-title>Comentarios de Salas</mat-card-title>
            <mat-card-subtitle>Comentarios por intervalo de tiempo</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Visualiza todos los comentarios realizados en las salas de tu cine.</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" (click)="generarReporte('comentarios-salas')">
              <mat-icon>picture_as_pdf</mat-icon>
              Generar PDF
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="reporte-card">
          <mat-card-header>
            <mat-icon mat-card-avatar color="accent">movie</mat-icon>
            <mat-card-title>Películas Proyectadas</mat-card-title>
            <mat-card-subtitle>Por sala y período de tiempo</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Listado de películas proyectadas en cada sala.</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" (click)="generarReporte('peliculas-proyectadas')">
              <mat-icon>picture_as_pdf</mat-icon>
              Generar PDF
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="reporte-card">
          <mat-card-header>
            <mat-icon mat-card-avatar color="warn">star</mat-icon>
            <mat-card-title>Top 5 Salas Más Gustadas</mat-card-title>
            <mat-card-subtitle>Basado en calificaciones</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Las 5 salas con mejores calificaciones en el período seleccionado.</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" (click)="generarReporte('top-salas')">
              <mat-icon>picture_as_pdf</mat-icon>
              Generar PDF
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="reporte-card">
          <mat-card-header>
            <mat-icon mat-card-avatar color="primary">confirmation_number</mat-icon>
            <mat-card-title>Boletos Vendidos</mat-card-title>
            <mat-card-subtitle>Ventas e ingresos por período</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Reporte detallado de boletos vendidos y total de ingresos.</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" (click)="generarReporte('boletos-vendidos')">
              <mat-icon>picture_as_pdf</mat-icon>
              Generar PDF
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="reporte-card">
          <mat-card-header>
            <mat-icon mat-card-avatar color="accent">attach_money</mat-icon>
            <mat-card-title>Reporte de Ganancias</mat-card-title>
            <mat-card-subtitle>Ingresos, costos y ganancias</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Análisis financiero completo del sistema.</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" (click)="generarReporte('ganancias')">
              <mat-icon>picture_as_pdf</mat-icon>
              Generar PDF
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="reporte-card">
          <mat-card-header>
            <mat-icon mat-card-avatar color="warn">campaign</mat-icon>
            <mat-card-title>Anuncios Comprados</mat-card-title>
            <mat-card-subtitle>Por tipo y período de tiempo</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Reporte de anuncios adquiridos en el sistema.</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" (click)="generarReporte('anuncios')">
              <mat-icon>picture_as_pdf</mat-icon>
              Generar PDF
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
      margin-bottom: 24px;
    }

    h1 {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0;
      color: #1a237e;
    }

    .reportes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }

    .reporte-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    mat-card-content {
      flex: 1;
    }

    mat-card-actions {
      padding: 16px;
      margin: 0;
    }
  `]
})
export class ReportesAdminComponent {
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  generarReporte(tipo: string) {
    this.snackBar.open(`Generando reporte: ${tipo}`, 'Cerrar', { duration: 3000 });

    this.http.post(`http://localhost:4000/api/reportes/${tipo}`, {}).subscribe({
      next: (data) => {
        this.snackBar.open('Reporte generado exitosamente', 'Cerrar', { duration: 3000 });
      },
      error: (err) => {
        console.error('Error generando reporte:', err);
        this.snackBar.open('Error al generar reporte', 'Cerrar', { duration: 3000 });
      }
    });
  }
}

const routes: Routes = [
  { path: '', component: ReportesAdminComponent }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), ReportesAdminComponent],
})
export class ReportesModule {}
