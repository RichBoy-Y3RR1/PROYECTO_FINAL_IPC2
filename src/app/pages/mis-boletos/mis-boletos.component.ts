import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-mis-boletos',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MatTableModule, MatCardModule, MatSnackBarModule],
  template: `
    <mat-card>
      <mat-card-title>Mis Boletos</mat-card-title>
      <mat-card-content>
        <table mat-table [dataSource]="boletos" class="mat-elevation-z2" *ngIf="boletos.length; else vacio">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>#</th>
            <td mat-cell *matCellDef="let b">{{ b.id }}</td>
          </ng-container>
          <ng-container matColumnDef="pelicula">
            <th mat-header-cell *matHeaderCellDef>Película</th>
            <td mat-cell *matCellDef="let b">{{ b.funcion?.pelicula?.titulo || b.pelicula?.titulo || 'N/A' }}</td>
          </ng-container>
          <ng-container matColumnDef="sala">
            <th mat-header-cell *matHeaderCellDef>Sala</th>
            <td mat-cell *matCellDef="let b">{{ b.funcion?.sala?.nombre || 'N/A' }}</td>
          </ng-container>
          <ng-container matColumnDef="cine">
            <th mat-header-cell *matHeaderCellDef>Cine</th>
            <td mat-cell *matCellDef="let b">{{ b.funcion?.cine?.nombre || 'N/A' }}</td>
          </ng-container>
          <ng-container matColumnDef="precio">
            <th mat-header-cell *matHeaderCellDef>Precio</th>
            <td mat-cell *matCellDef="let b">Q{{ b.precio }}</td>
          </ng-container>
          <ng-container matColumnDef="fecha">
            <th mat-header-cell *matHeaderCellDef>Fecha Compra</th>
            <td mat-cell *matCellDef="let b">{{ b.createdAt | date:'short' }}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols;"></tr>
        </table>
        <ng-template #vacio>
          <p>No tienes boletos comprados todavía.</p>
        </ng-template>
      </mat-card-content>
    </mat-card>
  `
})
export class MisBoletosComponent implements OnInit {
  boletos: any[] = [];
  cols = ['id','pelicula','sala','cine','precio','fecha'];

  constructor(private http: HttpClient, private snack: MatSnackBar) {}

  ngOnInit() { this.cargar(); }

  cargar() {
    const token = localStorage.getItem('token');
    this.http.get<any[]>('http://localhost:4000/api/boletos/mios', { headers: { Authorization: `Bearer ${token}` } })
      .subscribe({
        next: data => this.boletos = data,
        error: err => {
          console.error('Error cargando boletos', err);
          this.snack.open('Error al cargar tus boletos', 'Cerrar', { duration: 3000 });
        }
      });
  }
}
